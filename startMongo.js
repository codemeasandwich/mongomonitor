var exec = require('child_process').exec
var psTree = require('ps-tree');
const Subject = require('rxjs').Subject;
const stream = new Subject();

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
    stream.next(data)
});
mongo_process.stderr.on('data', function(err) {
    stream.error(err)
});
mongo_process.on('close', function(code) {
    stream.complete();
  //  process.exit(0)
});

//stream.kill = ()=> process.kill(mongo_process.pid, 'SIGQUIT')
stream.kill = ()=> kill(mongo_process.pid);

module.exports = stream
