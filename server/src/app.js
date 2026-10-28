const path = require('path');
const express = require('express');
const routes = require('./routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();
app.use(express.json());

app.use('/api', routes);
app.use(express.static(path.join(__dirname, '../../client'))); // serve the front end
app.use(errorHandler);

module.exports = app;
