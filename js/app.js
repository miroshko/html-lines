"use strict";

require.config({
  baseUrl: 'js',
  paths: {
    'lodash': '//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min',
    'vue': '//cdnjs.cloudflare.com/ajax/libs/vue/0.10.6/vue.min' ,
    'director': '//cdn.jsdelivr.net/director/1.1.9/director.min',
    'q': '//cdnjs.cloudflare.com/ajax/libs/q.js/1.0.1/q.js'
  }
}); 


require([
    'models/Field',
    'controllers/Lines',
    'components/Field',
    'director',
    'lodash'
  ], function(Field, Lines, VueField, Director, _) {

  var lines_game;
  var field_view;
  var field_container = document.querySelector('#game-container');

  function startGame(seed) {
    var field = new Field(9, 9);  
    
    lines_game = new Lines({
      field: field,
      seed: seed
    });
    window.GAME = lines_game;
    lines_game.setOption(Lines.OPTIONS.COLORS_ENABLED, _.values(Lines.COLORS));
    lines_game.start();

    if (field_view)
      field_view.$destroy();

    var el = document.createElement('div');
    field_container.appendChild(el);

    field_view = new VueField({
      el: el,
      data: lines_game
    });
    console.log(field_view.$el)    
  }

  function restartGame() {
    if (lines_game) {
      lines_game.restart();
      history.replaceState(null, null, '#/');  
    } else {
      history.pushState(null, null, '#/new');  
    }
  }

  var routes = {
    '/': startGame,
    '/new': function() {
      startGame();
      history.pushState(null, null, '#/');
    },
    '/restart': restartGame,
    '/seed/:seed': startGame
  };

  var router = Router(routes);
  router.init('/new');
});