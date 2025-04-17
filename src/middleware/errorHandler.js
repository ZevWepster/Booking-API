import * as Sentry from "@sentry/node";

const errorHandler = (err, req, res, next) => {
  Sentry.captureException(err);
  console.error(`Error: ${err.message}`);

  if (err.name === "NotFoundError") {
    return res.status(404).json({ error: err.message });
  }

  if (err.name === "AuthenticationError") {
    return res.status(401).json({ error: err.message });
  }

  console.error(err.stack); // Log the error for debugging
  res.status(500).json({ error: "An unexpected error occurred" });
};

export default errorHandler;
