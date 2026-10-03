import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaChalkboardTeacher,
  FaUserShield,
  FaUtensils,
  FaCheck,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function RoleSignupPage() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState("student");
  const [fullName, setFullName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      id: "student",
      title: "Student",
      subtitle: "Order food easily",
      icon: <FaGraduationCap />,
    },
    {
      id: "teacher",
      title: "Teacher",
      subtitle: "Quick & convenient",
      icon: <FaChalkboardTeacher />,
    },
    {
      id: "admin",
      title: "Admin",
      subtitle: "Manage food court",
      icon: <FaUserShield />,
    },
    {
      id: "kitchen",
      title: "Kitchen Staff",
      subtitle: "Handle orders",
      icon: <FaUtensils />,
    },
  ];

  const handleContinue = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser({
        username: username || `${selectedRole}_${Date.now().toString().slice(-4)}`,
        password: password || "pass123",
        full_name: fullName || (selectedRole === "teacher" ? "Dr. Priya" : "Akash R."),
        roll_number: rollNumber || (selectedRole === "teacher" ? "FAC-8842" : "23BCS042"),
        role: selectedRole,
      });
      if (selectedRole === "teacher") navigate("/teacher");
      else if (selectedRole === "admin") navigate("/admin");
      else if (selectedRole === "kitchen") navigate("/kitchen");
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
          <img src="/logo.jpg" alt="PSG Logo" className="header-logo" />
          <span>PSG College of Arts & Science</span>
        </div>

        {/* Screen 02 Content */}
        <div className="auth-content-box">
          <div className="header-titles">
            <h2>Create Your Account</h2>
            <p>Join CampusBite and choose your role</p>
          </div>

          {/* 4 Role Option Cards */}
          <div className="roles-options-vertical">
            {roles.map((r) => {
              const isSelected = selectedRole === r.id;
              return (
                <motion.div
                  key={r.id}
                  className={`role-select-box ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedRole(r.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="role-icon-col">{r.icon}</div>
                  <div className="role-text-col">
                    <h4>{r.title}</h4>
                    <p>{r.subtitle}</p>
                  </div>
                  <div className={`radio-dot ${isSelected ? "checked" : ""}`}>
                    {isSelected && <FaCheck />}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <form onSubmit={handleContinue} className="signup-quick-form">
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder={selectedRole === "teacher" ? "e.g. Dr. Priya V." : "e.g. Akash R."}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>{selectedRole === "teacher" ? "Faculty Staff ID" : "Register / Roll Number"}</label>
              <input
                type="text"
                placeholder={selectedRole === "teacher" ? "e.g. FAC-8842" : "e.g. 23BCS042"}
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
              />
            </div>

            <motion.button
              type="submit"
              className="continue-submit-btn"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Creating Account..." : "Continue"}
            </motion.button>
          </form>

          <div className="bottom-switch-link">
            <span>Already have an account? </span>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
