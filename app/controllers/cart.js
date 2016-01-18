var Vacation = require('../models/vacation.js'),
    Q = require('q'),
    emailService = require('../lib/email.js')(require('../../config/credentials.js'));

// TODO: move it to a file in /app/lib
var VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;


// Deserializes cart items from the database
exports.middleware = function(req, res, next){
  // Get cart from session
  var cart = req.session.cart;
  // If cart is not present or has no items go next middleware
  if(!cart || !cart.items) return next();

  // Pass to the request object from session a cart property with mapped items 
  req.cart = {
    items: cart.items.map(function(item){
      return {
        guests: item.guests,
        sku: item.sku,
      };
    })
  };
  
  var promises = req.cart.items.map(function(item){
    return Q.Promise(function(resolve, reject){
      
      Vacation.findOne({ sku: item.sku }, function(err, vacation){
        if(err) return reject(err);
        item.vacation = vacation;
        resolve();
      });
    });
  });
  
  Q.all(promises)
    .then(function(){
      next();
  })
    .catch(function(err){
      next(err);	
  });
};



// Function to add a given vacation(sku) to the cart object (session)
function addToCart(sku, guests, req, res, next){
  // Get the cart object from the session or initialize one
  var cart = req.session.cart || (req.session.cart = { items: [] });
  // Find a vacation in the db with the given sku value
  Vacation.findOne({ sku: sku }, function(err, vacation){
    // Error: database
    if(err) return next(err);
    // Error: no vacation with that sku value
    if(!vacation) return next(new Error('Unknown vacation SKU: ' + sku));
    // Add the found vacation(sku) to the cart items object
    cart.items.push({
      sku: sku,
      guests: guests || 1,
    });
    // Redirect to the cart page
    res.redirect(303, '/cart');
  });
}

// Function to add to the cart a given product with a given sku value
// Get the sku and guests values from the query
exports.addProcessGet = function(req, res, next){
  addToCart(req.query.sku, req.query.guests, req, res, next);
};

// Function to add to the cart a given product with a given sku value
// Get the sku and guests values from the query
exports.addProcessPost = function(req, res, next){
  addToCart(req.body.sku, req.body.guests, req, res, next);
};

// Renders the cart page
exports.home = function(req, res, next){
	res.render('cart', { cart: req.cart });
};

// Renders cart-checkout page if cart is not empty
exports.checkout = function(req, res, next){
  // Get cart object from session
  var cart = req.session.cart;
  // If there is no cart, go to next middleware
  if(!cart) next();
  // Render cart-checkout page
  res.render('cart-checkout');
};

// Renders cart-thank-you page
// Cart object is attached
exports.thankYou = function(req, res){
  res.render('cart-thank-you', { cart: req.session.cart });
};

// Renders the cart-thank-you email template
// Cart object is attached
exports.emailThankYou = function(req, res){
  res.render('email/cart-thank-you', { cart: req.session.cart, layout: null });
};

// Handles a cart checkout request (post)
// Sends an thankyou email and renders a thankyou page
// indicating order reservation data
// cart.number, cart.billing.name and cart.billing.email
exports.checkoutProcessPost = function(req, res){
  // Get cart object from session
  var cart = req.session.cart;
  // If cart object doesn´t exist pass an error
  if(!cart) next(new Error('Cart does not exist.'));
  // Get name and email values from the request body
  var name = req.body.name || '', email = req.body.email || '';
  // Validate email
  if(!email.match(VALID_EMAIL_REGEX)) return res.next(new Error('Invalid email address.'));
  // Assign a random cart ID; normally we would use a database ID here
  cart.number = Math.random().toString().replace(/^0\.0*/, '');
  // Billing data
  cart.billing = {
    name: name,
    email: email,
  };
  // Renders email/cart-thank-you template
  res.render('email/cart-thank-you', 
  { layout: null, cart: cart }, function(err,html){
    // Print error message to console if there was rendering error
    if(err) console.error('error in email template: ' + err.stack);
    // Send thank-you email to the customer
    emailService.send(cart.billing.email,'Thank you for booking your trip with Meadowlark Travel!',html);
  });
  // Render cart-thank-you page
  res.render('cart-thank-you', { cart: cart });
};

// Method to set the currency parameter in the session object
exports.setCurrency = function(req,res){
  // Copy the currency parameter from the route parameter to the session
  req.session.currency = req.params.currency;
  return res.redirect(303, '/vacations');
};