
var mongoose = require('./config/mongoose'),
    express = require('./config/express');
    
// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Create a new Mongoose connection instance
var db = mongoose();

// Create a new Express application instance
var app = express();

// Set server port
app.set('port', process.env.PORT || 3000);


function startServer() {
  
  var server = app.listen(app.get('port'), function(){
    
    console.log( 'Express started in ' + app.get('env') +
              ' mode on http://localhost:' + app.get('port') +
              '; press Ctrl-C to terminate.' );
  }); 

}

if(require.main === module){
  
  // application run directly; start app server
  startServer();

}else{
    // application imported as a module via "require":export function
    // to create server
    module.exports = startServer;
}
