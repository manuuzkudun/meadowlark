// Load required libraries
var mongoose = require('mongoose'),
    Order = require('./order.js');

// Define customer model schema
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

// Define getOrders method and attach it to the customer schema
customerSchema.methods.getOrders = function(){ 
  return Order.find({ customerId: this._id });
};

var Customer = mongoose.model('Customer', customerSchema);
modules.export = Customer;