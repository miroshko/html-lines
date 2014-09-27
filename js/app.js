"use strict";

require.config({
  baseUrl: 'js',
  paths: {
    'lodash': '//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min',
    'vue': '//cdnjs.cloudflare.com/ajax/libs/vue/0.10.6/vue.min' 
  }
}); 


require(['models/Field', 'components/Field'], function(Field, VueField) {
  var field = new Field(9, 9);  

  var fieldView = new VueField({
    el: '#field',
    data: field
  });

  window.FLD = field;
});