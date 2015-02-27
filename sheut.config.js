module.exports = {
    // Set to true if you want to see the verbose
    //  output from casper and phantom
    debug: false,

    // If your page is updated by javascript,
    //  and you need to screenshot elements
    //  only after this has finished loading,
    //  you can wait for a class to be available
    //  by uncommenting the following line and
    //  filling in the correct selector.
    // waitForSelector: '.js-layout-complete',

    // Server options if you need to run a local
    //  server to serve static assets.
    // Mainly used to test this tool only, you
    //  should have your own server running
    //  somewhere when you have integrated Sheut
    //  in your project.
    server: {
        dir: '_site',
        port: 8888
    },

    // directory under which all screenshots
    //  are taken and compared.
    screenshotsRoot: './test/screenshots/',

    // set here all the viewports you will
    //  need to screenshot. A screenshot
    //  for EACH of those will be generated
    //  for each selector below. There is
    //  currently no way to only take
    //  screenshots for some selectors at
    //  certain resolutions.
    viewports : [
        {
            'name': 'phone',
            'width': 320,
            'height': 480
        },
        {
            'name': 'tablet_p',
            'width': 568,
            'height': 1024
        },
        {
            'name': 'tablet_l',
            'width': 1024,
            'height': 768
        },
        {
            'name': 'desktop',
            'width': 1200,
            'height': 900
        }
    ],

    // An array of sites to capture screenshots from
    sites : [
        {
            'name':'localhost',
            'url':'http://localhost:8888',

            // Add here selectors that would be hidden
            //  with 'display: none' before capturing
            'hideSelectors': [
                '.hide-me-from-sheut'
            ],

            // Add here selectors for elements to be captured
            'selectors':[
                '.container-1',
                '.container-2 .nested'
            ]
        },
        {
            'name':'skynews',
            'url':'http://news.sky.com',

            // Add here selectors that would be hidden
            //  with 'display: none' before capturing
            'hideSelectors': [
                '.ad'
            ],

            // Add here selectors for elements to be captured
            'selectors':[
                '.header'
            ]
        }
    ],

    // Threshold values for error reporting
    thresholds: {
        // The percentage of differences between
        //  two images above which the compare
        //  test will fail.
        misMatchPercentage: 0,

        // The mximum different allowed, in px between
        //  a new capture and a reference image, before
        //  failing the test.
        height: 0,
        width: 0
    }
};