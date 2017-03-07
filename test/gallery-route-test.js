'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const User = require('../model/user.js');
const Gallery = require('../model/gallery.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'example user',
  email: 'example@user.com',
  password: 'user password'
};

const exampleGallery = {
  name: 'example gallery',
  description: 'my example gallery'
};

describe('Gallery Routes', function () {
  describe('POST: /api/gallery', function() {
    describe('with a valid body', () => {
      afterEach( done => {
        Promise.all([
          User.remove({}),
          Gallery.remove({})
        ])
        .then( () => done())
        .catch(done);
      });
      before( done => {
        new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then( user => user.save())
        .then( user => {
          this.tempUser = user;
          user.generateToken();
        })
        .then( token => {
          this.tempToken = token;
          done();
        })
        .catch(done);
      });
    });
    it('should return a gallery', done => {
      request.post('/api/gallery')
      .send(exampleGallery)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        expect(res.)
      })
    })
  });
});
