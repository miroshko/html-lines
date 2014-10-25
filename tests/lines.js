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
    game.setOption(Lines.OPTIONS.BALLS_ON_START, 3);
    game.setOption(Lines.OPTIONS.BALLS_EACH_TURN, 3);
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
    game.start();

    game.selectCell(game.field.cells[7][3]);
    game.moveSelected(game.field.cells[0][2]);

    expect(game.field.getFreeTiles()).to.have.length(75);

    game.selectCell(game.field.cells[6][3]);
    game.moveSelected(game.field.cells[0][5]);

    expect(game.field.getFreeTiles()).to.have.length(78);
  });

it('bursts required number of balls in a vertical row', function() {
    game.start();

    game.selectCell(game.field.cells[7][3]);
    game.moveSelected(game.field.cells[1][4]);
    expect(game.field.getFreeTiles()).to.have.length(75);

    game.selectCell(game.field.cells[6][3]);
    game.moveSelected(game.field.cells[2][4]);
    expect(game.field.getFreeTiles()).to.have.length(72);
    
    game.selectCell(game.field.cells[0][0]);
    game.moveSelected(game.field.cells[3][4]);
    
    console.log(game.field.cells.toString());

    expect(game.field.getFreeTiles()).to.have.length(77);
    
  });

  it('bursts on appearance', function() {
    game.start();
    game.selectCell(game.field.cells[7][3]);
    game.moveSelected(game.field.cells[0][2]);

    game.selectCell(game.field.cells[6][3]);
    game.moveSelected(game.field.cells[6][2]);

    expect(game.field.getFreeTiles()).to.have.length(77);
  });

  it('bursts on edges', function() {
    game.start();
    game.selectCell(game.field.cells[0][1]);
    game.moveSelected(game.field.cells[0][8]);

    game.selectCell(game.field.cells[6][3]);
    game.moveSelected(game.field.cells[0][7]);

    game.selectCell(game.field.cells[4][4]);
    game.moveSelected(game.field.cells[0][5]);

    expect(game.field.getFreeTiles()).to.have.length(78);
  });

  it('bursts on NW diagonal combination', function() {
    game.start();
    game.selectCell(game.field.cells[7][3]);
    game.moveSelected(game.field.cells[8][8]);

    game.selectCell(game.field.cells[6][3]);
    game.moveSelected(game.field.cells[7][7]);

    game.selectCell(game.field.cells[7][5]);
    game.moveSelected(game.field.cells[6][6]);

    game.selectCell(game.field.cells[4][1]);
    game.moveSelected(game.field.cells[5][5]);

    expect(game.field.getFreeTiles()).to.have.length(74);
  });

  it('bursts on NE diagonal combination', function() {
    game.start();
    game.selectCell(game.field.cells[7][3]);
    game.moveSelected(game.field.cells[8][4]);

    game.selectCell(game.field.cells[6][3]);
    game.moveSelected(game.field.cells[7][5]);

    game.selectCell(game.field.cells[4][4]);
    game.moveSelected(game.field.cells[6][6]);

    game.selectCell(game.field.cells[8][5]);
    game.moveSelected(game.field.cells[5][7]);

    game.selectCell(game.field.cells[4][3]);
    game.moveSelected(game.field.cells[4][8]);

    expect(game.field.getFreeTiles()).to.have.length(71);
  });

  it('bursts on complex combinations', function() {
    game.start();

    game.selectCell(game.field.cells[0][1]);
    game.moveSelected(game.field.cells[0][5]);

    game.selectCell(game.field.cells[6][3]);
    game.moveSelected(game.field.cells[1][6]);

    game.selectCell(game.field.cells[4][4]);
    game.moveSelected(game.field.cells[2][5]);

    game.selectCell(game.field.cells[4][1]);
    game.moveSelected(game.field.cells[3][4]);

    game.selectCell(game.field.cells[0][0]);
    game.moveSelected(game.field.cells[1][0]);

    expect(game.field.getFreeTiles()).to.have.length(72);
  });

  it('bursts combination with multiple (3) colors', function() {
    game.setOption(Lines.OPTIONS.COLORS_ENABLED, [
      Lines.COLORS.RED,
      Lines.COLORS.GREEN,
      Lines.COLORS.BLUE
    ]);
    game.start();

    game.selectCell(game.field.cells[7][3]);
    game.moveSelected(game.field.cells[4][1]);

    game.selectCell(game.field.cells[3][2]);
    game.moveSelected(game.field.cells[2][1]);

    game.selectCell(game.field.cells[1][5]);
    game.moveSelected(game.field.cells[1][1]);

    expect(game.field.getFreeTiles()).to.have.length(77);

    game.selectCell(game.field.cells[5][8]);
    game.moveSelected(game.field.cells[1][5]);

    game.selectCell(game.field.cells[5][2]);
    game.moveSelected(game.field.cells[5][6]);

    game.selectCell(game.field.cells[2][8]);
    game.moveSelected(game.field.cells[5][8]);

    game.selectCell(game.field.cells[3][2]);
    game.moveSelected(game.field.cells[5][3]);

    game.selectCell(game.field.cells[3][8]);
    game.moveSelected(game.field.cells[5][4]);

    game.selectCell(game.field.cells[8][3]);
    game.moveSelected(game.field.cells[5][1]);

    game.selectCell(game.field.cells[6][3]);
    game.moveSelected(game.field.cells[5][0]);

    expect(game.field.getFreeTiles()).to.have.length(64);

    game.selectCell(game.field.cells[4][7]);
    game.moveSelected(game.field.cells[5][4]);

    expect(game.field.getFreeTiles()).to.have.length(69);

  })
});

