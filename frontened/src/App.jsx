import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { userDataContext } from './context/userContext'
import SignIn from './pages/signIn'
import SignUp from './pages/signUp'
import Customize from './pages/Customize'
import Home from './pages/Home'

function App() {
  const { userData, isLoading } = useContext(userDataContext);

  // Jab tak backend se user check ho raha hai, tab tak loader dikhayein
  if (isLoading) return <div className='h-screen w-full bg-[#030353] flex items-center justify-center text-white'>Loading...</div>;

  return (
    <Routes>
      {/* 1. ROOT PATH LOGIC: Sabse pehle user yahan aayega */}
      <Route path='/' element={
        userData 
          ? (userData.assistantName && userData.assistantImage 
              ? <Home /> 
              : <Navigate to="/customize" replace />) 
          : <Navigate to="/signup" replace /> // Naya user hamesha signup par jaye
      } />

      {/* 2. SIGNUP: Sirf un-authenticated users ke liye */}
      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to="/" replace />} />

      {/* 3. SIGNIN: Sirf un-authenticated users ke liye */}
      <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to="/" replace />} />

      {/* 4. CUSTOMIZE: Sirf logged in users ke liye jinka setup bacha hai */}
      <Route path='/customize' element={
        userData ? <Customize /> : <Navigate to="/signin" replace />
      } />

      {/* 5. HOME: Protection taaki direct URL se koi setup skip na kare */}
      <Route path='/home' element={
        (userData && userData.assistantName) 
          ? <Home /> 
          : <Navigate to="/" replace />
      } />

      {/* Fallback: Sab anjaan links root par bhejien */}
      <Route path='*' element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App;