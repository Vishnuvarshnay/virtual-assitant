import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import groqResponse from "../groq.js"; // Groq integration
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

    let finalAssistantImage;

    // Cloudinary upload handling
    if (req.file) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
      if (!cloudinaryResponse) {
        throw new Error("Cloudinary upload failed");
      }
      finalAssistantImage = cloudinaryResponse?.secure_url || cloudinaryResponse?.url;
    } else {
      finalAssistantImage = imageUrl;
    }

    if (!assistantName || !finalAssistantImage) {
      return res.status(400).json({ message: "Assistant name and image are required" });
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

// --- 3. ASK TO ASSISTANT (With Industry Level Memory) ---

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Memory Logic: Last 6 messages fetch karna taaki AI ko context yaad rahe
    // Hum sirf role aur content pass karte hain Groq standard ke hisaab se
    const memory = user.chatHistory.slice(-6).map((chat) => ({
      role: chat.role,
      content: chat.content,
    }));

    // AI Response (Utility call with updated simple parameters)
   const aiData = await groqResponse(
     command,
     user.assistantName,
     user.name,
     memory
  );

    // Dynamic Time/Date Handling using Moment.js
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

    // Database mein current conversation save karna
    user.chatHistory.push({ role: "user", content: command });
    user.chatHistory.push({ role: "assistant", content: aiData.response });

    // Memory Management: History ko limit mein rakhna taaki DB slow na ho (Max 20 msgs)
    if (user.chatHistory.length > 20) {
      user.chatHistory.shift();
    }

    await user.save();

    return res.status(200).json(aiData);
  } catch (error) {
    console.error("Controller Error:", error.message);
    return res.status(500).json({ response: "Internal Server Error" });
  }
};
