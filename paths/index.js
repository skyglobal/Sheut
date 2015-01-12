function join() {
    var path = '';
    for (var i = 0; i < arguments.length; i++) {
        var segment = arguments[i];
        if (!typeof segment === 'string') {
            throw new TypeError('Arguments to path.join must be strings');
        }
        if (segment) {
            if (!path) {
                path += segment;
            } else {
                path += '/' + segment;
            }
        }
    }
    return path;
}


module.exports = function(config){
    if (!config.screenshots) {
        console.log('Please add `screenshots` to your sheut.config.js file.');
        process.exit(1);
    }
    return {
        new : join(config.screenshots, 'new'),
        reference : join(config.screenshots, 'reference'),
        different : join(config.screenshots, 'different')
    };
};