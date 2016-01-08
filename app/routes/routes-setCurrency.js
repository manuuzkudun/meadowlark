
module.exports = function(app) {
  
  app.get('/set-currency/:currency', function(req,res){ 
    // Copy the currency parameter from the route parameter to the session
    req.session.currency = req.params.currency; 
    return res.redirect(303, '/vacations');
  });
  
};

