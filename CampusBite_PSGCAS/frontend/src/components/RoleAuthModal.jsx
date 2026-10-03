import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGraduationCap,
  FaChalkboardTeacher,
  FaUserShield,
  FaUtensils,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaCheck,
  FaGoogle,
  FaLock,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function RoleAuthModal() {
  const {
    isLoginModalOpen,
    closeLoginModal,
    targetInitialRole,
    loginWithCredentials,
    registerUser,
    role: currentRole,
  } = useAuth();

  const navigate = useNavigate();

  // Screen mode: 'login' (Screen 03) or 'signup' (Screen 02)
  const [viewMode, setViewMode] = useState("login");
  const [selectedRole, setSelectedRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (targetInitialRole) {
      setSelectedRole(targetInitialRole);
    }
  }, [targetInitialRole]);

  // Pre-fill demo credentials when switching tabs
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

  if (!isLoginModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await loginWithCredentials(username, password, selectedRole);
      closeLoginModal();
      if (selectedRole === "teacher") navigate("/teacher");
      else if (selectedRole === "admin") navigate("/admin");
      else if (selectedRole === "kitchen") navigate("/kitchen");
      else navigate("/menu");
    } catch (err) {
      setError("Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await registerUser({
        username,
        password,
        full_name: fullName,
        roll_number: rollNumber,
        email,
        role: selectedRole,
      });
      closeLoginModal();
      if (selectedRole === "teacher") navigate("/teacher");
      else navigate("/menu");
    } catch (err) {
      setError("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const roleCardOptions = [
    {
      id: "student",
      title: "Student",
      subtitle: "Order food easily",
      icon: <FaGraduationCap />,
      color: "navy",
    },
    {
      id: "teacher",
      title: "Teacher",
      subtitle: "Quick & convenient",
      icon: <FaChalkboardTeacher />,
      color: "gold",
    },
    {
      id: "admin",
      title: "Admin",
      subtitle: "Manage food court",
      icon: <FaUserShield />,
      color: "blue",
    },
    {
      id: "kitchen",
      title: "Kitchen Staff",
      subtitle: "Handle orders",
      icon: <FaUtensils />,
      color: "amber",
    },
  ];

  return (
    <AnimatePresence>
      <div className="auth-overlay-replica" onClick={closeLoginModal}>
        <motion.div
          className="auth-modal-card-replica"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
        >
          {/* Top College Header */}
          <div className="modal-top-bar">
            <div className="psg-header-brand">
              <img src="/logo.jpg" alt="PSG Logo" className="modal-psg-crest" />
              <span>PSG College of Arts & Science</span>
            </div>
            <button className="close-btn" onClick={closeLoginModal}>
              <FaTimes />
            </button>
          </div>

          {/* SCREEN 02: ROLE SIGNUP */}
          {viewMode === "signup" && (
            <div className="signup-flow-view">
              <div className="form-title-group">
                <h2>Create Your Account</h2>
                <p>Join CampusBite and choose your role</p>
              </div>

              {/* 4 Role Selection Cards */}
              <div className="role-cards-selector">
                {roleCardOptions.map((opt) => {
                  const isSelected = selectedRole === opt.id;
                  return (
                    <div
                      key={opt.id}
                      className={`role-option-card ${isSelected ? "selected" : ""}`}
                      onClick={() => setSelectedRole(opt.id)}
                    >
                      <div className={`role-card-icon ${opt.color}`}>{opt.icon}</div>
                      <div className="role-card-details">
                        <h4>{opt.title}</h4>
                        <p>{opt.subtitle}</p>
                      </div>
                      <div className={`selection-radio ${isSelected ? "checked" : ""}`}>
                        {isSelected && <FaCheck />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input for name/id */}
              <form onSubmit={handleRegisterSubmit} className="register-inner-form">
                <div className="form-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Priya or Akash R."
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>{selectedRole === "teacher" ? "Faculty Staff ID" : "Register / Roll Number"}</label>
                  <input
                    type="text"
                    placeholder={selectedRole === "teacher" ? "e.g. FAC-8842" : "e.g. 23BCS042"}
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Username</label>
                  <input
                    type="text"
                    placeholder="Choose username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Set password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="primary-action-btn" disabled={loading}>
                  {loading ? "Creating Account..." : "Continue"}
                </button>
              </form>

              <div className="auth-footer-link">
                <span>Already have an account? </span>
                <button className="link-button" onClick={() => setViewMode("login")}>
                  Login
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 03: ROLE LOGIN */}
          {viewMode === "login" && (
            <div className="login-flow-view">
              <div className="form-title-group">
                <h2>Welcome Back</h2>
                <p>Login to your CampusBite account</p>
              </div>

              {/* 4 Role Tabs (Student | Teacher | Admin | Kitchen) */}
              <div className="role-tabs-bar">
                {roleCardOptions.map((opt) => (
                  <button
                    key={opt.id}
                    className={`role-tab-btn ${selectedRole === opt.id ? "active" : ""}`}
                    onClick={() => {
                      setSelectedRole(opt.id);
                      setError("");
                    }}
                  >
                    {opt.title}
                  </button>
                ))}
              </div>

              {error && <div className="login-error-alert">{error}</div>}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="login-inner-form">
                <div className="form-field">
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
                    placeholder={
                      selectedRole === "teacher"
                        ? "teacher or priya@psgcas.ac.in"
                        : "student or 23BCS042"
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Password</label>
                  <div className="password-input-wrap">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="eye-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="remember-forgot-row">
                  <label className="checkbox-wrap">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to registered PSGCAS email."); }}>
                    Forgot Password?
                  </a>
                </div>

                <button type="submit" className="primary-action-btn" disabled={loading}>
                  {loading ? "Authenticating..." : "Login"}
                </button>

                <div className="divider-or">
                  <span>or continue with</span>
                </div>

                {/* Google Sign In */}
                <button
                  type="button"
                  className="google-sign-in-btn"
                  onClick={() => {
                    handleLoginSubmit({ preventDefault: () => {} });
                  }}
                >
                  <FaGoogle className="google-icon" /> Sign in with Google (PSGCAS Mail)
                </button>

                <div className="auth-footer-link">
                  <span>New to CampusBite? </span>
                  <button className="link-button" onClick={() => setViewMode("signup")}>
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
