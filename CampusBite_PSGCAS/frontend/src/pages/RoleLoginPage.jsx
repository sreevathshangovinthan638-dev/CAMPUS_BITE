import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaArrowLeft,
  FaCheck,
  FaBolt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function RoleLoginPage() {
  const navigate = useNavigate();
  const { loginWithCredentials, quickSwitchRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState("student");
  const [username, setUsername] = useState("student");
  const [password, setPassword] = useState("student123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedRole === "teacher") {
      setUsername("teacher");
      setPassword("teacher123");
    } else if (selectedRole === "admin") {
      setUsername("admin");
      setPassword("admin123");
    } else if (selectedRole === "kitchen") {
      setUsername("kitchen");
      setPassword("kitchen123");
    } else {
      setUsername("student");
      setPassword("student123");
    }
  }, [selectedRole]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithCredentials(username, password, selectedRole);
      if (selectedRole === "teacher") navigate("/teacher");
      else if (selectedRole === "admin") navigate("/admin");
      else if (selectedRole === "kitchen") navigate("/kitchen");
      else navigate("/student");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    try {
      await quickSwitchRole(role);
      if (role === "teacher") navigate("/teacher");
      else if (role === "admin") navigate("/admin");
      else if (role === "kitchen") navigate("/kitchen");
      else navigate("/student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-standalone-page">
      <div className="auth-card-replica">
        {/* Top College Header */}
        <div className="card-top-college">
          <img src="/logo.jpg" alt="PSG Logo" className="header-logo" />
          <span>PSG College of Arts & Science</span>
        </div>

        {/* Screen 03 Content */}
        <div className="auth-content-box">
          <div className="header-titles">
            <h2>Welcome Back</h2>
            <p>Login to your CampusBite account</p>
          </div>

          {/* 4 Role Tabs: [ Student ] [ Teacher ] [ Admin ] [ Kitchen ] */}
          <div className="role-tabs-horizontal">
            {["student", "teacher", "admin", "kitchen"].map((r) => (
              <button
                key={r}
                className={`tab-btn ${selectedRole === r ? "active" : ""}`}
                onClick={() => setSelectedRole(r)}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {/* Quick Demo One-Click Access Notice */}
          <div className="quick-fill-hint">
            <button
              type="button"
              className="quick-demo-pill"
              onClick={() => handleQuickDemo(selectedRole)}
            >
              <FaBolt /> Instant One-Click Demo as {selectedRole.toUpperCase()}
            </button>
          </div>

          <form onSubmit={handleLogin} className="login-replica-form">
            <div className="input-group">
              <label>
                {selectedRole === "teacher"
                  ? "College Email / Faculty Staff ID"
                  : selectedRole === "admin"
                  ? "Admin Username"
                  : selectedRole === "kitchen"
                  ? "Kitchen Staff ID"
                  : "College Email / Register Number"}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter register number or staff email"
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="remember-forgot-bar">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to your PSGCAS registered email."); }}>
                Forgot Password?
              </a>
            </div>

            <motion.button
              type="submit"
              className="login-submit-navy-btn"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Authenticating..." : "Login"}
            </motion.button>

            <div className="or-divider-line">
              <span>or continue with</span>
            </div>

            <button
              type="button"
              className="google-btn"
              onClick={() => handleQuickDemo(selectedRole)}
            >
              <FaGoogle className="g-icon" /> Sign in with Google
            </button>

            <div className="bottom-switch-link">
              <span>New to CampusBite? </span>
              <Link to="/signup">Create Account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
