//Best Way to Use the Try-Catch
function WrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => {
      next(err);
    });
  };
}
module.exports = WrapAsync;
