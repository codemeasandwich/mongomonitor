const contrib = require('blessed-contrib')
function clusterload(label,grid,y,x,height, width){

      var stackedBar = grid.set(y,x,height, width,contrib.stackedBar,
       { label
       , barWidth: 4
       , barSpacing: 6
       , xOffset: 0
       //, maxValue: 15
       , height: "40%"
       , width: "50%"
       , barBgColor: [ 'red', 'blue', 'green' ]})
      
      
         stackedBar.setData(
       { barCategory: ['Q1', 'Q2', 'Q3', 'Q4']
       , stackedCategory: ['US', 'EU', 'AP']
       , data:
          [ [ 7, 7, 5]
          , [8, 2, 0]
          , [0, 0, 0]
          , [2, 3, 2] ]
       })

}// END clusterload

module.exports = clusterload
