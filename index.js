var blessed = require('blessed')
  , contrib = require('blessed-contrib')
  , screen  = blessed.screen()
  , grid    = new contrib.grid({rows: 4, cols: 4, screen: screen});

const os = require('os');

const MapBuilder = require('./wigits/map')
      MapBuilder('Servers Location',grid,1, 0, 2, 2)

const InfoBuilder = require('./wigits/info')
const LogBuilder  = require('./wigits/log')

/*
var exec = require('child_process').exec
var psTree = require('ps-tree');

var kill = function (pid, signal, callback) {
    signal   = signal || 'SIGKILL';
    callback = callback || function () {};
    var killTree = true;
    if(killTree) {
        psTree(pid, function (err, children) {
            [pid].concat(
                children.map(function (p) {
                    return p.PID;
                })
            ).forEach(function (tpid) {
                try { process.kill(tpid, signal) }
                catch (ex) { }
            });
            callback();
        });
    } else {
        try { process.kill(pid, signal) }
        catch (ex) { }
        callback();
    }
};

const mongo_process = exec("npm run mongo", { cwd: __dirname, windowsHide:true })

mongo_process.stdout.on('data', function(data) {
    console.log('stdout: ' + data);
});
mongo_process.stderr.on('data', function(data) {
    console.log('stdout: ' + data);
});
mongo_process.on('close', function(code) {
    console.log('mongo was closed: ' + code);
    process.exit(0);
});
*/
const mongoProcessStream = require('./startMongo');


 const LineBuilder = require('./wigits/io')
       LineBuilder('IO for the last minute',grid,3, 2, 1, 2)



// var markdown = grid.set(3, 0, 1, 2,contrib.markdown)
var inputLineForInfo = InfoBuilder("info",grid,3, 0, 1, 2)

 var table = grid.set(1,3,2,1,contrib.table,
                         { keys: true
                         , fg: 'white'
                         , selectedFg: 'white'
                         , selectedBg: 'blue'
                         , interactive: true
                         , label: 'commands'
                         , width: '30%'
                         , height: '30%'
                         , border: {type: "line", fg: "cyan"}
                         , columnSpacing: 3 //in chars
                         , columnWidth: [6,6,40] //in chars
                       })


var logFile = require('./read')

const sparkline = grid.set(2, 2, 1, 1,contrib.sparkline,
      { label: 'Throughput (bits/sec)', tags: true, style: { fg: 'green' }})
/*
const cpuSteps = Array(30).fill(0)

//    sparkline.setData(
//    [ 'CPU', 'RAM', 'DISK'],
//    [ [10, 20, 30, 20]
//    , [40, 10, 40, 50]])



                 // (row, col, rowSpan, colSpan, obj, opts)
   var gauge = grid.set(1, 2, 1, 1,contrib.gauge,{label: 'CPU', stroke: 'green', fill: 'white'})
   gauge.setPercent(0)
*/
//   var line = grid.set(0, 6, 6, 6, contrib.line, {
//       style:{
//         line: "yellow",
//         text: "green",
//         baseline: "black"
//      },
//      xLabelPadding: 3,
//      xPadding: 5,
//      label: 'Stocks'
//    })

    //var log = grid.set(0, 0, 1, 4,contrib.log,{ fg: "green", selectedFg: "green", label: 'Log file'})
    const inputLineForLog = LogBuilder("Log file",grid,0, 0, 1, 4)

    const lines = []
  /*  const info = {
      os:process.platform+ " "+os.release() + " " + os.arch(),
      cpus:os.cpus()[0].model + " - x" + os.cpus().length +" cores"
    }*/
    const conns = {

    }
//let temp = ""
    logFile.subscribe(line => {
      inputLineForLog(line)
  //    screen.render()
  //    return;
      if("CONTROL" === line.component){
      //  markdown.setMarkdown("A")
        if("initandlisten" === line.context){

          inputLineForInfo(line)

        }// END "initandlisten" === line.context
      }// END "CONTROL" === line.component
      if("NETWORK" === line.component){
          if(line.message.startsWith("end")){
            delete conns[line.context]
          }
      }

      if("COMMAND" === line.component){
        if(line.message.startsWith("run") && ! line.message.includes("ping"))
        conns[line.context] = line.message.split("run command ").pop().trim()
      }

      const data = Object.keys(conns)
                         .sort(function (a, b) {
                              return (+a.replace("conn", "")) - (+b.replace("conn", ""));
                          }).map(linkName => {
                            const [db,cmd] = conns[linkName].split(".$cmd ")
                            return [linkName,db,cmd]
                          })

      table.setData({ headers: ['link','db', 'comm'], data })


    //  screen.render()

    },console.error)


  // var map = grid.set(1, 0, 2, 2, contrib.map, {label: 'Servers Location',style:{stroke: "red",shapeColor:"yellow"}})

/*
   var lineData = {
      x: ['t1', 't2', 't3', 't4'],
      y: [5, 1, 7, 5]
   }
*/
//   line.setData([lineData])

   screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    // kill(mongo_process.pid);
    // return process.exit(0);
    mongoProcessStream.kill();
    setTimeout(()=>process.exit(0), 500);
    //process.exit(0);
   });



const NUMBER_OF_CPUS = os.cpus().length;
let startTime  = process.hrtime()
let startUsage = process.cpuUsage()
const stats = {
  cpu:Array(20).fill(0),
  ram:Array(20).fill(0)
}
setInterval(() => {
  // spin the CPU for 500 milliseconds
  var now = Date.now()
  while (Date.now() - now < 500);

  const newTime = process.hrtime();
  const newUsage = process.cpuUsage();
  const elapTime = process.hrtime(startTime)
  const elapUsage = process.cpuUsage(startUsage)
  startUsage = newUsage;
  startTime = newTime;


  const elapTimeMS = hrtimeToMS(elapTime)

  const elapUserMS = elapUsage.user / 1000; // microseconds to milliseconds
  const elapSystMS = elapUsage.system / 1000;
  const cpuPercent = (100 * (elapUserMS + elapSystMS) / elapTimeMS / NUMBER_OF_CPUS)//.toFixed(1) + '%'

//  console.log('elapsed time ms:  ', elapTimeMS)
//  console.log('elapsed user ms:  ', elapUserMS)
//  console.log('elapsed system ms:', elapSystMS)
//  console.log('cpu percent:      ', cpuPercent, '\n')
//  cpuSteps.unshift(cpuPercent);
//  cpuSteps.pop()
//    sparkline.setData(cpuSteps)
    stats.cpu.unshift(cpuPercent)
    stats.cpu.pop()

    const totalmem = os.totalmem()
    const freemem = os.freemem()
    const usedmem = totalmem - freemem

    stats.ram.unshift(usedmem)
    stats.ram.pop()

    sparkline.setData([ 'CPU '+cpuPercent.toFixed(2)+'%',
                        'RAM '+(totalmem/1073741824).toFixed(2) +'Gb/'+ (usedmem/1073741824).toFixed(2)+'Gb',
                        ],
                      [ stats.cpu,stats.ram])

   //gauge.setPercent(cpuPercent)
screen.render()
}, 1000);

screen.render()

function hrtimeToMS (hrtime) {
  return hrtime[0] * 1000 + hrtime[1] / 1000000
}
