// Last stop for every error in the app
module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ message: status === 500 ? 'Something went wrong' : err.message });
};
