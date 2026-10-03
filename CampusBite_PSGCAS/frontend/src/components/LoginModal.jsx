import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserGraduate, FaUtensils, FaUserShield, FaTimes, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, loginWithCredentials, registerStudent, quickSwitchRole, role } = useAuth();
  const [activeTab, setActiveTab] = useState("quick"); // "quick" | "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Register form state
  const [regData, setRegData] = useState({
    username: "",
    password: "",
    full_name: "",
    roll_number: "",
    email: "",
  });

  if (!isLoginModalOpen) return null;

  const handleCredentialLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginWithCredentials(username, password);
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials. Try student123, kitchen123, or admin123.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerStudent(regData);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Username may already exist.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSwitch = async (targetRole) => {
    setLoading(true);
    try {
      await quickSwitchRole(targetRole);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={closeLoginModal}>
        <motion.div
          className="auth-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="modal-header">
            <div className="modal-title-wrap">
              <img src="/logo.jpg" alt="Logo" className="modal-logo" />
              <div>
                <h2>CampusBite Access Portal</h2>
                <p>PSG College of Arts & Science</p>
              </div>
            </div>
            <button className="modal-close-btn" onClick={closeLoginModal} aria-label="Close">
              <FaTimes />
            </button>
          </div>

          <div className="auth-tabs">
            <button
              className={activeTab === "quick" ? "auth-tab active" : "auth-tab"}
              onClick={() => { setActiveTab("quick"); setError(""); }}
            >
              Quick Role Switch
            </button>
            <button
              className={activeTab === "login" ? "auth-tab active" : "auth-tab"}
              onClick={() => { setActiveTab("login"); setError(""); }}
            >
              Sign In
            </button>
            <button
              className={activeTab === "register" ? "auth-tab active" : "auth-tab"}
              onClick={() => { setActiveTab("register"); setError(""); }}
            >
              Register
            </button>
          </div>

          {error && <div className="auth-error-banner">{error}</div>}

          {activeTab === "quick" && (
            <div className="quick-roles-container">
              <p className="quick-roles-hint">
                Select a portal role to immediately test or switch views:
              </p>

              <div className="roles-grid">
                <motion.div
                  className={`role-card ${role === "student" ? "selected" : ""}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQuickSwitch("student")}
                >
                  <div className="role-icon student-icon">
                    <FaUserGraduate />
                  </div>
                  <div className="role-info">
                    <h4>Student Portal</h4>
                    <p>Order food, pay online or cash, get live status updates.</p>
                  </div>
                  {role === "student" && <span className="active-badge">Active</span>}
                </motion.div>

                <motion.div
                  className={`role-card ${role === "kitchen" ? "selected" : ""}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQuickSwitch("kitchen")}
                >
                  <div className="role-icon kitchen-icon">
                    <FaUtensils />
                  </div>
                  <div className="role-info">
                    <h4>Kitchen Display (KDS)</h4>
                    <p>View incoming orders, dish details, quantities, update preparation.</p>
                  </div>
                  {role === "kitchen" && <span className="active-badge">Active</span>}
                </motion.div>

                <motion.div
                  className={`role-card ${role === "admin" ? "selected" : ""}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQuickSwitch("admin")}
                >
                  <div className="role-icon admin-icon">
                    <FaUserShield />
                  </div>
                  <div className="role-info">
                    <h4>Admin Dashboard</h4>
                    <p>Full control: add new dishes, change prices, replace photos, manage stock.</p>
                  </div>
                  {role === "admin" && <span className="active-badge">Active</span>}
                </motion.div>
              </div>
            </div>
          )}

          {activeTab === "login" && (
            <form onSubmit={handleCredentialLogin} className="auth-form">
              <div className="form-group">
                <label>Username / Roll No</label>
                <input
                  type="text"
                  placeholder="e.g. admin, kitchen, or student"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="e.g. admin123, kitchen123, student123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <motion.button
                type="submit"
                className="auth-submit-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                <FaSignInAlt /> {loading ? "Signing in..." : "Sign In to CampusBite"}
              </motion.button>
            </form>
          )}

          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={regData.full_name}
                    onChange={(e) => setRegData({ ...regData, full_name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Roll Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 23BCS045"
                    value={regData.roll_number}
                    onChange={(e) => setRegData({ ...regData, roll_number: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Choose a username"
                  value={regData.username}
                  onChange={(e) => setRegData({ ...regData, username: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="student@psgcas.ac.in"
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                  required
                />
              </div>

              <motion.button
                type="submit"
                className="auth-submit-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                <FaUserPlus /> {loading ? "Creating Account..." : "Register Student"}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
