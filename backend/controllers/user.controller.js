import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import groqResponse from "../groq.js";
import moment from "moment";

// --- 1. GET CURRENT USER ---
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Get Current User Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// --- 2. SETUP / UPDATE ASSISTANT ---
export const setupAssistant = async (req, res) => {
  try {
    const { assistantName, assistantImage: imageUrl } = req.body;
    const userId = req.userId;

    // Validate required fields early before doing heavy work
    if (!assistantName) {
      return res.status(400).json({ message: "Assistant name is required" });
    }

    let finalAssistantImage;

    if (req.file) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
      if (!cloudinaryResponse) {
        return res.status(500).json({ message: "Cloudinary upload failed. Please try again." });
      }
      finalAssistantImage = cloudinaryResponse?.secure_url || cloudinaryResponse?.url;
    } else if (imageUrl) {
      finalAssistantImage = imageUrl;
    } else {
      return res.status(400).json({ message: "Assistant image is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { assistantName, assistantImage: finalAssistantImage },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Assistant setup successful",
      user: updatedUser
    });
  } catch (error) {
    console.error("Setup Assistant Error:", error.message);
    return res.status(500).json({ message: "Failed to save assistant settings." });
  }
};

// --- 3. ASK TO ASSISTANT ---
export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;

    // Validate command early
    if (!command || command.trim() === "") {
      return res.status(400).json({ message: "Command cannot be empty" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Last 6 messages for memory context
    const memory = user.chatHistory.slice(-6).map((chat) => ({
      role: chat.role,
      content: chat.content,
    }));

    // AI Response
    const aiData = await groqResponse(
      command,
      user.assistantName,
      user.name,
      memory
    );

    // Validate aiData — groqResponse can return null/undefined on bad parse
    if (!aiData || !aiData.type) {
      console.error("Invalid aiData received:", aiData);
      return res.status(500).json({ response: "Assistant returned an invalid response. Please try again." });
    }

    // Dynamic Time/Date Handling
    switch (aiData.type) {
      case "get_time":
        aiData.response = `The time is ${moment().format("LT")}`;
        break;
      case "get_date":
        aiData.response = `Today's date is ${moment().format("LL")}`;
        break;
      case "get_day":
        aiData.response = `Today is ${moment().format("dddd")}`;
        break;
      case "get_month":
        aiData.response = `It is currently ${moment().format("MMMM")}`;
        break;
    }

    // Save conversation to DB
    user.chatHistory.push({ role: "user", content: command });
    user.chatHistory.push({ role: "assistant", content: aiData.response });

    // Keep chat history max 20 messages
    // Bug fix: was only shifting once — need to trim until within limit
    while (user.chatHistory.length > 20) {
      user.chatHistory.shift();
    }

    await user.save();

    return res.status(200).json(aiData);
  } catch (error) {
    console.error("Controller Error:", error.message);
    return res.status(500).json({ response: "Internal Server Error" });
  }
};
