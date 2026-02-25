import express from "express";
import { getCurrentUser } from "../controllers/user.controller.js"; // File name check karein (.js zaroori hai)
import { setupAssistant } from "../controllers/user.controller.js"; // Setup assistant function import kiya
import isAuth from "../middlewares/isAuth.js"; // Middleware import kiya
import multer from "multer"; // Multer import kiya
const upload = multer({ dest: "uploads/" }); // Multer setup kiya
import { askToAssistant } from "../controllers/user.controller.js"; // Ask to assistant function import kiya


const userRouter = express.Router();

// Protected Route: Pehle isAuth check karega, phir getCurrentUser chalega
userRouter.get("/current", isAuth, getCurrentUser);
userRouter.post("/setup", isAuth,upload.single("assistantImage"), setupAssistant);
// 3. ASK TO ASSISTANT (YAHAN Galti thi, ye missing tha)
// Ye route aapke Home.jsx ke axios call se match hona chahiye
userRouter.post("/ask", isAuth, askToAssistant);

export default userRouter;