module.exports = function(app) {
  
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
  
  
};

