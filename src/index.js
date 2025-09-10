require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");

const { dbConnection } = require("./config/db");
const { typeError } = require("./middlewares/typeError");
const docs = require("./docs/index");

const app = express();
const PORT = process.env.PORT || 3001;

// // If we plan to use secure cookies/session behind Render’s proxy later:
// app.set('trust proxy', 1);

// —— CORS ——
// While frontend is not deployed, allow Vite dev. We add our prod domain later.
// allow local Vite and (optionally) your deployed frontend
const allowed = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  // 'https://your-frontend-domain.com', // add when you deploy
]);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // allow curl/Postman
      return allowed.has(origin)
        ? cb(null, true)
        : cb(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204, // important for some browsers
  })
);
// explicitly handle preflight for all routes
app.options("*", cors());

app.use(express.json());

// Health check (we can use on Render to confirm it’s up)
app.get("/health", (_req, res) => res.send("ok"));

// Routes
app.use("/", require("./routes/home"));
app.use("/users", require("./routes/users"));
app.use("/posts", require("./routes/posts"));
app.use("/comments", require("./routes/comments"));

// Note: Render’s disk is ephemeral. Files in /uploads won’t persist across restarts.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(docs));

// Errors (after routes)
app.use(typeError);

// Start only after DB is connected
(async () => {
  try {
    await dbConnection();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
})();
