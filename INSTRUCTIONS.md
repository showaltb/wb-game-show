# Wood Badge Game Show

## What is Wood Badge Game Show?

Wood Badge Game Show is an implementation of the game using HTML and
Javascript. It is designed to exactly follow the rules and questions
from the 2016 Wood Badge Syllabus:

* Two initial rounds, each with seven categories and four points levels
  per category.
* A single "daily double" from each category, selected at random.
* A single final question, selected at random from a set of questions
  making up a third round. Only one question from this round is used
  during play.
* Up to eight teams, named for the standard Wood Badge patrols.

The game is designed to used during a Wood Badge course, with the game
board projected on a large screen that everyone can see.

The game has the following features:

* Tracks progress through the game, displaying the available questions
  to choose from, displaying the question, and displaying the answer.
* Allows points to be awarded (or deducted) after each question is
  answered. For fixed point values, automatically adds/subtracts the
  correct value. For daily doubles or final question, prompts for the
  wager.
* Tracks the current state of the game using information in the browser
  address bar. You can use the "back" button to navigate back through
  the game history if necessary (e.g. a mistake was made).
* Allows you to end a round early (e.g. if you are running out of time).
* Allows you to manually adjust scores at any point in the game (e.g. to
  correct a previous error.)

The game does *not* track who has control of the board or is answering a
question. After each answer, you can adjust the scores of any of the
teams. It's up to you to adjust the correct team.

## System Requirements

To play the game, you need a modern browser. It has been tested on:

* Google Chrome
* Apple Safari
* Microsoft Edge (Windows 10)

It does *not* currently work on any version of Internet Explorer.

All game control is with the mouse, except when a wager is prompted for.

## Starting the Game

* The `wb-game-show.html` file is the only file needed to play the game. It is
  completely self-contained.
* Double-click `wb-game-show.html` to launch the game. Or, start your browser
  and drag the `wb-game-show.html` to the address bar of your browser.
* If using a projector, set your computer to mirror your display on the
  projector. The game display and control use the same window.

## Playing the Game

In general, play advances by simply clicking anywhere on the central
area of the screen.

The game starts by displaying "Round One". When you are ready to start,
click the screen to display the grid of categories.

When the team with control of the board selects a question, click on
that cell to display the question.

After the team answers, click again to display the answer. At this point
"+" and "-" icons will appear next to each team name. Use these to add
or deduct the points for the question, based on a correct or incorrect
answer.

After you've awarded or deducted points, click on the center area again
to return to the grid.

When all of the first round questions have been answered. The game will
automatically proceed to round two. Play this round in the same way.

When round two is finished, the game will proceed to the "Final
Question" question round.

Click to display the final question category and wait for teams to write
down their wagers. Click again to display the question and wait for
teams to write their answers. Click once more to display the answer and
award/deduct points per team.

Click one last time to display the "Game Over" screen.

## Special Situations

### Ending a Round Early

If you are running short on time, you may end a round early using the
following procedure:

* When the category grid is shown, hover the mouse cursor over the
  upper right corner of the grid area (next to the rightmost category
  name).
* You'll see a letter "E" appear. Click on this letter.
* The game will ask you if you want to end the round early. Click OK to
  proceed to the next round.

### Manualy Adjusting Scores

If you discover a mistake in scoring, you can manually adjust scores at
any point during game play. Hover the mouse cursor over any team name to
reveal the "+" and "-" adjustment icons. Click either of these and the
game will prompt for a wager amount. Enter a positive wager amount.
Depending on which button you clicked, that amount will be added or
subtracted from the team's score.

### Restarting the Game

The game is designed to be hard to accidentally restart. The back button
will navigate back through the steps of the game. Reloading the page
will maintain the current game state.

If you do need to restore the game, you can either:

* Close your browser window and restart using the "Starting the Game"
  procedure above, or
* Remove the data following the "#" mark in the address bar, and then
  press Enter.
