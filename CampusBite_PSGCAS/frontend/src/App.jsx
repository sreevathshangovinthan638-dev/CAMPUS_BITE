import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import RoleAuthModal from "./components/RoleAuthModal";
import DeviceSwitchBar, { SCREENS_LIST } from "./components/DeviceSwitchBar";

// 14 Mockup Screens
import Home from "./pages/Home";
import RoleSignupPage from "./pages/RoleSignupPage";
import RoleLoginPage from "./pages/RoleLoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import PickupTime from "./pages/PickupTime";
import Payment from "./pages/Payment";
import Bill from "./pages/Bill";
import Orders from "./pages/Orders";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import KitchenDashboard from "./pages/KitchenDashboard";

import "./styles/campusbite.css";

function AppContent() {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("campusbite_cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [lastOrder, setLastOrder] = useState(() => {
    try {
      const stored = localStorage.getItem("lastOrder");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Cross-device simulator state (toggle between Laptop Web View & Mobile Phone Frame)
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("campusbite_cart", JSON.stringify(cart));
  }, [cart]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  return (
    <div className={`app-root ${isMobileFrame ? "mobile-simulator-active" : "laptop-view-active"}`}>
      {/* Interactive Top Switcher Bar (Laptop Web View <-> Mobile App View & 14 Screens Jumper) */}
      <DeviceSwitchBar
        currentScreen={location.pathname}
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        navigate={navigate}
      />

      {/* Simulator Wrapper: When Mobile View is selected, wraps content in an authentic iPhone bezel */}
      <div className={isMobileFrame ? "iphone-device-frame" : "desktop-browser-container"}>
        {isMobileFrame && (
          <div className="iphone-status-bar">
            <span className="status-time">9:41</span>
            <div className="iphone-notch">
              <span className="camera-lens"></span>
              <span className="speaker-ear"></span>
            </div>
            <div className="status-icons">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Global Navigation */}
        <Navbar cartCount={cartCount} />

        {/* Auth Modal with Teacher, Student, Admin, Kitchen */}
        <RoleAuthModal />

        {/* Main Routes */}
        <div className="app-main-viewport">
          <Routes>
            {/* 01. Home Page */}
            <Route path="/" element={<Home />} />

            {/* 02. Role Signup */}
            <Route path="/signup" element={<RoleSignupPage />} />

            {/* 03. Role Login */}
            <Route path="/login" element={<RoleLoginPage />} />

            {/* 04. Student Dashboard */}
            <Route
              path="/student"
              element={<StudentDashboard cart={cart} setCart={setCart} />}
            />

            {/* 05 & 06. Menu & Categories */}
            <Route path="/menu" element={<Menu cart={cart} setCart={setCart} />} />

            {/* 07. Cart Page */}
            <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />

            {/* 08. Pickup Time Selection */}
            <Route path="/pickup-time" element={<PickupTime />} />

            {/* 09. Payment Page (UPI / QR) */}
            <Route
              path="/payment"
              element={<Payment cart={cart} setLastOrder={setLastOrder} />}
            />

            {/* 10. Pay-Bill / Invoice */}
            <Route
              path="/bill"
              element={<Bill lastOrder={lastOrder} setCart={setCart} />}
            />

            {/* 11. Order Tracking */}
            <Route path="/orders" element={<Orders />} />

            {/* 12. Teacher Dashboard */}
            <Route
              path="/teacher"
              element={<TeacherDashboard cart={cart} setCart={setCart} />}
            />

            {/* 13. Admin Dashboard */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* 14. Kitchen Dashboard */}
            <Route path="/kitchen" element={<KitchenDashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
