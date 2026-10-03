import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaQrcode,
  FaCreditCard,
  FaWallet,
  FaCopy,
  FaCheck,
  FaLock,
  FaBolt,
  FaArrowRight,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { placeOrder } from "../api/dataService";

export default function Payment({ cart, setLastOrder }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("upi"); // 'upi' | 'card' | 'wallet'
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const cgst = subtotal * 0.025;
  const sgst = subtotal * 0.025;
  const grandTotal = Math.round((subtotal + cgst + sgst) * 100) / 100;

  const upiId = "campusbite@psg";
  const paymentUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent("PSGCAS CampusBite")}&am=${grandTotal.toFixed(2)}&cu=INR&tn=CampusBite%20Order`;

  const copyUpi = () => {
    navigator.clipboard?.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const completePayment = async () => {
    if (!cart.length) {
      navigate("/menu");
      return;
    }

    const pickupTime = localStorage.getItem("pickupTime") || "Now (10-15 mins)";
    setSubmitting(true);

    try {
      const customerName = user?.fullName || "PSGCAS Student";
      const payload = {
        customer_name: customerName,
        pickup_time: pickupTime,
        payment_method: activeTab,
        total_amount: grandTotal,
        items: cart.map((item) => ({
          food_id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const result = await placeOrder(payload);

      const orderData = {
        id: `CB${Date.now().toString().slice(-10)}`,
        rawId: result.data.id,
        items: cart,
        subtotal: subtotal,
        cgst: cgst,
        sgst: sgst,
        total: grandTotal,
        customerName: customerName,
        paymentMethod: activeTab === "upi" ? "UPI / QR" : activeTab.toUpperCase(),
        paymentStatus: "Paid",
        pickupTime: pickupTime,
        orderTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        orderDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        status: "preparing", // Screen 11 shows active preparing status
        role: user?.role || "student",
      };

      setLastOrder(orderData);
      localStorage.setItem("lastOrder", JSON.stringify(orderData));
      navigate("/bill");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="payment-page-replica">
      <div className="payment-container">
        {/* Navigation & Titles */}
        <div className="payment-header-row">
          <button className="back-btn" onClick={() => navigate("/pickup-time")}>
            <FaArrowLeft />
          </button>
          <div>
            <h1>Payment</h1>
            <p>Complete your payment using UPI</p>
          </div>
        </div>

        {/* Payment Tabs: [ UPI / QR ] [ Card ] [ Wallet ] (Screen 09) */}
        <div className="payment-nav-tabs">
          <button
            className={`pay-tab-btn ${activeTab === "upi" ? "active" : ""}`}
            onClick={() => setActiveTab("upi")}
          >
            <FaQrcode /> UPI / QR
          </button>
          <button
            className={`pay-tab-btn ${activeTab === "card" ? "active" : ""}`}
            onClick={() => setActiveTab("card")}
          >
            <FaCreditCard /> Card
          </button>
          <button
            className={`pay-tab-btn ${activeTab === "wallet" ? "active" : ""}`}
            onClick={() => setActiveTab("wallet")}
          >
            <FaWallet /> Wallet
          </button>
        </div>

        {/* Tab 1: UPI / QR Code Section */}
        {activeTab === "upi" && (
          <motion.div
            className="upi-qr-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="scan-pay-title">Scan & Pay</span>

            <div className="qr-box-frame">
              <QRCodeSVG
                value={paymentUrl}
                size={210}
                bgColor="#ffffff"
                fgColor="#111e38"
                level="Q"
                includeMargin={false}
              />
            </div>

            <div className="amount-payable-badge">
              <span>Grand Total</span>
              <strong>₹{grandTotal.toFixed(2)}</strong>
            </div>

            {/* UPI ID with copy button */}
            <div className="upi-id-pill" onClick={copyUpi} title="Click to copy UPI ID">
              <span>UPI ID: <strong>{upiId}</strong></span>
              <button className="copy-icon-btn" aria-label="Copy UPI ID">
                {copied ? <FaCheck className="copied" /> : <FaCopy />}
              </button>
            </div>

            {/* Supported Payment App Logos */}
            <div className="upi-apps-row">
              <span className="app-badge gpay">Google Pay</span>
              <span className="app-badge phonepe">PhonePe</span>
              <span className="app-badge paytm">Paytm</span>
              <span className="app-badge bhim">BHIM UPI</span>
            </div>

            <p className="scan-helper-text">
              Scan the QR code using any UPI app and complete the payment.
            </p>
          </motion.div>
        )}

        {/* Tab 2: Card */}
        {activeTab === "card" && (
          <div className="card-mock-form">
            <div className="form-group">
              <label>Card Number</label>
              <input type="text" placeholder="4123 •••• •••• 8842" readOnly value="4123 •••• •••• 8842" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiry</label>
                <input type="text" placeholder="12/28" readOnly value="12/28" />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input type="password" placeholder="•••" readOnly value="•••" />
              </div>
            </div>
            <p className="card-notice"><FaLock /> 256-bit encrypted PSGCAS Campus Smart Pay</p>
          </div>
        )}

        {/* Tab 3: Wallet */}
        {activeTab === "wallet" && (
          <div className="wallet-mock-list">
            <div className="wallet-choice active">
              <FaWallet />
              <div>
                <strong>PSG Student Campus Wallet</strong>
                <p>Available Balance: ₹450.00</p>
              </div>
            </div>
          </div>
        )}

        {/* Primary Action Button: "I've Paid, Verify Payment" */}
        <motion.button
          className="verify-pay-btn"
          disabled={submitting}
          onClick={completePayment}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {submitting ? "Verifying Payment..." : "I've Paid, Verify Payment →"}
        </motion.button>
      </div>
    </main>
  );
}
