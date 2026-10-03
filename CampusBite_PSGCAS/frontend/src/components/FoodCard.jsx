import { useState } from "react";
import { motion } from "framer-motion";
import { FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";

function FoodCard({ food, addToCart }) {
  const [qty, setQty] = useState(1);

  const imageSource =
    food.image ||
    food.image_url ||
    `https://placehold.co/600x400?text=${encodeURIComponent(food.name)}`;

  return (
    <motion.div
      className="food-card"
      whileHover={{ y: -6, boxShadow: "0 14px 28px rgba(0, 0, 0, 0.12)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="food-img-container">
        <img src={imageSource} alt={food.name} loading="lazy" />
        <span className="category-label">{food.category_name}</span>
      </div>

      <div className="food-details">
        <h3>{food.name}</h3>
        <p>{food.description}</p>

        <h4>Price: ₹{food.price}</h4>

        <div className="quantity">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => qty > 1 && setQty(qty - 1)}
            aria-label="Decrease quantity"
          >
            <FaMinus />
          </motion.button>
          <strong>{qty}</strong>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setQty(qty + 1)}
            aria-label="Increase quantity"
          >
            <FaPlus />
          </motion.button>
        </div>

        <p className="food-total">
          Total: ₹{(Number(food.price) * qty).toFixed(2)}
        </p>

        <motion.button
          className="cart-button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            addToCart(food, qty);
            setQty(1);
          }}
        >
          <FaShoppingCart /> Add To Cart
        </motion.button>
      </div>
    </motion.div>
  );
}

export default FoodCard;
