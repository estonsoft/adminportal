import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import "./styles.css";

const TestimonialCreate = () => {
  const [testimonial, setTestimonial] = useState({
    star: 5,
    name: "",
    image: "",
    content: "",
    designation: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setTestimonial({ ...testimonial, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTestimonial({ ...testimonial, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!testimonial.name || !testimonial.content || !testimonial.designation || !testimonial.star) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("https://admin.estonsoft.com/testimonials/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(testimonial),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit testimonial");
      }

      setSuccess("✅ Testimonial Submitted Successfully!");
      console.log("Submitted Testimonial:", data);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Submit a Testimonial</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>Star Rating:</label>
        <select name="star" value={testimonial.star} onChange={handleChange} required>
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
          placeholder="Your Name"
          value={testimonial.name}
          onChange={handleChange}
          required
        />
        <input type="file" name="image" accept="image/*" onChange={handleFileChange} required />
        <textarea
          name="content"
          placeholder="Your Testimonial"
          value={testimonial.content}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="designation"
          placeholder="Your Designation"
          value={testimonial.designation}
          onChange={handleChange}
          required
        />
        <button type="submit" className="submit-btn">Submit Testimonial</button>
      </form>
    </div>
  );
};

export default TestimonialCreate;
