import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaPlus,
  FaMinus,
  FaCheck,
  FaShoppingCart,
  FaLeaf,
  FaClock,
  FaStar,
  FaFire,
  FaWifi,
} from "react-icons/fa";
import { fetchFoods, isBackendConnected } from "../api/dataService";
import { CATEGORIES } from "../api/mockData";

export default function Menu({ cart, setCart }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("cat") || "all";

  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [loading, setLoading] = useState(true);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [justAddedId, setJustAddedId] = useState(null);

  // Sync category param with URL
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    const cat = searchParams.get("cat");
    if ((cat || "all") !== selectedCategory) {
      setSelectedCategory(cat || "all");
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetchFoods()
      .then((items) => {
        setFoods(items);
        setIsBackendOnline(isBackendConnected());
      })
      .catch((err) => {
        console.warn("Could not load from API, falling back to local master menu", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryChange = (key) => {
    setSelectedCategory(key);
    if (key === "all") {
      searchParams.delete("cat");
    } else {
      searchParams.set("cat", key);
    }
    setSearchParams(searchParams);
  };

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      // Category filter
      const matchesCategory =
        selectedCategory === "all" ||
        food.category === selectedCategory ||
        food.category_name?.toLowerCase().replaceAll(" ", "").includes(selectedCategory);

      // Search filter
      const matchesSearch =
        !searchQuery.trim() ||
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [foods, selectedCategory, searchQuery]);

  const getItemQuantity = (id) => {
    const found = cart.find((item) => item.id === id);
    return found ? found.quantity : 0;
  };

  const updateQuantity = (food, delta) => {
    const existing = cart.find((item) => item.id === food.id);
    if (existing) {
      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        setCart(cart.filter((item) => item.id !== food.id));
      } else {
        setCart(
          cart.map((item) =>
            item.id === food.id ? { ...item, quantity: newQty } : item
          )
        );
      }
    } else if (delta > 0) {
      setCart([...cart, { ...food, quantity: 1 }]);
      setJustAddedId(food.id);
      setTimeout(() => setJustAddedId(null), 1200);
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <main className="menu-page food-focus-page"><div className="food-focus-actions"><button type="button" onClick={() => { if (selectedCategory !== "all") { setSearchQuery(""); setSearchParams({}); } else { navigate("/portals"); } }}>← {selectedCategory === "all" ? "Back" : "Food categories"}</button><button type="button" onClick={() => navigate("/cart")} aria-label={`View cart, ${totalCartCount} items`}><FaShoppingCart /> Cart ({totalCartCount})</button></div>
      {/* Top Banner & Search (Matching Mockup Screen 04, 05, 06) */}
      <div className="menu-header-section">
        <div className="menu-title-block">
          <div className="title-left">
            <h1>{selectedCategory === "all" ? "Menu" : CATEGORIES.find(c => c.key === selectedCategory)?.label || "Menu"}</h1>
            <p>{selectedCategory === "all" ? "Explore our delicious food categories" : CATEGORIES.find(c => c.key === selectedCategory)?.tagline}</p>
          </div>
          <div className="system-status-indicator">
            <span className={`status-pill ${isBackendOnline ? "online" : "standalone"}`}>
              <span className="dot"></span>
              {isBackendOnline ? "Menu connected" : "CampusBite Ready • Full Menu Active"}
            </span>
          </div>
        </div>

        {/* Search Bar matching mockup Screen 04 */}
        <div className="menu-search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="menu-search-input"
            aria-label="Search the menu" placeholder="Search for food, e.g., idli, dosa, sandwich, meals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button aria-label="Clear search" className="clear-search-btn" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>

      </div>

      {selectedCategory === "all" && !searchQuery.trim() && <div className="reference-category-grid">{CATEGORIES.filter(c => c.key !== "all").map(c => <button key={c.key} className="reference-category-card" onClick={() => handleCategoryChange(c.key)}><img src={c.image} alt={c.label} loading="lazy" /><div><h2>{c.label}</h2><p>{({breakfast:"Start fresh",lunch:"Wholesome meals",snacks:"Quick bites",juice:"Fresh & healthy",chat:"Full of flavour",icecream:"Cool your day"})[c.key]}</p></div></button>)}</div>}
      {/* Loading Skeleton */}
      {loading && (
        <div className="menu-loading-state">
          <div className="spinner"></div>
          <p>Loading fresh food court items...</p>
        </div>
      )}

      {/* Food Grid (Matching Screen 06 replica) */}
      {!loading && (selectedCategory !== "all" || searchQuery.trim()) && (
        <div className="food-grid-container">
          {filteredFoods.length === 0 ? (
            <div className="empty-menu-state">
              <span className="empty-icon">🍽️</span>
              <h3>No items found</h3>
              <p>Try searching for something else or pick another category.</p>
              <button
                className="reset-filter-btn"
                onClick={() => {
                  handleCategoryChange("all");
                  setSearchQuery("");
                }}
              >
                Show All Menu
              </button>
            </div>
          ) : (
            <div className="replica-food-list">
              {filteredFoods.map((food) => {
                const qty = getItemQuantity(food.id);
                return (
                  <motion.div
                    key={food.id}
                    className="replica-food-card"
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="food-img-container">
                      <img
                        src={food.image || food.image_url}
                        alt={food.name}
                        className="food-thumb-img"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80";
                        }}
                      />
                      <span className="prep-time-badge">
                        <FaClock /> {food.preparation_time || 10}m
                      </span>
                    </div>

                    <div className="food-card-body">
                      <div className="food-header-row">
                        <h3 className="food-title">{food.name}</h3>
                        <span className="food-price">₹{food.price}</span>
                      </div>
                      <p className="food-desc-text">{food.description}</p>

                      <div className="food-footer-actions">
                        <span className="food-category-pill">{food.category_name || food.category}</span>

                        {qty === 0 ? (
                          <motion.button
                            disabled={food.is_available === false} aria-label={`Add ${food.name} to bag`} className="add-to-cart-pill-btn"
                            onClick={() => updateQuantity(food, 1)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaPlus /> {food.is_available === false ? "Sold out" : "Add"}
                          </motion.button>
                        ) : (
                          <div className="quantity-stepper">
                            <button
                              className="step-btn minus"
                              onClick={() => updateQuantity(food, -1)}
                              aria-label="Decrease quantity"
                            >
                              <FaMinus />
                            </button>
                            <span className="step-count">{qty}</span>
                            <button
                              className="step-btn plus"
                              onClick={() => updateQuantity(food, 1)}
                              aria-label="Increase quantity"
                            >
                              <FaPlus />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Floating Checkout Bar when cart has items (Matching mobile/desktop bottom action) */}
      <AnimatePresence>
        {totalCartCount > 0 && (
          <motion.div
            className="floating-cart-bar"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
          >
            <div className="cart-bar-left">
              <span className="cart-bar-count">{totalCartCount} {totalCartCount === 1 ? "Item" : "Items"}</span>
              <strong className="cart-bar-total">₹{totalCartAmount.toFixed(2)}</strong>
            </div>
            <button className="cart-bar-action-btn" onClick={() => navigate("/cart")}>
              <FaShoppingCart /> View Cart & Order →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
