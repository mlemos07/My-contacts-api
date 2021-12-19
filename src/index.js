const express = require('express');
require('express-async-errors');
require('dotenv/config');
const routes = require('./routes');


const app = express();
app.use(express.json());
app.use(routes);
app.use((error, request, response, next) => {
  console.log('entrou no middleware');
  console.log(error);
  return response.sendStatus(500);
});

app.listen(3000, () => console.log('🔥 Server started on port 3000'));
