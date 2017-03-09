'use strict';

const AWS = require('aws-sdk-mock');

module.exports = exports = {};

exports.uploadMock = {
  ETag: '"1234lookatme"',
  Location: 'https://fakeurl.com/mock.png',
  Key: 'hashedname.png',
  key: 'hashedname.png',
  Bucket: 'cfgram-nikko'
};

AWS.mock('S3', 'upload', function(params, callback) {
  if (!params.ACL === 'public-read') {
    return callback(new Error('ACL must be public-read'));
  }
  if(!params.bucket === 'cfgram-nikko') {
    return callback(new Error('bucket must be cfgram-nikko'));
  }
  if(!params.Key) {
    return callback(new Error('key required'));
  }
  if(!params.Body) {
    return callback(new Error('body required'));
  }

  callback(null, exports.uploadMock); 
});
