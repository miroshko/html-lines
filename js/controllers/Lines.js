"use strict";

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['lib/shuffle', 'lodash', 'helpers/seeded_random'], function(shuffle, _, seeded_random) {
  function Lines(options) {
    this.selected_cell = null;

    this.init = function() {
      options = options ? options : {};
      if (!options.field) {
        throw new Error("field argument must be specified");
      }
      this.field = options.field;
      this.seed = options.seed || Math.random();
      this.score = 0;
      this.is_over = false;
      this.random_colors_queue = [];

      this._options = {};

      // defaults
      this.setOption(Lines.OPTIONS.BALLS_ON_START, 3);
      this.setOption(Lines.OPTIONS.BALLS_EACH_TURN, 3);
      this.setOption(Lines.OPTIONS.COMBINATION_LENGTH, 5);
      this.setOption(Lines.OPTIONS.COLORS_ENABLED, [Lines.COLORS.RED]);
      this.setOption(Lines.OPTIONS.SCORE_CALC_FUNCTION, this.scoreCalc.bind(this))

      this.setOptions(options);
    }

    this.getOption = function(option) {
      return this._options[option];
    }

    this.setOption = function(option, value) {
      if (typeof value == "undefined")
        value = null;
      if (Lines.OPTIONS[option])
        this._options[option] = value;
    }

    this.getOptions = function() {
      return this._options;
    }

    this.setOptions = function(options) {
      Object.keys(options).forEach(function(option) {
        option = Lines.OPTIONS[option];
        if (Lines.OPTIONS[option]) {
          this.setOption(option, options[option]);
        }
      });
    };

    this.selectCell = function(cell) {
      cell.selected = !cell.selected;
      if (this.selected_cell)
        this.selected_cell.selected = false;
      this.selected_cell = cell.selected ? cell : null;
    }

    this.moveSelected = function(cell, callback) {
      var origin_cell = this.selected_cell;
      if (!origin_cell || origin_cell == cell)
        return;
      var this_ = this;
      this.field.move(
        origin_cell.y, origin_cell.x,
        cell.y, cell.x,
        function() {
          setTimeout(function() {
            this_.field.actualiseVirtualColors();
          }, 150);
          if (typeof callback == "function") callback();
        }
      );

      this_.selected_cell.selected = false;
      this_.selected_cell = null;
      this_.nextTurn();
    }

    function diagonal(rows) {
      var lines = [];
      var row_length = rows[0].length;
      var current;
      for (var x = -row_length; x < row_length; x++) {
        current = [];
        for (var d = 0; d < rows.length; d++) {
          if (rows[d] && rows[d][x+d])
            current.push(rows[d][x+d]);
        }
        lines.push(current);
      }
      return lines;
    }

    this.findCombinations = function() {
      var transposed = _.zip.apply(_, this.field.cells); // vertical
      var mirrored = this.field.cells.map(function(row) { return row.slice(0).reverse(); })
      var diagonal_nw = diagonal(this.field.cells);
      var diagonal_ne = diagonal(mirrored);
      var row_sets = [this.field.cells, transposed, diagonal_nw, diagonal_ne];
      var combinations = [];
      var current_sequence;
      var combination_length = this.getOption(Lines.OPTIONS.COMBINATION_LENGTH);
      var last_color;
      var tiles;

      for(var m = 0; m < row_sets.length; m++) {
        for(var n = 0; n < row_sets[m].length; n++) {
          tiles = row_sets[m][n];
          current_sequence = [];

          // 1 more to cover edge case
          for(var i = 0; i <= tiles.length; i++) {
            if(last_color && tiles[i] && last_color === tiles[i].color) {
              current_sequence.push(tiles[i]);
            } else {
              if (current_sequence.length >= combination_length) {
                combinations.push(current_sequence);
              }
              current_sequence = [tiles[i]];
              last_color = tiles[i] && tiles[i].color;
            }
          }
        }
      }
      return combinations;
    }

    this.scoreCalc = function(bursted) {
      var base = 10;
      var over = bursted - this.getOption(Lines.OPTIONS.COMBINATION_LENGTH);
      if (over < 0) {
        return 0;
      }
      return base + Math.ceil(Math.pow(1.2 * over, 2.03));
    }

    this.increaseScore = function(bursted) {
      this.score += this.getOption(Lines.OPTIONS.SCORE_CALC_FUNCTION)(bursted);
    }

    this.burstCombinations = function() {
      var bursted = 0;
      var combinations = this.findCombinations();
      var cells = _.unique(_.flatten(combinations));
      cells.forEach(function(cell) {
        cell.color = null;
      }, this);
      if (cells.length){
        this.increaseScore(cells.length);
      }
      return cells.length;
    }

    this.start = function() {
      if (this.turns_made) {
        throw new Error("Game already started");
      }

      this.turns_made = 0;
      this.random = seeded_random(this.seed);
      this.score = 0;
      this.is_over = false;
      this.generateRandomColorsSet();
      this.nextTurn();
      this.field.actualiseVirtualColors();
    }

    this.restart = function() {
      this.field.getTiles().forEach(function(cell) {
        cell.color = null;
      });
      this.turns_made = 0;
      this.start();
    }

    this.nextTurn = function() {
      var bursted = this.burstCombinations();
      var field_is_empty = this.field.getTiles().length === this.field.getFreeTiles().length;
      if (0 === bursted || field_is_empty) {
        this.addBalls();
        this.generateRandomColorsSet();
        this.burstCombinations();
        this.checkGameOver();
      }
    };

    this.generateRandomColorsSet = function() {
      var amount = this.getOption(Lines.OPTIONS.BALLS_EACH_TURN);
      var color;
      for(var i = 0; i < amount; i++) {
        color = shuffle(this.getOption(Lines.OPTIONS.COLORS_ENABLED), this.random)[0];
        this.random_colors_queue.push(color);
      }
    }

    this.checkGameOver = function() {
      if (0 === this.field.getFreeTiles().length) {
        this.is_over = true;
      }
    }

    this.addBalls = function() {
      var tiles = this.field.getTiles();
      var balls_to_add = this.getOption(
        this.turns_made == 0 ? Lines.OPTIONS.BALLS_ON_START : Lines.OPTIONS.BALLS_EACH_TURN 
      );

      var x = 0;
      var free_tiles_shuffled = shuffle(tiles, this.random).filter(function(item) { return item.color == null; });
      var tiles_for_new_balls = free_tiles_shuffled.slice(0, balls_to_add);
      tiles_for_new_balls.forEach(function(tile) {
        var random_color = this.random_colors_queue.shift();
        tile.color = random_color;
      }, this);
      this.turns_made += 1;
    }

    this.init(options);
  }

  Lines.OPTIONS = {
    BALLS_EACH_TURN: 'BALLS_EACH_TURN',
    BALLS_ON_START: 'BALLS_ON_START',
    COMBINATION_LENGTH: 'COMBINATION_LENGTH',
    COLORS_ENABLED: 'COLORS_ENABLED',
    SCORE_CALC_FUNCTION: 'SCORE_CALC_FUNCTION'
  };

  Lines.COLORS = {
    RED: 'red',
    GREEN: 'green',
    BLUE: 'blue',
    YELLOW: 'yellow',
    MAGENTA: 'magenta',
    BROWN: 'brown',
    LIGHTBLUE: 'lightblue'
  }
  return Lines;
});