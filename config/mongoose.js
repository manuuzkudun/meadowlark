// Load the module dependencies
var	credentials = require('./credentials'),
	mongoose = require('mongoose');

var opts = {
  server: {
    // Prevent database connection errors
    socketOptions: { keepAlive: 1 }
  } 
};

module.exports = function() {
  
  // Database connection
  var db = null;

  // Connect to the development or production database
  switch(process.env.NODE_ENV){
    case 'development':
      db = mongoose.connect(credentials.mongo.development.connectionString, opts);
      break;
    case 'production':
      db = mongoose.connect(credentials.mongo.production.connectionString, opts);
      break; 
    default:
      throw new Error('Unknown execution environment: ' + process.env.NODE_ENV);
  }  

	// Load the application models 
	var Vacation = require('../app/models/vacation.js');
  
    // initialize vacations
    Vacation.find(function(err, vacations){
  
      if(vacations.length) return;
  
      // If there are no vacations, then create and save some vacation objects in the db
      // These part is only executed the first time when the vacation collection is empty
      new Vacation({
        name: 'Hood River Day Trip',
        slug: 'hood-river-day-trip',
        category: 'Day Trip',
        sku: 'HR199',
        description: 'Spend a day sailing on the Columbia and ' + 
                'enjoying craft beers in Hood River!',
        priceInCents: 9995,
        tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
        inSeason: true,
        maximumGuests: 16,
        available: true,
        packagesSold: 0,
        imagePath: 'img/vacations/mt-hood.png',
      }).save();

      new Vacation({
        name: 'Oregon Coast Getaway',
        slug: 'oregon-coast-getaway',
        category: 'Weekend Getaway',
        sku: 'OC39',
        description: 'Enjoy the ocean air and quaint coastal towns!',
        priceInCents: 269995,
        tags: ['weekend getaway', 'oregon coast', 'beachcombing'],
        inSeason: false,
        maximumGuests: 8,
        available: true,
        packagesSold: 0,
        imagePath: 'img/vacations/oregon-coast.png',
      }).save();

      new Vacation({
        name: 'Rock Climbing in Bend',
        slug: 'rock-climbing-in-bend',
        category: 'Adventure',
        sku: 'B99',
        description: 'Experience the thrill of rock climbing in the high desert.',
        priceInCents: 289995,
        tags: ['weekend getaway', 'bend', 'high desert', 'rock climbing', 'hiking', 'skiing'],
        inSeason: true,
        requiresWaiver: true,
        maximumGuests: 4,
        available: false,
        packagesSold: 0,
        notes: 'The tour guide is currently recovering from a skiing accident.',
        imagePath: 'img/vacations/rock-climbing.png',
      }).save();
    
    });
  

	// Return the Mongoose connection instance
	return db;
};
