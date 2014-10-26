define(['vue', 'components/Cell'], function(Vue, Cell) {
  var Field = Vue.extend({
    // @todo: move to tpls
    template: '<div id="field" v-class="game-over: is_over">' +
      '<nav class="side-panel">' +
        '<ul>' +
          '<li>' +
            '<a href="#/restart">Restart this game</a>' +
          '</li>' +
          '<li>' +
            '<a href="#/new">Start new game</a>' +
          '</li>' +
        '</ul>' +
      '</nav>' +
      '<aside class="score side-panel">Score: <span class="score-value">{{ score }}</span></aside>' +
      '<aside class="next-balls side-panel">Next:' +
        '<span v-repeat="random_colors_queue" class="ball ball-{{ $value }}"></span>' +
      '</aside>' +
      '<div>' +
        '<div v-repeat="field.cells" class="row">' +
          '<field-cell v-repeat="$value" class="tile">' +
          '</field-cell>' +
        '</div>' +
      '</div>' +
    '</div>',
    created: function() {
      var game = this.$data;
      this.$on('selected-cell-set', function(cell) {
        game.selectCell(cell.$data);
      });
      this.$on('move-commanded', function(cell, callback) {
        game.moveSelected(cell.$data, callback);
      });
    }
  });
  Field.component('field-cell', Cell);
  return Field;
});