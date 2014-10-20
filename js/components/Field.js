define(['vue', 'components/Cell'], function(Vue, Cell) {
  var Field = Vue.extend({
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