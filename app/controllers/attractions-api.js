Attraction = require('../models/attraction.js');

// List all attractions (approved) 
exports.list = function(req, res){
  // Find all attractions that are approved in the db
  Attraction.find({ approved: true }, function(error, attractions){
    // Error: Database
    if(error) return res.send(500, 'Error occurred: database error.');
    // Send db results as JSON response
    // Return only the data from the model that we are interested
    res.json(attractions.map(function(attraction){
      return {
        name: attraction.name,
        id: attraction._id,
        description: attraction.description,
        location: attraction.location,
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
  attraction.save(function(error, attraction){
    // Error: Database
    if(error) return res.send(500, 'Error occurred: database error.');
    // Send db results as JSON response
    res.json({ id: attraction._id });
  }); 
  
};

// Delete a given attraction
exports.delete = function(req,res){
  // Find an attraction given it´s ID
  Attraction.findById(req.params.id, function(error, attraction){
    // Try to remove attraction from the db
    return attraction.remove(function (error) {
      if (!error) {
        console.log("removed");
        return res.send('');
      } else {
        console.log(error);
      }
    });
  });
};


// Delete a given attraction
exports.update = function(req,res){
  // Find an attraction given it´s ID
  Attraction.findById(req.params.id, function(error, attraction){
    // Error: Database
    if(error) return res.send(500, 'Error occurred: database error.');
    //Update attraction attributes
    attraction.name = req.body.name;
    attraction.description = req.body.description;
    attraction.location = { lat: req.body.lat, lng: req.body.lng };
    attraction.history = {
      event: 'updated',
      email: req.body.email,
      date: new Date(),
    };
    attraction.approved = false;
    // save the uodated attraction
    attraction.save(function(error, attraction){
      // Error: Database
      if(error) return res.send(500, 'Error occurred: database error.');
      // Send db results as JSON response
      res.json({ id: attraction._id });
    }); 

  });
};


// View a given attraction
exports.read = function(req, res){
  // Find an attraction given it´s ID
  Attraction.findById(req.params.id, function(err, attraction){
    // Error: Database
    if(err) return res.send(500, 'Error occurred: database error.');
    // Send db results as JSON response
    // Return only the data from the model that we are interested
    res.json({
      name: attraction.name,
      id: attraction._id,
      description: attraction.description,
      location: attraction.location
    });
  });
};