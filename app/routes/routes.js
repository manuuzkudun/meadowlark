// Load the controller libraries
var vacations = require('../controllers/vacations.js'),
  main = require('../controllers/main.js'),
  contest = require('../controllers/contest.js'),
  cart = require('../controllers/cart.js'),
  samples = require('../controllers/samples.js'),
  customer = require('../controllers/customer.js'),
  cartValidation = require('../lib/cartValidation.js'),
  user = require('../controllers/user.js'),
  authHelpers = require('../lib/authHelpers.js');


module.exports = function (app) {

  // Main page routes
  app.get('/', main.home);
  app.get('/about', main.about);

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
  app.get('/vacations/request-group-rate', vacations.requestGroupRate);

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


  // User routes
  app.get('/sign-in', user.signIn);
  app.get('/account', authHelpers.allow('customer,employee'), user.home);
  app.get('/account/order-history', authHelpers.customerOnly, user.orderHistory);
  app.get('/account/email-prefs', authHelpers.customerOnly, user.EmailPrefs);
  app.get('/sales', authHelpers.employeeOnly, user.sales);

  // contest routes
  app.get('/contest/vacation-photo', contest.vacationPhoto);
  app.post('/contest/vacation-photo/:year/:month', contest.vacationPhotoProcessPost);
  app.get('/contest/vacation-photo/entries', contest.vacationPhotoEntries);

  // React.js test
  app.get('/react-test', function (req, res) {
    res.render('reactTest', {
      layout: null
    });
  });

  app.get('/api/comments', function (req, res) {
    var data = [
      {
        'id': '1',
        'author': 'Pete Hunt',
        'text': 'This is one comment'
      },
      {
        'id': '2',
        'author': 'Jordan Walke',
        'text': 'This is *another* comment'
      }];

    res.json(data);
  });




};