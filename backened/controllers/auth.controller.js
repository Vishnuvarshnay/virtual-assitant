import User from "../models/user.model.js";
import genToken from "../config/token.js";
import bcrypt from "bcryptjs";

// --- SIGN UP FUNCTION ---
export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = await genToken(newUser._id);
    
    // Updated Cookie Logic for better compatibility
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Hamesha true rakhein taaki cross-site allow ho
      sameSite: "none", // Cross-port cookies ke liye zaroori hai
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: { _id: newUser._id, name: newUser.name, email: newUser.email },
      token,
    });

  } catch (error) {
    console.error("Sign up error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// --- LOGIN FUNCTION ---
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: { _id: user._id, name: user.name, email: user.email },
      token
    });

  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// --- LOGOUT (INDUSTRY FIX) ---
export const logout = async (req, res) => {
  try {
    // Clear cookie with exact same attributes as set
    res.cookie("token", "", { 
      httpOnly: true,
      expires: new Date(0), // Immediate expiry
      sameSite: "none",
      secure: true
    });

    return res.status(200).json({ 
      message: "Logged out successfully" 
    });
    
  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};