import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaPlus, FaMinus, FaArrowRight, FaArrowLeft, FaUtensils, FaCommentDots } from "react-icons/fa";

export default function Cart({ cart, setCart }) {
  const navigate = useNavigate();
  const [specialInstructions, setSpecialInstructions] = useState(() => {
    return localStorage.getItem("cartSpecialInstructions") || "";
  });

  const updateQuantity = (id, delta) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const proceedToPickup = () => {
    if (cart.length === 0) return;
    localStorage.setItem("cartSpecialInstructions", specialInstructions);
    navigate("/pickup-time");
  };

  return (
    <main className="cart-page-replica">
      <div className="cart-page-container">
        {/* Navigation & Title (Matching Mockup Screen 07) */}
        <div className="cart-header-row">
          <button className="back-btn" onClick={() => navigate("/menu")}>
            <FaArrowLeft />
          </button>
          <div>
            <h1>Your Cart</h1>
            <p>Review your items before selecting pickup time</p>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart-state">
            <span className="empty-bag-icon">🛍️</span>
            <h2>Your cart is empty</h2>
            <p>Add some delicious meals or hot snacks from the PSGCAS Food Court.</p>
            <button className="browse-menu-action-btn" onClick={() => navigate("/menu")}>
              <FaUtensils /> Browse Food Menu
            </button>
          </div>
        ) : (
          <div className="cart-layout-grid">
            {/* Left: Items list */}
            <div className="cart-items-section">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    className="cart-card-replica"
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <img
                      src={item.image || item.image_url}
                      alt={item.name}
                      className="cart-thumb"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop&q=80";
                      }}
                    />

                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      <p className="cart-item-price">₹{item.price}</p>
                    </div>

                    <div className="cart-item-actions">
                      <div className="quantity-box">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label="Decrease"
                        >
                          <FaMinus />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label="Increase"
                        >
                          <FaPlus />
                        </button>
                      </div>

                      <button
                        className="delete-trash-btn"
                        onClick={() => removeItem(item.id)}
                        title="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Special Instructions (Optional) matching Screen 07 */}
              <div className="special-instructions-card">
                <label htmlFor="specialNotes">
                  <FaCommentDots /> Special Instructions (Optional)
                </label>
                <input
                  id="specialNotes"
                  type="text"
                  placeholder="e.g. less spicy, no onion, extra sambar..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </div>
            </div>

            {/* Right: Bill Summary */}
            <div className="cart-summary-section">
              <div className="cart-bill-card">
                <h3>Order Summary</h3>
                <div className="summary-line">
                  <span>Total Items</span>
                  <strong>{totalItems}</strong>
                </div>
                <div className="summary-line highlight">
                  <span>Subtotal</span>
                  <strong>₹{subtotal.toFixed(2)}</strong>
                </div>
                <div className="tax-notice">
                  <span>CGST (2.5%) & SGST (2.5%) calculated at invoice</span>
                </div>

                <motion.button
                  className="proceed-pickup-btn"
                  onClick={proceedToPickup}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Proceed to Pickup Time <FaArrowRight />
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
