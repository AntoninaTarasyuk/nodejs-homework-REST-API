const tryCatchWrapper = (endpointFn) => {
  return async (req, res, next) => {
    try {
      await endpointFn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

const createError = (status, err) => {
  const messages = {
    400: 'Bad request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not found',
  }
  let message;
  if (err) {
    message = err.message;
  } else { message = messages[status] }
  const error = new Error(message);
  error.status = status;
  return error;
};

module.exports = {
  tryCatchWrapper,
  createError, 
};