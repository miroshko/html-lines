"use strict";

require.config({
  baseUrl: 'js',
  paths: {
    'lodash': '//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min',
    'vue': '//cdnjs.cloudflare.com/ajax/libs/vue/0.10.6/vue.min' ,
    'director': '//cdn.jsdelivr.net/director/1.1.9/director.min'
  }
}); 


require([
    'models/Field',
    'controllers/Lines',
    'components/Field',
    'director',
    'helpers/seeded_random'
  ], function(Field, Lines, VueField, Director, seeded_random) {

  function startGame(seed) {
    if (seed) {
      Math.random = seeded_random(seed);
    }

    var field = new Field(9, 9);  
    window.FLD = field;
    var lines = new Lines({
      field: field
    });

    var fieldView = new VueField({
      el: '#field',
      data: field
    });

    lines.nextTurn();
  }

  var routes = {
    '/': startGame,
    '/seed/:seed': startGame
  };

  var router = Router(routes);
  router.init('/');
});