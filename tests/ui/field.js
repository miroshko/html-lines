var expect = require("chai").expect;
var test = require('selenium-webdriver/testing');
var webdriver = require('selenium-webdriver');

test.describe('Page with Lines field', function() {
  var url = 'http://localhost:8000/test.html';

  test.it('sees field with initial balls on it', function() {
    var driver = new webdriver.Builder().
      withCapabilities(webdriver.Capabilities.firefox()).
      build();
    driver.get(url).then(function() {
      driver.findElements(webdriver.By.className('tile')).then(function(tiles) {
        expect(tiles).to.have.length(81);
        
      })
    }).then(function() {
      driver.quit();
    });;

  });
  test.it('can select and unselect a ball');
  test.it('can move selected ball')
  test.it('cannot move unselected ball')
  test.it('gets new balls after each turn')
});