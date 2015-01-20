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

 * `debug` : Boolean to determine if Casper's verbose logging is enabled
 * `server` : (optional) If provided Sheut will start a static server using the dir and port given. If omitted, Sheut will assume the server has already been started.
   * `dir`: The location of the site to serve.
   * `port`: the port to open the server on.
 * `thresholds` : (optional) When making comparison, how much difference is allowed before an error is reported.
   * `misMatchPercentage` : (default 0) 
   * `height` : (default 0)
   * `width` :  (default 0)
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

Add the following to your package.json and run `npm test`

```json
{
...
  "scripts":{
    "sheut:capture" : "sheut capture",
    "sheut:accept" : "sheut accept",
    "sheut:clean" : "sheut clean",
    "sheut:compare" : "sheut compare",
    "test" : "sheut clean && sheut capture && sheut compare"
  }
}
```

## CircleCI Example
circle.yml
```yml
test:
  pre:
    - npm install -g gulp
    - gulp build
  override:
    - gulp test
    - npm test
dependencies:
  post:
    - npm install -g casperjs@1.1.0-beta3
```


## Gulp Example
gulpfile.js
```javascript
var gulp = require('gulp');
var gutil = require('gulp-util');
var sheut = require('sheut');

function error(err){
    gulp.emit("error", err);
}
function success(err){
    gutil.log(gutil.colors.green(err.message));
}

gulp.task('sheut:clean', function(){
    return sheut.clean().then(success, error);
});

gulp.task('sheut:capture', ['sheut:clean'], function(){
    return sheut.capture().then(success, error);
});

gulp.task('sheut:accept', function(){
    return sheut.accept().then(success, error);
});

gulp.task('sheut:compare', ['sheut:capture'], function(){
    return sheut.compare().then(success, error);
});
```

### todo:
 * move remotely built screen-shots to aws on fail
 * integrate into existing tests
 * cross browser remotely
