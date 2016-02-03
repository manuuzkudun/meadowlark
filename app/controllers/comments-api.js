Comment = require('../models/comment.js');

// List all comments (approved) 
exports.list = function (req, res) {
  // Find all attractions that are approved in the db
  Comment.find({}, function (error, comments) {
    // Error: Database
    if (error) return res.send(500, 'Error occurred: database error.');
    // Send db results as JSON response
    // Return only the data from the model that we are interested
    res.json(comments.map(function (comment) {
      return {
        author: comment.author,
        text: comment.text,
      };
    }));
  });

};

// Add a new comment to the db 
exports.add = function (req, res) {
  // Create a new comment object and fill it with req.body data
  var comment = new Comment({
    author: req.body.author,
    text: req.body.text,
  });
  // Save the comment to the db  
  comment.save(function (error, comment) {
    // Error: Database
    if (error) return res.send(500, 'Error occurred: database error.');
    // Send db results as JSON response
    res.json({
      id: comment._id
    });
  });

};