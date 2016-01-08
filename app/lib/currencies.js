exports.convertFromUSD = function(value, currency) {
  
  switch(currency){
    case 'USD': return (value * 1).toFixed(2);
    case 'GBP': return (value * 0.6).toFixed(2);
    case 'EUR': return (value * 0.918602).toFixed(2)
    case 'BTC': return (value * 0.0023707918444761).toFixed(2);
    default: return NaN;
  }
  
};
