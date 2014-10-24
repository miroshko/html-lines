"use strict";

var requirejs = require('requirejs');
requirejs.config({
    nodeRequire: require,
    baseUrl: __dirname + '/../js'
});

var expect = require("chai").expect;
var setup = require('mocha').setup

var Field, Lines;
setup(function(done) {
  requirejs(['models/Field', 'controllers/Lines'], function(Field_, Lines_) {
    Field = Field_;
    Lines = Lines_;

    done();
  })
});

describe('Lines Game', function() {
  var field, game;
  setup(function() {
    field = new Field(9,9);
    game = new Lines({field: field});
    Math.random = require("../js/helpers/seeded_random")(42);
  });

  it('creates a new game', function() {
    expect(game).to.be.an('object');
  });

  it('gets options', function() {
    var options = game.getOptions();

    for(var option in Lines.OPTIONS) {
      if (!Lines.OPTIONS.hasOwnProperty(option)) continue;
      option = Lines.OPTIONS[option];
      expect(options[option])
        .to.be.equal(game.getOption(option));
      game.setOption(option, null);
      expect(game.getOption(option)).to.be.equal(null);
    }
  });

  function test_turn_correctness(is_first_turn) {
    var free_tiles_before = game.field.getFreeTiles().length
    var tiles_to_fill = game.getOption(
      is_first_turn ? Lines.OPTIONS.BALLS_ON_START : Lines.OPTIONS.BALLS_EACH_TURN
    );
    game.nextTurn();
    var free_tiles_after = game.field.getFreeTiles().length;
    expect(free_tiles_before - free_tiles_after).to.be.equal(tiles_to_fill);
  }

  it('starts game', function() {
    test_turn_correctness(true);
  });

  it('starts game with specified balls number', function() {
    game.setOption(Lines.OPTIONS.BALLS_ON_START, 6);
    test_turn_correctness(true);
  });

  it('continues game', function() {
    test_turn_correctness(true);
    test_turn_correctness();
  });

  it('continues game with specified ball numbers each turn', function() {
    test_turn_correctness(true);
    game.setOption(Lines.OPTIONS.BALLS_EACH_TURN, 5);
    test_turn_correctness();
  });

  it('bursts required number of balls in a row', function() {
    game.setOption(Lines.OPTIONS.BALLS_ON_START, 3);
    game.setOption(Lines.OPTIONS.BALLS_EACH_TURN, 3);
    Math.random = require("../js/helpers/seeded_random")(42);

    game.nextTurn();

    game.selectCell(game.field.cells[7][3]);
    game.moveSelected(game.field.cells[0][2]);

    console.log(game.field.cells+'')
    expect(game.field.getFreeTiles()).to.have.length(75);

    game.selectCell(game.field.cells[6][3]);
    game.moveSelected(game.field.cells[0][5]);

    console.log(game.field.cells+'')
    expect(game.field.getFreeTiles()).to.have.length(81);
  });
});