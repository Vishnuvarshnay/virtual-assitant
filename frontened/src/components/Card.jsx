import React, { useState, useContext } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Card({ images, selectedFile, setSelectedFile, previewUrl, setPreviewUrl }) {
  const { serverUrl, handleCurrentUser } = useContext(userDataContext);
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [selectedImg, setSelectedImg] = useState(null); 
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    if (!name) return alert("Please enter a name!");
    if (!selectedImg && !selectedFile) return alert("Please select or upload an image!");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('assistantName', name);

      if (selectedFile) {
        formData.append('assistantImage', selectedFile); 
      } else {
        formData.append('assistantImage', selectedImg); 
      }

      const response = await axios.post(`${serverUrl}/api/user/setup`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      if (response.status === 200) {
        await handleCurrentUser(); // Refresh context data
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error saving setup. Please check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleGridSelect = (img) => {
    setSelectedImg(img);    // Select from library
    setSelectedFile(null);  // Clear binary file
    setPreviewUrl(null);    // Clear top preview image
  };

  return (
    <div className='bg-black/70 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] shadow-2xl w-full max-w-[420px] flex flex-col items-center gap-6'>
      <h2 className='text-white text-2xl font-bold'>Assistant Identity</h2>
      
      <input 
        type="text" 
        placeholder="Assistant Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all' 
      />
      
      <div className='w-full'>
        <p className='text-white/50 text-xs mb-2 uppercase tracking-widest'>Library Selection</p>
        <div className='grid grid-cols-3 gap-3 max-h-[180px] overflow-y-auto p-1 custom-scrollbar'>
          {images.map((img, i) => (
            <div key={i} onClick={() => handleGridSelect(img)} 
              className={`cursor-pointer aspect-square rounded-xl overflow-hidden border-4 transition-all duration-300 
              ${selectedImg === img ? 'border-blue-500 scale-105' : 'border-transparent opacity-50 hover:opacity-100'}`}>
              <img src={img} className='w-full h-full object-cover' alt="avatar" />
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSetup} disabled={loading}
        className={`w-full py-4 rounded-xl font-bold text-white uppercase tracking-widest transition-all ${loading ? 'bg-zinc-700 text-zinc-500' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20 active:scale-95'}`}>
        {loading ? "Syncing..." : "Finalize Setup"}
      </button>
    </div>
  );
}

export default Card;
