define(['vue'], function(Vue) {
  return Vue.extend({
    // @todo: move to tpls
    template: '<span class="cell" v-on="click: moveSelectedHere" v-class="selected: selected">' +
      '<span class="ball ball-{{ color_virtual }}" v-on="click: toggleSelected" v-on="click:onClick">' +
      '</span>' +
    '</span>', 
    methods: {
      toggleSelected: function(e) {
        e.stopPropagation();
        this._select(!this.$data.selected);
      },
      _select: function(value) {
        this.$dispatch('selected-cell-set', this);
      },
      moveSelectedHere: function() {
        var this_ = this;
        this.$dispatch('move-commanded', this);
      }
    }
  });
});