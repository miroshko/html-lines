"use strict";

var seeded = function(s) {
  return function() {
    s = Math.sin(s) * 10000; return s - Math.floor(s);
  };
};

if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function() {
  return seeded;
});  
