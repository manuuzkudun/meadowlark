// Check if any of the products in the cart requires a waiver
// If it´s true add warning message to the cart object
exports.checkWaivers = function(req, res, next){
  // Get cart object from the request object
  var cart = req.cart;
  // If cart is not present go to next middleware
  if(!cart) return next();
  // If any of the items in the cart requires a waiver
  if(cart.items.some(function(item){ return item.vacation.requiresWaiver; })){
    // Create a warnings array if there is none
    if(!cart.warnings) cart.warnings = [];
    // Add a warning message to the array
    cart.warnings.push('One or more of your selected tours requires a waiver.');
  }
  // Go to next middleware
  next();
};

// Check if any of the products in the cart requires has number of guests 
// greater than the max
// if it´s true add an error message to the cart object
exports.checkGuestCounts = function(req, res, next){
  // Get cart object from the request object
  var cart = req.cart;
  // If cart is not present go to next middleware
  if(!cart) return next();
  // If any of the items in the cart has a number of guests greater than the max
  if(cart.items.some(function(item){ return item.guests > item.vacation.maximumGuests; })){
    // Create an errors array if there is none
    if(!cart.errors) cart.errors = [];
    // Add an error message to the array
    cart.errors.push('One or more of your selected tours cannot accmodate the ' +
				'number of guests you have selected.');
  }
  next();
};