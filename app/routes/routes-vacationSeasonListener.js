module.exports = function(app) {
  
  // Load the db model
  var VacationInSeasonListener = require('../models/vacationInSeasonListener.js');

  app.get('/notify-me-when-in-season', function(req, res){
    res.render('notify-me-when-in-season', { sku: req.query.sku });
  });

  app.post('/notify-me-when-in-season', function(req, res){ 
  
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
  
  });

};