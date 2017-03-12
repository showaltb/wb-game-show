// handlers.js
// set event handlers

(function(_, $, Game) {

  'use strict';

  // set event handlers

  $(function() {

    // click on start round panel
    $('div.play.start').on('click', function() {
      Game.setMode('grid');
      Game.settle();
    });

    // click on an active grid cell (pick question)
    $('div.grid').on('click', 'td.points.active', function() {
      var $this = $(this);
      var state = Game.state;
      var config = Game.config;
      var category_index = $this.data('category');
      var points_index = $this.data('points');
      $this.removeClass('active');
      state.question = [category_index, points_index];
      state.answered = false;
      state.shown[state.round][category_index][points_index] = true;
      if (Game.isDailyDouble(category_index, points_index)) {
        state.wager = null;
        Game.setMode('double');
      }
      else {
        state.wager = config.rounds[state.round].points[points_index];
        Game.setMode('question');
      }
      Game.settle();
    });

    // click on final category page. selects the final question.
    $('div.play.final').on('click', function() {
      var state = Game.state;
      var config = Game.config;
      state.question = state.final_question;
      state.answered = false;
      state.wager = null;
      Game.markAllShown();
      Game.setMode('question');
      Game.settle();
    });

    // click on "X" to end round early
    $('div.grid .close').on('click', function() {
      if (confirm('End this round early?')) {
        Game.markAllShown();
        Game.settle();
      }
    });

    // click on daily double page
    $('div.play.double').on('click', function() {
      Game.setMode('question');
      Game.settle();
    });

    // click on qa page (either show answer or return to grid)
    $('div.play.qa').on('click', function() {
      var state = Game.state;
      Game.setMode(state.answered ? 'grid' : 'answer');
      Game.settle();
    });

    // click on score adjustment arrows.  these are supported in any mode, and
    // do not affect mode.  adjust by amount of Game.state.wager, or prompt for
    // wager if zero
    var adjust = function() {
      var $this = $(this);
      var team = $(this).data('team');
      var wager = Game.state.wager || parseInt(prompt('Amount of wager')) || 0;
      if ($this.hasClass('minus')) wager = -wager;
      Game.setScore(team, Game.state.scores[team] + wager);
      return false;
    }
    $('#scores a').on('click', adjust);

    $(window).on('popstate', function(event) {
      Game.loadState();
    });

  });

})(_, jQuery, Game);
