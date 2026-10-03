import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaDownload, FaShareAlt, FaArrowRight, FaArrowLeft, FaPrint } from "react-icons/fa";

export default function Bill({ lastOrder, setCart }) {
  const navigate = useNavigate();
  const order =
    lastOrder ||
    JSON.parse(localStorage.getItem("lastOrder") || "null") || {
      id: "CB2410160032",
      orderDate: "16 Oct 2024",
      orderTime: "10:24 AM",
      customerName: "Akash R.",
      pickupTime: "Now (10-15 mins)",
      items: [
        { id: 2, name: "Masala Dosa", quantity: 1, price: 50 },
        { id: 5, name: "Filter Coffee", quantity: 2, price: 25 },
        { id: 3, name: "Pongal", quantity: 1, price: 40 },
      ],
      subtotal: 140,
      cgst: 3.5,
      sgst: 3.5,
      total: 147,
      paymentMethod: "UPI / QR",
      paymentStatus: "Paid",
    };

  const handleTrack = () => {
    if (setCart) setCart([]);
    navigate("/orders");
  };

  const handleDownload = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `CampusBite Order ${order.id}`,
        text: `My food court order ${order.id} is confirmed at PSGCAS Food Court! Total: ₹${order.total}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert(`Receipt link copied to clipboard: Order ${order.id}`);
    }
  };

  return (
    <main className="bill-invoice-page">
      <div className="invoice-container">
        {/* Top Navigation */}
        <div className="invoice-nav-row">
          <button className="back-btn" onClick={() => navigate("/menu")}>
            <FaArrowLeft />
          </button>
          <div className="invoice-title-badge-row">
            <h2>Order Invoice</h2>
            <span className="paid-status-badge">
              <FaCheckCircle /> Paid
            </span>
          </div>
        </div>

        {/* Printable Invoice Card (Screen 10 Replica) */}
        <motion.div
          className="invoice-card-replica"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Invoice ID and Date */}
          <div className="invoice-meta-header">
            <span className="order-id-tag">#{order.id}</span>
            <span className="order-timestamp">
              {order.orderDate}, {order.orderTime}
            </span>
          </div>

          <hr className="invoice-divider" />

          {/* College & Canteen Header */}
          <div className="college-bill-branding">
            <img src="/logo.jpg" alt="PSGCAS Logo" className="invoice-college-logo" />
            <div className="branding-text">
              <h3>CampusBite</h3>
              <p className="college-sub">PSG College of Arts & Science</p>
              <p className="food-court-sub">Food Court • Coimbatore - 641014</p>
            </div>
          </div>

          <div className="customer-pickup-details">
            <p><strong>Customer:</strong> {order.customerName}</p>
            <p><strong>Pickup Slot:</strong> <span className="slot-badge">{order.pickupTime}</span></p>
          </div>

          {/* Items Table */}
          <table className="invoice-items-table">
            <thead>
              <tr>
                <th className="th-item">Item</th>
                <th className="th-qty">Qty</th>
                <th className="th-price">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="td-name">{item.name}</td>
                  <td className="td-qty">{item.quantity}</td>
                  <td className="td-price">₹{(Number(item.price) * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Financial Breakdown */}
          <div className="invoice-totals-breakdown">
            <div className="line-row">
              <span>Subtotal</span>
              <span>₹{(Number(order.subtotal) || 140).toFixed(2)}</span>
            </div>
            <div className="line-row tax-line">
              <span>CGST (2.5%)</span>
              <span>₹{(Number(order.cgst) || 3.5).toFixed(2)}</span>
            </div>
            <div className="line-row tax-line">
              <span>SGST (2.5%)</span>
              <span>₹{(Number(order.sgst) || 3.5).toFixed(2)}</span>
            </div>
            <div className="line-row grand-total">
              <strong>Total</strong>
              <strong>₹{(Number(order.total) || 147).toFixed(2)}</strong>
            </div>
          </div>

          <div className="invoice-footer-message">
            <p className="blessing">Thank you for ordering with CampusBite!</p>
            <p className="sub-motto">Good Food, Brighter Days.</p>
          </div>
        </motion.div>

        {/* Invoice Action Buttons (Download & Share from Screen 10) */}
        <div className="invoice-action-buttons">
          <button className="action-btn download" onClick={handleDownload}>
            <FaDownload /> Download Invoice
          </button>
          <button className="action-btn share" onClick={handleShare}>
            <FaShareAlt /> Share
          </button>
        </div>

        <motion.button
          className="track-live-order-btn"
          onClick={handleTrack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Track Live Order Status <FaArrowRight />
        </motion.button>
      </div>
    </main>
  );
}
