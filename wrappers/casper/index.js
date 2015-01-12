var gutil = require('gulp-util');
var spawn = require('child_process').spawn;
var promisify = require("es6-promisify");

function casper(command, cb) {
    var cmd = (typeof command === 'undefined') ? 'test' : command;
    cmd = cmd ? (Array.isArray(cmd) ? cmd : cmd.split(' ')) : [];

    var casperChild = spawn('casperjs', cmd);

    casperChild.stdout.on('data', function(data) {
        var msg = data.toString().slice(0, -1);
        gutil.log(msg);
    });

    casperChild.on('close', function(code) {
        var success = code === 0;
        return cb && cb(!success, success);
    });
}

module.exports = promisify(casper, function(err, result){
    if (err) {
        return this.reject(err);
    }
    this.resolve(result);
});