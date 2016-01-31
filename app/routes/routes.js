// Load the controller libraries
var vacations = require('../controllers/vacations.js'),
  main = require('../controllers/main.js'),
  contest = require('../controllers/contest.js'),
  cart = require('../controllers/cart.js'),
  samples = require('../controllers/samples.js'),
  customer = require('../controllers/customer.js'),
  cartValidation = require('../lib/cartValidation.js');

module.exports = function (app) {

  // Main page routes
  app.get('/', main.home);
  app.get('/about', main.about);
  app.get('/account',main.account);

  // Newsletter signup
  app.get('/newsletter', main.newsletter);
  app.post('/newsletter', main.newsletterProcessPost);
  app.get('/newsletter/archive', main.newsletterArchive);
  app.get('/thank-you', main.genericThankYou);

  // Vacations page routes
  app.get('/vacations', vacations.list);
  app.get('/vacations/:vacation', vacations.detail);
  app.get('/notify-me-when-in-season', vacations.notifyWhenInSeason);
  app.post('/notify-me-when-in-season', vacations.notifyWhenInSeasonProcessPost);
  app.get('/vacations/request-group-rate',vacations.requestGroupRate);

  // Shopping cart routes
  app.get('/cart', cart.middleware, cartValidation.checkWaivers, cartValidation.checkGuestCounts, cart.home);
  app.get('/cart/add', cart.addProcessGet);
  app.post('/cart/add', cart.addProcessPost);
  app.get('/cart/checkout', cart.checkout);
  app.post('/cart/checkout', cart.checkoutProcessPost);
  app.get('/cart/thank-you', cart.thankYou);
  app.get('/email/cart/thank-you', cart.emailThankYou);
  app.get('/set-currency/:currency', cart.setCurrency);

  // Customer profile pages 
  app.get('/customer/register', customer.register);
  app.post('/customer/register', customer.processRegister);
  app.get('/customer/:id', customer.home);
  app.get('/customer/:id/preferences', customer.preferences);
  //app.get('/orders/:id', customer.orders);
  app.post('/customer/:id/update', customer.ajaxUpdate);

  // contest routes
  app.get('/contest/vacation-photo', contest.vacationPhoto);
  app.post('/contest/vacation-photo/:year/:month', contest.vacationPhotoProcessPost);
  app.get('/contest/vacation-photo/entries', contest.vacationPhotoEntries);




};