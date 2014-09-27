define(['vue', 'components/Cell'], function(Vue, Cell) {
  var Field = Vue.extend({

  });
  Field.component('field-cell', Cell);
  return Field;
});