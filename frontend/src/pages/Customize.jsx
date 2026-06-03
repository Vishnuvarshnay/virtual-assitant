import React, { useState, useContext, useEffect } from 'react'
import Card from '../components/Card'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../context/UserContext'
import bg from "../assets/authBg.png"
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.jpeg"
import image7 from "../assets/image7.jpeg"

function Customize() {
  const navigate = useNavigate();
  const { userData, isLoading } = useContext(userDataContext);

  const [assistantImages] = useState([image1, image2, image4, image5, image6, image7]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!isLoading && !userData) {
      navigate('/signin');
    }
  }, [userData, isLoading, navigate]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) return <div className="text-white">Loading...</div>;

  return (
    <div className='w-full min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4 relative' style={{ backgroundImage: `url(${bg})` }}>
      
      {/* --- GO BACK BUTTON (GOOGLE STYLE) --- */}
      <button 
        onClick={() => navigate(-1)} // Yeh exactly pichle page par bhej dega
        className="absolute top-10 left-10 text-white/50 hover:text-white transition-all flex items-center gap-2 z-20 font-medium group"
      >
        <span className='text-2xl group-hover:-translate-x-1 transition-transform'>←</span> 
        Go Back
      </button>

      <div className='absolute inset-0 bg-black/60'></div>

      <div className='relative z-10 w-full flex flex-col items-center gap-6 py-10'>
        <div className='text-center'>
          <h1 className='text-white text-3xl font-bold tracking-tight'>
            Customize Your <span className='text-blue-500'>Assistant</span>
          </h1>
          {previewUrl && (
            <div className='mt-4 flex flex-col items-center animate-fade-in'>
              <img 
                src={previewUrl} 
                className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover shadow-[0_0_20px_rgba(59,130,246,0.4)]" 
                alt="Preview" 
              />
              <p className='text-blue-400 text-xs mt-2'>Looks Great!</p>
            </div>
          )}
        </div>

        <label htmlFor="upload-photo" className="cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3 rounded-full font-bold transition-all active:scale-95 shadow-lg">
          {selectedFile ? "Change Photo" : "+ Upload Your Photo"}
        </label>
        <input type="file" id="upload-photo" className="hidden" accept="image/*" onChange={handlePhotoUpload} />

        <Card 
          images={assistantImages} 
          selectedFile={selectedFile} 
          setSelectedFile={setSelectedFile} 
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl} 
        />
      </div>
    </div>
  )
}

export default Customize;
