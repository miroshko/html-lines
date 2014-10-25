"use strict";

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
  return function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    if (currentIndex == 1) {
      return array;
    }

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  } 
});
