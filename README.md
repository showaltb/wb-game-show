# Wood Badge Game Show

HTML/Javascript implementation of the Wood Badge game show, designed to
implement the full rules of the game as described in the 2016 Wood Badge
Syllabus.

If you just want to play the game, load
[wb-game-show.html](wb-game-show.html) in your browser. See
[INSTRUCTIONS.md](INSTRUCTIONS.md) for detailed gameplay instructions.

## Building the Game

Building the game requires Ruby 2.3 and Bundler. To setup:

    bundle install

The following rake tasks are available:

    rake build    - builds the game (writes wb-game-show.html)
    rake watch    - watches src/ and config/ directories and rebuilds
                    the game on any changes.

## Configuration

The `config/game.yml` file contains the full game configuration. See the
comments in the file for an explanation of the options available.

## Notes/Limitations

* The stylesheet assumes that each game round will have the same number
  of categories and questions per category.

## Author

Bob Showalter, for Wood Badge S-6-713-17
