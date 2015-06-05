'use strict';
var gutil = require('gulp-util');
var finalhandler = require('finalhandler');
var http = require('http');
var serveIndex = require('serve-index');
var serveStatic = require('serve-static');

function start(dir, port){
    gutil.log('Serving `' + dir + '` on port ' + port +'');
    var index = serveIndex(dir);
    var serve = serveStatic(dir);
    var server = http.createServer(function onRequest(req, res){
        var done = finalhandler(req, res);
        serve(req, res, function onNext(err) {
            if (err) return done(err);
            index(req, res, done);
        });
    });
    server.listen(port);
    return server;
}



module.exports = {
    start: start
};