import React, { useState, useEffect } from "react";
import "./styles.css";

const TestimonialEdit = ({ testimonial, onUpdate, onCancel }) => {
  const [editTestimonial, setEditTestimonial] = useState({
    star: 5,
    name: "",
    image: "",
    content: "",
    designation: "",
  });

  useEffect(() => {
    if (testimonial) {
      setEditTestimonial({
        star: testimonial.star || 5,
        name: testimonial.name || "",
        image: testimonial.image || "",
        content: testimonial.content || "",
        designation: testimonial.designation || "",
      });
    }
  }, [testimonial]);

  const handleChange = (e) => {
    setEditTestimonial({ ...editTestimonial, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditTestimonial({ ...editTestimonial, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editTestimonial.name || !editTestimonial.content || !editTestimonial.designation || !editTestimonial.star) {
      alert("All fields are required.");
      return;
    }
    onUpdate(editTestimonial);
  };

  return (
    <div className="form-container">
      <h2>Edit Testimonial</h2>
      <form onSubmit={handleSubmit}>
        <label>Star Rating:</label>
        <select name="star" value={editTestimonial.star} onChange={handleChange} required>
          <option value="">Select Rating</option>
          <option value="1">⭐ (1)</option>
          <option value="2">⭐⭐ (2)</option>
          <option value="3">⭐⭐⭐ (3)</option>
          <option value="4">⭐⭐⭐⭐ (4)</option>
          <option value="5">⭐⭐⭐⭐⭐ (5)</option>
        </select>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={editTestimonial.name}
          onChange={handleChange}
          required
        />

        {editTestimonial.image && (
          <div className="image-preview">
            <img src={editTestimonial.image} alt="Current" style={{width: '100px', height: '100px', objectFit: 'cover'}} />
          </div>
        )}
        <input type="file" name="image" accept="image/*" onChange={handleFileChange} />

        <textarea
          name="content"
          placeholder="Testimonial Content"
          value={editTestimonial.content}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="designation"
          placeholder="Designation"
          value={editTestimonial.designation}
          onChange={handleChange}
          required
        />

        <div className="form-actions">
          <button type="submit" className="submit-btn">Update Testimonial</button>
          <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default TestimonialEdit;