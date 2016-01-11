var controller = require('../controllers/attractions-api');

module.exports = function(rest) {
  
  rest.get('/attractions', controller.list);

  rest.post('/attraction', controller.add);

  rest.get('/attraction/:id', controller.view);

};

