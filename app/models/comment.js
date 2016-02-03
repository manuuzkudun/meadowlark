var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
  author: String,
  text: String,
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;