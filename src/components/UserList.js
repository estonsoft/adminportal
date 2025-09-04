import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserCreate from "./UserCreate"; // Import UserCreate component
import "./styles.css"; // Import the CSS file

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.permissions) {
      setPermissions(userData.permissions);
    }
    fetchUsers(); // Fetch users on mount
  }, []);

  const hasPermission = (permission) => permissions.includes(permission);

  // Function to fetch users
  const fetchUsers = async () => {
    if (!token) {
      setError("❌ Unauthorized! Please log in.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost/new.php/users", {
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
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!token) {
      alert("Unauthorized! Please login.");
      return;
    }

      try {
        const response = await fetch(`http://localhost/new.php/users/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to delete user.");
        }

        alert("✅ User deleted successfully!");
        fetchUsers(); // Refresh list after deletion
      } catch (err) {
        alert(err.message);
      }
  };

  return (
    <div>
      <h1 className="heading">Users</h1>

      {/* Toggle "Create User" Button */}
      {hasPermission("create_user") && (
        <button className="create-btn" onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? "➖ Close" : "👤 Create User"}
        </button>
      )}

      {/* Show UserCreate form when toggled */}
      {showCreateForm && <UserCreate token={token} fetchUsers={fetchUsers} setShowCreateForm={setShowCreateForm} />}

      {error && <p className="error">{error}</p>}
      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Name</th>
              <th>Email</th>
              <th>Permissions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.permissions ? user.permissions.join(", ") : "No permissions"}</td>
                <td>
                  <button onClick={() => handleDelete(user.id)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
