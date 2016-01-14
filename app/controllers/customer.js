// Load models 
var Customer = require('../models/customer.js'),
    customerViewModel = require('../viewModels/customer.js');

// Renders customer registration page
exports.register = function(req, res, next) {
  res.render('customer/register');
};

// Handles customer registration (POST request)
exports.processRegister = function(req, res, next) {
  // TODO: back-end validation (safety)
  // Create a new customer object using data from the request body
  var customer = new Customer({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    address1: req.body.address1,
    address2: req.body.address2,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    phone: req.body.phone,
  });
  // Save the customer to the db
  customer.save(function(err,customer) {
    // Error: db
    if(err) return next(err);
    // Save succesful: redirect to customer page
    res.redirect(303, '/customer/' + customer._id);
  });
};

// Renders the home page of a specific customer
// customer id is given as a url parameter
// the customer page uses a visual model created from customer and order models
exports.home = function(req, res, next) {
  // Find a customer in the db given it´s id
  // id is given in as a url param
  Customer.findById(req.params.id, function(err, customer) {
    //Error: db
    if(err) return next(err);
    // Error: no customer with this id
    // pass this on to 404 handler
    if(!customer) return next(); 	
    // Get the orders from this customer
    // TODO: implement order model
    customer.getOrders(function(err, orders) {
      if(err) return next(err);
      if(!orders) orders=[];
      // Render custome home page using the 
      // visual model created with the customer and orders data
      res.render('customer/home', customerViewModel(customer));
    });
  });
};

// Renders the preferences page of a specific customer
// customer id is given as a url parameter
// the customer preferences page uses a visual model created from customer and order models
exports.preferences = function(req, res, next) {
  // Find a customer in the db given it´s id
  // id is given in as a url param
  Customer.findById(req.params.id, function(err, customer) {
    //Error: db
    if(err) return next(err);
    // Error: no customer with this id
    // pass this on to 404 handler
    if(!customer) return next();
    // Get the orders from this customer
    customer.getOrders(function(err, orders) {
      if(err) return next(err);
      // Render customer preferences page using the 
      // visual model created with the customer and orders data
      res.render('customer/preferences', customerViewModel(customer));
    });
  });
};


// TODO: check as this function is the same as the previous
exports.orders = function(req, res, next) {
  // Find a customer in the db given it´s id
  // id is given in as a url param
  Customer.findById(req.params.id, function(err, customer) {
    //Error: db
    if(err) return next(err);
    // Error: no customer with this id
    // pass this on to 404 handler
    if(!customer) return next();
    // Get the orders from this customer
    customer.getOrders(function(err, orders) {
      if(err) return next(err);
      // Render customer preferences page using the 
      // visual model created with the customer and orders data
      res.render('customer/preferences', customerViewModel(customer));
    });
  });
};

// Handles an AJAX request
exports.ajaxUpdate = function(req, res) {
  // Find a customer in the db given it´s id
  // id is given in as a url param
  Customer.findById(req.params.id, function(err, customer) {
    //Error: db
    if(err) return next(err);
    // Error: no customer with this id
    // pass this on to 404 handler
    if(!customer) return next();
    //If firstName in the request body has valid format
    // then update the customer object
    if(req.body.firstName){
      if(typeof req.body.firstName !== 'string' || req.body.firstName.trim() === '')
        return res.json({ error: 'Invalid name.'});
      customer.firstName = req.body.firstName;
    }
    // and so on....
    // Save the updated customer object in the db
    customer.save(function(err) {
      // Send a specific JSON response depending if save was succesful or not
      return err ? res.json({ error: 'Unable to update customer.' }) : res.json({ success: true });
    });
  });
};