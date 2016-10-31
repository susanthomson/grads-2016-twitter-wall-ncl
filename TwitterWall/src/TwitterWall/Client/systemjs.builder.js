var path = require("path");
var Builder = require('systemjs-builder');

var builder = new Builder('./Client', './Client/systemjs.config.js');

builder.buildStatic('app/main.js', 'wwwroot/staticBundle.js', { minify: true, sourceMaps: false })
  .then(function() {
    console.log('Build complete');
  })
  .catch(function(err) {
    console.log('Build error');
    console.log(err);
  });
