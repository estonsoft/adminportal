import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./styles.css"; // Import styles

const availablePermissions = [
  "create_user",
  "delete_user",
  "update_user",
  "view_users",
  "create_blog",
  "update_blog",
  "delete_blog",
  "read_blog",
  "create_portfolio",
  "update_portfolio",
  "delete_portfolio",
  "read_portfolio",
  "create_testimonial",
  "update_testimonial",
  "delete_testimonial",
  "read_testimonial",
];

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    permissions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        alert("Unauthorized! Please log in.");
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`http://213.210.37.58/users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch user details.");
        }

        const data = await response.json();
        setUser(data); // Store user details
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, token, navigate]);

  // Handle permission selection
  const handlePermissionChange = (permission) => {
    setUser((prevUser) => ({
      ...prevUser,
      permissions: prevUser.permissions.includes(permission)
        ? prevUser.permissions.filter((p) => p !== permission) // Remove
        : [...prevUser.permissions, permission], // Add
    }));
  };

  // Handle form submission (Update Permissions)
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!token) {
      alert("❌ Unauthorized! Please log in.");
      return;
    }
  
    try {
      const response = await fetch(`http://213.210.37.58/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name, // Required
          email: user.email, // Required
          password: user.password || "", // Optional (empty string if not provided)
          permissions: user.permissions, // Only this is updated
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error updating user.");
      }
  
      alert("✅ Permissions updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };
  

  return (
    <div className="form-container">
      <h2>Edit User Permissions</h2>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" value={user.name} readOnly />
          <input type="email" name="email" value={user.email} readOnly />

          {/* Permissions Selection */}
          <div className="permissions-container">
            <label>Permissions:</label>
            {availablePermissions.map((perm) => (
              <label key={perm} className="permission-item">
                <input
                  type="checkbox"
                  value={perm}
                  checked={user.permissions.includes(perm)}
                  onChange={() => handlePermissionChange(perm)}
                />
                {perm}
              </label>
            ))}
          </div>

          <button type="submit" className="submit-btn">
            Update Permissions
          </button>
        </form>
      )}
      <Link to="/dashboard" className="back-btn">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default UserDetails;
