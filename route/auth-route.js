'use strict';

const Router = require('express').Router;
const debug = require('debug')('cfgram:auth-route');
const jsonParser = require('body-parser').json();
const createError = require('http-errors');

const basicAuth = require('../lib/auth-middleware.js');
const User = require('../model/user.js');

const authRouter = module.exports = Router();

authRouter.post('/api/signup', jsonParser, function(req, res, next) {
  debug('POST: /api/signup');

  let password = req.body.password;
  delete req.body.password;

  let user = new User(req.body);
  user.generatePasswordHash(password)
  .then( user => user.save())
  .then( user => user.generateToken())
  .then( token => res.send(token))
  .catch( () => next(createError(400, 'bad request')));
});

authRouter.get('/api/login', basicAuth, function(req, res, next) {
  debug('GET: /api/login');

  User.findOne({ username: req.auth.username })
  .then( user => user.comparePasswordHash(req.auth.password))
  .then( user => user.generateToken())
  .then( token => res.send(token))
  .catch( () => next(createError(400, 'bad request')));
});
