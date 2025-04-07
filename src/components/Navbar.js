import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import "./styles.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <h1 onClick={() => navigate("/dashboard")}>Estonsoft</h1>

        {token ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={() => setIsLoginOpen(true)}>Login</button>
        )}
      </nav>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="modal-bg">
          <div className="modal">
            <Login
              onClose={() => setIsLoginOpen(false)}
              onLoginSuccess={() => {
                setIsLoginOpen(false);
                navigate("/dashboard");
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
