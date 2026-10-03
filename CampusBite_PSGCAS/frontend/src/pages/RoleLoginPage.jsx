import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const requestedRole = searchParams.get("role");
  const initialRole = ["student", "teacher", "admin", "kitchen"].includes(requestedRole) ? requestedRole : "student";
  const { loginWithCredentials, quickSwitchRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [username, setUsername] = useState(initialRole);
  const [password, setPassword] = useState("student123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  useEffect(() => { setSelectedRole(initialRole); }, [initialRole]);

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
      if (selectedRole === "teacher") navigate("/menu");
      else if (selectedRole === "admin") navigate("/admin");
      else if (selectedRole === "kitchen") navigate("/kitchen");
      else navigate("/menu");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    try {
      await quickSwitchRole(role);
      if (role === "teacher") navigate("/menu");
      else if (role === "admin") navigate("/admin");
      else if (role === "kitchen") navigate("/kitchen");
      else navigate("/menu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-standalone-page">
      <div className="auth-card-replica">
        {/* Top College Header */}
        <div className="card-top-college">
          <img src="/campusbite-logo.jpeg" alt="CampusBite PSGCAS logo" className="header-logo" />
          <span>PSG College of Arts & Science</span>
        </div>

        {/* Screen 03 Content */}
        <div className="auth-content-box"><nav className="role-auth-tabs" aria-label="Account access"><Link className="" to={`/signup?role=${selectedRole}`}>Sign up</Link><Link className="active" to={`/login?role=${selectedRole}`}>Login</Link></nav>
          <div className="header-titles">
            <h2>Welcome Back</h2>
            <p>Login to your CampusBite account</p>
          </div>

          <div className="selected-role-note"><strong>{selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} account</strong><Link to="/portals">Change role →</Link></div>
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
              <Link to={`/signup?role=${selectedRole}`}>Create Account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
