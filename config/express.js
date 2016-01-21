// Load the module dependencies
var express = require('express'),
    path = require("path"),
    fortune = require('../app/lib/fortune.js'),
    bodyParser = require('body-parser'),
    formidable = require('formidable'),
    credentials = require('./credentials.js'),
    weatherData = require('../app/lib/weatherData.js'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    connect = require('connect'),
    MongoSessionStore = require("session-mongoose")(connect);
    //rest = require('connect-rest'),
    //vhost = require('vhost');


// Define the Express configuration method
module.exports = function() {
  
  // Create a new Express application instance
  var app = express();
  
  // Set logging middleware depending the enviroment 
  switch(app.get('env')){
    case 'development':
      // compact, colorful dev logging
      app.use(require('morgan')('dev'));
      break;
    case 'production':
      // module 'express-logger' supports daily log rotation
      app.use(require('express-logger')({
        path: __dirname + '/log/requests.log'
      }));
      break; 
  }
  
  // set up handlebars view engine
  var handlebars = require('express3-handlebars').create({
    defaultLayout:'main',
    layoutsDir: path.join(__dirname, '../app/views/layouts'),
    partialsDir: path.join(__dirname, '../app/views/partials'),
    helpers: {
      // Adds content in different sections of the layout
      section: function(name, options){
        if(!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
      },
      // Static resources mapper
      static: function(name) {
        return require('../app/lib/static.js').map(name);
      },   
    }
  });

  app.engine('handlebars', handlebars.engine);
  app.set('view engine', 'handlebars');
  
  // Set the 'views' folder
  app.set('views', path.join(__dirname, '../app/views'));
  
  ///////// Middleware ////////
  
  
  // use domains for better error handling
  app.use(function(req, res, next){
    
    // create a domain for this request
    var domain = require('domain').create();
    
    // This function will be invoked any time 
    // an uncaught error occurs in the domain
    domain.on('error', function(err){
      console.error('DOMAIN ERROR CAUGHT\n', err.stack);
      try {
        // We’re allowing the server five seconds 
        // to respond to any in-progress requests
        setTimeout(function(){
          console.error('Failsafe shutdown.');
          process.exit(1);
        }, 5000);

        // Disconnect from the cluster
        var worker = require('cluster').worker;
        if(worker) worker.disconnect();

        // stop taking new requests
        server.close();

        try {
          // attempt to use Express error route
          next(err);
        } catch(error){
          // if Express error route failed, try
          // plain Node response
          console.error('Express error mechanism failed.\n', error.stack);
          res.statusCode = 500;
          res.setHeader('content-type', 'text/plain');
          res.end('Server error.');
        }
      } catch(error){
        console.error('Unable to send 500 response.\n', error.stack);
      }
    });

    // Add the request and response objects to the domain
    // allowing any methods on those objects that throw an error 
    // to be handled by the domain
    domain.add(req);
    domain.add(res);

    // execute the rest of the request chain in the domain
    domain.run(next);
  });

  
  // Set testing context to true depending the querystring parameter
  app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
  });
  
  // Provides support for serving static (public) files
  app.use(express.static(path.join(__dirname, '../public')));

  // for parsing application/json
  app.use(bodyParser.json()); 

  // Middleware for parsing application/x-www-form-urlencoded
  // req.body can be used with this middleware
  app.use(bodyParser.urlencoded({ extended: true })); 
  
  // Middleware for setting and accesing cookies 
  app.use(cookieParser(credentials.cookieSecret));
  
  // Stores the session in the mongo db
  var sessionStore = new MongoSessionStore({ 
    url:credentials.mongo.connectionString 
  });
    
  // Middleware to store user session information on the server
  // In the default configuration when the server is restarted, the session information dissapears
  // We use mongodb to store the session
  app.use(require('express-session')({ store: sessionStore }));
  //app.use(expressSession());
  
  // Middleware to transfer flash message from the session to the context
  app.use(function(req, res, next){
    // if there's a flash message, transfer 
    // it to the context, then clear it
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});
  
/*  app.use(function(req,res,next){
    var cluster = require('cluster');
    if(cluster.isWorker) console.log('Worker %d received request', cluster.worker.id);
  });*/

  
  app.use(function(req, res, next){
    if(!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = weatherData.getWeatherData();
    next();
  });

  
  // Website routes
  require('../app/routes/routes.js')(app);
  
  // Attractions API routes
  require('../app/routes/attractions-api.js')(app);
  
  
  // 404 catch-all handler (middleware)
  app.use(function(req, res, next){
    res.status(404);
    res.render('404');
  });
  
  // 500 error handler (middleware)
  app.use(function(err, req, res, next){
    console.error(err.stack);
    //TODO: Send error email to the development team
    res.status(500);
    res.render('500');
    
  });

  
  return app;


};