export const async_Handler = (passed_function) => {
  return (req, resp, next) => {
    Promise.resolve(passed_function(req, resp, next)).catch((err) => next(err));
  };
};
