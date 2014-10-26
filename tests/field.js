"use strict";

var requirejs = require('requirejs');
requirejs.config({
    nodeRequire: require
});

var expect = require("chai").expect;
var setup = require('mocha').setup

var COLORS = {
  RED: 'redColOR',
  BLUE: 'blue',
  GREEN: 'Green'  
}

var Field;
setup(function(done) {
  requirejs(['../js/models/Field'], function(Field_) {
    Field = Field_;
    done();
  })
});

describe("Field.", function() {
  it("creates a new field", function() {
    var field = new Field();
  });

  it("specifies size", function() {
    var field = new Field(9, 9);
    expect(field.getTiles()).to.have.length(9*9);
    field = new Field(2, 8);
    expect(field.getTiles()).to.have.length(2*8);
    field = new Field(1, 11);
    expect(field.getTiles()).to.have.length(1*11);
    field = new Field(0, 0);
    expect(field.getTiles()).to.have.length(0);
  });

  it("sets colors of tiles", function() {
    var field = new Field(9, 9);
    field.color(1, 2, COLORS.RED);
    field.color(2, 8, COLORS.BLUE);
    expect(field.color(1,2)).to.be.equal(COLORS.RED);
    expect(field.color(2,8)).to.be.equal(COLORS.BLUE);
    expect(field.color(4,4)).to.be.equal(null);
    expect(field.color(0,0)).to.be.equal(null);
    field.color(1, 2, COLORS.GREEN);
    expect(field.color(1,2)).to.be.equal(COLORS.GREEN);
    field.color(1, 2, null);
    field.color(2, 8, null);
    expect(field.color(1,2)).to.be.equal(null);
    expect(field.color(2,8)).to.be.equal(null);
  });

  it('gets free tiles', function() {
    var field = new Field(4, 4);
    field.color(1,1, COLORS.RED);
    field.color(2,2, COLORS.RED);
    field.color(3,3, COLORS.BLUE);
    expect(field.getFreeTiles()).to.have.length(4*4 - 3);
    field.color(1,1, COLORS.BLUE);
    expect(field.getFreeTiles()).to.have.length(4*4 - 3);
    field.color(1,1, null);
    field.color(2,2, null);
    expect(field.getFreeTiles()).to.have.length(4*4 - 1);
  });
})
// expect([]).to.be.a('object')

describe('Moving.', function() {
  it('moves one ball', function(done) {
    var field = new Field(5,5);
    field.color(1,1, COLORS.RED);
    expect(field.color(2,2)).to.be.equal(null);
    field.move(1,1,2,2, function(err) {
      expect(err).to.be.equal(null);
      expect(field.color(1,1)).to.be.equal(null);
      expect(field.color(2,2)).to.be.equal(COLORS.RED);
      done();
    });
  });

  it('moves one ball two times', function(done) {
    var field = new Field(9,9);
    field.color(1,1, COLORS.RED);
    field.move(1,1,2,2,function(err) {
      expect(err).to.be.equal(null);
      field.move(2,2,4,4,function(err) {
        expect(err).to.be.equal(null);
        expect(field.color(4,4)).to.be.equal(COLORS.RED);
        expect(field.color(2,2)).to.be.equal(null);
        expect(field.color(1,1)).to.be.equal(null);
      })
      done();
    })
  });

  it("cannot move to an occupied cell", function() {
    var field = new Field(4,4);
    field.color(1,1,COLORS.RED);
    field.color(1,2,COLORS.BLUE);
    field.move(1,2,1,1,function(err) {
      expect(err).to.be.not.equal(null);
      expect(field.color(1,1)).to.be.equal(COLORS.RED);
      expect(field.color(1,2)).to.be.equal(COLORS.BLUE);
    });
  });

  it('cannot move from empty tile', function(done) {
    var field = new Field(4,4);
    field.move(1,1,2,2, function(err) {
      expect(err).to.be.not.equal(null);
      done();
    });    
  });

  it('cannot move a barred ball', function(done) {
    var field = new Field(6,6);
    field.color(2,0, COLORS.RED);
    field.color(2,1, COLORS.RED);
    field.color(2,2, COLORS.RED);
    field.color(2,3, COLORS.RED);
    field.color(2,4, COLORS.RED);
    field.color(2,5, COLORS.RED);
    field.color(0,0, COLORS.GREEN);
    field.move(0,0,5,5,function(err) {
      expect(err).to.be.not.equal(null);
      done();
    });
  });

  it('can move an unbarred ball', function(done) {
    var field = new Field(7,3);
    field.color(1,0, COLORS.BLUE);
    field.color(1,1, COLORS.BLUE);
    field.color(3,1, COLORS.GREEN);
    field.color(3,2, COLORS.GREEN);
    field.color(5,0, COLORS.RED);
    field.color(5,1, COLORS.RED);

    field.color(0,0, COLORS.BLUE);

    expect(field.color(0,0)).to.be.equal(COLORS.BLUE);
    expect(field.color(5,2)).to.be.equal(null);

    field.move(0,0,6,1, function(err) {
      expect(err).to.be.equal(null);
      expect(field.color(6,1)).to.be.equal(COLORS.BLUE);
      expect(field.color(0,0)).to.be.equal(null);
      done();
    })
  });


});
