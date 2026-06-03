import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://virtual-assitant-backened-vtwx.onrender.com",
    "https://virtual-assitant-ld7b.onrender.com",
    "https://virtual-assitant-ld7b.onrender.com/"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({ status: "Server is running" });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// Connect DB first, then start server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB. Server not started.", err.message);
    process.exit(1);
  });

export default app;
