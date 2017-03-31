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

  if(!req.user) return next(createError(400, 'bad request'));

  req.body.userID = req.user._id;
  new Gallery(req.body).save()
  .then( gallery => res.json(gallery))
  .catch( () => next(createError(400, 'bad request')));
});

galleryRouter.get('/api/gallery/:id', bearerAuth, function(req, res, next) {
  debug('GET /api/gallery/:id');

  Gallery.findById(req.params.id)
  .then( gallery => res.json(gallery))
  .catch( () => next(createError(404, 'not found')));
});

galleryRouter.put('/api/gallery/:id', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT /api/gallery/:id');

  // Gallery.findById(req.params.id)
  // .then( gallery => {
  //   if( gallery.userID.toString() !== req.params.id.toString() ) {
  //     return Promise.reject(createError(404, 'not found'));
  //   }
  Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .then( gallery => res.json(gallery))
  .catch( () => next(createError(400, 'bad request')));
});

galleryRouter.delete('/api/gallery/:id', bearerAuth, function(req, res, next) {
  debug('DELETE /api/gallery/:id');

  Gallery.findByIdAndRemove(req.params.id)
  .then( () => res.status(204).send('no content'))
  .catch( () => next(createError(404, 'not found')));
});

//request all galleries

galleryRouter.get('/api/gallery', bearerAuth, function(req, res, next) {
  debug('GET /api/gallery');

  Gallery.find({ userID: req.user._id })
  .populate('pics')
  .then( galleries => res.status(200).send(galleries))
  .catch( () => next(createError(404, 'not found')));
});
