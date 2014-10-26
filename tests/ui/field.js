var expect = require("chai").expect;
var test = require('selenium-webdriver/testing');
var webdriver = require('selenium-webdriver');

var HARDCODED_VALUES = {
  tiles_amount: 81
};
SELECTED_BALL_REGEXP = /.*\bselected\b.*/;

function timeout(ms) {
  webdriver.promise.controlFlow().execute(function() {
    var deferred = new webdriver.promise.Deferred();

    setTimeout(function () {
        deferred.fulfill(true);
    }, ms);
    return deferred.promise;
  });
}

test.describe('Page with Lines field:', function() {
  var seed = 42;
  var url = 'http://localhost:8000/#/seed/' + seed + '/colors/1';
  var driver;
  var selector_with_ball = '.row:nth-child(1) .tile:nth-child(2) .cell';
  var selector_with_ball2 = '.row:nth-child(1) .tile:nth-child(7) .cell';
  var selector_without_ball = '.row:nth-child(1) .tile:nth-child(6) .cell';

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

  test.it('deselects a ball when other is selected', function() {
    var tile, ball;
    driver.get(url).then(function() {
      return driver.findElement(webdriver.By.css(selector_with_ball + " .ball"));
    }).then(function(ball_) {
      ball = ball_;
      ball.click();
      return driver.findElement(webdriver.By.css(selector_with_ball2 + " .ball"));
    }).then(function(ball2_) {
      ball2_.click();
      return driver.findElement(webdriver.By.css(selector_with_ball));
    })
    .then(function(cell) {
      return cell.getAttribute('class')
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
      return timeout(1000);
    }).then(function() {
      return driver.findElement(webdriver.By.css(selector_without_ball));
    }).then(function(tile_) {
      tile_target = tile_;
      tile_target.click();
      return timeout(1000);
    }).then(function() {
      return tile_target.findElement(webdriver.By.css('.ball'));
    }).then(function(target_cell_ball) {
      return target_cell_ball.isDisplayed();
    }).then(function(is_displayed) {
      expect(is_displayed).to.be.true;
      return tile_origin.findElement(webdriver.By.css('.ball'));
    }).then(function(origin_cell_ball) {
      return origin_cell_ball.isDisplayed();
    }).then(function(is_displayed) {
      expect(is_displayed).to.be.false;
    })
  });

  test.it('gets balls in a row bursted', function() {
    driver.get(url).then(function() {
      return driver.findElement(webdriver.By.css('.row:nth-child(7) .tile:nth-child(4) .ball'));
    }).then(function(ball) {
      ball.click();
      return driver.findElement(webdriver.By.css('.row:nth-child(1) .tile:nth-child(3) .cell'));
    }).then(function(cell) {
      cell.click();
      return timeout(1000);
    }).then(function() {
      return driver.findElements(webdriver.By.css('.ball.ball-red'));
    }).then(function(balls) {
      expect(balls).to.have.length(1);
    });
  });

  test.it('gets score increased', function() {
    driver.get(url).then(function(cells) {
      return driver.findElement(webdriver.By.css('.score-value'));
    }).then(function(score) {
      return score.getAttribute('innerHTML');
    }).then(function(score_value) {
      expect(score_value).to.be.equal("10");
    })
  });

  test.it('can restart current game', function() {
    driver.get(url).then(function() {
      return driver.findElement(webdriver.By.css("[href='#/restart']"));
    }).then(function(link){
      link.click();
      return driver.findElements(webdriver.By.css('.ball.ball-red'));
    }).then(function(cells) {
      expect(cells).to.have.length(3);
      return driver.findElement(webdriver.By.css('.score-value'));
    }).then(function(score) {
      return score.getAttribute('innerHTML');
    }).then(function(score_value) {
      expect(score_value).to.be.equal("0");
    });
  });

  test.after(function() {
    driver.quit();
  });
});