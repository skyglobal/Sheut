/*jslint node: true */
/* global console, require, process, module */

'use strict';
var findup = require('findup-sync');
var configPath = findup('./sheut.config.js');
if (!configPath) {
    console.log('Please add a sheut.config.js file in your root.');
    process.exit(1);
}

var Promise = require('es6-promise').Promise;
var gutil = require('gulp-util');
var chalk = require('chalk');
var casperPath = findup('node_modules/sheut/casper.js');
var config = require(configPath);
var mkdirp = require('mkdirp');
var del = require('del');
var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');
var resemble = require('./wrappers/resemble');
var nodeCasper = require('./wrappers/casper');
var staticServer = require('./wrappers/server');

var paths = {
    new: path.join(config.screenshotsRoot, 'new'),
    different: path.join(config.screenshotsRoot, 'different'),
    reference: path.join(config.screenshotsRoot, 'reference')
};
var thresholds = config.thresholds || { };

// If a server config is given,
//  this will run it.
// That's mainly for testing purposes,
//  as your own application will rely
//  on its own server
function serve(server){
    if (!server) {
        return;
    }

    return staticServer.start(server.dir, server.port);
}

function capture(){
    var testServer = serve(config.server);
    return nodeCasper([casperPath || './casper.js', '--configPath=' + configPath]).then(function closeServer() {
        if (testServer) {
            testServer.close();
        }

        return {message: 'Sheut: Images Captured'};
    });
}

function accept(){
    return new Promise(function(resolve, reject){
        fse.copy(paths.new, paths.reference, function(err){
            if (err) {
                return reject(err);
            }

            resolve({message: 'Sheut: Images Accepted as reference shots'});
        });
    });
}

function clean(){
    return new Promise(function(resolve, reject){
        del([paths.new, paths.different], function(){
            resolve({message: 'Sheut: New and Different Images removed'});
        });
    });
}

function filterFiles(dir){
    return new Promise(function(resolve, reject){
        fs.readdir(dir, function (err, files) {

            var filteredFiles = {
                validFiles: [],
                orphanedFiles: []
            };

            var newFile;

            files.forEach(function(fileName){

                if(fileName.match(/\.DS*/)) {
                    return;
                }

                try {
                    newFile = fs.readFileSync(path.join(paths.new, fileName));
                    filteredFiles.validFiles.push(fileName);

                } catch (e) {
                    filteredFiles.orphanedFiles.push(fileName);
                }
            });

            resolve(filteredFiles);
        });
    });
}

function saveDifference(file, data){
    return new Promise(function(resolve, reject){
        mkdirp(paths.different, function saveFile(){
            var base64 = data.getImageDataUrl().replace(/^data:image\/png;base64,/, "");
            fs.writeFile(file, base64, {encoding:'base64'}, function(){
                resolve();
            });
        });
    });
}

function compareAndSaveDifference(fileName){
    return new Promise(function(resolve, reject){

        var diffFilePath = path.join(paths.different, fileName);
        var referenceFile = fs.readFileSync(path.join(paths.reference, fileName));
        var newFile = fs.readFileSync(path.join(paths.new, fileName));

        var api = resemble(newFile).compareTo(referenceFile).onComplete(function(data){
            var errors = imageErrors(diffFilePath, data);

            if (errors.length){
                saveDifference(diffFilePath, data).then(function(){
                    var err = new gutil.PluginError('Sheut: ', errors.join('\n'), {showStack: false});
                    reject(err);
                });
            } else {
                resolve({message: 'Sheut: Images Captured'});
            }
        });
    });
}

function imageErrors(file, data){
    var errors = [];
    if (!data.isSameDimensions) {
        if (data.dimensionDifference.width !== (thresholds.width || 0)) {
            errors.push('the new image is wider/smaller: ' + data.dimensionDifference.width + 'px different');
        }

        if (data.dimensionDifference.height !== (thresholds.height || 0)) {
            errors.push('the new image is taller/smaller: ' + data.dimensionDifference.height + 'px different');
        }

        errors.push(file);
    }

    if (data.misMatchPercentage > (thresholds.misMatchPercentage || 0)) {
        errors.push('The new image content has changed: ' + data.misMatchPercentage + '% different');
        errors.push(file);
    }

    return errors;
}

function compare(){
    return filterFiles(paths.reference).then(function(files){

        if (!files.validFiles.length) {
            gutil.log(chalk.red('Sheut: No references were found to compare the new screenshots to. Please accept the previously generated screenshots with `Sheut.accept()`'));
            process.exit(1);
        }

        if (files.orphanedFiles.length) {
            gutil.log(chalk.yellow('/!\\/!\\ Sheut: The following files are orphaned (a reference exists, but new screenshots aren\'t being captured with the current configuration)\n', files.orphanedFiles));
        }

        var promises = [];

        files.validFiles.forEach(function(fileName){
            gutil.log(chalk.cyan('Comparing ' + fileName));
            promises.push(compareAndSaveDifference(fileName));
        });

        return Promise.all(promises)
            .then(function(data) {
                return {message: 'Sheut: New images match reference shots'};
            });
    });
}

module.exports = {
    clean: clean,
    capture: capture,
    accept: accept,
    compare: compare
};