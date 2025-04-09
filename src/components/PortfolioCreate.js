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
    if (!portfolio.title || !portfolio.description || !portfolio.link) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("https://admin.estonsoft.com/portfolios/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(portfolio),
      });

      if (!response.ok) {
        throw new Error("Failed to create portfolio.");
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
        <input type="text" name="title" placeholder="Title" value={portfolio.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={portfolio.description} onChange={handleChange} required />
        <input type="file" name="image" accept="image/*" onChange={handleFileChange} required />
        <input type="url" name="link" placeholder="Portfolio Link" value={portfolio.link} onChange={handleChange} required />
        <button type="submit" className="submit-btn">Create Portfolio</button>
      </form>
    </div>
  );
};

export default PortfolioCreate;