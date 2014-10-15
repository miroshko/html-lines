define(['vue'], function(Vue) {
  return Vue.extend({
    // @todo: move to tpls
    template: '<span class="cell" v-on="click: moveSelectedHere" v-class="selected: selected">' +
      '<span class="{{ color }}" v-on="click: toggleSelected" v-class="ball: color" v-on="click:onClick">' +
      '</span>' +
    '</span>', 
    computed: {
      className: function() {
        var className = this.$data.color ? "ball ball-" + this.$data.color : "";
        return className;
      }
    },
    methods: {
      toggleSelected: function() {
        this._select(!this.$data.selected);
      },
      _select: function(value) {
        this.$data.selected = value;
        this.$dispatch('selected-cell-set', this);
      },
      moveSelectedHere: function() {
        var this_ = this;
        this.$dispatch('move-commanded', this);
      }
    }
  });
});