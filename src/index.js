const express = require('express');
require('express-async-errors');
require('dotenv/config');
const cors = require('./app/middlewares/cors');
const errorHandler = require('./app/middlewares/errorHandler');
const routes = require('./routes');

const app = express();
app.use(express.json());
app.use(cors);
app.use(routes);
app.use(errorHandler);

// eslint-disable-next-line no-console
app.listen(3000, () => console.log('🔥 Server started on port 3000'));
