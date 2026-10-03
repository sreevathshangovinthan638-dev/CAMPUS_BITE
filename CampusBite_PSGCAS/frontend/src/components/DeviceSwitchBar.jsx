import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaMobileAlt,
  FaLaptop,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaExternalLinkAlt,
  FaListOl,
} from "react-icons/fa";

export const SCREENS_LIST = [
  { id: 1, key: "home", label: "01. Home Page", path: "/" },
  { id: 2, key: "signup", label: "02. Role Signup", path: "/signup" },
  { id: 3, key: "login", label: "03. Role Login", path: "/login" },
  { id: 4, key: "student", label: "04. Student Dashboard", path: "/student" },
  { id: 5, key: "categories", label: "05. Menu / Categories", path: "/menu" },
  { id: 6, key: "food-items", label: "06. Food Items Page", path: "/menu?cat=breakfast" },
  { id: 7, key: "cart", label: "07. Cart Page", path: "/cart" },
  { id: 8, key: "pickup", label: "08. Pickup Time Selection", path: "/pickup-time" },
  { id: 9, key: "payment", label: "09. Payment Page (UPI/QR)", path: "/payment" },
  { id: 10, key: "invoice", label: "10. Pay-Bill / Invoice", path: "/bill" },
  { id: 11, key: "tracking", label: "11. Order Tracking", path: "/orders" },
  { id: 12, key: "teacher", label: "12. Teacher Dashboard", path: "/teacher" },
  { id: 13, key: "admin", label: "13. Admin Dashboard", path: "/admin" },
  { id: 14, key: "kitchen", label: "14. Kitchen Dashboard", path: "/kitchen" },
];

export default function DeviceSwitchBar({ currentScreen, isMobileFrame, setIsMobileFrame, navigate }) {
  const [isScreenNavOpen, setIsScreenNavOpen] = useState(false);

  return (
    <div className="device-switch-top-bar">
      <div className="switch-left">
        <span className="project-badge">PSGCAS CampusBite Design System</span>
        <button
          className="screen-directory-toggle-btn"
          onClick={() => setIsScreenNavOpen(!isScreenNavOpen)}
        >
          <FaListOl /> 14 Screens Replica Menu {isScreenNavOpen ? "▲" : "▼"}
        </button>
      </div>

      <div className="switch-right">
        {/* Toggle between Laptop Web View & Mobile App Frame */}
        <div className="device-toggle-pills">
          <button
            className={`device-btn ${!isMobileFrame ? "active" : ""}`}
            onClick={() => setIsMobileFrame(false)}
            title="Switch to full-width responsive laptop website mode"
          >
            <FaLaptop /> Laptop Web View
          </button>
          <button
            className={`device-btn ${isMobileFrame ? "active" : ""}`}
            onClick={() => setIsMobileFrame(true)}
            title="Switch to mobile phone app replica preview"
          >
            <FaMobileAlt /> Mobile App View
          </button>
        </div>
      </div>

      {/* Screen Selector Drawer */}
      {isScreenNavOpen && (
        <div className="screen-selector-drawer">
          <div className="drawer-header">
            <h4>Quick Jump to Any of the 14 Mockup Screens:</h4>
            <button className="drawer-close" onClick={() => setIsScreenNavOpen(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="screens-chips-grid">
            {SCREENS_LIST.map((scr) => (
              <button
                key={scr.id}
                className="screen-chip-btn"
                onClick={() => {
                  navigate(scr.path);
                  setIsScreenNavOpen(false);
                }}
              >
                {scr.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
