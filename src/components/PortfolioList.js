import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css"; // Make sure to update CSS for horizontal layout
import PortfolioCreate from "./PortfolioCreate";
import PortfolioEdit from "./PortfolioEdit";

const PortfolioList = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
   const [permissions, setPermissions] = useState([]);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.permissions) {
      setPermissions(userData.permissions);
    }

    if (!token) {
      alert("Unauthorized! Please login to view portfolios.");
      return;
    }

    const fetchPortfolios = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/portfolios`, {
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch portfolios.");
        }

        const data = await response.json();
        setPortfolios(data);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchPortfolios();
  }, [token]);

  const hasPermission = (permission) => {
    console.log("Checking permission:", permission, "User permissions:", permissions);
    return permissions.includes(permission);
  };
  const handleDelete = async (portfolioId) => {
    if (!token) {
      alert("Unauthorized! Please login.");
      return;
    }

    if (!hasPermission("delete_portfolio")) {
      alert("You don't have permission to delete portfolios.");
      return;
    }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/portfolios/${portfolioId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete portfolio.");
        }

        alert("✅ Portfolio deleted successfully!");
        setPortfolios(portfolios.filter((portfolio) => portfolio.id !== portfolioId));
      } catch (err) {
        alert(err.message);
      }
  };

  const handleEdit = (portfolioId) => {
    if (!hasPermission("update_portfolio")) {
      alert("You don't have permission to edit portfolios.");
      return;
    }
    const portfolioToEdit = portfolios.find(portfolio => portfolio.id === portfolioId);
    setEditingPortfolio(portfolioToEdit);
  };

  const handleUpdatePortfolio = async (updatedPortfolioData) => {
    if (!token) {
      alert("Unauthorized! Please login.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/portfolios/${editingPortfolio.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(updatedPortfolioData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update portfolio.");
      }

      alert("✅ Portfolio updated successfully!");
      setEditingPortfolio(null);
      // Refresh portfolios
      const fetchPortfolios = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/portfolios`, {
            headers: {
              Authorization: token,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setPortfolios(data);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchPortfolios();
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleSection = () => {
    setActiveSection(activeSection === "portfolioForm" ? null : "portfolioForm");
  };

  return (
    <div className="portfolio-container">
      <h1 className="heading">Portfolios</h1>
      {hasPermission("create_portfolio") && (
      <button onClick={toggleSection} className="create-btn">
        {activeSection === "portfolioForm" ? "➖ Close Form" : "📁 Create Portfolio"}
      </button>)}
      {activeSection === "portfolioForm" && <PortfolioCreate />}
      
      {/* Show PortfolioEdit form when editing */}
      {editingPortfolio && (
        <PortfolioEdit
          portfolio={editingPortfolio}
          onUpdate={handleUpdatePortfolio}
          onCancel={() => setEditingPortfolio(null)}
        />
      )}
      
      {!token ? (
        <p>Please login to view portfolios.</p>
      ) : portfolios.length > 0 ? (
        <div className="portfolio-grid">
          {portfolios.map((portfolio) => (
            <div key={portfolio.id} className="portfolio-card">
              <img src={portfolio.image} alt={portfolio.title} className="portfolio-image" />
              <h2 className="portfolio-title">{portfolio.title}</h2>
              <p className="portfolio-description">{portfolio.description}</p>
              <a href={portfolio.link} target="_blank" rel="noopener noreferrer" className="portfolio-link">
                Visit Portfolio
              </a>
              <div className="portfolio-actions action-buttons">
                {hasPermission("update_portfolio") && (
                  <button onClick={() => handleEdit(portfolio.id)} className="edit-btn">
                    Edit
                  </button>
                )}
                {hasPermission("delete_portfolio") && (
                  <button onClick={() => handleDelete(portfolio.id)} className="delete-btn">
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No portfolios available.</p>
      )}
    </div>
  );
};

export default PortfolioList;
