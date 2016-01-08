// Load the Vacation model 
var mongoose = require('mongoose'),
	Vacation = mongoose.model('Vacation'),
    currencies = require('../lib/currencies');

module.exports = function(app) {
  
  app.get('/vacations', function(req, res){
    
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
  
  });
  
  
};

