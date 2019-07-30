 const contrib = require('blessed-contrib')
function cluster(label,grid,y,x,height, width){

           var table = grid.set(y,x,height, width, contrib.table,
                                    { keys: true
                                    , fg: 'white'
                                    , selectedFg: 'white'
                                    , selectedBg: 'blue'
                                    , interactive: true
                                    , label
                                    , width: '30%'
                                    , height: '30%'
                                    , border: {type: "line", fg: "cyan"}
                                    , columnSpacing: 10 //in chars
                                    , columnWidth: [16, 12, 12] //in chars
                                    })

     
     
     
     
   //allow control the table with the keyboard
   table.focus()

   table.setData(
   { headers: ['col1', 'col2', 'col3']
   , data:
      [ [1, 2, 3]
      , [4, 5, 6] ]})



      /*
      return function inputLine(line){
        log.log(line.raw)
      }
      */
      
      
      
      
}// END cluster

module.exports = cluster
 
 
 