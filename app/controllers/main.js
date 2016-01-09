// Load required libraries 
var fortune = require('../lib/fortune');

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

  