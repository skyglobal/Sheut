'use strict';
var findup = require('findup-sync');
var configPath = findup('./sheut.config.js');
if (!configPath) {
    console.log('Please add a sheut.config.js file in your root.');
    process.exit(1);
}

var config = require(configPath);
var mkdirp = require('mkdirp');
var del = require('del');
var fs = require('fs');
var fse = require('fs-extra');
var child_process = require('child_process');
var spawn = child_process.spawn;
var exec = child_process.exec;
var execFile = child_process.execFile;
var resemble = require('./wrappers/resemble');
var nodeCasper = require('./wrappers/casper');
var server = require('./wrappers/server');
var paths = require('./paths')(config);



function capture(){
    clean();
    if (config.server){
        var testServer = server.start(config.server.dir, config.server.port);
    }
    return nodeCasper(['casper.js']).then(function(result){
        testServer && testServer.close();
    });
}

function accept(){
    fse.copy(paths.new, paths.reference, function(err){
        if (err) return console.error(err)
    })
}


function clean(cb){
    return del([paths.new, paths.different], cb);
}

function compare(cb){
    execFile('find', [ paths.reference ], function(err, stdout, stderr) {
        var errors = [];
        var file_list = stdout.split('\n');
        file_list.shift();
        file_list.pop();
        file_list.forEach(function(file){
            var img1 = fs.readFileSync(file);
            var img2 = fs.readFileSync(file.replace('/reference/', '/new/'));
            var imgDiff = file.replace('/reference/', '/different/');
            var api = resemble(img2).compareTo(img1).onComplete(function(data){
                if (!data.isSameDimensions) {
                    if (data.dimensionDifference.width !== 0) {
                        errors.push('the new image is wider/smaller: ' + data.dimensionDifference.width + 'px different');
                    }
                    if (data.dimensionDifference.height !== 0) {
                        errors.push('the new image is taller/smaller: ' + data.dimensionDifference.height + 'px different');
                    }
                    errors.push(file)
                }
                if (data.misMatchPercentage > 0) {
                    errors.push('The new image content has changed: ' + data.misMatchPercentage + '% different');
                    errors.push(file)
                }
                if (data.misMatchPercentage > 0 || !data.isSameDimensions){
                    mkdirp(paths.different, function saveDifference(){
                        var base64 = data.getImageDataUrl().replace(/^data:image\/png;base64,/, "");
                        fs.writeFile(imgDiff, base64, {encoding:'base64'}, function(){
                            //process.exit(1);
                        });
                    });
                }
            });
        });

        if (err){
            console.log(err);
            process.exit(1);
        }
        if (errors.length > 0) {
            console.log(errors.join('\n'))
        } else {
            console.log('All reference shots match the new images');
            cb && cb();
        }
    });
}

capture()

module.exports = {
    capture: capture,
    accept: accept,
    compare: compare
};