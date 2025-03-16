const catchAsync = fn => { // here fn is async so error we will get a reject promise, so we are catcing it
    return (req, res, next) => {
      fn(req, res, next).catch(err => next(err));
    }
}
module.exports = catchAsync