const { Client } = require('pg');

const client = new Client({
  host: process.env.HOST_DATABASE,
  port: process.env.PORT_DATABASE,
  user: process.env.USER_DATABASE,
  password: process.env.PASSWORD_DATABASE,
  database: 'mycontacts',
});

client.connect();

exports.query = async (query, values) => {
  const { rows } = await client.query(query, values);
  return rows;
};
