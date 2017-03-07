'use strict';

const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const Router = require('express').Router;
const debug = require('debug')('cfgram:gallery-route');

const Gallery = require('../model/gallery.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const galleryRouter = module.exports = Router();

galleryRouter.post('/api/gallery', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/gallery');

  req.body.userID = req.user._id;
  new Gallery(req.body).save()
  .then( gallery => res.json(gallery))
  .catch(next);
});

galleryRouter.get('/api/gallery:id', bearerAuth, function(req, res, next) {
  debug('GET /api/gallery:id');

  Gallery.findOne({ findHash: req.params.id })
  .then( gallery => res.json(gallery))
  .catch(next);
});

galleryRouter.delete('/api/gallery/:id', bearerAuth, function(req, res, next) {
  debug('DELETE /api/gallery/:id');

  Gallery.findByIdAndRemove(req.params.id)
  .then( () => res.status(204).send('no content'))
  .catch(next);
});
