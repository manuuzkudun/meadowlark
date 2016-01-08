// Load the Vacation model 
var mongoose = require('mongoose'),
	Vacation = mongoose.model('Vacation');

module.exports = function(app) {
  
  app.get('/vacations', function(req, res){
    
    // Find all vacation objects in the db that are avalaible
    Vacation.find({ available: true }, function(err, vacations){
      
      //
      var context = {
        vacations: vacations.map(function(vacation){
          return {
            sku: vacation.sku,
            name: vacation.name,
            description: vacation.description,
            price: vacation.getDisplayPrice(),
            inSeason: vacation.inSeason,
          } 
        })
      };
      // Render the view using the context object
      res.render('vacations', context);
    });
  
  });
  
  
};

