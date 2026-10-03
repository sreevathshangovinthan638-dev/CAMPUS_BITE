import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaBell,
  FaArrowRight,
  FaPlus,
  FaLeaf,
  FaFire,
  FaClock,
  FaStar,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { fetchFoods } from "../api/dataService";
import { CATEGORIES } from "../api/mockData";

export default function StudentDashboard({ cart, setCart }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchFoods().then(setFoods);
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/menu");
    }
  };

  const popularPicks = foods.slice(0, 4);

  return (
    <div className="student-dashboard-page">
      <div className="student-container">
        {/* Header Greeting (Screen 04) */}
        <div className="student-header-row">
          <div className="profile-greeting">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"}
              alt="Akash"
              className="student-avatar"
            />
            <div>
              <h2>Hi, {user?.fullName?.split(" ")[0] || "Akash"} 👋</h2>
              <p>Good food fuels great learning!</p>
            </div>
          </div>
          <button className="notify-bell-btn" title="Notifications">
            <FaBell />
            <span className="dot"></span>
          </button>
        </div>

        {/* Search Bar (Screen 04) */}
        <form onSubmit={handleSearchSubmit} className="search-food-form">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for food, e.g., idli, sandwich..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Banner: "Fuel Your Day At CampusBite" (Screen 04) */}
        <motion.div
          className="fuel-promo-banner"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="promo-text-side">
            <span className="promo-tag">Campus Special</span>
            <h2>Fuel Your Day At CampusBite</h2>
            <p>Hot South Indian breakfast & wholesome college meals made fresh daily.</p>
            <button className="promo-order-btn" onClick={() => navigate("/menu")}>
              Explore Menu <FaArrowRight />
            </button>
          </div>
          <div className="promo-visual-side">
            <img
              src="https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400&auto=format&fit=crop&q=80"
              alt="Delicious Meals"
              className="promo-food-img"
            />
          </div>
        </motion.div>

        {/* Category Circular Grid (Screen 04) */}
        <div className="student-categories-section">
          <div className="section-title-line">
            <h3>Food Categories</h3>
            <button className="view-all-link" onClick={() => navigate("/menu")}>
              View All
            </button>
          </div>

          <div className="student-cat-grid">
            {CATEGORIES.filter((c) => c.key !== "all").map((cat) => (
              <div
                key={cat.key}
                className="student-cat-item"
                onClick={() => navigate(`/menu?cat=${cat.key}`)}
              >
                <div className="cat-circle-avatar">
                  <img src={cat.image} alt={cat.label} />
                </div>
                <span>{cat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Campus Picks */}
        <div className="popular-picks-section">
          <div className="section-title-line">
            <h3>Popular Student Picks</h3>
            <button className="view-all-link" onClick={() => navigate("/menu")}>
              See Full Menu
            </button>
          </div>

          <div className="picks-grid">
            {popularPicks.map((food) => (
              <div key={food.id} className="pick-card">
                <img src={food.image} alt={food.name} />
                <div className="pick-details">
                  <h4>{food.name}</h4>
                  <p className="pick-desc">{food.description}</p>
                  <div className="pick-footer">
                    <strong>₹{food.price}</strong>
                    <button className="add-mini-btn" onClick={() => addToCart(food)}>
                      <FaPlus /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
