import {
  Eye,
  EyeOff,
  LogIn,
  Lock,
  User,
  Loader,
} from "lucide-react";
import React, { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { decryptData, encryptData } from "../utils/cryptoUtils";
import { useNavigate } from "react-router-dom";
import { Auth_RESPONSE_STRUCTURE } from "../utils/Auth/dummyData";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/Slice/SidebarMenu";
const LoginPage = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  /**
   * Prefill username/password ONLY if Remember Me data exists
   */
  useEffect(() => {
    const savedEncrypted = localStorage.getItem("rememberedLogin");

    if (!savedEncrypted) return;

    try {
      const savedData = decryptData(savedEncrypted);

      if (savedData?.username && savedData?.password) {
        setUserName(savedData.username);
        setPassword(savedData.password);
        setRememberMe(true);
      }
    } catch (err) {
      console.error("Decryption failed:", err);
      localStorage.removeItem("rememberedLogin");
    }
  }, []);

  /**
   * Clear stored credentials immediately if Remember Me is unchecked
   */
  useEffect(() => {
    if (!rememberMe) {
      localStorage.removeItem("rememberedLogin");
    }
  }, [rememberMe]);

  /**
   * Login Handler
   */
  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      // Simulated API delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (
        username === Auth_RESPONSE_STRUCTURE.User_Approval_Name &&
        password === Auth_RESPONSE_STRUCTURE.Password_User
      ) {
        toast.success("Login successful!");

        localStorage.setItem(
          "tbgs_access_token",
          JSON.stringify(Auth_RESPONSE_STRUCTURE)
        );
          // Dispatch user data to Redux store
        dispatch(setUserData(Auth_RESPONSE_STRUCTURE));

        // Save credentials only if Remember Me is checked
        if (rememberMe) {
          localStorage.setItem(
            "rememberedLogin",
            encryptData({ username, password })
          );
        }
        
        navigate("/");
      } else {
        setError("Invalid username or password");
        toast.error("Invalid username or password");
      }

      setLoading(false);
    },
    [username, password, rememberMe, navigate]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-200 transition duration-500 hover:shadow-xl hover:shadow-indigo-400/30">
          {/* Header */}
          <div className="flex flex-col items-center">
            <LogIn className="w-12 h-12 text-indigo-700 mb-4 p-2 bg-indigo-100 rounded-xl" />
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Admin Portal Login
            </h2>
            <p className="text-sm text-gray-500">
              Access the administrative control panel
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {/* Username */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                User Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-700" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-700 transition disabled:bg-gray-50"
                  placeholder="Enter your user name"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-700" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-700 transition disabled:bg-gray-50"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-indigo-500 w-3 h-3 scale-125"
                />
                <label className="ml-2 text-sm text-indigo-700 font-medium">
                  Remember me
                </label>
              </div>

              <a
                href="#"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 rounded-xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:bg-indigo-400"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin  h-5 w-5 border-white mr-3"/>
                  Authenticating...
                </>
              ) : (
                "Login"
              )}
            </button>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-center font-medium">{error}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
