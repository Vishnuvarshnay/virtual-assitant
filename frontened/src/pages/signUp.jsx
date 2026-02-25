import React, { useState, useContext, useEffect } from 'react';
import bg from '../assets/authBg.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/userContext';
import axios from 'axios';

function SignUp() {
  const navigate = useNavigate();
  const { serverUrl, userData } = useContext(userDataContext);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      navigate('/');
    }
  }, [userData, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await axios.post(`${serverUrl}/api/auth/signup`, {
        name, email, password
      }, { withCredentials: true });

      if (response.status === 201) {
        alert("Registration Successful! Please Login.");
        navigate('/signin');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 'relative' class yahan zaroori hai arrow positioning ke liye
    <div className='w-full h-screen bg-cover bg-center flex justify-center items-center relative' style={{ backgroundImage: `url(${bg})` }}>
      
      {/* --- BACK ARROW BUTTON --- */}
      <button 
        onClick={() => navigate('/signin')} 
        className="absolute top-10 left-10 text-white/50 hover:text-white transition-all flex items-center gap-2 z-20 font-medium group"
      >
        <span className='text-2xl group-hover:-translate-x-1 transition-transform'>←</span> 
        Back to Login
      </button>

      <form onSubmit={handleSubmit} className='w-[90%] h-auto py-[40px] max-w-[500px] bg-black/40 backdrop-blur-md shadow-2xl shadow-black flex flex-col items-center justify-center gap-[15px] px-[30px] rounded-2xl'>
        <h1 className='text-white text-[30px] font-semibold mb-[5px] text-center'>Register</h1>

        {errorMessage && (
          <div className='w-full bg-red-500/20 border border-red-500 text-red-200 text-sm py-2 px-4 rounded-lg text-center'>{errorMessage}</div>
        )}

        <input type="text" placeholder='Name' value={name} required onChange={(e) => setName(e.target.value)} className='w-full h-[55px] outline-none border-2 border-white/50 bg-transparent px-[20px] text-white rounded-full focus:border-blue-400 transition-all' />
        <input type="email" placeholder='Email' value={email} required onChange={(e) => setEmail(e.target.value)} className='w-full h-[55px] outline-none border-2 border-white/50 bg-transparent px-[20px] text-white rounded-full focus:border-blue-400 transition-all' />
        
        <div className='w-full relative'>
          <input type={showPassword ? "text" : "password"} placeholder='Password' value={password} required onChange={(e) => setPassword(e.target.value)} className='w-full h-[55px] outline-none border-2 border-white/50 bg-transparent px-[20px] text-white rounded-full focus:border-blue-400 transition-all' />
          <div className='absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-white/70 hover:text-white text-xl' onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading} 
          className={`w-full h-[55px] text-white font-bold text-[18px] rounded-full transition-all mt-[5px] ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className='text-white text-[16px]'>Already have an account? <Link to="/signin" className='text-blue-400 font-semibold hover:underline'>Login</Link></p>
      </form>
    </div>
  );
}

export default SignUp;