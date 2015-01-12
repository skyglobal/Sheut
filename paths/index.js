var path = require('path');

module.exports = function(config){
    if (!config.screenshots) {
        console.log('Please add `screenshots` to your sheut.config.js file.');
        process.exit(1);
    }
    return {
        new : path.join(config.screenshots, 'new'),
        reference : path.join(config.screenshots, 'reference'),
        different : path.join(config.screenshots, 'different')
    };
};