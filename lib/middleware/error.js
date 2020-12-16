// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const status = err.status || 500;

  res.status(status);

  console.log(JSON.parse(err.message));

  res.send({
    ...JSON.parse(status),
    ...JSON.parse(err.message),
  });
};
