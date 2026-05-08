// ✅ Correct middleware syntax for Express
export const responseTimeLogger = (req, res, next) => {
  const start = Date.now();

  // res is a valid Express Response object, so this works:
  res.on("finish", () => {
    const time = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} → ${time} ms`);
  });

  next();
};
