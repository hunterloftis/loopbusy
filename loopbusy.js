var loopLag = require('event-loop-lag');

module.exports = function loopbusy(maxLag, interval) {
  interval = interval || 1000;
  maxLag = maxLag || 250;

  var lag = loopLag(interval);

  var loopbusy = function(req, res, next) {
    if (lag() < maxLag) return next();
    var err = new Error('Too busy');
    err.status = 503;
    next(err);
  };

  loopbusy.interval = interval;
  loopbusy.maxLag = maxLag;

  return loopbusy;
};
