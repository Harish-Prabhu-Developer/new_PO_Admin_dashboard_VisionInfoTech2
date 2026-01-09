import { useState, useEffect } from "react";

const TOKEN_KEY = "tbgs_access_token";

const useUserData = () => {
  const [UserData, setUserData] = useState(
    () => localStorage.getItem(TOKEN_KEY) || ""
  );

  // Listen for token changes (multi-tab support)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem(TOKEN_KEY);
      setUserData(token || "");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const setUser = (newUserData) => {
    setUserData(newUserData);
    localStorage.setItem(TOKEN_KEY, newUserData);
  };

  const clearUser = () => {
    setUserData("");
    localStorage.removeItem(TOKEN_KEY);
  };

  return { UserData, setUser, clearUser };
};

export default useUserData;
