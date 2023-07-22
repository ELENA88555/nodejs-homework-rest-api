const errorMessageList = {
400: 'Bad Request',
409: "Conflict! Email in use",
401: 'Unauthorized! Not authorized',

}

const HttpError = (status, message = errorMessageList[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

module.exports = HttpError;
