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


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!portfolio.title || !portfolio.description || !portfolio.link) {
      setError("All fields are required.");
      return;
    }

    try {
      console.log("Sending portfolio data:", portfolio);
      
      const response = await fetch("http://localhost/new.php/portfolios", {
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
        <input type="text" name="title" placeholder="Title" value={portfolio.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={portfolio.description} onChange={handleChange} required />
        <input type="url" name="image" placeholder="Image URL" value={portfolio.image} onChange={handleChange} required />
        <input type="url" name="link" placeholder="Portfolio Link" value={portfolio.link} onChange={handleChange} required />
        <button type="submit" className="submit-btn">Create Portfolio</button>
      </form>
    </div>
  );
};

export default PortfolioCreate;