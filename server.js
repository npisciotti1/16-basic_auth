'use strict';

//teehee

const express = require('express');
const debug = require('debug')('cfgram:server');
const Promise = require('bluebird');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const errors = require('./lib/error-middleware.js');
const authRouter = require('./route/auth-route.js');
const galleryRouter = require('./route/gallery-route.js');
const picRouter = require('./route/pic-route.js');

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.load();
mongoose.connect(process.env.MONGODB_URI);

//ternary operator, if PRODUCTION evals to true, it uses 'common', if PRODUCTION
//evals to false, 'dev' is used.
let morganFormat = process.env.PRODUCTION ? 'common' : 'dev';

app.use(cors());
app.use(morgan(morganFormat));

app.use(authRouter);
app.use(galleryRouter);
app.use(picRouter);
app.use(errors);

const server = module.exports = app.listen(PORT, () => {
  debug(`Port is up yo: ${PORT}`);
});

server.isRunning = true;
