// src/components/AuthWatcher.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSidebarMenu } from "../hooks/useSidebarMenu"; // Update import

const AuthWatcher = () => {
  const { userData } = useSidebarMenu(); // Use Redux state
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate("/login", { replace: true });
    }
  }, [userData, navigate]);

  return null;
};

export default AuthWatcher;