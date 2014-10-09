var expect = require("chai").expect;
var test = require('selenium-webdriver/testing');
var webdriver = require('selenium-webdriver');

var HARDCODED_VALUES = {
  tiles_amount: 81
}

test.describe('Page with Lines field', function() {
  var seed = 42;
  var url = 'http://localhost:8000/index.html?seed=' + seed;
  var driver;

  test.before(function() {
    driver = new webdriver.Builder().
      withCapabilities(webdriver.Capabilities.firefox()).
      build();
  });

  test.it('sees field with initial balls on it', function() {
    driver.get(url).then(function() {
      driver.findElements(webdriver.By.className('tile')).then(function(tiles) {
        expect(tiles).to.have.length(HARDCODED_VALUES.tiles_amount);
      })
    }).then(function() {
      driver.quit();
    });;
  });

  test.it('can not select an empty cell', function() {
    driver.get(url).then(function() {
      driver
    });
  });
  test.it('can select and unselect a ball');
  test.it('can move selected ball')
  test.it('cannot move unselected ball')
  test.it('gets new balls after each turn')
});