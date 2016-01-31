// Import required modules and packages
var User = require('../models/user.js'),
  passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Puts user data into the session in req.session.passport.user
// an id (or email...) is stored as user identifier
passport.serializeUser(function (user, done) {
  done(null, user._id);
});

// In deserialize function the whole user object 
// is retrieved with help of an user iodentifier
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err || !user) return done(err, null);
    done(null, user);
  });
});

module.exports = function (app, options) {

  // if success and failure redirects aren't specified,
  // set some reasonable defaults
  if (!options.successRedirect)
    options.successRedirect = '/account';
  if (!options.failureRedirect)
    options.failureRedirect = '/login';

  return {

    init: function () {
      var env = app.get('env');
      // Get credentials for the auth providers
      var config = options.providers;

      // Configure Facebook strategy
      passport.use(new FacebookStrategy({
        // App ID for facebook
        clientID: config.facebook[env].appId,
        // App secret for fb
        clientSecret: config.facebook[env].appSecret,
        callbackURL: (options.baseUrl || '') + '/auth/facebook/callback',
      }, function (accessToken, refreshToken, profile, done) {
        // user has successfully authenticated
        
        // In our db we specify the user authId as the combination
        // of the provider name and the user id in the provider
        var authId = 'facebook:' + profile.id;
        // Find a user in our database with this authId
        User.findOne({
          authId: authId
        }, function (err, user) {
          // Error: db error
          if (err) return done(err, null);
          // If there´s already a user with this authId return it
          // serializeUser gets called, which will put the MongoDB ID into the session
          if (user) return done(null, user);
          // If there is no user with that id, create a new user in the db
          user = new User({
            authId: authId,
            name: profile.displayName,
            created: Date.now(),
            role: 'customer',
          });
          // Save the user in the db
          user.save(function (err) {
            if (err) return done(err, null);
            done(null, user);
          });
        });
      }));

      // Configure Google strategy
     /* passport.use(new GoogleStrategy({
        // Client ID for google
        clientID: config.google[env].clientID,
        // Client secret
        clientSecret: config.google[env].clientSecret,
        callbackURL: (options.baseUrl || '') + '/auth/google/callback',
      }, function (token, tokenSecret, profile, done) {
        // user has successfully authenticated
        
        // In our db we specify the user authId as the combination
        // of the provider name and the user id in the provider
        var authId = 'google:' + profile.id;
        // Find a user in our database with this authId
        User.findOne({
          authId: authId
        }, function (err, user) {
          // Error: db error
          if (err) return done(err, null);
          // If there´s already a user with this authId return it
          // serializeUser gets called, which will put the MongoDB ID into the session
          if (user) return done(null, user);
          // If there is no user with that id, create a new user in the db
          user = new User({
            authId: authId,
            name: profile.displayName,
            created: Date.now(),
            role: 'customer',
          });
          // Save the user in the db
          user.save(function (err) {
            if (err) return done(err, null);
            done(null, user);
          });
        });
      }));*/
      
      // Middleware required by passport
      app.use(passport.initialize());
      app.use(passport.session());
    },

    registerRoutes: function () {
      // register Facebook routes
      app.get('/auth/facebook', function (req, res, next) {
        if (req.query.redirect) req.session.authRedirect = req.query.redirect;
        // Redirect the visitor to Facebook’s authentication screen
        passport.authenticate('facebook')(req, res, next);
      });
      app.get('/auth/facebook/callback', passport.authenticate('facebook', {
          failureRedirect: options.failureRedirect
        }),
        function (req, res) {
          // we only get here on successful authentication
          var redirect = req.session.authRedirect;
          if (redirect) delete req.session.authRedirect;
          res.redirect(303, redirect || options.successRedirect);
        }
      );

      // register Google routes
    /*  app.get('/auth/google', function (req, res, next) {
        if (req.query.redirect) req.session.authRedirect = req.query.redirect;
        passport.authenticate('google', {
          scope: 'profile'
        })(req, res, next);
      });
      app.get('/auth/google/callback', passport.authenticate('google', {
          failureRedirect: options.failureRedirect
        }),
        function (req, res) {
          // we only get here on successful authentication
          var redirect = req.session.authRedirect;
          if (redirect) delete req.session.authRedirect;
          res.redirect(303, req.query.redirect || options.successRedirect);
        }
      );*/
    },

  };
};