import React, { useState, useContext } from 'react';
import GeneralContext from './GeneralContext.js';
import './BuyActionWindow.css';
import axios from 'axios';

const BuyActionWindow = ({ uid }) => {

  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [product, setProduct] = useState("CNC");

  const { closeBuyWindow , triggerRefresh} = useContext(GeneralContext);

  const handleBuyClick = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://zerodhabackend-lrq5.onrender.com/newOrder",
        {
          name: uid,
          qty: Number(stockQuantity),
          price: Number(stockPrice),
          mode: "BUY",
          product: product
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      triggerRefresh();
      closeBuyWindow();

    } catch (err) {
      alert("Order failed");
    }
  };

  return (
    <div className="buy-window">

      <div className="buy-card">

        <h2 className="buy-title">Buy {uid}</h2>

        <div className="buy-section">

          {/* Product */}
          <div className="buy-field">
            <label>Product</label>
            <div className="product-toggle">
              <button
                className={`toggle-btn ${product === "CNC" ? "active" : ""}`}
                onClick={() => setProduct("CNC")}
              >
                CNC
              </button>

              <button
                className={`toggle-btn ${product === "MIS" ? "active" : ""}`}
                onClick={() => setProduct("MIS")}
              >
                MIS
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div className="buy-field">
            <label>Quantity</label>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
            />
          </div>

          {/* Price */}
          <div className="buy-field">
            <label>Price</label>
            <input
              type="number"
              step="0.05"
              value={stockPrice}
              onChange={(e) => setStockPrice(Number(e.target.value))}
            />
          </div>

        </div>

        <div className="buy-footer">
          <span className="buy-info">
            {product === "MIS"
              ? "Intraday trade (Margin)"
              : "Delivery trade"}
          </span>

          <div className="buy-actions">
            <button className="btn-primary" onClick={handleBuyClick}>
              Buy
            </button>

            <button className="btn-secondary" onClick={closeBuyWindow}>
              Cancel
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default BuyActionWindow;