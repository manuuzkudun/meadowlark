
var express = require('./config/express');


var app = express();
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