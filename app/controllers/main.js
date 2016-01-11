// Load required libraries 
var fortune = require('../lib/fortune');
var VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

exports.home = function(req,res){
  res.render('home');
};

// About page route controller
exports.about = function(req, res){
  res.render('about', { 
    fortune: fortune.getFortune(),
    pageTestScript:'/qa/tests-about.js'
  });
};

// Renders newsletter signup page
exports.newsletter = function(req, res){
  // we will learn about CSRF later...for now, we just
  // provide a dummy value
  res.render('newsletter', { csrf: 'CSRF token goes here' });
};

// for now, we're mocking NewsletterSignup:
function NewsletterSignup(){
}
NewsletterSignup.prototype.save = function(cb){
  cb();
};

// Processes a post request to the newsletter signup
exports.newsletterProcessPost = function(req, res){  
  // Input validation
  var name = req.body.name || ''; 
  var email = req.body.email || ''; 
  
  // If the email format is not correct
  if(!email.match(VALID_EMAIL_REGEX)) {
    // If it is an AJAX request send a JSON error response
    if(req.xhr) return res.json({ error: 'Invalid name email address.' });
    // Set flash message object for invalid email format
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
  // Save the NewsletterSignup object
  newsletterSignup.save(function(err){
    if(err) {
      // If it is an AJAX request send a JSON error response
      if(req.xhr) return res.json({ error: 'Database error.' });
      // Set flash message object for db error 
      req.session.flash = {
        type: 'danger',
        intro: 'Database error!',
        message: 'There was a database error; please try again later.'
      }
      // Redirect to the newsletter archive
      return res.redirect(303, '/newsletter/archive');
    }
    // Object saved correctly
    // If it is an AJAX request send a JSON error response
    if(req.xhr) return res.json({ success: true });
    // Set flash succes message object
    req.session.flash = {
      type: 'success',
      intro: 'Thank you!',
      message: 'You have now been signed up for the newsletter.'
    };
    // Redirect to the newsletter archive
    return res.redirect(303, '/newsletter/archive'); 
  });
};

exports.newsletterArchive = function(req, res){
  res.render('newsletter/archive');
}

exports.genericThankYou = function(req, res){
  res.render('thank-you');
}

  