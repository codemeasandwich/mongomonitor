const contrib = require('blessed-contrib')
function builder(label,grid,y,x,height, width){

      var table = grid.set(y,x,height, width,contrib.table,{ keys: true
                         , fg: 'white'
                         , selectedFg: 'white'
                         , selectedBg: 'blue'
                         , interactive: true
                         , label
                         , width: '30%'
                         , height: '30%'
                         , border: {type: "line", fg: "cyan"}
                         , columnSpacing: 3 //in chars
                         , columnWidth: [6,6,40] //in chars
                       })
      return function inputLine(conns){
        
        const data = Object.keys(conns)
                         .sort(function (a, b) {
                              return (+a.replace("conn", "")) - (+b.replace("conn", ""));
                          }).map(linkName => {
                            const [db,cmd] = conns[linkName].split(".$cmd ")
                            return [linkName,db,cmd]
                          })
        
        
        table.setData({ headers: ['link','db', 'comm'], data })
      }
}// END builder

module.exports = builder

       
