var expect = require("chai").expect
var Field = require('../js/Field.js');

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
    expect(field.color(1,2)).to.be.equal(null);
    expect(field.color(2,8)).to.be.equal(null);
  });

  it('gets free tiles', function() {
    var field = new Field(4, 4);
    field.color(1,1, field.colors.RED);
    field.color(2,2, field.colors.RED);
    field.color(3,3, field.colors.BLUE);
    expect(field.getFreeTiles()).to.have.length(4*4 - 3);
    field.color(1,1, field.colors.BLUE);
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
    field.color(1,1, field.colors.RED);
    expect(field.color(2,2)).to.be.equal(null);
    field.move(1,1,2,2, function(err) {
      expect(err).to.be.equal(null);
      done();
    });
    expect(field.color(1,1)).to.be.equal(null);
    expect(field.color(2,2)).to.be.equal(field.colors.RED);
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
    field.color(2,0, field.colors.RED);
    field.color(2,1, field.colors.RED);
    field.color(2,2, field.colors.RED);
    field.color(2,3, field.colors.RED);
    field.color(2,4, field.colors.RED);
    field.color(2,5, field.colors.RED);
    field.color(0,0, field.colors.GREEN);
    field.move(0,0,5,5,function(err) {
      expect(err).to.be.not.equal(null);
    });
  });
});
