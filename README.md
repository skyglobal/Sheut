Sheut [![NPM version](http://img.shields.io/npm/v/sheut.svg)](https://www.npmjs.org/package/sheut)
==============
 
 >  NodeJS regression testing with [Cairo](http://cairographics.org/)
 
# Getting Started

## Dependencies

 * [PhantomJS](http://phantomjs.org/) `npm i -g phantomjs`
 * [CasperJS](http://casperjs.org/) `npm i -g casperjs`
 * [XQuartz](https://xquartz.macosforge.org/landing/)
 * [Cairo](http://cairographics.org/) `brew install cairo`

## Installing

 * `export PKG_CONFIG_PATH=/opt/X11/lib/pkgconfig`
 * `npm install --save-dev sheut`
 * Create a [config file](sheut.config.js)

## Gulp Example

```
var gulp = require('gulp');
var sheut = require('sheut');

gulp.task('sheut:accept', function(cb){
    return sheut.accept.then(function(){
        cb()
    });
});

gulp.task('sheut', function(cb){
    return sheut.capture()
        .then(function(){
            return sheut.compare();
        }).then(function onSuccess(){
            cb();
        }, function onError(err){
            gulp.emit("error", err)
        });
});
```
