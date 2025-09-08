import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { jwtDecode } from "jwt-decode";
import UserList from "./UserList";
import BlogList from "./BlogList";
import PortfolioList from "./PortfolioList";
import TestimonialsList from "./testimonialsList";
import UserCreate from "./UserCreate";
import G1260 from "../assets/G1260.svg";
import Group1171274824 from "../assets/Group 1171274824.svg";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [userName, setUserName] = useState();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    // Get user details from local storage
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.permissions) {
      setPermissions(userData.permissions);
      console.log("Permissions", userData.permissions);
      setUserName(userData.name); // Store user name
    } else {
      navigate("/");
    }
  }, [token, navigate]);

  const hasPermission = (permission) =>
    Array.isArray(permissions) && permissions.includes(permission);

  // Fetch Users
  const fetchUsers = async () => {
    if (!token) {
      setError("❌ No authentication token found. Please log in.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://admin.estonsoft.com/users/", {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error fetching users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = async (section) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      if (section === "usersList") {
        await fetchUsers();
      }
      setActiveSection(section);
    }
  };

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      // Remove token from local storage
      localStorage.removeItem("token");

      window.location.href = "/";

      alert("You have been signed out.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">
          <img src={G1260} alt="Logo" />
          <img src={Group1171274824} alt="LogoText" />
        </h2>
        <p className="welcome-loged-in-user text-white text-lg font-semibold mb-2">Welcome, {userName} 👋</p>
        <div className="mt-[60px]">
          <ul>
            {hasPermission("view_users") && (
              <li onClick={() => toggleSection("usersList")}>
                {activeSection === "usersList" ? "👥 User" : "👥 User"}
              </li>
            )}
            {hasPermission("view_blogs") && (
              <li onClick={() => toggleSection("blog")}>
                {activeSection === "blog" ? "➖ Blog" : "📝 Blog"}
              </li>
            )}
            {hasPermission("view_portfolio") && (
              <li onClick={() => toggleSection("portfolio")}>
                {activeSection === "portfolio"
                  ? "➖ Portfolio"
                  : "📁 Portfolio"}
              </li>
            )}
            {hasPermission("view__testimonial") && (
              <li onClick={() => toggleSection("testimonial")}>
                {activeSection === "testimonial"
                  ? "➖ Testimonial"
                  : "💬 Testimonial"}
              </li>
            )}
            <li onClick={handleSignOut}>🚪 Sign Out</li>
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {error && <p className="error">{error}</p>}

        {activeSection === "user" && (
          <UserCreate
            token={token}
            fetchUsers={fetchUsers}
            setActiveSection={setActiveSection}
          />
        )}

        {activeSection === "blog" && <BlogList />}
        {/* {activeSection === "blog" && <BlogCreate />} */}
        {activeSection === "portfolio" && <PortfolioList />}
        {/* {activeSection === "portfolio" && <PortfolioCreate />} */}
        {activeSection === "testimonial" && <TestimonialsList />}
        {/* {activeSection === "testimonial" && <TestimonialCreate />} */}
        {activeSection === "usersList" &&
          (isLoading ? <p>Loading users...</p> : <UserList users={users} />)}

        {/* <BlogList />
        <PortfolioList />
        <TestimonialsList /> */}
      </div>
    </div>
  );
};

export default Dashboard;
