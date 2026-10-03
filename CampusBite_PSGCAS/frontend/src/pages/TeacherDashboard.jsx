import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCoffee,
  FaChalkboardTeacher,
  FaBell,
  FaBolt,
  FaClock,
  FaShoppingCart,
  FaCheckCircle,
  FaSearch,
  FaArrowRight,
  FaPlus,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { fetchFoods } from "../api/dataService";

export default function TeacherDashboard({ cart, setCart }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [facultySpecial, setFacultySpecial] = useState([]);

  useEffect(() => {
    fetchFoods().then((all) => {
      setFoods(all);
      // Filter faculty favorites: Filter Coffee, Masala Dosa, Meals, Snacks, Juice
      const favs = all.filter((item) =>
        ["Filter Coffee", "Masala Dosa", "Special South Indian Meals", "Crispy Samosa (2 pcs)", "Fresh Orange Juice"].includes(item.name)
      );
      setFacultySpecial(favs);
    });
  }, []);

  const addToCart = (food) => {
    const existing = cart.find((item) => item.id === food.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...food, quantity: 1 }]);
    }
  };

  const categories = [
    { key: "breakfast", label: "Breakfast", icon: "🥞" },
    { key: "lunch", label: "Lunch", icon: "🍛" },
    { key: "snacks", label: "Snacks", icon: "🥟" },
    { key: "juice", label: "Juice", icon: "🍹" },
    { key: "chat", label: "Chat Items", icon: "🥣" },
    { key: "icecream", label: "Ice Cream", icon: "🍦" },
  ];

  return (
    <div className="teacher-dashboard-page">
      <div className="teacher-container">
        {/* Top Faculty Greeting Card (Matching Screen 12) */}
        <div className="teacher-header-card">
          <div className="teacher-profile-row">
            <div className="teacher-avatar-wrap">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80"}
                alt="Teacher Profile"
                className="teacher-avatar-img"
              />
              <span className="teacher-badge-verified" title="Verified Faculty">✓</span>
            </div>
            <div className="teacher-greeting-text">
              <h2>Hi, {user?.fullName || "Dr. Priya"} 👋</h2>
              <p>Good food keeps great minds going!</p>
              <div className="faculty-meta-tags">
                <span className="dept-tag">Dept of Computer Science</span>
                <span className="faculty-id-tag">ID: {user?.rollNumber || "FAC-8842"}</span>
                <span className="priority-pill"><FaBolt /> Express Pickup Access</span>
              </div>
            </div>
          </div>
          <div className="teacher-header-actions">
            <button className="icon-notify-btn" title="Faculty Notifications">
              <FaBell />
              <span className="notify-dot"></span>
            </button>
          </div>
        </div>

        {/* Hero Banner: "A peaceful break for brighter ideas" */}
        <motion.div
          className="teacher-peace-banner"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="banner-text-side">
            <span className="peace-badge">Faculty Exclusive Lounge</span>
            <h2>A peaceful break for brighter ideas.</h2>
            <p>Order your favourite meals & South Indian degree filter coffee from CampusBite.</p>
            <div className="express-counter-hint">
              <FaClock /> <strong>Zero-Wait Priority:</strong> Ready in 5-8 mins at Counter #1 (Faculty Counter).
            </div>
          </div>
          <div className="banner-visual-side">
            <div className="coffee-cup-glow">
              <span className="coffee-emoji">☕</span>
            </div>
          </div>
        </motion.div>

        {/* Category Circular Icons (Matching Mockup Screen 12) */}
        <div className="category-circular-section">
          <h3>Browse Menu Categories</h3>
          <div className="circular-grid">
            {categories.map((c) => (
              <motion.div
                key={c.key}
                className="circular-card"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/menu?cat=${c.key}`)}
              >
                <div className="circle-icon-bubble">{c.icon}</div>
                <span>{c.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Faculty Favourite Picks with One-Click Add */}
        <div className="faculty-favorites-section">
          <div className="section-title-row">
            <div>
              <h3>Faculty Quick Re-Order</h3>
              <p>Most popular healthy, energizing food & beverages for staff members</p>
            </div>
            <button className="see-all-btn" onClick={() => navigate("/menu")}>
              Full Menu <FaArrowRight />
            </button>
          </div>

          <div className="faculty-picks-grid">
            {facultySpecial.map((item) => (
              <motion.div
                key={item.id}
                className="faculty-food-card"
                whileHover={{ y: -3 }}
              >
                <img src={item.image} alt={item.name} className="faculty-food-thumb" />
                <div className="faculty-food-details">
                  <h4>{item.name}</h4>
                  <p className="food-desc">{item.description}</p>
                  <div className="price-add-row">
                    <span className="price-tag">₹{item.price}</span>
                    <button
                      className="add-express-btn"
                      onClick={() => addToCart(item)}
                    >
                      <FaPlus /> Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Faculty Express Pickup Guarantee */}
        <div className="faculty-service-notice">
          <div className="notice-icon"><FaBolt /></div>
          <div>
            <h4>PSGCAS Faculty Express Priority</h4>
            <p>Orders placed from the Teacher Portal are prioritized at the kitchen counter. Simply show your Digital Order Invoice at Counter 1.</p>
          </div>
          <button className="view-cart-btn" onClick={() => navigate("/cart")}>
            View Cart ({cart.reduce((s, i) => s + i.quantity, 0)}) <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
