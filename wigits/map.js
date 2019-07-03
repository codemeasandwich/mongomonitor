
const fetch = require('node-fetch')
const contrib = require('blessed-contrib')
let map;
function builder(label,grid,y,x,height, width){
  if(map){
    throw new Error("Map was already created")
  }
  map = grid.set(y,x,height, width, contrib.map, {
    label,
    style:{
      stroke: "red",
      shapeColor:"yellow"
    }
  })
}

fetch('https://api.ipdata.co/')
    .then(res => res.json())
    .then(geo=>{
 map.addMarker({"lon" : geo.longitude, "lat" : geo.latitude, color: "white", char: "♦" })
}).catch(err => { throw err } )

module.exports = builder
