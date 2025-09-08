import React, { useState } from "react";

const availableTags = [
  "Tech",
  "Health",
  "Education",
  "Entertainment",
  "Sports",
];

const BlogEdit = ({ blog, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    title: blog?.title || "",
    image: blog?.image || "",
    paragraph: blog?.paragraph || "",
    content: blog?.content || "",
    authorName: blog?.authorName || "",
    authorImage: blog?.authorImage || "",
    authorDesignation: blog?.authorDesignation || "",
    tags: blog?.tags || [],
    publishDate: blog?.publishDate || "",
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

  const handleAuthorImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, authorImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagChange = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (
      !formData.title ||
      !formData.paragraph ||
      !formData.content ||
      !formData.authorName ||
      !formData.authorImage ||
      !formData.authorDesignation ||
      !formData.publishDate
    ) {
      setError("All fields are required.");
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
    <div className="form-container">
      <h2>Edit Blog</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="field-label">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter blog title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="blog-image-section">
          <label className="image-label">Blog Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />
          {formData.image && (
            <div className="image-preview">
              <img src={formData.image} alt="Blog preview" style={{maxWidth: '200px', maxHeight: '200px'}} />
            </div>
          )}
        </div>
        
        <div className="form-field">
          <label className="field-label">Short Paragraph</label>
          <textarea
            name="paragraph"
            placeholder="Enter a brief description"
            value={formData.paragraph}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-field">
          <label className="field-label">Full Content</label>
          <textarea
            name="content"
            placeholder="Enter the complete blog content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-field">
          <label className="field-label">Author Name</label>
          <input
            type="text"
            name="authorName"
            placeholder="Enter author's name"
            value={formData.authorName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label className="field-label">Author Designation</label>
          <input
            type="text"
            name="authorDesignation"
            placeholder="Enter author's designation"
            value={formData.authorDesignation}
            onChange={handleChange}
          />
        </div>

        <div className="author-image-section">
          <label className="image-label">Author Image</label>
          <input
            type="file"
            name="authorImage"
            accept="image/*"
            onChange={handleAuthorImageChange}
          />
          {formData.authorImage && (
            <div className="image-preview">
              <img src={formData.authorImage} alt="Author preview" style={{maxWidth: '100px', maxHeight: '100px', borderRadius: '50%'}} />
            </div>
          )}
        </div>

        <div className="form-field">
          <label className="field-label">Publish Date</label>
          <input
            type="date"
            name="publishDate"
            value={formData.publishDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="tags-container">
          <label>Tags:</label>
          <div className="tags-list">
            {availableTags.map((tag) => (
              <div key={tag} className="tag-item">
                <label className="tag-label" htmlFor={`tag-${tag}`}>
                  {tag}
                </label>
                <input
                  id={`tag-${tag}`}
                  type="checkbox"
                  value={tag}
                  checked={formData.tags.includes(tag)}
                  onChange={() => handleTagChange(tag)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            Update Blog
          </button>
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogEdit;