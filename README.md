Server-side Screenshots with [Cairo](http://cairographics.org/)
==============

## Dependencies

 * [PhantomJS](http://phantomjs.org/) `npm i -g phantomjs`
 * [CasperJS](http://casperjs.org/) `npm i -g casperjs`

## Installation

`./install-cairo.sh`

#### Glib Error

You may get  a `glib` error with pkg-config. if so sort this out with :
```
cd pkg-config
./configure --with-internal-glib
make
make install
cd ..
./install.sh
```

#### freetype Error

You may get a `freetype` error. do this:
```
cp /usr/local/lib/libfreetype.6.dylib /usr/local/lib/libfreetype.6.dylib.orig;
rm /usr/local/lib/libfreetype.6.dylib;
ln -s /opt/X11/lib/libfreetype.6.dylib  /usr/local/lib/libfreetype.6.dylib;
```

#### libPNG Error

You may get a `libpng` error. do this:
```
brew link libpng --overwrite
```

you may also need to do, but probably not:
```
rm  /usr/local/lib/libpng*.*;
ln -s /usr/local/Cellar/libpng/1.6.16/lib/libpng.a /usr/local/lib/libpng.a;
ln -s /usr/local/Cellar/libpng/1.6.16/lib/libpng.la /usr/local/lib/libpng.la;
ln -s /usr/local/Cellar/libpng/1.6.16/lib/libpng.dylib /usr/local/lib/libpng.dylib;
ln -s /usr/local/Cellar/libpng/1.6.16/lib/libpng16.a /usr/local/lib/libpng16.a;
ln -s /usr/local/Cellar/libpng/1.6.16/lib/libpng16.la /usr/local/lib/libpng16.la;
ln -s /usr/local/Cellar/libpng/1.6.16/lib/libpng16.dylib /usr/local/lib/libpng16.dylib;
ln -s /usr/local/Cellar/libpng/1.6.16/lib/libpng16.16.dylib /usr/local/lib/libpng16.16.dylib;
```
