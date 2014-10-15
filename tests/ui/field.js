var expect = require("chai").expect;
var test = require('selenium-webdriver/testing');
var webdriver = require('selenium-webdriver');

var HARDCODED_VALUES = {
  tiles_amount: 81
};
SELECTED_BALL_REGEXP = /.*\bselected\b.*/;

test.describe('Page with Lines field', function() {
  var seed = 42;
  var url = 'http://localhost:8000/#/seed/' + seed;
  var driver;
  var selector_with_ball = '.row:nth-child(1) .tile:nth-child(3) .cell';
  var selector_without_ball = '.row:nth-child(1) .tile:nth-child(2) .cell';

  test.before(function() {
    driver = new webdriver.Builder().
      withCapabilities(webdriver.Capabilities.firefox()).
      build();
  });

  test.it('sees field with initial balls on it', function() {
    driver.get(url).then(function() {
      return driver.findElements(webdriver.By.className('tile'));
    }).then(function(tiles) {
      expect(tiles).to.have.length(HARDCODED_VALUES.tiles_amount);
    });
  });

  test.it('can not select an empty cell', function() {
    driver.get(url).then(function() {
      return driver.findElement(webdriver.By.css(selector_without_ball))
    }).then(function(tile) {
      tile.click();
      expect(tile.getAttribute("class")).to.not.match(SELECTED_BALL_REGEXP);
    });
  });

  test.it('can select and unselect a cell with a ball', function() {
    var tile, ball;
    driver.get(url).then(function() {
      return driver.findElement(webdriver.By.css(selector_with_ball))
    }).then(function(tile_) {
      tile = tile_;
      return tile.findElement(webdriver.By.css('.ball'));
    }).then(function(ball_) {
      ball = ball_;
      ball.click();
      return tile.getAttribute("class");
    }).then(function(className) {
      expect(className).to.match(SELECTED_BALL_REGEXP);
      ball.click();
      return tile.getAttribute("class");
    }).then(function(className) {
      expect(className).to.not.match(SELECTED_BALL_REGEXP);
    });
  });

  test.it('can move selected ball', function() {
    var tile_origin, tile_target, ball;
    driver.get(url).then(function() {
      return driver.findElement(webdriver.By.css(selector_with_ball));
    }).then(function(tile_) {
      tile_origin = tile_;
      return tile_origin.findElement(webdriver.By.css('.ball'))
    }).then(function(ball_) {
      ball = ball_;
      ball.click();
      return driver.findElement(webdriver.By.css(selector_without_ball));
    }).then(function(tile_) {
      tile_target = tile_
      tile_target.click();
      return tile_target.findElements(webdriver.By.css('.ball'));
    }).then(function(target_cell_balls) {
      expect(target_cell_balls).to.have.length(1);
      return tile_origin.findElements(webdriver.By.css('.ball'));
    }).then(function(origin_cell_balls) {
      expect(origin_cell_balls).to.have.length(0);
    });
  });
  test.it('cannot move unselected ball')
  test.it('gets new balls after each turn')

  test.after(function() {
    driver.quit();
  });
});