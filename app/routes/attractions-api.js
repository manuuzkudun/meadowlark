var controller = require('../controllers/attractions-api');

module.exports = function(app) {
  
  app.get('/api/attractions', controller.list);

  app.post('/api/attraction', controller.add);

  app.get('/api/attraction/:id', controller.view);

};

