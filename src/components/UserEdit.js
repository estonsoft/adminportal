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

const UserEdit = ({ user, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    permissions: user?.permissions || [],
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePermissionChange = (permission) => {
    setFormData((prevData) => ({
      ...prevData,
      permissions: prevData.permissions.includes(permission)
        ? prevData.permissions.filter((p) => p !== permission)
        : [...prevData.permissions, permission],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      setError("Name and email are required.");
      return;
    }

    try {
      await onUpdate(formData);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Edit User</h2>
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

      <div className="permissions-container">
        <label>Permissions:</label>
        <div className="permissions-list">
          {availablePermissions.map((perm) => (
            <div key={perm} className="permission-item">
              <label className="permission-label" htmlFor={`perm-${perm}`}>
                {perm}
              </label>
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

      <div className="form-buttons">
        <button type="submit" className="submit-btn">
          Update User
        </button>
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserEdit;