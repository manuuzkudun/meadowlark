var mongoose = require('mongoose');

// Define order schema
var orderSchema = mongoose.Schema({
  orderNumber: Number,
  customerId: String,
  date: Date,
  status: String,
});

var Order = mongoose.model('Order', orderSchema);
module.exports = Order;