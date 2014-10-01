"use strict";

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
  function Lines(options) {
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

  Lines.prototype.getOption = function(option) {
    return this._options[option];
  }

  Lines.prototype.setOption = function(option, value) {
    if (typeof value == "undefined")
      value = null;
    if (Lines.OPTIONS[option])
      this._options[option] = value;
  }

  Lines.prototype.getOptions = function() {
    return this._options;
  }

  Lines.prototype.setOptions = function(options) {
    Object.keys(options).forEach(function(option) {
      option = Lines.OPTIONS[option];
      if (Lines.OPTIONS[option]) {
        this.setOption(option, options[option]);
      }
    });
  };

  Lines.prototype.nextTurn = function() {
    var free_tiles = this.field.getFreeTiles();
    var balls_to_add = this.getOption(
      this.turns_made == 0 ? Lines.OPTIONS.BALLS_ON_START : Lines.OPTIONS.BALLS_EACH_TURN 
    );
    var tiles_for_new_balls = free_tiles
                  .sort(function() { return Math.random() > 0.5 })
                  .slice(0, balls_to_add);
    tiles_for_new_balls.forEach(function(tile) {
      this.field.color(tile.y, tile.x, this.field.colors.RED);
    }, this);
    this.turns_made += 1;
  };

  Lines.OPTIONS = {
    BALLS_EACH_TURN: 'BALLS_EACH_TURN',
    BALLS_ON_START: 'BALLS_ON_START'
  };

  return Lines;
});