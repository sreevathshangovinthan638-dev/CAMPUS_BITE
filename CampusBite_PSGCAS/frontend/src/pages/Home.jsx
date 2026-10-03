import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaGraduationCap, FaChalkboardTeacher, FaUserShield, FaUtensils, FaClock, FaCheckCircle, FaLeaf, FaBolt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { openLoginForRole, role, user } = useAuth();

  return (
    <div className="replica-home-page">
      {/* Top Heritage Campus Notice */}
      <section className="replica-hero-section">
        <div className="replica-hero-container">
          {/* Header pill badges */}
          <motion.div
            className="replica-pill-row"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="replica-pill">
              <FaLeaf className="pill-icon green" /> Fresh Food
            </span>
            <span className="replica-pill">
              <FaBolt className="pill-icon amber" /> Quick Pickup
            </span>
            <span className="replica-pill">
              <FaGraduationCap className="pill-icon navy" /> Made for PSGCAS
            </span>
          </motion.div>

          {/* Title and Tagline */}
          <div className="replica-hero-titles">
            <h1 className="replica-brand-title">CampusBite</h1>
            <p className="replica-brand-tagline">Good Food, Brighter Days.</p>
            <p className="replica-sub-college">FOOD COURT • PSG COLLEGE OF ARTS & SCIENCE, COIMBATORE</p>
          </div>

          {/* Main Heritage Card with Campus Image */}
          <motion.div
            className="replica-main-card"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="campus-image-wrapper">
              <img
                src="/psgcas_campus.jpg"
                alt="PSG College of Arts & Science Main Heritage Building"
                className="campus-hero-img"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80";
                }}
              />
              <div className="campus-img-overlay"></div>
            </div>

            {/* Floating Action Banner */}
            <div className="replica-banner-content">
              <div className="banner-left">
                <span className="banner-badge">Smarter Dining • Happier Campus</span>
                <h2>Delicious Food Happier Campus</h2>
                <p>Your favourite food, now a few taps away. Skip the queue, pre-order & pick up fresh.</p>
              </div>
              <div className="banner-actions">
                <motion.button
                  className="replica-order-btn"
                  onClick={() => navigate("/menu")}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Order Now <FaArrowRight />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Quick Portal Switcher Cards (Student, Teacher, Admin, Kitchen) */}
          <div className="replica-role-cards-section">
            <div className="section-label">
              <h3>Choose Your Campus Portal</h3>
              <p>Experience tailored features for students, faculty, administrators, and kitchen crew</p>
            </div>

            <div className="role-selector-grid">
              {/* Student Portal */}
              <motion.div
                className={`role-choice-card ${role === "student" ? "active-role" : ""}`}
                whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(17, 30, 56, 0.12)" }}
                onClick={() => {
                  openLoginForRole("student");
                  navigate("/menu");
                }}
              >
                <div className="role-icon-box student">
                  <FaGraduationCap />
                </div>
                <div className="role-text">
                  <h4>Student Portal</h4>
                  <p>Order food easily, track live prep time, digital bill & pay.</p>
                </div>
                <span className="role-arrow-badge">Open →</span>
              </motion.div>

              {/* Teacher Portal */}
              <motion.div
                className={`role-choice-card ${role === "teacher" ? "active-role" : ""}`}
                whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(17, 30, 56, 0.12)" }}
                onClick={() => {
                  openLoginForRole("teacher");
                  navigate("/teacher");
                }}
              >
                <div className="role-icon-box teacher">
                  <FaChalkboardTeacher />
                </div>
                <div className="role-text">
                  <div className="role-title-row">
                    <h4>Teacher Portal</h4>
                    <span className="faculty-tag">Faculty Priority</span>
                  </div>
                  <p>Quick & convenient, dedicated faculty express counter & breaks.</p>
                </div>
                <span className="role-arrow-badge">Open →</span>
              </motion.div>

              {/* Admin Portal */}
              <motion.div
                className={`role-choice-card ${role === "admin" ? "active-role" : ""}`}
                whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(17, 30, 56, 0.12)" }}
                onClick={() => {
                  openLoginForRole("admin");
                  navigate("/admin");
                }}
              >
                <div className="role-icon-box admin">
                  <FaUserShield />
                </div>
                <div className="role-text">
                  <h4>Admin Portal</h4>
                  <p>Manage food court menu items, prices, view sales analytics.</p>
                </div>
                <span className="role-arrow-badge">Open →</span>
              </motion.div>

              {/* Kitchen Staff */}
              <motion.div
                className={`role-choice-card ${role === "kitchen" ? "active-role" : ""}`}
                whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(17, 30, 56, 0.12)" }}
                onClick={() => {
                  openLoginForRole("kitchen");
                  navigate("/kitchen");
                }}
              >
                <div className="role-icon-box kitchen">
                  <FaUtensils />
                </div>
                <div className="role-text">
                  <h4>Kitchen Staff</h4>
                  <p>Live Kitchen Display System (KDS), manage incoming orders.</p>
                </div>
                <span className="role-arrow-badge">Open →</span>
              </motion.div>
            </div>
          </div>

          {/* Food Court Highlights / Categories preview */}
          <div className="replica-categories-highlight">
            <div className="highlight-header">
              <h3>Popular PSGCAS Food Court Categories</h3>
              <button className="view-all-text-btn" onClick={() => navigate("/menu")}>
                View Full Menu →
              </button>
            </div>

            <div className="highlight-grid">
              <div className="highlight-item" onClick={() => navigate("/menu?cat=breakfast")}>
                <span className="emoji">🥞</span>
                <strong>Breakfast</strong>
                <small>Idli, Dosa, Pongal</small>
              </div>
              <div className="highlight-item" onClick={() => navigate("/menu?cat=lunch")}>
                <span className="emoji">🍛</span>
                <strong>Lunch</strong>
                <small>Meals, Rice Dishes</small>
              </div>
              <div className="highlight-item" onClick={() => navigate("/menu?cat=snacks")}>
                <span className="emoji">🥟</span>
                <strong>Snacks</strong>
                <small>Samosa, Fries, Cutlet</small>
              </div>
              <div className="highlight-item" onClick={() => navigate("/menu?cat=juice")}>
                <span className="emoji">🍹</span>
                <strong>Juice</strong>
                <small>Orange, Watermelon</small>
              </div>
              <div className="highlight-item" onClick={() => navigate("/menu?cat=chat")}>
                <span className="emoji">🥣</span>
                <strong>Chaat Items</strong>
                <small>Pani Puri, Bhel</small>
              </div>
              <div className="highlight-item" onClick={() => navigate("/menu?cat=icecream")}>
                <span className="emoji">🍦</span>
                <strong>Ice Cream</strong>
                <small>Cones & Sundaes</small>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
