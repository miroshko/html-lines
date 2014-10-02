var expect = require("chai").expect;
var Browser = require('zombie');

describe('Page with Lines field', function() {
  var url = 'http://localhost:8000';
  var browser;

  before(function(done) {   
    // Math.random = require("../helpers/seeded_random")(50);
    browser = new Browser();
    browser.visit(url, function() {
      browser.assert.success();
      setTimeout(done, 1000);
    });
  });

  it('sees field with initial balls on it', function() {
    expect(browser.query("#field")).to.be.ok;

    console.log(browser.body.innerHTML)

    // for default values only
    expect(browser.body.querySelectorAll('.tile')).to.have.length(81);
    expect(browser.body.querySelectorAll('.tile.colored')).to.have.length(3);
  });
  it('can select and unselect a ball', function() {

  });
  it('can move selected ball')
  it('cannot move unselected ball')
  it('gets new balls after each turn')
});