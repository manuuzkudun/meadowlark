var mongoose = require('mongoose');

var userSchema = mongoose.Schema({ 
  // authId will be a combination of a strategy type and a third-party ID
  authId: String,
  name: String,
  email: String,
  // We will be using two roles in our example: “customer” and “employee.”
  role: String,
  created: Date,
});

var User = mongoose.model('User', userSchema);

module.exports = User;