module.exports = {
    debug: false,
    server : {
        dir: '_site',
        port: 8888
    },
    screenshots: 'src/test/screenshots/',
    "viewports" : [
        {
            "name": "iPhone portrait",
            "width": 320,
            "height": 480
        }
        ,{
            "name": "iPhone landscape",
            "width": 480,
            "height": 320
        }
        ,{
            "name": "iPad portrait",
            "width": 768,
            "height": 1024
        }
        ,{
            "name": "iPad landscape",
            "width": 1024,
            "height": 768
        }
        ,{
            "name": "desktop",
            "width": 1025,
            "height": 800
        }
    ]
    ,"sites" : [
        {
            "name": "homepage"
            ,"url": "http://localhost:3001",
            "hideSelectors": [
                "footer",
                ".section-trending-stories"
            ]
            ,"selectors":[
                "body"
            ]
        }
    ],
    thresholds: {
        misMatchPercentage: 0,
        height: 0,
        width: 0
    }
};