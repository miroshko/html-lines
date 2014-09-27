define(['vue'], function(Vue) {
  return Vue.extend({
    computed: {
      colorx: function() {
        return this.$data.color;
      }
    }
  });
});