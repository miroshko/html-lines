"use strict";

var seeded = function(s) {
  return function() {
    // 15 seems to be preciseness that covers all environments
    s = Math.sin(s).toFixed(15) * 10000; return s - Math.floor(s);
  };
};

if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function() {
  return seeded;
});  
