const webpack = require('webpack');
const path = require('path');
 module.exports = {
   entry:{
     hp:'./src/hp.js'
   },
   output:{
     filename:'[name].js',
     path:path.resolve(__dirname,'dist'),
     library:'hp',
     libraryTarget:'umd'
   }
 }
