import React, { useState } from "react";

const availablePermissions = [
  "create_user",
  "view_users",
  "update_user",
  "delete_user",
  "create_blog",
  "update_blog",
  "delete_blog",
  "view_blogs",
  "create_portfolio",
  "update_portfolio",
  "delete_portfolio",
  "view_portfolio",
  "create_testimonial",
  "update_testimonial",
  "delete_testimonial",
  "view__testimonial",
];

const UserCreate = ({ token, fetchUsers, setActiveSection }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    permissions: [],
  });

  const [error, setError] = useState("");

  // Handle Form Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Permission Selection
  const handlePermissionChange = (permission) => {
    setFormData((prevData) => ({
      ...prevData,
      permissions: prevData.permissions.includes(permission)
        ? prevData.permissions.filter((p) => p !== permission)
        : [...prevData.permissions, permission],
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("❌ Unauthorized! Please log in.");
      return;
    }

    try {
      const response = await fetch("https://estonsoft.com/users", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error creating user.");
      }

      alert("✅ User created successfully!");
      setActiveSection(null);
      fetchUsers();
      setFormData({
        name: "",
        email: "",
        password: "",
        permissions: [],
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Create User</h2>
      {error && <p className="error">{error}</p>}
      
      <div className="form-field">
        <label className="field-label">Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter full name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-field">
        <label className="field-label">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter email address"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-field">
        <label className="field-label">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
<div className="permissions-container">
  <label>Permissions:</label>
  <div className="permissions-list">
    {availablePermissions.map((perm) => (
      <div key={perm} className="permission-item">
        <label className="permission-label" htmlFor={`perm-${perm}`}>{perm}</label>
        <input
          id={`perm-${perm}`}
          type="checkbox"
          value={perm}
          checked={formData.permissions.includes(perm)}
          onChange={() => handlePermissionChange(perm)}
        />
      </div>
    ))}
  </div>
</div>


      <button type="submit" className="submit-btn">
        Submit
      </button>
    </form>
  );
};

export default UserCreate;
