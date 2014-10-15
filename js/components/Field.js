define(['vue', 'components/Cell'], function(Vue, Cell) {
  var Field = Vue.extend({
    created: function() {
      this.$on('selected-cell-set', function(cell) {
        this.$data.selected = cell.$data.selected ? cell : null;
      });
      this.$on('move-commanded', function(cell, callback) {
        var origin_cell = this.$data.selected;
        if (!origin_cell || origin_cell == cell)
          return;
        var this_ = this;
        this.$data.move(
          origin_cell.$data.y,
          origin_cell.$data.x,
          cell.$data.y,
          cell.$data.x,
          function(err) {
            if (!err) {
              this_.$data.selected.selected = false;
              this_.$data.selected = null;
            }
          }
        );
      });
    }
  });
  Field.component('field-cell', Cell);
  return Field;
});