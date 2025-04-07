import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import G1260 from "../assets/G1260.svg";
import Group1171274824 from "../assets/Group 1171274824.svg";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true);
  
    try {
      const response = await fetch("http://213.210.37.58/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      console.log("Login Response:", response); // Log full response object
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "❌ Login failed!");
      }
  
      const data = await response.json();
      if (!data.token) {
        throw new Error("No token received from server");
      }
      console.log("Login Response Body:", data); // Log body content
  
      // ✅ Store token first
      localStorage.setItem("token", data.token);
  
      // ✅ Now call `/me/` to fetch user details
      fetchUserDetails();
  
    } catch (err) {
      console.error("Login Error:", err); // Log error clearly
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // fetch user details using stored token
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const userResponse = await fetch("http://213.210.37.58/auth/me/", {
        method: "GET",
        headers: {
          "Authorization": `${token}`, 
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
  
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user details");
      }
  
      const userData = await userResponse.json();
      localStorage.setItem("user", JSON.stringify(userData)); // user info
  
      navigate("/dashboard"); // Redirect after fetching user data
  
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError(err.message);
    }
  };
  
  


  return (
    <div className="relative w-screen h-screen bg-[#070D34] flex items-center justify-center font-['Roboto']">
      {/* Logo & Text */}
      <div className="absolute top-[21px] left-[90px] flex items-center">
        <img src={G1260} alt="Logo" className="w-[29px] h-[29px]" />
        <img
          src={Group1171274824}
          alt="LogoText"
          className="w-[131px] h-[25px] ml-[2px]"
        />
      </div>
  
      {/* Sign-In Form Container */}
      <div className="p-10 rounded-lg shadow-lg w-[544px]">
        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <input
              type="email"
              className="w-[544px] h-[85px] p-3 border border-gray-300 rounded-[11px]"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-2">
            <input
              type="password"
              className="w-[544px] h-[85px] p-3 border border-gray-300 rounded-[11px]"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
  
          <div className="flex justify-end mt-2 mb-5">
            <a
              href="#"
              className="text-white text-[14px] leading-[142%] tracking-[1%] font-roboto font-normal"
            >
              Forgot Password?
            </a>
          </div>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
  
          <button
            type="submit"
            className="w-[544px] h-[79px] bg-[#274266] text-white rounded-[11px] text-lg font-semibold"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
  
};

export default SignIn;
