// Load the conytrollers
var vacations = require('../controllers/vacations.js'),
    main = require('../controllers/main.js'),
    contest = require('../controllers/contest.js'),
    cart = require('../controllers/cart.js'),
    samples = require('../controllers/samples.js');
    
module.exports = function(app) {

  // Main page routes
  app.get('/', main.home);
  app.get('/about',main.about);
 
  // Newsletter signup
  app.get('/newsletter', main.newsletter);
  app.post('/newsletter', main.newsletterProcessPost);
  app.get('/newsletter/archive', main.newsletterArchive);
  app.get('/thank-you', main.genericThankYou);

  // Vacations page routes
  app.get('/vacations', vacations.list);
  app.get('/notify-me-when-in-season', vacations.notifyWhenInSeason);
  app.post('/notify-me-when-in-season',vacations.notifyWhenInSeasonProcessPost);
  
  // shopping cart routes
//  app.get('/cart', cart.middleware, cartValidation.checkWaivers, cartValidation.checkGuestCounts, cart.home);
//  app.get('/cart/add', cart.addProcessGet);
//  app.post('/cart/add', cart.addProcessPost);
//  app.get('/cart/checkout', cart.checkout);
//  app.post('/cart/checkout', cart.checkoutProcessPost);
//  app.get('/cart/thank-you', cart.thankYou);
//  app.get('/email/cart/thank-you', cart.emailThankYou);
//  app.get('/set-currency/:currency', cart.setCurrency);
   
  // contest routes
  app.get('/contest/vacation-photo', contest.vacationPhoto);
  app.post('/contest/vacation-photo/:year/:month', contest.vacationPhotoProcessPost);
  app.get('/contest/vacation-photo/entries', contest.vacationPhotoEntries);
    
  // Hood-river page
  app.get('/tours/hood-river', function(req, res){
    res.render('tours/hood-river');
  });

  // Oregon-coast page
  app.get('/tours/oregon-coast', function(req, res){
    res.render('tours/oregon-coast');
  });
  
  // Request group-rate page
  app.get('/tours/request-group-rate', function(req, res){
    res.render('tours/request-group-rate');
  });
  
  // Testing/sample routes
  app.get('/jquery-test', samples.jqueryTest);
  app.get('/popcorn', samples.popcornTest);

};

