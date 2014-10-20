"use strict";

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
  function Lines(options) {
    this.selected_cell = null;

    this.init = function() {
      options = options ? options : {};
      if (!options.field) {
        throw new Error("field argument must be specified");
      }
      this.field = options.field;
      this._options = {};
      this.turns_made = 0;

      // defaults
      this.setOption(Lines.OPTIONS.BALLS_ON_START, 3);
      this.setOption(Lines.OPTIONS.BALLS_EACH_TURN, 3);

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

    this.moveSelected = function(cell) {
      var origin_cell = this.selected_cell;
      if (!origin_cell || origin_cell == cell)
        return;
      var this_ = this;
      this.field.move(
        origin_cell.y, origin_cell.x,
        cell.y, cell.x,
        function(err) {
          if (!err) {
            this_.selected_cell.selected = false;
            this_.selected_cell = null;
            this_.nextTurn();
          }
        }
      );
    }

    this.nextTurn = function() {
      var tiles = this.field.getTiles();
      var balls_to_add = this.getOption(
        this.turns_made == 0 ? Lines.OPTIONS.BALLS_ON_START : Lines.OPTIONS.BALLS_EACH_TURN 
      );
      var free_tiles_shuffled = tiles
                    .sort(function() { return Math.random() > 0.5; })
                    .filter(function(item) { return item.color == null; });
      var tiles_for_new_balls = free_tiles_shuffled
                    .slice(0, balls_to_add);
      tiles_for_new_balls.forEach(function(tile) {
        this.field.color(tile.y, tile.x, this.field.colors.RED);
      }, this);
      this.turns_made += 1;
    };

    this.init(options);
  }

  Lines.OPTIONS = {
    BALLS_EACH_TURN: 'BALLS_EACH_TURN',
    BALLS_ON_START: 'BALLS_ON_START'
  };
  return Lines;
});