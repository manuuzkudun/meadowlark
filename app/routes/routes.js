// Load the conytrollers
var vacations = require('../controllers/vacations');

module.exports = function(app) {
  
  // Main page routes
  
  // Home page
  app.get('/', function(req, res) {
    res.render('home');
  });
  
  // Jquery test page 
  app.get('/jquery-test', function(req, res) {
    res.render('jquery-test');
  });
  
  // About page
  app.get('/about', function(req, res) {
    res.render('about', { 
      fortune: fortune.getFortune(),
      pageTestScript:'/qa/tests-about.js'
    } );
  });
  
   app.get('/set-currency/:currency', function(req,res){ 
    // Copy the currency parameter from the route parameter to the session
    req.session.currency = req.params.currency; 
    return res.redirect(303, '/vacations');
  });
  
  
  // Vacations page routes
  
  app.get('/vacations', vacations.list);
  
  app.get('/notify-me-when-in-season', vacations.notifyWhenInSeason);

  app.post('/notify-me-when-in-season',vacations.notifyWhenInSeasonProcessPost);
  
  
  // Newsletter signup
  
  // Routing for the newsletter page
  app.get('/newsletter', function(req, res){
    // we will learn about CSRF later...for now, we just
    // provide a dummy value
    res.render('newsletter_ajax', { csrf: 'CSRF token goes here' });
  });

  app.post('/newsletter', function(req, res){
    
    // Input validation
    var name = req.body.name || ''; 
    var email = req.body.email || ''; 
  
    // Check if the email is a valid email address
    if(!email.match(VALID_EMAIL_REGEX)) {
      // Email has not a valid format
    
      // If it is an AJAX request send a JSON error response
      if(req.xhr) return res.json({ error: 'Invalid name email address.' });
    
        // Set flash message object
        req.session.flash = {
          type: 'danger',
          intro: 'Validation error!',
          message: 'The email address you entered was  not valid.',
        };
    
        // Redirect to the newsletter archive
        return res.redirect(303, '/newsletter/archive');
    }
  
    // Email has valid format
  
    // Create a new instance of a NewsletterSignup object
    var newsletterSignup = new NewsletterSignup({ name: name, email: email });
  
    // Call the save method in the NewsletterSignup object
    newsletterSignup.save(function(err){
      if(err) {
      
        // Error trying to save
      
        // If it is an AJAX request send a JSON error response
        if(req.xhr) return res.json({ error: 'Database error.' });
      
        // Set flash message object
        req.session.flash = {
          type: 'danger',
          intro: 'Database error!',
          message: 'There was a database error; please try again later.'
        }
        // Redirect to the newsletter archive
        return res.redirect(303, '/newsletter/archive');
      }
      // Object saved correctly
      if(req.xhr) return res.json({ success: true });
    
      // Set flash message object
      req.session.flash = {
        type: 'success',
        intro: 'Thank you!',
        message: 'You have now been signed up for the newsletter.'
      };
      // Redirect to the newsletter archive
      return res.redirect(303, '/newsletter/archive'); });
  });
  
  
  
  
  
  // Tours page routes
  
  // Hood-river page
  app.get('/tours/hood-river', function(req, res){
    res.render('tours/hood-river');
  });

  // Oregon-coast page
  app.get('/tours/oregon-coast', function(req, res){
    res.render('tours/oregon-coast');
  });
  
  // Request group-rate page
  app.get('/tours/request-group-rate', function(req, res){
    res.render('tours/request-group-rate');
  });
  
  // 
  app.get('/contest/vacation-photo',function(req,res){
    var now = new Date();
    res.render('contest/vacation-photo',{
      year: now.getFullYear(),
      month: now.getMonth()
    });
  });


app.post('/contest/vacation-photo/:year/:month', function(req, res){
  var form = new formidable.IncomingForm();
  
  form.parse(req, function(err, fields, files){
    if(err) return res.redirect(303, '/error');
    console.log('received fields:');
    console.log(fields);
    console.log('received files:');
    console.log(files);
    res.redirect(303, '/thank-you');
  });
});



  
// Newsletter form processing
app.post('/process', function(req, res){
  
  if(req.xhr || req.accepts('json,html')==='json'){
    // if there were an error, we would send { error: 'error description' }
    res.send({ success: true }); 
  }else{
    // if there were an error, we would redirect to an error page
    res.redirect(303, '/thank-you');
    }

});


app.get('/thank-you', function(req, res){
  res.render('thank-you');
});

app.get('/popcorn', function(req, res){
  res.render('popcorn');
});

  





};

