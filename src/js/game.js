// game.js
// define game functions

(function(_, $, Game) {

  'use strict';

  // initialize game
  Game.init = function()
  {
    var config = Game.config;

    // initialize game state
    var state = Game.state = {};

    // current mode
    state.mode = 'start';

    // current round
    state.round = 0;

    // current question being asked. a two element array of category index,
    // points index, or null if there is no current question.
    state.question = null;

    // points wagered on current question. null if wager needs to be prompted
    // for (e.g. daily double or final question.)
    state.wager = null;

    // true if current question has been answered
    state.answered = false;

    // questions already shown, indexed by round, category, points indexes
    state.shown = _.map(config.rounds, function(round) {
      return _.map(round.categories, function(category) {
        return _.map(round.points, function() { return false; });
      });
    });

    // scores by team (all zero)
    state.scores = _.map(Game.config.teams, function() { return 0 });

    // daily doubles by round. each round has a list of zero or more
    // [category_index, points_index] pairs.
    state.daily_doubles = [];
    _.each(config.rounds, function(round) {
      var daily_doubles = [];
      while (daily_doubles.length < round.daily_doubles) {
        var category_index = _.sample(_.range(round.categories.length));
        var points_index = Game.weightedIndex(round.points.length);
        var exists = _.some(daily_doubles, function(d) {
          return d[0] == category_index && d[1] == points_index
        });
        if (!exists) {
          daily_doubles.push([category_index, points_index]);
        }
      }
      state.daily_doubles.push(daily_doubles);
    });

    // final question. a [category_index, points_index] pair from the last round.
    if (config.final_question) {
      var round = config.rounds[config.rounds.length - 1];
      var category_index = _.sample(_.range(round.categories.length));
      var points_index = Game.weightedIndex(round.points.length);
      state.final_question = [category_index, points_index];
    }
  };

  // set game mode
  Game.setMode = function(mode) {
    Game.state.mode = mode;
  }

  // set the score for a team. updates state and UI.
  Game.setScore = function(team, score) {
    Game.state.scores[team] = score;
    Game.showScores();
  };

  Game.showScores = function() {
    _.each(Game.state.scores, function(score, team) {
      $('#scores td[data-team=' + team + ']').each(function() {
        var $score = $(this).find('div.score');
        $score.html(score.toLocaleString());
        if (score < 0)
          $score.addClass('minus');
        else
          $score.removeClass('minus');
      });
    });
  };

  // returns true if game is over
  Game.isGameOver = function() {
    var state = Game.state;
    var config = Game.config;
    return state.round >= config.rounds.length;
  };

  // returns true if round is over:
  // * no current question in progress
  // * all questions shown
  Game.isRoundOver = function() {
    var state = Game.state;
    if (state.question)
      return true;
    return _.every(state.shown[state.round], function(category) {
      return _.every(category, function(points) {
        return points;
      });
    });
  };

  // return jquery object for the round container for round (default current round)
  Game.$round = function(round) {
    round = round || Game.state.round;
    return $('div.round[data-round=' + round + ']');
  };

  // return jquery object for the given play container for round (default current round)
  Game.$play = function(play, round) {
    return Game.$round(round).find('div.play.' + play);
  };

  // show UI for given round and hide all other rounds
  Game.showRound = function(round) {
    $('div.round').hide();
    var config = Game.config;
    var state = Game.state;
    $('#title .subtitle').html(' &mdash; ' + _.escape(Game.roundName()));
    var $round = Game.$round(round);
    $round.show();
    return $round;
  };

  // returns unescaped round name for current round (default current round)
  Game.roundName = function() {
    var config = Game.config;
    var state = Game.state;
    return Game.isFinalQuestion() ? 'Final Question' : config.rounds[state.round].name;
  };

  // show start round screen for current round
  Game.showStart = function() {
    var state = Game.state;
    state.question = null;
    state.answered = false;
    state.wager = null;
    Game.showPlay('start');
  };

  // show "game over" screen
  Game.showEnd = function() {
    $('div.round').hide();
    $('#title .subtitle').html('');
  };

  // show grid screen for current round
  Game.showGrid = function() {
    var state = Game.state;
    var config = Game.config;
    state.question = null;
    state.answered = false;
    state.wager = null;
    // adjust the active grid cells to match state
    var shown = state.shown[state.round];
    Game.$play('grid').find('td.points').each(function() {
      var $this = $(this);
      var category_index = $this.data('category');
      var points_index = $this.data('points');
      if (shown[category_index][points_index])
        $this.removeClass('active');
      else
        $this.addClass('active');
    });
    Game.showPlay('grid');
  };

  // show final question category
  Game.showFinal = function() {
    var state = Game.state;
    var config = Game.config;
    state.question = null;
    state.answered = false;
    state.wager = null;
    var category = config.rounds[state.round].categories[state.final_question[0]].name;
    Game.$play('final').find('.final-category').html(_.escape(category));
    Game.showPlay('final');
  }

  // show dailiy double screen
  Game.showDouble = function() {
    Game.showPlay('double');
  };

  // show question (with or without answer) for current round
  Game.showQuestion = function(with_answer) {
    var config = Game.config;
    var state = Game.state;
    var $play = Game.showPlay('qa');
    var category_index = state.question[0];
    var points_index = state.question[1];
    var round = config.rounds[state.round];
    var category = config.rounds[state.round].categories[category_index];
    var question = category.questions[points_index];
    var title = _.escape(category.name) + ' for ' + _.escape(round.points[points_index]);
    if (Game.isDailyDouble(category_index, points_index)) {
      title = title + ' (Daily Double)';
    }
    else if (Game.isFinalQuestion()) {
      title = '';
    }
    $play.find('.qa-title').html(title);
    $play.find('.qa-question').html(_.escape(question.q));
    if (with_answer) {
      $play.find('.qa-answer').html(_.escape(question.a));
    }
    else {
      $play.find('.qa-answer').html('');
    }
  };

  // show answer for current round
  Game.showAnswer = function() {
    Game.showQuestion(true);
  };

  // show UI for given play panel for current round and hide all other play panels
  Game.showPlay = function(play) {
    $('div.play').hide();
    var $play = Game.$play(play);
    $play.show();
    Game.showRound();
    return $play;
  };

  // save current state in location hash if it's different
  Game.saveState = function() {
    var hash = btoa(JSON.stringify(Game.state));
    if (hash != window.location.hash.substr(1)) {
      window.location.hash = hash;
    }
  };

  // load state from location hash if it's different from current state
  Game.loadState = function() {
    var state_hash = btoa(JSON.stringify(Game.state));
    var location_hash = window.location.hash.substr(1);
    if (location_hash != state_hash) {
      try { var state = JSON.parse(atob(location_hash)) } catch(e) { state = null }
      if (state && typeof state === 'object') {
        Game.state = state;
      }
      else {
        Game.init();
      }
      Game.settle();
    }
  };

  // return a random "weighted" value for a given range 0..num-1. The weight of
  // each element is (n+1)^2, which heavily favors higher point values. Used
  // for allocating daily doubles and final questions.
  Game.weightedIndex = function(num) {
    var values = [];
    return _.sample(
      _.flatten(
        _.map(_.range(num), function(i) {
          return _.map(_.range((i + 1) * (i + 1)), function() {
            return i;
          });
        })
      )
    );
  };

  // returns true if cell is a daily double for current round
  Game.isDailyDouble = function(category_index, points_index) {
    var state = Game.state;
    var daily_doubles = state.daily_doubles[state.round];
    return _.some(daily_doubles, function(d) {
      return d[0] == category_index && d[1] == points_index;
    });
  };

  // returns true if we are in the final question round
  Game.isFinalQuestion = function() {
    var config = Game.config;
    var state = Game.state;
    return !!config.final_question && state.round == config.rounds.length - 1;
  };

  // mark all questions in current round shown. used to end a round early and
  // to end the final question round after one question.
  Game.markAllShown = function() {
    var state = Game.state;
    var shown = state.shown[state.round];
    _.each(shown, function(category) {
      _.each(_.range(category.length), function(i) {
        category[i] = true;
      });
    });
  };

})(_, jQuery, Game);
