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
    authorName: "",
    authorImage: "",
    authorDesignation: "",
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
      !blog.authorName ||
      !blog.authorImage ||
      !blog.authorDesignation ||
      !blog.publishDate
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      console.log("Sending blog data:", blog);
      
      const response = await fetch("http://localhost/estonsoft-api/new.php/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(blog),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error response:", errorData);
        throw new Error(`Failed to create blog: ${response.status} - ${errorData}`);
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
          name="authorName"
          placeholder="Author Name"
          value={blog.authorName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="authorDesignation"
          placeholder="Author Designation"
          value={blog.authorDesignation}
          onChange={handleChange}
        />

        <input
          type="file"
          name="authorImage"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setBlog({ ...blog, authorImage: reader.result });
              };
              reader.readAsDataURL(file);
            }
          }}
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
                <label className="tag-label" htmlFor={`tag-${tag}`}>
                  {tag}
                </label>
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
