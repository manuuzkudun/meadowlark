Attraction = require('../models/attraction.js');

// List all approved attractions
exports.list = function(req, content, cb){
  // Find all attractions that are approved in the db
  Attraction.find({ approved: true }, function(err, attractions){
    if(err) return cb({ error: 'Internal error.' });
    
    cb(null, attractions.map(function(a){
      return {
        name: a.name,
        description: a.description,
        location: a.location,
      };
    }));
  });

};

exports.add = function(req, content, cb){
  
  var a = new Attraction({
    name: req.body.name,
    description: req.body.description,
    location: { lat: req.body.lat, lng: req.body.lng },
    history: {
      event: 'created',
      email: req.body.email,
      date: new Date(),
    },
    approved: false,
  });
    
  a.save(function(err, a){
    if(err) return cb({ error: 'Unable to add attraction.' });
    cb(null, { id: a._id });
  }); 
  
};



exports.view = function(req, content, cb){
  
  Attraction.findById(req.params.id, function(err, a){
    if(err) return cb({ error: 'Unable to retrieve attraction.' });
    cb(null, { 
      name: a.name,
      description: a.description,
      location: a.location,
    });
  });
};