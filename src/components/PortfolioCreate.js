import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const PortfolioCreate = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [portfolio, setPortfolio] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setPortfolio({ ...portfolio, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPortfolio({ ...portfolio, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!portfolio.title || !portfolio.description || !portfolio.image || !portfolio.link) {
      setError("All fields are required.");
      return;
    }

    try {
      console.log("Sending portfolio data:", portfolio);
      
      const response = await fetch("https://estonsoft.com/portfolios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(portfolio),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error response:", errorData);
        throw new Error(`Failed to create portfolio: ${response.status} - ${errorData}`);
      }

      alert("✅ Portfolio Created Successfully!");
      navigate("/dashboard"); // Redirect to portfolio list
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Create Portfolio</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="field-label">Title</label>
          <input 
            type="text" 
            name="title" 
            placeholder="Enter portfolio title" 
            value={portfolio.title} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-field">
          <label className="field-label">Description</label>
          <textarea 
            name="description" 
            placeholder="Enter portfolio description" 
            value={portfolio.description} 
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
            required 
          />
        </div>
        
        <div className="form-field">
          <label className="field-label">Portfolio Link</label>
          <input 
            type="url" 
            name="link" 
            placeholder="Enter portfolio link" 
            value={portfolio.link} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <button type="submit" className="submit-btn">Create Portfolio</button>
      </form>
    </div>
  );
};

export default PortfolioCreate;