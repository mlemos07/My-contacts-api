module.exports = (error, request, response, next) => {
  console.log(error);
  return response.sendStatus(500);
};
