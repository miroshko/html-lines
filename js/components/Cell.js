define(['vue', 'text!templates/Cell.html'], function(Vue, tpl) {
  return Vue.extend({
    template: tpl, 
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