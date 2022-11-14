const tryCatchWrapper = (endpointFn) => {
  return async (req, res, next) => {
    try {
      await endpointFn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

const validation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      error.status = 400;
      next(error);
    }
    next();
  };
};

const createError = (status, err) => {
  const messages = {
    400: 'Bad request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not found',
    409: 'Conflict'
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
  validation,
  createError, 
};