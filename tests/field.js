var expect = require("chai").expect
var _ = require('../js/lib/underscore');
var Field = require('../js/Field.js');

describe("abc", function() {
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
    field = new Field(9, 9);
    field.color(1, 2, field.colors.RED);
    field.color(2, 8, field.colors.BLUE);
    expect(field.color(1,2)).to.be.equal(field.colors.RED);
    expect(field.color(2,8)).to.be.equal(field.colors.BLUE);
    expect(field.color(4,4)).to.be.equal(null);
    expect(field.color(0,0)).to.be.equal(null);
    field.color(1, 2, field.colors.GREEN);
    expect(field.color(1,2)).to.be.equal(field.colors.GREEN);
    field.color(1, 2, null);
    field.color(2, 8, null);
    expect(field.color(1,2)).to.be.equal(field.colors.null);
    expect(field.color(2,8)).to.be.equal(field.colors.null);
  });

  it('gets free tiles', function() {
    field = new Field(4, 4);
    field.color(1,1, field.colors.RED);
    field.color(2,2, field.colors.RED);
    field.color(3,3, field.colors.BLUE);
    expect(field.getFreeTiles()).to.have.length(4*4 - 3);
    field.color(1,1, field.colors.BLUE);
    expect(field.getFreeTiles()).to.have.length(4*4 - 4);
    field.color(1,1, null);
    field.color(2,2, null);
    expect(field.getFreeTiles()).to.have.length(4*4 - 2);
  });
})
// expect([]).to.be.a('object')

