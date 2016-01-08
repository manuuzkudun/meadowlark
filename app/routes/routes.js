module.exports = function(app) {
  
  
  app.get('/', function(req, res) {
    res.render('home');
});
  

  app.get('/jquery-test', function(req, res) {
    res.render('jquery-test');
  });

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

app.get('/tours/hood-river', function(req, res){
  res.render('tours/hood-river');
});

app.get('/tours/oregon-coast', function(req, res){
  res.render('tours/oregon-coast');
});

app.get('/tours/request-group-rate', function(req, res){
  res.render('tours/request-group-rate');
});

app.get('/about', function(req, res) {
  res.render('about', { 
    fortune: fortune.getFortune(),
    pageTestScript:'/qa/tests-about.js'
  } );
});


};

