// Load required libraries
var mongoose = require('mongoose'),
    Order = require('./order.js');

// Customer model schema
var customerSchema = mongoose.Schema({ 
  firstName: String,
  lastName: String,
  email: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  zip: String,
  phone: String,
  salesNotes: [{
    date: Date,
    salespersonId: Number,
    notes: String,
  }], 
});

// Get the orders corresponding to the customer object calling it
customerSchema.methods.getOrders = function(){ 
  return Order.find({ customerId: this._id });
};

// Attach the schema to the model
var Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;