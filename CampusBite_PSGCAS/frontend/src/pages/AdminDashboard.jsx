import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaUtensils,
  FaShoppingBag,
  FaRupeeSign,
  FaImage,
  FaTimes,
  FaSave,
  FaSync,
  FaSearch,
  FaArrowUp,
  FaChartBar,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";
import API from "../api/axios";
import { fetchFoods, fetchCategories } from "../api/dataService";
import { INITIAL_FOODS } from "../api/mockData";

export default function AdminDashboard() {
  const [foods, setFoods] = useState(INITIAL_FOODS);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [chartMetric, setChartMetric] = useState("orders"); // 'orders' | 'revenue'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "breakfast",
    price: "",
    description: "",
    preparation_time: 10,
    image_url: "",
    is_available: true,
  });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allFoods, allCats] = await Promise.all([
        fetchFoods("all"),
        fetchCategories(),
      ]);
      setFoods(allFoods);
      setCategories(allCats);
    } catch (err) {
      console.warn("Using local admin data fallback", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingFood(null);
    setFormData({
      name: "",
      category: "breakfast",
      price: "",
      description: "",
      preparation_time: 10,
      image_url: "",
      is_available: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      category: food.category || "breakfast",
      price: food.price,
      description: food.description || "",
      preparation_time: food.preparation_time || 10,
      image_url: food.image_url || food.image || "",
      is_available: food.is_available !== false,
    });
    setIsModalOpen(true);
  };

  const handleToggleStock = (food) => {
    const updated = foods.map((f) =>
      f.id === food.id ? { ...f, is_available: !f.is_available } : f
    );
    setFoods(updated);
    localStorage.setItem("campusbite_foods_cache", JSON.stringify(updated));
  };

  const handleDeleteFood = (foodId) => {
    if (window.confirm("Are you sure you want to remove this food item?")) {
      const updated = foods.filter((f) => f.id !== foodId);
      setFoods(updated);
      localStorage.setItem("campusbite_foods_cache", JSON.stringify(updated));
    }
  };

  const handleSaveFood = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      if (editingFood) {
        const updated = foods.map((f) =>
          f.id === editingFood.id
            ? {
                ...f,
                name: formData.name,
                price: Number(formData.price),
                category: formData.category,
                category_name: formData.category,
                description: formData.description,
                preparation_time: Number(formData.preparation_time),
                image: formData.image_url || f.image,
                is_available: formData.is_available,
              }
            : f
        );
        setFoods(updated);
        localStorage.setItem("campusbite_foods_cache", JSON.stringify(updated));
      } else {
        const newItem = {
          id: Date.now(),
          name: formData.name,
          price: Number(formData.price),
          category: formData.category,
          category_name: formData.category,
          description: formData.description,
          preparation_time: Number(formData.preparation_time),
          image: formData.image_url || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80",
          is_available: formData.is_available,
        };
        const updated = [newItem, ...foods];
        setFoods(updated);
        localStorage.setItem("campusbite_foods_cache", JSON.stringify(updated));
      }
      setIsModalOpen(false);
      setSaving(false);
    }, 300);
  };

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchCat =
        selectedCategory === "all" ||
        food.category === selectedCategory ||
        food.category_name?.toLowerCase().includes(selectedCategory);
      const matchSearch =
        !searchQuery.trim() ||
        food.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [foods, selectedCategory, searchQuery]);

  // Hourly trend bar chart mock data (Screen 13)
  const hourlyTrend = [
    { hour: "8 AM", orders: 25, revenue: 1800 },
    { hour: "10 AM", orders: 68, revenue: 4900 },
    { hour: "12 PM", orders: 110, revenue: 8400 },
    { hour: "2 PM", orders: 48, revenue: 3600 },
    { hour: "4 PM", orders: 52, revenue: 3900 },
    { hour: "6 PM", orders: 24, revenue: 1960 },
  ];

  return (
    <div className="admin-page-replica">
      <div className="admin-container">
        {/* Top Header Row (Screen 13 Replica) */}
        <div className="admin-header-row">
          <div className="admin-title-col">
            <h2>Admin Dashboard</h2>
            <p>Overview of Food Court Operations</p>
          </div>
          <div className="date-filter-pill">
            <FaCalendarAlt /> Today: <strong>16 Oct 2024</strong>
          </div>
        </div>

        {/* 4 Key Metric Cards (Screen 13 Replica) */}
        <div className="admin-metrics-grid">
          {/* Card 1: Total Orders */}
          <div className="admin-metric-card">
            <span className="card-label">Total Orders</span>
            <div className="card-value-row">
              <h3>327</h3>
              <span className="trend-badge positive">
                <FaArrowUp /> 12%
              </span>
            </div>
            <p className="card-subtext">vs yesterday (292)</p>
          </div>

          {/* Card 2: Total Revenue */}
          <div className="admin-metric-card">
            <span className="card-label">Total Revenue</span>
            <div className="card-value-row">
              <h3>₹24,560</h3>
              <span className="trend-badge positive">
                <FaArrowUp /> 8%
              </span>
            </div>
            <p className="card-subtext">Today's gross earnings</p>
          </div>

          {/* Card 3: Active Users */}
          <div className="admin-metric-card">
            <span className="card-label">Active Users</span>
            <div className="card-value-row">
              <h3>286</h3>
              <span className="trend-badge positive">
                <FaArrowUp /> 5%
              </span>
            </div>
            <p className="card-subtext">Students & faculty</p>
          </div>

          {/* Card 4: Avg. Order Value */}
          <div className="admin-metric-card">
            <span className="card-label">Avg. Order Value</span>
            <div className="card-value-row">
              <h3>₹75</h3>
              <span className="trend-badge positive">
                <FaArrowUp /> 6%
              </span>
            </div>
            <p className="card-subtext">₹71 last week</p>
          </div>
        </div>

        {/* Orders Trend Interactive Bar Chart (Screen 13 Replica) */}
        <div className="orders-trend-card">
          <div className="chart-header">
            <h4>Orders Trend</h4>
            <div className="chart-toggle-buttons">
              <button
                className={`chart-btn ${chartMetric === "orders" ? "active" : ""}`}
                onClick={() => setChartMetric("orders")}
              >
                Orders
              </button>
              <button
                className={`chart-btn ${chartMetric === "revenue" ? "active" : ""}`}
                onClick={() => setChartMetric("revenue")}
              >
                Revenue
              </button>
            </div>
          </div>

          {/* CSS Bar Chart */}
          <div className="trend-bars-container">
            {hourlyTrend.map((point) => {
              const heightPercent =
                chartMetric === "orders"
                  ? (point.orders / 110) * 100
                  : (point.revenue / 8400) * 100;

              return (
                <div key={point.hour} className="bar-column">
                  <span className="bar-val">
                    {chartMetric === "orders" ? point.orders : `₹${point.revenue}`}
                  </span>
                  <div className="bar-track">
                    <motion.div
                      className="bar-fill"
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.5 }}
                    ></motion.div>
                  </div>
                  <span className="bar-hour">{point.hour}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Menu Management Section */}
        <div className="admin-menu-management-header">
          <div>
            <h3>Food Court Menu Management</h3>
            <p>Update live items, prices, descriptions, and kitchen availability</p>
          </div>
          <button className="add-dish-btn" onClick={openAddModal}>
            <FaPlus /> Add New Food Item
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="admin-controls-bar">
          <div className="search-wrap">
            <FaSearch />
            <input
              type="text"
              placeholder="Filter menu items by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-pills">
            {["all", "breakfast", "lunch", "snacks", "juice", "chat", "icecream"].map(
              (cat) => (
                <button
                  key={cat}
                  className={`pill-btn ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        {/* Food Items Table */}
        <div className="admin-items-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Dish</th>
                <th>Category</th>
                <th>Price</th>
                <th>Prep Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFoods.map((food) => (
                <tr key={food.id}>
                  <td className="dish-cell">
                    <img src={food.image || food.image_url} alt={food.name} className="dish-thumb" />
                    <div>
                      <strong>{food.name}</strong>
                      <p className="dish-mini-desc">{food.description?.slice(0, 45)}...</p>
                    </div>
                  </td>
                  <td><span className="cat-badge">{food.category_name || food.category}</span></td>
                  <td><strong>₹{food.price}</strong></td>
                  <td>{food.preparation_time || 10} mins</td>
                  <td>
                    <button
                      className={`stock-toggle-btn ${food.is_available !== false ? "in-stock" : "out-stock"}`}
                      onClick={() => handleToggleStock(food)}
                      title="Click to toggle availability"
                    >
                      {food.is_available !== false ? "Available" : "Sold Out"}
                    </button>
                  </td>
                  <td className="actions-cell">
                    <button className="action-btn edit" onClick={() => openEditModal(food)} title="Edit dish">
                      <FaEdit />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDeleteFood(food.id)} title="Delete dish">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal: Add/Edit Food */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
              <motion.div
                className="admin-edit-modal"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="modal-header">
                  <h3>{editingFood ? "Edit Food Item" : "Add New Dish"}</h3>
                  <button onClick={() => setIsModalOpen(false)}><FaTimes /></button>
                </div>
                <form onSubmit={handleSaveFood} className="admin-form">
                  <div className="form-group">
                    <label>Dish Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Price (₹)</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="snacks">Snacks</option>
                        <option value="juice">Juice</option>
                        <option value="chat">Chaat Items</option>
                        <option value="icecream">Ice Cream</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    />
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-save" disabled={saving}>
                      <FaSave /> {saving ? "Saving..." : "Save Dish"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
