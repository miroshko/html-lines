define(['vue', 'components/Cell', 'text!templates/Field.html'], function(Vue, Cell, tpl) {
  var Field = Vue.extend({
    template: tpl,
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