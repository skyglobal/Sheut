module.exports = {
    debug: false,
    server: {
        dir: '_site',
        port: 8888
    },
    screenshots: './test/screenshots/',
    "viewports" : [
        {
            "name": "phone",
            "width": 320,
            "height": 480
        }
        ,{
            "name": "tablet_p",
            "width": 568,
            "height": 1024
        }
        ,{
            "name": "tablet_l",
            "width": 1024,
            "height": 768
        }
        ,{
            "name": "desktop",
            "width": 1200,
            "height": 900
        }
    ]
    ,"sites" : [
        {
            "name":"localhost"
            ,"url":"http://localhost:8888"
            ,"hideSelectors": [
                '.skycon' //webfonts not supported on phantomjs1.9 :(
            ]
            //,"removeSelectors": [
            //    "#carbonads-container"
            //]
            ,"selectors":[
                ".share__bar .share__list"
                ,".share__popup .share__summary"
            ]
        }
    ],
    thresholds: {
        misMatchPercentage: 0,
        height: 0,
        width: 0
    }
}