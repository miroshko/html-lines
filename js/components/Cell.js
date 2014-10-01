define(['vue'], function(Vue) {
  return Vue.extend({
    template: '<span class="{{ className }}"></span>',
    computed: {
      className: function() {
        return this.$data.color ? "ball ball-" + this.$data.color : "";
      }
    }
  });
});