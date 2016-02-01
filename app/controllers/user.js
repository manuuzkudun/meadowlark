exports.signIn = function (req, res) {
  res.render('sign-in');
};

exports.home = function (req, res) {
  res.render('account', {
    name: req.user.name
  });
};

exports.orderHistory = function (req, res) {
  res.render('account/order-history');
};

exports.EmailPrefs = function (req, res) {
  res.render('account/email-prefs');
};

exports.sales = function (req, res) {
  res.render('sales');
};