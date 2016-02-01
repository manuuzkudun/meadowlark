// Load the Vacation model 
var mongoose = require('mongoose'),
  Vacation = mongoose.model('Vacation'),
  currencies = require('../lib/currencies'),
  VacationInSeasonListener = require('../models/vacationInSeasonListener.js');



// Find a vacation in the db and render it´s page
exports.detail = function (req, res, next) {
  // Find a vacation in the db
  // The search parameter (slug) is specified in the req.params.vacation
  Vacation.findOne({
    slug: req.params.vacation
  }, function (err, vacation) {
    // Error: db
    if (err) return next(err);
    // Error: no vacation with that parameter
    if (!vacation) return next();
    // Get the currency parameter from the session
    var currency = req.session.currency || 'USD';
    // Set the context for the view template
    var vacation = {
      slug: vacation.slug,
      currency: currency,
      sku: vacation.sku,
      name: vacation.name,
      description: vacation.description,
      inSeason: vacation.inSeason,
      price: currencies.convertFromUSD(vacation.priceInCents / 100, currency),
      qty: vacation.qty,
      image: {
        small: vacation.image.small,
        big: vacation.image.big
      },
    };
    // Render the vacation page and pass the vacation object to the template
    res.render('vacations/vacation', {
      vacation: vacation
    });
  });
};





// List all the avalaible vacations
exports.list = function (req, res) {
  // Find all vacation objects in the db that are avalaible
  Vacation.find({
    available: true
  }, function (err, vacations) {
    // Error: db
    if (err) return next(err);
    // Error: no vacation with that parameter
    if (!vacations) return next();
    // Get the currency parameter from the session
    var currency = req.session.currency || 'USD';
    // Set the context for the view template
    var context = {
      vacations: vacations.map(function (vacation) {
        return {
          slug: vacation.slug,
          currency: currency,
          sku: vacation.sku,
          name: vacation.name,
          description: vacation.description,
          inSeason: vacation.inSeason,
          price: currencies.convertFromUSD(vacation.priceInCents / 100, currency),
          qty: vacation.qty,
          image: {
            small: vacation.image.small,
            big: vacation.image.big
          },
        }
      })
    };

    // Add selected property to the currency link depending of the current currency
    switch (currency) {
    case 'USD':
      context.currencyUSD = 'selected';
      break;
    case 'GBP':
      context.currencyGBP = 'selected';
      break;
    case 'EUR':
      context.currencyEUR = 'selected';
      break;
    case 'BTC':
      context.currencyBTC = 'selected';
      break;
    }

    // Render the view using the context object
    res.render('vacations/vacations', context);
  });
};

// Renders the notifyWhenInSeason page to register
// for send you a email when a vacation is in season
exports.notifyWhenInSeason = function (req, res) {
  res.render('vacations/notify-me-when-in-season', {
    sku: req.query.sku
  });
};

// Processes the request to send you an email when
// a vacation is in season
exports.notifyWhenInSeasonProcessPost = function (req, res) {

  VacationInSeasonListener.update({
      email: req.body.email
    }, {
      $push: {
        skus: req.body.sku
      }
    }, {
      upsert: true
    },
    function (err) {
      // Error in the db update
      if (err) {
        console.error(err.stack);
        req.session.flash = {
          type: 'danger',
          intro: 'Ooops!',
          message: 'There was an error processing your request.',
        };
        // Redirect to vacation list page
        return res.redirect(303, '/vacations');
      }
      // Db update was success
      req.session.flash = {
        type: 'success',
        intro: 'Thank you!',
        message: 'You will be notified when this vacation is in season.',
      };
      // Redirect to vacation list page
      return res.redirect(303, '/vacations');
    }
  );

};

exports.requestGroupRate = function (req, res) {
  res.render('vacations/request-group-rate');
};