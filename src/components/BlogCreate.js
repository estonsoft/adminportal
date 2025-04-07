import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const BlogCreate = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [blog, setBlog] = useState({
    title: "",
    image: "",
    paragraph: "",
    content: "",
    author: "",
    tags: [],
    publishDate: "",
  });
  const [error, setError] = useState("");

  const availableTags = [
    "Tech",
    "Health",
    "Education",
    "Entertainment",
    "Sports",
  ];

  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlog({ ...blog, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagChange = (tag) => {
    setBlog((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !blog.title ||
      !blog.paragraph ||
      !blog.content ||
      !blog.author ||
      !blog.publishDate
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://213.210.37.58/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(blog),
      });

      if (!response.ok) {
        throw new Error("Failed to create blog.");
      }

      alert("✅ Blog Created Successfully!");
      navigate("/dashboard"); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Create Blog</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={blog.title}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
        <textarea
          name="paragraph"
          placeholder="Short Paragraph"
          value={blog.paragraph}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Full Content"
          value={blog.content}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={blog.author}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="publishDate"
          value={blog.publishDate}
          onChange={handleChange}
          required
        />

<div className="tags-container">
  <label>Tags:</label>
  <div className="tags-list">
    {availableTags.map((tag) => (
      <div key={tag} className="tag-item">
        <label className="tag-label" htmlFor={`tag-${tag}`}>{tag}</label>
        <input
          id={`tag-${tag}`}
          type="checkbox"
          value={tag}
          checked={blog.tags.includes(tag)}
          onChange={() => handleTagChange(tag)}
        />
      </div>
    ))}
  </div>
</div>


        <button type="submit" className="submit-btn">
          Create Blog
        </button>
      </form>
    </div>
  );
};

export default BlogCreate;
