import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaFire,
  FaShoppingBag,
  FaUtensils,
  FaSmile,
  FaClock,
  FaMotorcycle,
  FaSync,
} from "react-icons/fa";

export default function Orders() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("lastOrder") || "null") || {
        id: "CB2410160032",
        orderDate: "16 Oct 2024",
        orderTime: "10:24 AM",
        status: "preparing",
        pickupTime: "10:40 AM",
        items: [
          { name: "Masala Dosa", quantity: 1, price: 50 },
          { name: "Filter Coffee", quantity: 2, price: 25 },
          { name: "Pongal", quantity: 1, price: 40 },
        ],
      }
    );
  });

  useEffect(() => {
    const sync = () => { try { const saved=JSON.parse(localStorage.getItem("lastOrder") || "null"); if(saved) setOrder(saved); } catch {} };
    window.addEventListener("storage",sync); window.addEventListener("campusbite-orders-updated",sync);
    return () => {window.removeEventListener("storage",sync);window.removeEventListener("campusbite-orders-updated",sync);};
  }, []);
  const [activeStep, setActiveStep] = useState(1); // 0 = Placed, 1 = Preparing, 2 = Ready, 3 = Completed

  useEffect(() => {
    if (order.status === "pending") setActiveStep(0);
    else if (order.status === "preparing") setActiveStep(1);
    else if (order.status === "ready") setActiveStep(2);
    else if (order.status === "collected" || order.status === "completed") setActiveStep(3);
  }, [order.status]);

  const advanceStepForDemo = () => {
    const next = (activeStep + 1) % 4;
    setActiveStep(next);
    const statuses = ["pending", "preparing", "ready", "completed"];
    const updated = { ...order, status: statuses[next] };
    setOrder(updated);
    localStorage.setItem("lastOrder", JSON.stringify(updated));
  };

  const steps = [
    {
      title: "Order Placed",
      time: order.orderTime || "",
      desc: "Your order has been confirmed",
      icon: <FaCheckCircle />,
    },
    {
      title: "Preparing",
      time: "",
      desc: "Our kitchen is preparing your food",
      icon: <FaFire />,
    },
    {
      title: "Ready for Pickup",
      time: "",
      desc: "Your order is ready at the counter",
      icon: <FaShoppingBag />,
    },
    {
      title: "Completed",
      time: "",
      desc: "Enjoy your meal!",
      icon: <FaSmile />,
    },
  ];

  return (
    <main className="tracking-page-replica">
      <div className="tracking-container">
        {/* Top Header */}
        <div className="tracking-header-row">
          <button className="back-btn" onClick={() => navigate("/menu")}>
            <FaArrowLeft />
          </button>
          <div className="tracking-titles">
            <h2>Order #{order.id}</h2>
            <p>Placed at {order.orderTime || "10:24 AM"}</p>
          </div>
        </div>

        {/* Vertical Tracking Stepper (Matching Screen 11) */}
        <div className="tracking-stepper-card">
          <div className="stepper-timeline">
            {steps.map((step, idx) => {
              const isPast = idx < activeStep;
              const isCurrent = idx === activeStep;
              const isUpcoming = idx > activeStep;

              return (
                <div
                  key={step.title}
                  className={`timeline-step-row ${
                    isPast ? "completed" : isCurrent ? "current" : "upcoming"
                  }`}
                >
                  <div className="step-indicator-col">
                    <div className="indicator-node">
                      {isPast ? <FaCheckCircle /> : isCurrent ? <span className="pulsing-dot"></span> : <span className="empty-circle"></span>}
                    </div>
                    {idx < steps.length - 1 && <div className="timeline-connector-bar"></div>}
                  </div>

                  <div className="step-text-col">
                    <div className="step-title-time">
                      <strong>{step.title}</strong>
                      <span className="step-time">{step.time}</span>
                    </div>
                    <p className="step-desc">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Estimated Ready Time Box (Matching Screen 11) */}
        <motion.div
          className="estimated-ready-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="ready-left">
            <span className="label-caption">Estimated Ready Time</span>
            <div className="ready-time-highlight">
              <h3>10:40 AM</h3>
              <span className="diff-pill">(about 5 mins)</span>
            </div>
            <p className="counter-reminder">Collect at PSGCAS Food Court Counter 2</p>
          </div>

          <div className="scooter-visual">
            <span className="delivery-icon">🛵</span>
          </div>
        </motion.div>

        {/* Demo Fast-Forward Button for Project Reviews */}
        <div className="tracking-footer-actions">
          <button className="demo-step-advance-btn" onClick={advanceStepForDemo}>
            <FaSync /> Advance Status (Demo Review)
          </button>
          <button className="return-menu-btn" onClick={() => navigate("/menu")}>
            <FaUtensils /> Order More Food
          </button>
        </div>
      </div>
    </main>
  );
}
