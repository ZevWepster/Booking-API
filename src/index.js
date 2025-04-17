import express from "express";
import * as Sentry from "@sentry/node";
import "dotenv/config";

// Routes
import userRoutes from "./routes/userRoutes.js";
import loginRoute from "./routes/authRoutes.js";
import hostRoutes from "./routes/hostsRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import amenityRoutes from "./routes/amenityRoutes.js";
// middleware
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({
      tracing: true,
    }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({
      app,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!,
});

// Middleware
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(express.json());
app.use(logger);

// Routes
app.use("/login", loginRoute);
app.use("/users", userRoutes);
app.use("/hosts", hostRoutes);
app.use("/properties", propertyRoutes);
app.use("/bookings", bookingRoutes);
app.use("/reviews", reviewRoutes);
app.use("/amenities", amenityRoutes);

// sentry test
// app.get("/debug-sentry", function mainHandler(req, res) {
//   throw new Error("My first Sentry error!");
// });

app.use(Sentry.Handlers.errorHandler());

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
