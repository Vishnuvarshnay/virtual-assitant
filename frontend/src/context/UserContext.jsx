import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const userDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = import.meta.env.VITE_SERVER_URL || "https://virtual-assitant-backened-vtwx.onrender.com";
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true
      });

      setUserData(result.data);

    } catch (error) {
      if (error.response?.status === 401) {
        console.log("No active session (User is not logged in)");
      } else {
        console.error("Error fetching user data:", error.message);
      }
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }, [serverUrl]);

  useEffect(() => {
    handleCurrentUser();
  }, [handleCurrentUser]);

  useEffect(() => {
    if (userData) {
      console.log("✅ Current User State Updated:", userData);
    }
  }, [userData]);

  const value = {
    serverUrl,
    userData,
    setUserData,
    handleCurrentUser,
    loading
  };

  if (loading) {
    return null;
  }

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
