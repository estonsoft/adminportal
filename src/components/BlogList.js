import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogCreate from "./BlogCreate"; // Import BlogCreate component
import "./styles.css";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
   const [permissions, setPermissions] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.permissions) {
      setPermissions(userData.permissions);
    }

    if (!token) {
      alert("Unauthorized! Please login to view blogs.");
      return;
    }

    const fetchBlogs = async () => {
      try {
        const response = await fetch("https://admin.estonsoft.com/blogs/", {
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch blogs.");
        }

        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchBlogs();
  }, [token]);

  const hasPermission = (permission) => permissions.includes(permission);

  const handleDelete = async (blogId) => {
    if (!token) {
      alert("Unauthorized! Please login.");
      return;
    }

      try {
        const response = await fetch(`https://admin.estonsoft.com/blogs/${blogId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete blog.");
        }

        alert("✅ Blog deleted successfully!");
        setBlogs(blogs.filter((blog) => blog.id !== blogId));
      } catch (err) {
        alert(err.message);
      }
  };

  return (
    <div className="blog-container">
      <h1 className="heading">Blogs</h1>
      
      {/* Toggle "Create Blog" Button */}
      {hasPermission("create_blog") && (
      <button className="create-btn" onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? "➖ Close Blog Form" : "📝 Create Blog"}
      </button>)}

      {/* Show BlogCreate form when toggled */}
      {showCreateForm && <BlogCreate />}

      {!token ? (
        <p>Please login to view blogs.</p>
      ) : blogs.length > 0 ? (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <div key={blog.id} className="blog-card">
              <img src={blog.image} alt={blog.title} className="blog-image" />
              <h2 className="blog-title">
                {blog.title}
              </h2>
              <p className="blog-paragraph">{blog.paragraph}</p>
              <p><strong>Author:</strong> {blog.author}</p>
              <p><strong>Published on:</strong> {new Date(blog.publishDate).toLocaleDateString()}</p>
              <p><strong>Tags:</strong> {blog.tags.join(", ")}</p>
              <div className="blog-actions">
                {/* <button onClick={() => navigate(`/blogs/${blog.id}`)} className="edit-btn">
                  View
                </button> */}
                <button onClick={() => handleDelete(blog.id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No blogs available.</p>
      )}
    </div>
  );
};

export default BlogList;
