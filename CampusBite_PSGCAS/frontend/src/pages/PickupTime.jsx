import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaClock, FaCalendarAlt, FaCheck, FaArrowRight, FaArrowLeft, FaBolt } from "react-icons/fa";

export default function PickupTime() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState("today");
  const [selectedSlot, setSelectedSlot] = useState("Now (10-15 mins)");

  const days = [
    { key: "today", label: "Today", date: "Oct 16, 2024" },
    { key: "tomorrow", label: "Tomorrow", date: "Oct 17" },
    { key: "day3", label: "Fri", date: "Oct 18" },
  ];

  const slots = [
    {
      id: "now",
      time: "Now (10-15 mins)",
      desc: "Get it as soon as possible • Kitchen preps immediately",
      isFast: true,
    },
    { id: "s1", time: "11:00 AM – 11:15 AM", desc: "Morning Tea Break slot" },
    { id: "s2", time: "11:15 AM – 11:30 AM", desc: "Short Break slot" },
    { id: "s3", time: "12:00 PM – 12:15 PM", desc: "Lunch Period 1" },
    { id: "s4", time: "12:15 PM – 12:30 PM", desc: "Lunch Period 2" },
    { id: "s5", time: "01:00 PM – 01:15 PM", desc: "Afternoon slot" },
  ];

  const handleContinue = () => {
    localStorage.setItem("pickupTime", selectedSlot);
    localStorage.setItem("pickupDay", selectedDay);
    navigate("/payment");
  };

  return (
    <div className="pickup-time-page">
      <div className="pickup-container">
        {/* Navigation back */}
        <div className="page-header-nav">
          <button className="back-circle-btn" onClick={() => navigate("/cart")}>
            <FaArrowLeft />
          </button>
          <div className="header-titles">
            <h2>Select Pickup Time</h2>
            <p>Choose a convenient time to collect your order</p>
          </div>
        </div>

        {/* Day Selector Tabs (Matching Mockup Screen 08) */}
        <div className="day-tabs-container">
          {days.map((day) => (
            <button
              key={day.key}
              className={`day-tab-btn ${selectedDay === day.key ? "active" : ""}`}
              onClick={() => setSelectedDay(day.key)}
            >
              <span className="day-name">{day.label}</span>
              <span className="day-date">{day.date}</span>
            </button>
          ))}
        </div>

        {/* Slot Radio Cards (Matching Mockup Screen 08) */}
        <div className="slots-list">
          {slots.map((slot) => {
            const isSelected = selectedSlot === slot.time;
            return (
              <motion.div
                key={slot.id}
                className={`slot-card ${isSelected ? "selected" : ""} ${slot.isFast ? "fast-slot" : ""}`}
                onClick={() => setSelectedSlot(slot.time)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="slot-left">
                  <div className={`slot-icon-box ${slot.isFast ? "bolt-icon" : ""}`}>
                    {slot.isFast ? <FaBolt /> : <FaClock />}
                  </div>
                  <div className="slot-details">
                    <div className="slot-time-row">
                      <strong>{slot.time}</strong>
                      {slot.isFast && <span className="recommended-badge">Fastest</span>}
                    </div>
                    <p>{slot.desc}</p>
                  </div>
                </div>

                <div className={`radio-circle ${isSelected ? "checked" : ""}`}>
                  {isSelected && <FaCheck />}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Continue Action Button */}
        <motion.button
          className="continue-pickup-btn"
          onClick={handleContinue}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue to Payment <FaArrowRight />
        </motion.button>
      </div>
    </div>
  );
}
