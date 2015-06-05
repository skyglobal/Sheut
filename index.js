/*jslint node: true */
/* global console, require, process, module */

'use strict';
var Promise = require('es6-promise').Promise,
    findup = require('findup-sync'),
    gutil = require('gulp-util'),
    chalk = require('chalk'),
    mkdirp = require('mkdirp'),
    del = require('del'),
    path = require('path'),
    fs = require('fs'),
    fse = require('fs-extra'),
    resemble = require('./wrappers/resemble'),
    nodeCasper = require('./wrappers/casper'),
    staticServer = require('./wrappers/server');


var Sheut = function(configFilePath) {
    this.configPath = findup('sheut.config.js');

    if (!this.configPath) {
        this.configPath = path.join(process.cwd(), configFilePath);
    }

    if (!fs.existsSync(this.configPath)) {
        console.log('Please add a sheut.config.js file in your root.');
        process.exit(1);
    }

    this.config = require(this.configPath);

    this.paths = {
        new: path.join(this.config.screenshotsRoot, 'new'),
        different: path.join(this.config.screenshotsRoot, 'different'),
        reference: path.join(this.config.screenshotsRoot, 'reference')
    };
};

Sheut.prototype = {

    accept: function accept() {
        var that = this;

        return new Promise(function(resolve, reject) {
            fse.copy(that.paths.new, that.paths.reference, function(err) {
                if (err) {
                    return reject(err);
                }

                resolve({message: 'Sheut: Images Accepted as reference shots'});
            });
        });
    },

    capture: function capture() {
        var testServer = this._serve(this.config.server);

        console.log(this.configPath);

        return nodeCasper([path.join(__dirname,'casper.js'), '--configPath=' + this.configPath]).then(function closeServer() {
            if (testServer) {
                testServer.close();
            }

            return {message: 'Sheut: Images Captured'};
        });
    },

    clean: function clean() {
        var that = this;

        return new Promise(function(resolve, reject) {
            del([that.paths.new, that.paths.different], function() {
                resolve({message: 'Sheut: New and Different Images removed'});
            });
        });
    },

    compare: function compare() {
        var that = this;

        return this._filterFiles(this.paths.reference).then(function(files) {

            if (!files.validFiles.length) {
                gutil.log(chalk.red('Sheut: No references were found to compare the new screenshots to. Please accept the previously generated screenshots with `Sheut.accept()`'));
                process.exit(1);
            }

            if (files.orphanedFiles.length) {
                gutil.log(chalk.yellow('/!\\/!\\ Sheut: The following files are orphaned (a reference exists, but new screenshots aren\'t being captured with the current configuration)\n', files.orphanedFiles));
            }

            var promises = [];

            files.validFiles.forEach(function(fileName) {
                gutil.log(chalk.cyan('Comparing ' + fileName));
                promises.push(that._compareAndSaveDifference(fileName));
            });

            return Promise.all(promises)
                .then(function(data) {
                    return {message: 'Sheut: New images match reference shots'};
                });
        });
    },

    // If a server config is given,
    //  this will run it.
    // That's mainly for testing purposes,
    //  as your own application will rely
    //  on its own server
    _serve: function _serve(server) {
        if (!server) {
            return;
        }

        return staticServer.start(server.dir, server.port);
    },

    _filterFiles: function _filterFiles(dir) {
        var that = this;

        return new Promise(function(resolve, reject) {
            fs.readdir(dir, function (err, files) {

                var filteredFiles = {
                    validFiles: [],
                    orphanedFiles: []
                };

                var newFile;

                files.forEach(function(fileName) {

                    if(fileName.match(/\.DS*/) || fileName === '.gitkeep') {
                        return;
                    }

                    try {
                        newFile = fs.readFileSync(path.join(that.paths.new, fileName));
                        filteredFiles.validFiles.push(fileName);

                    } catch (e) {
                        filteredFiles.orphanedFiles.push(fileName);
                    }
                });

                resolve(filteredFiles);
            });
        });
    },

    _saveDifference: function _saveDifference(file, data) {
        var that = this;

        return new Promise(function(resolve, reject) {
            mkdirp(that.paths.different, function saveFile() {
                var base64 = data.getImageDataUrl().replace(/^data:image\/png;base64,/, "");
                fs.writeFile(file, base64, {encoding:'base64'}, function() {
                    resolve();
                });
            });
        });
    },

    _compareAndSaveDifference: function _compareAndSaveDifference(fileName) {
        var that = this;

        return new Promise(function(resolve, reject) {

            var diffFilePath = path.join(that.paths.different, fileName);
            var referenceFile = fs.readFileSync(path.join(that.paths.reference, fileName));
            var newFile = fs.readFileSync(path.join(that.paths.new, fileName));

            var api = resemble(newFile).compareTo(referenceFile).onComplete(function(data) {
                var errors = that._imageErrors(diffFilePath, data);

                if (errors.length) {
                    that._saveDifference(diffFilePath, data).then(function() {
                        var err = new gutil.PluginError('Sheut: ', errors.join('\n'), {showStack: false});
                        reject(err);
                    });
                } else {
                    resolve({message: 'Sheut: Images Captured'});
                }
            });
        });
    },

    _imageErrors: function _imageErrors(file, data) {
        var errors = [];

        if (!data.isSameDimensions) {
            if (data.dimensionDifference.width !== (this.config.thresholds.width || 0)) {
                errors.push('the new image is wider/smaller: ' + data.dimensionDifference.width + 'px different');
            }

            if (data.dimensionDifference.height !== (this.config.thresholds.height || 0)) {
                errors.push('the new image is taller/smaller: ' + data.dimensionDifference.height + 'px different');
            }

            errors.push(file);
        }

        if (data.misMatchPercentage > (this.config.thresholds.misMatchPercentage || 0)) {
            errors.push('The new image content has changed: ' + data.misMatchPercentage + '% different');
            errors.push(file);
        }

        return errors;
    }
};

module.exports = Sheut;