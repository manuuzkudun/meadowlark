var assert = require('chai').assert;
var http = require('http');
var rest = require('restler');

suite('API tests', function(){
  
  // Attraction object
  var attraction = {
    lat: 45.516011,
    lng: -122.682062,
    name: 'Portland Art Museum',
    description: 'Founded in 1892, the Portland Art Museum\'s colleciton ' +
        'of native art is not to be missed.  If modern art is more to your ' +
        'liking, there are six stories of modern art for your enjoyment.',
    email: 'test@meadowlarktravel.com',
  };
  
  // Base URL
  var base = 'http://api.meadowlark:3000';

  // Test to add an attraction through the API
  test('should be able to add an attraction', function(done){
    // Add an attraction using a POST request through the API
    rest.post(base+'/attraction', {data:attraction})
      // Succesful response
      .on('success', function(data){
        // Data id is correct
        assert.match(data.id, /\w/, 'id must be set');
		done();
      })
      // Error response
      .on('error', function() {
        assert(false, 'Did you remember to alias api.meadowlark to 127.0.0.1 in your /etc/hosts file?');
      });
	
    });
  
  //Test to retrieve an attraction 
  test('should be able to retrieve an attraction', function(done){
    // Add an attraction using a POST request through the API
    rest.post(base+'/attraction', {data:attraction})
      // Succesful response
      .on('success', function(data){
        // Retrieve the same attraction using a GET request through the API
        rest.get(base+'/attraction/'+data.id)
          // Succesful response
          .on('success', function(data){
            // Assert that the retrieved attraction and the original attraction 
            // has the same name and description properties
            assert(data.name===attraction.name);
		    assert(data.description===attraction.description);
		    done();
          })
          // Error response
          .on('error', function() {
            assert(false, 'Did you remember to alias api.meadowlark to 127.0.0.1 in your /etc/hosts file?');
		  });
      });
  });

});