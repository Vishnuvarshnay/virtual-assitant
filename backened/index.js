import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js"; // User routes import kiya
import cors from "cors";
import cookieParser from "cookie-parser";


const app=express();
const port=process.env.PORT || 5000;
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter) // User routes ke liye userRouter use karna hoga
// --- TEST ROUTE ---

app.listen(port,()=>{
    connectDB();
    console.log(`Server is running on port ${port}`);
})