var attractions = require('../controllers/attractions-api');

module.exports = function(app) {
  
  app.get('/api/attractions', attractions.list);

  app.post('/api/attraction', attractions.add);

  app.get('/api/attraction/:id', attractions.read);
  
  app.put('/api/attraction/:id', attractions.update);
  
  app.delete('/api/attraction/:id', attractions.delete);

};

