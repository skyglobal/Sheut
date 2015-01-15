Sheut [![NPM version](http://img.shields.io/npm/v/sheut.svg)](https://www.npmjs.org/package/sheut)
==============
 
 >  **To work with Circle CI, local PhantomJS must be webfont build**

 >  NodeJS regression testing with [Cairo](http://cairographics.org/)
 
# Getting Started

## Dependencies

 * [PhantomJS](http://phantomjs.org/) `npm i -g phantomjs`
 * [CasperJS](http://casperjs.org/) `npm i -g casperjs`
 * [XQuartz](https://xquartz.macosforge.org/landing/) (Mac's only)
 * [Cairo](http://cairographics.org/) `brew install cairo`

## Installing

 * `export PKG_CONFIG_PATH=/opt/X11/lib/pkgconfig`
 * `npm install --save-dev sheut`
 * Create a [sheut.config.js config file](sheut.config.js)
 
## sheut.config.js 

 * `server` : (optional) If provided Sheut will start a static server using the dir and port given. If omitted, Sheut will assume the server has already been started.
   * `dir`: The location of the site to serve.
   * `port`: the port to open the server on.
 * `screenshots` : (mandatory) The directory where to save the captured screens.
 * `viewport` : (mandatory) An array of sizes to test the give sites at.
   * `name` : Used to categorise the url and used in the filename of the save screen-shots.
   * `height` : The height of the browser.
   * `width` : The width of the browser.
 * `sites` : (mandatory) An array of URLs to test.
   * `name` : Used to categorise the url and used in the filename of the save screen-shots.
   * `url` : The url to test
   * `hideSelectors` : An array of selectors to hide (visibility:hidden)
   * `selectors` : An array of selectors to take test.  Saved screenshots will be trimmed to show only this selector.

## NPM Example

Add the following to your package.json and run `npm run test:regression`

```
  "scripts":{
    "sheut:capture" : "sheut capture",
    "sheut:accept" : "sheut accept",
    "sheut:clean" : "sheut clean",
    "sheut:compare" : "sheut compare",
    "test:regression" : "npm run sheut:clean && npm run sheut:capture && npm run sheut:compare"
  }
```

## Gulp Example

```
var gulp = require('gulp');
var sheut = require('sheut');

gulp.task('clean', function(cb){
    return sheut.clean();
});

gulp.task('capture', ['clean'], function(cb){
    return sheut.capture();
});

gulp.task('accept', function(cb){
    return sheut.accept();
});

gulp.task('compare', ['capture'], function(cb){
    return sheut.compare()
        .then(function onSuccess(){
        }, function onError(err){
            gulp.emit("error", err);
        });
});
```

## CircleCI Example
```
test:
  pre:
    - npm install -g gulp
    - gulp build
  override:
    - gulp test
    - gulp sheut
dependencies:
  post:
    - npm install -g casperjs@1.1.0-beta3
```


### todo:
 * move remotely built screen-shots to aws on fail
 * integrate into existing tests
 * cross browser remotely
