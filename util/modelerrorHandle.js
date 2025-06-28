const modelErrorHandler = async (fn, fnname, ...args) => {
  try {
    return await fn(...args);
  } catch (err) {
    console.error(`${fnname} Error`, err);
    return { error: true, message: `${fnname} failed` };
  }
};

module.exports = modelErrorHandler;
