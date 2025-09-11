import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css"; // Ensure CSS is updated
import TestimonialCreate from "./TestimonialCreate";
import TestimonialEdit from "./TestimonialEdit";

const TestimonialsList = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.permissions) {
      setPermissions(userData.permissions);
    }

    if (!token) {
      alert("Unauthorized! Please login to view testimonials.");
      return;
    }

    const fetchTestimonials = async () => {
      try {
        const response = await fetch("https://estonsoft.com/testimonials", {
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch testimonials.");
        }

        const data = await response.json();
        setTestimonials(data);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchTestimonials();
  }, [token]);

  const hasPermission = (permission) => permissions.includes(permission);

  const handleDelete = async (testimonialId) => {
    if (!token) {
      alert("Unauthorized! Please login.");
      return;
    }

    if (!hasPermission("delete_testimonial")) {
      alert("You don't have permission to delete testimonials.");
      return;
    }

    try {
      const response = await fetch(`https://estonsoft.com/testimonials/${testimonialId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete testimonial.");
      }

      alert("✅ Testimonial deleted successfully!");
      setTestimonials(testimonials.filter((testimonial) => testimonial.id !== testimonialId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (testimonialId) => {
    if (!hasPermission("update_testimonial")) {
      alert("You don't have permission to edit testimonials.");
      return;
    }
    const testimonialToEdit = testimonials.find(testimonial => testimonial.id === testimonialId);
    setEditingTestimonial(testimonialToEdit);
  };

  const handleUpdateTestimonial = async (updatedTestimonialData) => {
    if (!token) {
      alert("Unauthorized! Please login.");
      return;
    }

    try {
      const response = await fetch(`https://estonsoft.com/testimonials/${editingTestimonial.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(updatedTestimonialData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update testimonial.");
      }

      alert("✅ Testimonial updated successfully!");
      setEditingTestimonial(null);
      // Refresh testimonials
      const fetchTestimonials = async () => {
        try {
          const response = await fetch("https://estonsoft.com/testimonials", {
            headers: {
              Authorization: token,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setTestimonials(data);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchTestimonials();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="testimonials-container">
      <h1 className="heading">Testimonials</h1>
      {!token ? (
        <p>Please login to view testimonials.</p>
      ) : (
        <div className="testimonials-wrapper">
          {hasPermission("create_testimonial") && (
          <button onClick={() => toggleSection("testimonialForm")} className="create-btn">
            {activeSection === "testimonialForm" ? "➖ Close Form" : "💬 Create Testimonial"}
          </button>)}
          {activeSection === "testimonialForm" && <TestimonialCreate />}
          
          {/* Show TestimonialEdit form when editing */}
          {editingTestimonial && (
            <TestimonialEdit
              testimonial={editingTestimonial}
              onUpdate={handleUpdateTestimonial}
              onCancel={() => setEditingTestimonial(null)}
            />
          )}
          <div className="testimonials-grid">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card">
                  <img src={testimonial.image} alt={testimonial.name} className="testimonial-image" />
                  <h2 className="testimonial-name">{testimonial.name}</h2>
                  <p className="testimonial-designation">{testimonial.designation}</p>
                  <p className="testimonial-content">"{testimonial.content}"</p>
                  <div className="testimonial-stars">
                    {"⭐".repeat(testimonial.star)}
                  </div>
                  <div className="testimonial-actions action-buttons">
                    {hasPermission("update_testimonial") && (
                      <button
                        onClick={() => handleEdit(testimonial.id)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                    )}
                    {hasPermission("delete_testimonial") && (
                      <button
                        onClick={() => handleDelete(testimonial.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No testimonials available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsList;
