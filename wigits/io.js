

const contrib = require('blessed-contrib')

function builder(label,grid,y,x,height, width){
     var line = grid.set(y,x,height, width,contrib.line,
           { /*style:
             { line: "yellow"
             , text: "green"
             , baseline: "black"}
           ,*/ xLabelPadding: 0
           , xPadding: 0
           , showLegend: true
           , wholeNumbersOnly: false //true=do not show fraction in y axis
           , label}) // every 5 sec

    var dt = new Date;
      const x_labels =  Array.from(new Array(12)).map(()=> {
          const t = dt.getHours() +":"+("0"+dt.getMinutes()).slice(-2)
          dt.setMinutes( dt.getMinutes() - 5 );
          return t
      }).reverse()

/*
  const x =  Array.from(new Array(12)).map((x,i)=> {
      const t = dt.getHours() +":"+dt.getMinutes()
      dt.setMinutes( dt.getMinutes() - 1 );
      return t
  }).reverse()
*/



     var series1 = {
           title: 'Read',
           style: {
            line: 'white'
},
           x:x_labels,//: ['t1', 't2', 't3', 't4'],
           y: [5, 1, 7, 5,5, 1, 7, 5, 4, 8,1,1]
        }// END series1
     var series2 = {
           title: 'Write',
           style: {
            line: 'blue'
          },
           x:x_labels,//: ['t1', 't2', 't3', 't4'],
           y: [2, 1, 4, 8,2, 1, 4, 8,5, 1,1,1]
        } // END series2
    // screen.append(line) //must append before setting data
    setInterval(()=>{
      series1.y.push(Math.floor(Math.random() * 8))
      series1.y.shift()
      series1.title = "Read: "+series1.y[series1.y.length - 1]
      series2.y.push(Math.floor(Math.random() * 12))
      series2.y.shift()
      series2.title = "Write: "+series2.y[series2.y.length - 1]


      const max1 = series1.y.reduce((m,x)=> m>x ? m:x)
      const max2 = series2.y.reduce((m,x)=> m>x ? m:x)
      const top = max1 > max2 ? max1 : max2

      line.setData([series1, series2,{title: '',//'Max: '+max,
        style: series1.style,
        x:x_labels, y:series1.y.map(()=>max1)
     },{title: '',//'Max: '+max,
       style: series2.style,
       x:x_labels, y:series2.y.map(()=>max2)
    },{title: '',//'Max: '+max,
    style: {
     line: 'black'
   },
      x:x_labels, y:series2.y.map(()=>top+5)
   }
   ])
    }, 1000);
     line.setData([series1, series2])
   }// END builder


   module.exports = builder
