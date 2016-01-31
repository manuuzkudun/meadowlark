var Customer = require('../models/customer.js'),
    _ = require('underscore');

// Convenience function for joining fields
function smartJoin(arr, separator){
	if(!separator) separator = ' ';
	return arr.filter(function(elt) {
		return elt!==undefined &&
			elt!==null &&
			elt.toString().trim() !== '';
	}).join(separator);
}


// Create customer view model

function getCustomerViewModel(customer, orders){
  // Given a customer object, create a visual model 
  // omiting the salesNotes property
  var vm = _.omit(customer, 'salesNotes');
  // Extend the visual model with some properties and Return
  return _.extend(vm, {
    name: smartJoin([vm.firstName, vm.lastName]),
    fullAddress: smartJoin([
      customer.address1,
      customer.address2,
      customer.city + ', ' + 
		customer.state + ' ' + 
		customer.zip,
    ], '<br>'),
    // Attach the orders object, mapping the model properties
    // to new visual model properties
    orders: orders.map(function(order){
      return {
        orderNumber: order.orderNumber,
        date: order.date,
        status: order.status,
        url: '/orders/' + order.orderNumber,
      };
    }),
  });
}

module.exports = getCustomerViewModel;