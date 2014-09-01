var express = require('express');
var assert = require('chai').assert;
var supertest = require('supertest');

var loopbusy = require('..');

describe('loopbusy', function() {
  describe('interval', function() {

    it('should default to 1000', function() {
      var lb = loopbusy();
      assert(lb.interval, 1000);
    });

    it('should allow overrides', function() {
      var lb = loopbusy(null, 2000);
      assert(lb.interval, 2000);
    });

  });

  describe('max lag', function() {

    it('should default to 250', function() {
      var lb = loopbusy();
      assert(lb.maxLag, 250);
    });

    it('should allows overrides', function() {
      var lb = loopbusy(500);
      assert(lb.maxLag, 500);
    });
  });

  describe('middleware', function() {
    var app = express();

    app
      .use(loopbusy(50, 50))
      .get('/', function(req, res, next) { res.send('ok'); })
      .use(function(err, req, res, next) { res.status(err.status).send('err'); });

    describe('under no load', function() {
      it('should allow requests to proceed normally', function(done) {
        supertest(app)
          .get('/')
          .expect(200, done);
      });
    });

    describe('under load', function() {
      it('should send a 503 response', function(done) {
        var finish = Date.now() + 200;
        while (Date.now() < finish);

        supertest(app)
          .get('/')
          .expect(503, done);
      });
    });
  });
});
