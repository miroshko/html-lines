function Field(width, height) {
  this.width = width;
  this.height = height;
  this.cells = [];
  this.colors = {
    RED: 'red',
    BLUE: 'blue',
    GREEN: 'green'
  }

  for(var i = 0; i < config.field_height; i++) {
    field[i] = [];
    for(var j = 0; j < config.field_width; j++) {
      field[i][j] = {
        y: i,
        x: j,
        color: null
      };
    }  
  }

  this.getTiles = function() {
    return _.flatten(this.cells);
  };
}

module.exports = Field;