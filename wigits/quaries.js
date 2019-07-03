const contrib = require('blessed-contrib')
function builder(label,grid,y,x,height, width){

      var log = grid.set(y,x,height, width,contrib.log,{ fg: "green", selectedFg: "green", label})
      return function inputLine(line){
        log.log(line.raw)
      }
}// END builder

module.exports = builder
