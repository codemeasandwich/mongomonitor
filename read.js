
const Tail = require('tail').Tail;
const Subject = require('rxjs').Subject;
const stream = new Subject();

const severityLookup = {
  F:"Fatal",
  E:"Error",
  W:"Warning",
  I:"Info",
  D:"Debug"
}

//<timestamp> <severity> <component> [<context>] <message>
function parceLogLine (raw){
  var [meta,...messageArray] = raw.split("]")
  var message = messageArray.join("]").trim()
  let [timestamp,severity,component,context] = meta.split(" ").filter(x=>x)
  context = context.substr(1)
  timestamp = new Date(timestamp)
  severity = severityLookup[severity]

  return {timestamp,severity,component,context,message,raw}
}


const tail = //new Tail("./test.txt");//
new Tail("/data/mongod.log");

tail.on("line", function(data) {
  stream.next(parceLogLine(data));
});

tail.on("error", function(error) {
  stream.error(error);
});

module.exports = stream
