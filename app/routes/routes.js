//TODO: Move route handlers to the controllers directory

// Load the conytrollers
var vacations = require('../controllers/vacations'),
    main = require('../controllers/main');

module.exports = function(app) {
  
  // Main page routes
  app.get('/', main.home);
  app.get('/about',main.about);
 
  // Newsletter signup
  app.get('/newsletter', main.newsletter);
  app.post('/newsletter', main.newsletterProcessPost);
  app.get('/newsletter/archive', main.newsletterArchive);
  app.get('/thank-you', main.genericThankYou);

  // Vacations page routes
  app.get('/vacations', vacations.list);
  app.get('/notify-me-when-in-season', vacations.notifyWhenInSeason);
  app.post('/notify-me-when-in-season',vacations.notifyWhenInSeasonProcessPost);
  

  app.get('/set-currency/:currency', function(req,res){ 
    // Copy the currency parameter from the route parameter to the session
    req.session.currency = req.params.currency; 
    return res.redirect(303, '/vacations');
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

// Test pages
app.get('/popcorn', function(req, res){
  res.render('popcorn');
});

  app.get('/jquery-test', function(req, res) {
    res.render('jquery-test');
  });





};

