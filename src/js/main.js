// main.js
// initialize game and start game play

(function(_, $, Game) {

  'use strict';

  // evaluate current game state and update the UI ready for next user action
  Game.settle = function() {
    var state = Game.state;
    var config = Game.config;
    switch(state.mode) {

      case 'start':
        if (Game.isGameOver()) {
          Game.setMode('end');
          return Game.settle();
        }
        Game.showStart();
        break;

      case 'grid':
        state.question = null;    // no current question
        if (Game.isRoundOver()) {
          // move to next round
          state.round++;
          Game.setMode('start');
          return Game.settle();
        }
        else if (Game.isFinalQuestion()) {
          Game.setMode('final');
          return Game.settle();
        }
        Game.showGrid();
        break;

      case 'final':
        Game.showFinal();
        break;

      case 'double':
        Game.showDouble();
        break;

      case 'question':
        state.answered = false;
        Game.showQuestion();
        break;

      case 'answer':
        state.answered = true;
        Game.showAnswer();
        break;

      case 'end':
        Game.showEnd();
        break;

      default:
        alert('Internal error. Unknown mode ' + state.mode);
    };

    // set data-mode in body
    $('body').data('mode', state.mode);
    $('body').attr('data-mode', state.mode);

    Game.showScores();
    Game.saveState();
  };

  // start game play
  $(function() {
    Game.loadState();
  });

})(_, jQuery, Game);
