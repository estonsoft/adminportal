import React, { useState } from "react";

const PortfolioEdit = ({ portfolio, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    title: portfolio?.title || "",
    description: portfolio?.description || "",
    image: portfolio?.image || "",
    link: portfolio?.link || "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.link) {
      setError("Title, description, and link are required.");
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
      <h2>Edit Portfolio</h2>
      {error && <p className="error">{error}</p>}
      
      <div className="form-field">
        <label className="field-label">Title</label>
        <input
          type="text"
          name="title"
          placeholder="Enter portfolio title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-field">
        <label className="field-label">Description</label>
        <textarea
          name="description"
          placeholder="Enter portfolio description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="blog-image-section">
        <label className="image-label">Portfolio Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
        />
        {formData.image && (
          <div className="current-image-preview">
            <p className="current-image-text">Current image:</p>
            <img 
              src={formData.image} 
              alt="Current portfolio" 
              style={{width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px"}}
            />
          </div>
        )}
      </div>
      
      <div className="form-field">
        <label className="field-label">Portfolio Link</label>
        <input
          type="url"
          name="link"
          placeholder="Enter portfolio link"
          value={formData.link}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-buttons">
        <button type="submit" className="submit-btn">
          Update Portfolio
        </button>
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PortfolioEdit;