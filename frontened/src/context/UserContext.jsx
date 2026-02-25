import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Context create kiya taaki data poore app mein available ho
export const userDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = "https://virtual-assitant-backened.onrender.com"; //
  const [userData, setUserData] = useState(null); //

  // Function jo backend se current logged-in user ka data lata hai
  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true //
      });
      
      console.log("🔥 FULL USER DATA FETCHED:", result.data);
      setUserData(result.data); //
      
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("No active session (User is not logged in)"); //
      } else {
        console.log("Error fetching user data:", error); //
      }
      setUserData(null);
    }
  };

  // App load hote hi user data check karein
  useEffect(() => {
    handleCurrentUser();
  }, []);

  // Jab bhi userData update ho, console par dekhein (Debugging ke liye)
  useEffect(() => {
    if (userData) {
      console.log("✅ Current User State Updated:", userData);
    }
  }, [userData]);

  // Yeh values poore app mein export hongi
  const value = { serverUrl, userData, setUserData, handleCurrentUser };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
