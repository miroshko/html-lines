"use strict";

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['lodash'], function(_) {
  return function Field(height, width) {
    this.width = width;
    this.height = height;
    this.cells = [];

    for(var i = 0; i < height; i++) {
      this.cells[i] = [];
      for(var j = 0; j < width; j++) {
        this.cells[i][j] = {
          y: i,
          x: j,
          color: null
        };
      }  
    }

    this.color = function(y, x, color) {
      if (typeof color != "undefined") {
        this.cells[y][x].color = color;
      }
      return this.cells[y][x].color;
    }

    this.getTiles = function() {
      return _.flatten(this.cells);
    };

    this.getFreeTiles = function() {
      var free = _.flatten(this.cells).filter(function(cell) {
        return cell.color === null;
      });
      return free;
    };

    this.getPath = function(from_y, from_x, to_y, to_x)  {
      var dx,dy,i,j,
          weights = [],
          iteration = 0,
          next_cells = [this.cells[to_y][to_x]],
          next_next_cells = [],
          ds = [[0,1], [0,-1], [1,0], [-1,0]],
          curr_cell,
          next_cell,
          path_exists = false,
          distances = [],
          distance;

      distances.toString = function() {
        var string = this.join("\n");
        return string;
      }

      walkup:
      while(next_cells.length){
        for(i = 0; i < next_cells.length; i++) {
          curr_cell = next_cells[i];
          if (!distances[curr_cell.y])
            distances[curr_cell.y] = [];
          if (curr_cell.y === from_y && curr_cell.x === from_x) {
            path_exists = true;
            distances[curr_cell.y][curr_cell.x] = iteration;
            break walkup;
          }
          if (typeof distances[curr_cell.y][curr_cell.x] != "undefined" || curr_cell.color)
            continue;
          distances[curr_cell.y][curr_cell.x] = iteration;

          for(j = 0; j < ds.length; j++) {
            dx = ds[j][1];
            dy = ds[j][0];
            next_cell = this.cells[curr_cell.y+dy] ? this.cells[curr_cell.y+dy][curr_cell.x+dx] : null;
            if (next_cell)
              next_next_cells.push(next_cell);
          }
        }
        iteration++;
        next_cells = _.unique(next_next_cells);
        next_next_cells = [];
      }

      if (!path_exists)
        return;

      var path = [];
      for(i = iteration; i >= 0; i--) {
        for(j=0; j < ds.length; j++) {
          dx = ds[j][1];
          dy = ds[j][0];
          if (distances[curr_cell.y + dy] && distances[curr_cell.y + dy][curr_cell.x + dx] == i - 1) {
            path.push(curr_cell);
            curr_cell = this.cells[curr_cell.y + dy][curr_cell.x + dx];
          }
        }
      }

      return path;
    };

    this.move = function(from_y, from_x, to_y, to_x, callback) {
      var error = null, path;
      var from = this.cells[from_y][from_x];
      var to = this.cells[to_y][to_x];
      if (!from.color) {
        error = "empty origin cell"
      } else if (to.color) {
        error = "occupied target cell"
      } else {
        path = this.getPath(from_y, from_x, to_y, to_x);
        if (!path) {
          error = "cell not reachable"
        } else {
          to.color = from.color;
          from.color = null;
        }
      }
      callback(error);
    };

    this.cells.toString = function() {
      var string = "";
      this.forEach(function(row) {
        row.forEach(function(cell){
          string += cell.color ? cell.color[0] : "-";
        });
        string += "\n";
      });
      return string;
    }
  }

});