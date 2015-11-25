var Browser = require('zombie'),
    assert = require('chai').assert;

var browser;

suite('Cross-Page Tests', function(){
  // Initialize a new browser object before each test is run
  setup(function(){
    browser = new Browser();
  });

  test('requesting a group rate quote from the hood river tour page' +
       'should populate the referrer field', function(done){
    // Referer web page    
    var referrer = 'http://localhost:3000/tours/hood-river';
    // Visit referer page
    browser.visit(referrer, function(){
      // Click the .requestGroupRate link 
      browser.clickLink('.requestGroupRate', function(){
        // Check that the field with the name referrer has referrer value (web address)
        assert(browser.field('referrer').value === referrer);
        done();
      });
    });
  });

  test('requesting a group rate from the oregon coast tour page should ' +
       'populate the referrer field', function(done){
    // Referer web page
    var referrer = 'http://localhost:3000/tours/oregon-coast';
    // Visit referer page
    browser.visit(referrer, function(){
      // Click the .requestGroupRate link
      browser.clickLink('.requestGroupRate', function(){
        // Check that the field with the name referrer has referrer value (web address)
        assert(browser.field('referrer').value === referrer);
        done();
      });
    });
  });

  test('visiting the "request group rate" page directly should result ' +
       'in an empty referrer field', function(done){
    // Visit "request group rate" directly
    browser.visit('http://localhost:3000/tours/request-group-rate',function(){
      // Check that the field with the name referrer has empty value
      assert(browser.field('referrer').value === '');
      done();
    });
  });

});
