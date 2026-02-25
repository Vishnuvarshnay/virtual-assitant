import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    assistantImage:{
        type:String,
        default: ""
    },
    assistantName:{
      type:String,
      default: ""
    },
    history:{
      type:String
    },
    chatHistory: [
        {
            role: { type: String, enum: ["user", "assistant"] },
            content: { type: String },
            timestamp: { type: Date, default: Date.now }
        }
    ]

},{timestamps:true});
const User=mongoose.model("User",userSchema);
export default User;