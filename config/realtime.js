'use strict'
module.exports = {
  primus:{
    options:{
      transformer: 'websockets',   
      pingInterval: false,
      parser: 'JSON'
    }
  } 
};

//these options are passed directly to the Primus constructor: https://github.com/primus/primus#getting-started