// Load the Vacation model 
var mongoose = require('mongoose'),
	Vacation = mongoose.model('Vacation'),
    currencies = require('../lib/currencies'),
    VacationInSeasonListener = require('../models/vacationInSeasonListener.js');

// List all the avalaible vacations
exports.list = function(req, res){
  // Find all vacation objects in the db that are avalaible
  Vacation.find({ available: true }, function(err, vacations){
    // Get the currency parameter from the session
    var currency = req.session.currency || 'USD';
    // Set the context for the view template
    var context = {
      vacations: vacations.map(function(vacation){
        return {
          currency: currency,
          sku: vacation.sku,
          name: vacation.name,
          description: vacation.description,
          inSeason: vacation.inSeason,
          price: currencies.convertFromUSD(vacation.priceInCents/100, currency),
          qty: vacation.qty,
        } 
      })
    };
    
    // Add selected property to the currency link depending of the current currency
    switch(currency){
      case 'USD': 
        context.currencyUSD = 'selected'; 
        break; 
      case 'GBP': 
        context.currencyGBP = 'selected'; 
        break; 
      case 'EUR':
        context.currencyEUR = 'selected';
        break;
      case 'BTC': 
        context.currencyBTC = 'selected'; 
        break;
    }
      
    // Render the view using the context object
    res.render('vacations', context);
    });
  };

// Renders the notifyWhenInSeason page to register
// for send you a email when a vacation is in season
exports.notifyWhenInSeason = function(req, res){
  res.render('notify-me-when-in-season', { sku: req.query.sku });
};

// Processes the request to send you an email when
// a vacation is in season
exports.notifyWhenInSeasonProcessPost = function(req, res){ 
  
  VacationInSeasonListener.update(
    {email: req.body.email},
    { $push: { skus: req.body.sku } }, 
    { upsert: true },
    function(err){
      // Error in the db update
      if(err) {
        console.error(err.stack);
        req.session.flash = {
          type: 'danger',
          intro: 'Ooops!',
          message: 'There was an error processing your request.',
        };
        // Redirect to vacation list page
        return res.redirect(303, '/vacations');
      }
      // Db update was success
      req.session.flash = {
        type: 'success',
        intro: 'Thank you!',
        message: 'You will be notified when this vacation is in season.',
      };
      // Redirect to vacation list page
      return res.redirect(303, '/vacations');
    }
  ); 

};