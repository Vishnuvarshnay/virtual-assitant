import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const groqResponse = async (prompt, assistantName = "Shray", userName = "Vishnu", memory = []) => {
    try {
        const apiKey = process.env.GROQ_API_KEY;
        
        if (!apiKey) {
            console.error("ERROR: GROQ_API_KEY is missing in .env file");
            return {
                type: "general",
                userinput: prompt,
                response: "API key is missing. Please add GROQ_API_KEY to your .env file."
            };
        }
        
        const apiUrl = "https://api.groq.com/openai/v1/chat/completions";

        const systemInstruction = `You are a virtual assistant named ${assistantName} created by ${userName}.
        You are a highly capable, voice-enabled AI.

        STRICT LANGUAGE RULES:
        1. Detect the language of the user's CURRENT prompt (English, Hindi, Tamil, etc.).
        2. Your "response" MUST be in the EXACT same language as the user's last message.
        3. If the user speaks English, respond in English. If Hindi, respond in Hindi. 
        4. Do NOT let the conversation history change your current response language.
        
        CRITICAL: Respond ONLY with a valid JSON object. Do not include markdown or triple backticks.

        JSON Structure:
        {
          "type": "general" | "google_search" | "youtube_search" | "youtube_play" | "get_time" | "get_date" | "get_day" | "get_month" | "calculator_open" | "instagram_open" | "facebook_open" | "weather_show",
          "userinput": "<clean query in user's language>",
          "response": "<a short spoken response in the SAME language as the current user prompt>"
        }

        Instructions for 'userinput':
        - Extract only the core topic for searches (e.g., "YouTube par Salman Khan ke gaane chalao" -> "Salman Khan songs").
        `;

        // Combining System Instruction + Chat History + Current Prompt
        const messages = [
            { role: "system", content: systemInstruction },
            ...memory, 
            { role: "user", content: prompt }
        ];

        const result = await axios.post(apiUrl, {
            messages,
            model: "llama-3.3-70b-versatile",
            // Temperature 0.1 ensure karega ki AI instructions ko strictly follow kare
            temperature: 0.1, 
            response_format: { type: "json_object" }
        }, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        });

        const content = result.data.choices[0].message.content;
        return JSON.parse(content);

    } catch (error) {
        console.log("=== GROQ ERROR START ===");
        console.log("Status:", error.response?.status);
        console.log("Data:", error.response?.data);
        console.log("Message:", error.message);
        console.log("=== GROQ ERROR END ===");

        return {
            type: "general",
            userinput: prompt,
            response: "I am having trouble connecting to my brain right now."
        };
    }
};

export default groqResponse;
