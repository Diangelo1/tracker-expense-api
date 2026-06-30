// Evita repetir try/catch em cada controller: encaminha qualquer erro para o middleware global
module.exports = function asyncHandler(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
};
