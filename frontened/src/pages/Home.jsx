import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const { userData, serverUrl, setUserData } = useContext(userDataContext);
  const [isListening, setIsListening] = useState(false);
  const [statusText, setStatusText] = useState("System Ready");
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false); // ✅ Fix 1: useRef to avoid stale closure
  const hasInitialized = useRef(false); // ✅ Fix 3: prevent double init

  // Sync ref with state
  const setListening = (val) => {
    isListeningRef.current = val;
    setIsListening(val);
  };

  // --- Speak Function ---
  const speak = useCallback((text) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    if (/[त-ह]/.test(text)) utterance.lang = 'hi-IN';
    else if (/[அ-ஹ]/.test(text)) utterance.lang = 'ta-IN';
    else utterance.lang = 'en-IN';

    utterance.onstart = () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
      setStatusText("Assistant Speaking...");
    };

    utterance.onend = () => {
      setTimeout(() => {
        // ✅ Fix 1: use ref instead of state variable
        if (recognitionRef.current && isListeningRef.current) {
          try { recognitionRef.current.start(); } catch(e) {}
        }
        setStatusText("Listening for Command...");
      }, 500);
    };

    window.speechSynthesis.speak(utterance);
  }, []); // ✅ Fix 2: no isListening dependency

  // --- Recognition Logic ---
  const initRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatusText("Speech not supported in this browser");
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setListening(true); // ✅ Fix 1: use setListening
        setStatusText("Awaiting Voice Input...");
      };

      recognition.onresult = async (event) => {
        const command = event.results[event.results.length - 1][0].transcript;
        console.log("Input Log:", command);
        setStatusText("Thinking...");

        try {
          const { data } = await axios.post(
            `${serverUrl}/api/user/ask`,
            { command },
            { withCredentials: true }
          );

          speak(data.response);

          const actions = {
            google_search: () => window.open(`https://www.google.com/search?q=${data.userinput}`, "_blank"),
            youtube_search: () => window.open(`https://www.youtube.com/results?search_query=${data.userinput}`, "_blank"),
            youtube_play: () => window.open(`https://www.youtube.com/results?search_query=${data.userinput}`, "_blank"),
            weather_show: () => window.open(`https://www.google.com/search?q=weather+${data.userinput}`, "_blank"),
            instagram_open: () => window.open("https://www.instagram.com", "_blank"),
            facebook_open: () => window.open("https://www.facebook.com", "_blank"),
            calculator_open: () => window.open("https://www.google.com/search?q=calculator", "_blank"),
          };

          if (actions[data.type]) {
            setTimeout(() => actions[data.type](), 2000);
          }
        } catch (err) {
          setStatusText("Neural Link Error");
          console.error("Pipeline Error:", err.response?.data || err.message);
          speak("Sorry, I had trouble processing that.");
        }
      };

      recognition.onerror = (event) => {
        console.error("Recognition error:", event.error);
        if (event.error === "not-allowed") {
          setStatusText("Microphone access denied");
        }
      };

      recognition.onend = () => {
        // ✅ Fix 1: use ref to check real current value
        if (isListeningRef.current) {
          setTimeout(() => {
            try { recognition.start(); } catch(e) {}
          }, 300);
        }
      };

      recognitionRef.current = recognition;
    }

    setListening(true);
    try { recognitionRef.current.start(); } catch(e) {}
  }, [serverUrl, speak]); // ✅ Fix 2: no isListening dependency

  // ✅ Fix 3: only run once on mount
  useEffect(() => {
    if (userData?.assistantName && !hasInitialized.current) {
      hasInitialized.current = true;
      initRecognition();
      speak(`Initializing ${userData.assistantName}. All systems online.`);
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      window.speechSynthesis.cancel();
      setListening(false);
    };
  }, []); // ✅ Fix 3: empty dependency array — runs once only

  // --- Logout ---
  const handleLogout = async () => {
    try {
      window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setListening(false);

      await axios.post(`${serverUrl}/api/auth/logout`, {}, { withCredentials: true });
      setUserData(null);
      navigate('/signin');
    } catch (error) {
      console.error("Logout failed:", error);
      setUserData(null);
      navigate('/signin');
    }
  };

  if (!userData) return (
    <div className="h-screen bg-[#030353] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
    </div>
  );

  return (
    <div className="w-full h-screen bg-[#030353] flex flex-col items-center justify-center text-white p-10 relative overflow-hidden font-sans">

      {/* Background Decor */}
      <div className="absolute top-[-15%] left-[-15%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] bg-cyan-600/10 blur-[150px] rounded-full"></div>

      {/* Top Navigation */}
      <div className="absolute top-10 w-full px-10 flex justify-between items-center z-20">
        <button
          onClick={() => navigate('/customize')}
          className="glass-effect px-6 py-2 rounded-full text-sm border border-white/10 hover:bg-white/5 transition-all"
        >
          Change Assistant
        </button>
        <button
          onClick={handleLogout}
          className="px-6 py-2 rounded-full text-sm text-red-300 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all"
        >
          Logout
        </button>
      </div>

      {/* Assistant Visualizer */}
      <div className="relative group cursor-default">
        <div className={`absolute -inset-12 rounded-full blur-[100px] opacity-30 transition-all duration-1000
          ${isListening ? 'bg-cyan-400' : 'bg-blue-900'}`}></div>
        <div className="absolute -inset-2 rounded-full border border-cyan-400/20 animate-pulse-slow"></div>

        <img
          src={userData.assistantImage}
          alt="Core Intelligence"
          className={`relative w-72 h-72 rounded-full object-cover border-2 transition-all duration-700
            ${isListening ? 'border-cyan-400 scale-105 shadow-[0_0_50px_rgba(34,211,238,0.2)]' : 'border-white/10'}`}
        />
      </div>

      <div className="text-center z-10 mt-12">
        <h1 className="text-6xl font-black tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
          {userData.assistantName}
        </h1>
        <p className="mt-4 text-sm font-mono tracking-widest text-cyan-400/80 uppercase">
          STATUS: {statusText}
        </p>
      </div>

      {/* Waveform Visualizer */}
      <div className="flex gap-2 mt-16 h-20 items-center">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`w-1 bg-cyan-400 rounded-full transition-all duration-300 ${isListening ? 'animate-wave' : 'opacity-20 h-2'}`}
            style={{
              animationDelay: `${i * 0.05}s`,
              height: isListening ? `${Math.random() * 80 + 20}%` : '8px'
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Home;
