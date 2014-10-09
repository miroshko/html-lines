define(['vue'], function(Vue) {
  return Vue.extend({
    // @todo: move to tpls
    template: '<span class="cell" v-on="click: moveSelectedHere" v-class="selected: selected">' +
      '<span class="{{ color }}" v-on="click: select" v-class="ball: color" v-on="click:onClick">' +
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