import React, { useState, useContext, useEffect } from 'react';
import bg from '../assets/authBg.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';

function SignIn() {
  const navigate = useNavigate();
  const { serverUrl, handleCurrentUser, userData } = useContext(userDataContext);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // REDIRECT LOGIC: Agar user logged in hai toh Home page bhej do
  useEffect(() => {
    if (userData) {
      navigate('/');
    }
  }, [userData, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${serverUrl}/api/auth/signin`, {
        email, 
        password
      }, { 
        withCredentials: true 
      });

      if (response.status === 200) {
        alert("Login Successful!");
        
        if (handleCurrentUser) {
            await handleCurrentUser(); 
        }
        
        navigate('/');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Invalid credentials or server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 'relative' class add ki gayi hai taaki button corner mein set ho sake
    <div 
      className='w-full h-screen bg-cover bg-center flex justify-center items-center relative' 
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* --- BACK ARROW BUTTON --- */}
      <button 
        onClick={() => navigate('/signup')} 
        className="absolute top-10 left-10 text-white/50 hover:text-white transition-all flex items-center gap-2 z-20 font-medium group"
      >
        <span className='text-2xl group-hover:-translate-x-1 transition-transform'>←</span> 
        Back
      </button>

      <form 
        onSubmit={handleSubmit} 
        className='w-[90%] h-auto py-[40px] max-w-[500px] bg-black/40 backdrop-blur-md shadow-2xl shadow-black flex flex-col items-center justify-center gap-[15px] px-[30px] rounded-2xl'
      >
        <h1 className='text-white text-[30px] font-semibold mb-[5px] text-center'>Login</h1>

        {errorMessage && (
          <div className='w-full bg-red-500/20 border border-red-500 text-red-200 text-sm py-2 px-4 rounded-lg text-center'>
            {errorMessage}
          </div>
        )}

        <input 
          type="email" 
          placeholder='Enter your Email' 
          value={email} 
          required 
          onChange={(e) => setEmail(e.target.value)} 
          className='w-full h-[55px] outline-none border-2 border-white/50 bg-transparent px-[20px] text-white rounded-full focus:border-blue-400 transition-all' 
        />
        
        <div className='w-full relative'>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder='Enter your Password' 
            value={password} 
            required 
            onChange={(e) => setPassword(e.target.value)} 
            className='w-full h-[55px] outline-none border-2 border-white/50 bg-transparent px-[20px] text-white rounded-full focus:border-blue-400 transition-all' 
          />
          <div 
            className='absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-white/70 hover:text-white text-xl' 
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading} 
          className={`w-full h-[55px] text-white font-bold text-[18px] rounded-full transition-all mt-[5px] 
            ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {isLoading ? "Verifying..." : "Login"}
        </button>

        <p className='text-white text-[16px]'>
          Don't have an account? {' '}
          <Link to="/signup" className='text-blue-400 font-semibold hover:underline'>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignIn;
