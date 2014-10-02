define(['vue'], function(Vue) {
  return Vue.extend({
    // @todo: move to tpls
    template: '<span class="cell" v-on="click: moveSelectedHere">' +
      '<span class="{{ color }}" v-on="click: select" v-class="ball: color, selected: selected" v-on="click:onClick">' +
      '</span>' +
    '</span>', 
    computed: {
      className: function() {
        var className = this.$data.color ? "ball ball-" + this.$data.color : "";
        return className;
      }
    },
    methods: {
      select: function() {
        this.$data.selected = !this.$data.selected;
      },
      moveSelectedHere: function() {
        console.log("moving")
      }
    }
  });
});