var blessed = require('blessed')
  , contrib = require('blessed-contrib')
  , screen  = blessed.screen()
  , grid    = new contrib.grid({rows: 8, cols: 8, screen });

const store = require('./store');
const actions = require('redux-auto').default;
const os = require('os');

const MapBuilder = require('./wigits/map');
      MapBuilder('Servers Location',grid,2, 0, 3, 3);


const Cluster = require('./wigits/cluster');
      Cluster('Cluster',grid,2, 3, 2, 3);

const ClusterLoad = require('./wigits/clusterload');
      ClusterLoad('Cluster Load',grid,4, 3, 2, 3);

const InfoBuilder = require('./wigits/info');
const LogBuilder  = require('./wigits/log');

const mongoProcessStream = require('./startMongo');


 const LineBuilder = require('./wigits/io')
       LineBuilder('IO for the last minute',grid,6, 4, 2, 4)

let fullScreenLog = false;

// var markdown = grid.set(3, 0, 1, 2,contrib.markdown)
var inputLineForInfo = InfoBuilder("This server",grid,6, 0, 2, 2)



 const CommandsBuilder = require('./wigits/commands')
var inputCommands = CommandsBuilder('commands',grid,2,6,4,2)


var logFile = require('./read')

//=====================================================
//============================
//=====================================================

const sparkline = grid.set(6, 2, 2, 2,contrib.sparkline,
      { label: 'Throughput (bits/sec)', tags: true, style: { fg: 'green' }})

    const inputLineForLog = LogBuilder("Log file", grid, 0, 0, 2, 8);

    const lines = []

    const conns = { }


    logFile.subscribe(line => {
    //  console.log(actions)
      actions.log.newline({line:line.raw})
      //inputLineForLog(line)

      if("CONTROL" === line.component){
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

       inputCommands(conns)

    },console.error)

   screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    mongoProcessStream.kill();
    setTimeout(()=>clearInterval(pollSysInfo), 400);
    setTimeout(()=>process.exit(0), 600);
   });

   screen.key('l', function(ch, key) {
    fullScreenLog != fullScreenLog;
   });


//+++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++


const NUMBER_OF_CPUS = os.cpus().length;
let startTime  = process.hrtime()
let startUsage = process.cpuUsage()
const stats = {
  cpu:Array(20).fill(0),
  ram:Array(20).fill(0)
}

//=====================================================
//============================
//=====================================================


const pollSysInfo = setInterval(() => {
  // spin the CPU for 500 milliseconds
  var now = Date.now()
  while (Date.now() - now < 500); //TODO: WFT?!?!

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


//+++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++

screen.render()

//+++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++

function hrtimeToMS (hrtime) {
  return hrtime[0] * 1000 + hrtime[1] / 1000000
}
