import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUserCircle,
  FaUtensils,
  FaUserShield,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaExchangeAlt,
  FaShoppingCart,
  FaHome,
  FaReceipt,
  FaClipboardList,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ cartCount = 0 }) {
  const { user, role, openLoginModal, isAdmin, isKitchen, isTeacher, isStudent } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getRoleIcon = () => {
    if (role === "admin") return <FaUserShield className="role-badge-icon" />;
    if (role === "kitchen") return <FaUtensils className="role-badge-icon" />;
    if (role === "teacher") return <FaChalkboardTeacher className="role-badge-icon" />;
    return <FaUserGraduate className="role-badge-icon" />;
  };

  const getRoleLabel = () => {
    if (role === "admin") return "Admin";
    if (role === "kitchen") return "Kitchen";
    if (role === "teacher") return "Teacher";
    return "Student";
  };

  return (
    <>
      {/* Top Banner (Laptop / Desktop) */}
      <div className="top-bar-replica">
        <div className="top-bar-content">
          <div className="top-college-crest">
            <img src="/logo.jpg" alt="PSG Crest" className="crest-mini-img" />
            <span>PSG College of Arts & Science • Autonomous Institution</span>
          </div>
          <div className="top-bar-right">
            <span className="motto-tag">Good Food • Brighter Days</span>
            <button className="role-switch-btn" onClick={openLoginModal}>
              <FaExchangeAlt /> Portal: <strong>{getRoleLabel()}</strong>
            </button>
          </div>
        </div>
      </div>

      {/* Main Responsive Navbar */}
      <nav className="navbar-replica">
        <div className="navbar-container">
          <Link to="/" className="brand-link">
            <div className="brand">
              <motion.div
                className="logo-box"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <img src="/logo.jpg" alt="PSG CAS Logo" className="brand-logo-img" />
              </motion.div>

              <div className="brand-text">
                <h2>CampusBite</h2>
                <p>PSG College of Arts & Science Food Court</p>
              </div>
            </div>
          </Link>

          {/* Nav Links for Laptop/Desktop */}
          <div className="desktop-nav-links">
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
            <Link to="/menu" className={location.pathname === "/menu" ? "active" : ""}>
              Menu
            </Link>

            {/* Teacher Portal shortcut */}
            <Link
              to="/teacher"
              className={`portal-link teacher-link ${location.pathname === "/teacher" ? "active" : ""}`}
            >
              <FaChalkboardTeacher /> Teacher Lounge
            </Link>

            {/* Admin shortcut */}
            {isAdmin && (
              <Link
                to="/admin"
                className={`portal-link admin-link ${location.pathname === "/admin" ? "active" : ""}`}
              >
                <FaUserShield /> Admin Panel
              </Link>
            )}

            {/* Kitchen shortcut */}
            {isKitchen && (
              <Link
                to="/kitchen"
                className={`portal-link kitchen-link ${location.pathname === "/kitchen" ? "active" : ""}`}
              >
                <FaUtensils /> Kitchen KDS
              </Link>
            )}

            {/* Cart & Orders */}
            <Link to="/cart" className={`cart-link-btn ${location.pathname === "/cart" ? "active" : ""}`}>
              <FaShoppingCart />
              <span>Cart</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <Link to="/orders" className={location.pathname === "/orders" ? "active" : ""}>
              Orders
            </Link>

            {/* User Profile Pill with Switcher */}
            <motion.div
              className={`user-role-pill ${role}`}
              onClick={openLoginModal}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              title="Click to switch role or login"
            >
              {getRoleIcon()}
              <div className="user-pill-text">
                <span className="user-name">{user?.fullName || user?.username}</span>
                <span className="user-role-label">{getRoleLabel()}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar (Matching Screens 01, 04, 05, 12, 13) */}
      <div className="mobile-bottom-nav">
        <Link to="/" className={`bottom-nav-item ${location.pathname === "/" ? "active" : ""}`}>
          <FaHome />
          <span>Home</span>
        </Link>
        <Link to="/menu" className={`bottom-nav-item ${location.pathname === "/menu" ? "active" : ""}`}>
          <FaUtensils />
          <span>Menu</span>
        </Link>
        <Link to="/cart" className={`bottom-nav-item cart-item ${location.pathname === "/cart" ? "active" : ""}`}>
          <div className="cart-icon-wrap">
            <FaShoppingCart />
            {cartCount > 0 && <span className="bottom-cart-badge">{cartCount}</span>}
          </div>
          <span>Cart</span>
        </Link>
        <Link to="/orders" className={`bottom-nav-item ${location.pathname === "/orders" ? "active" : ""}`}>
          <FaClipboardList />
          <span>Orders</span>
        </Link>
        <button className="bottom-nav-item profile-item" onClick={openLoginModal}>
          {getRoleIcon()}
          <span>{getRoleLabel()}</span>
        </button>
      </div>
    </>
  );
}
