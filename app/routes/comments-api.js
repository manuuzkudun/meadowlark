var comments = require('../controllers/comments-api');

module.exports = function (app) {

  app.get('/api/comments', comments.list);

  app.post('/api/comments', comments.add);

};