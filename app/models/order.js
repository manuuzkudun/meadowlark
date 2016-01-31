var mongoose = require('mongoose');

// Define order schema
var orderSchema = mongoose.Schema({
  orderNumber: Number,
  customerId: String,
  date: Date,
  status: String,
});

var Order = mongoose.model('Order', orderSchema);

// Remove all order documemnts from the db
Order.remove({}, function(error){
  if(error) return next(error);
});

// Create some order documents for test and save them in the db
new Order({
  orderNumber: 1,
  customerId: "56a21291980a5cae666cf70a",
  date: new Date(2015-03-25),
  status: "sent",
}).save();

new Order({
  orderNumber: 2,
  customerId: "56a21291980a5cae666cf70a",
  date: new Date(2015-03-25),
  status: "sent",
}).save();

new Order({
  orderNumber: 3,
  customerId: "56a21291980a5cae666cf70a",
  date: new Date(2015-03-27),
  status: "sent",
}).save();

module.exports = Order;
