Attraction = require('../models/attraction.js');

// List all attractions (approved) 
exports.list = function(req, res){
  // Find all attractions that are approved in the db
  Attraction.find({ approved: true }, function(err, attractions){
    // Error: Database
    if(err) return res.send(500, 'Error occurred: database error.');
    // Send db results as JSON response
    res.json(attractions.map(function(a){
      return {
        name: a.name,
        id: a._id,
        description: a.description,
        location: a.location,
      };
    }));
  });

};

// Add a new attraction to the db 
exports.add = function(req, res){
  // Create a new attraction object and fill it with req.body data
  var attraction = new Attraction({
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
  // Save the attraction to the db  
  attraction.save(function(err, attraction){
    // Error: Database
    if(err) return res.send(500, 'Error occurred: database error.');
    // Send db results as JSON response
    res.json({ id: a._id });
  }); 
  
};

// View a given attraction
exports.view = function(req, res){
  // Find an attraction given it´s ID
  Attraction.findById(req.params.id, function(err, a){
    // Error: Database
    if(err) return res.send(500, 'Error occurred: database error.');
    // Send db results as JSON response
    res.json({
      name: a.name,
      id: a._id,
      description: a.description,
      location: a.location
    });
  });
};