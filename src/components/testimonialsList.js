import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css"; // Ensure CSS is updated
import TestimonialCreate from "./TestimonialCreate";

const TestimonialsList = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
   const [permissions, setPermissions] = useState([]);
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
        const response = await fetch("http://213.210.37.58/testimonials/", {
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
