const contrib = require('blessed-contrib')
const listen = require('../store')
function builder(label,grid,y,x,height, width){

      var logWigit = grid.set(y,x,height, width,contrib.log,{ fg: "green", selectedFg: "green", label})
      var lastline = ""
      listen(({log}) => {
        if(log[log.length-1] !== lastline){
          lastline = log[log.length-1]
          logWigit.log(lastline)
        }
      })
    /*  return function inputLine(line){
        logWigit.log(line.raw)
      }*/
}// END builder

module.exports = builder
