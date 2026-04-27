import React, { useState, useContext, useEffect } from 'react';
import GeneralContext from './GeneralContext.js';
import './BuyActionWindow.css';
import axios from 'axios';

const SellActionWindow = ({ uid }) => {

  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [availableQty, setAvailableQty] = useState(0);
  const [product, setProduct] = useState("CNC");

  const { closeSellWindow , triggerRefresh} = useContext(GeneralContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        console.log("Fetching data for:", uid);

        // ✅ 1. Check Holdings
        const holdingRes = await axios.get(
          `https://zerodhabackend-lrq5.onrender.com/holding/${uid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log("Holding API:", holdingRes.data);

        if (holdingRes.data && holdingRes.data.qty > 0) {
          setAvailableQty(holdingRes.data.qty);
          setProduct("CNC");
          return;
        }

        
        const posRes = await axios.get(
          `https://zerodhabackend-lrq5.onrender.com/allPositions`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log("Positions API:", posRes.data);

        const pos = posRes.data.find(
          (p) => p.name?.toUpperCase() === uid.toUpperCase()
        );

        if (pos) {
          setAvailableQty(pos.qty);
          setProduct("MIS");
          return;
        }

        
        setAvailableQty(0);

      } catch (err) {
        console.error("Error fetching sell data:", err);
        setAvailableQty(0);
      }
    };

    fetchData();
  }, [uid]);

  const handleSellClick = async () => {
    if (Number(stockQuantity) > availableQty) {
      alert("Not enough quantity to sell");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://zerodhabackend-lrq5.onrender.com/newOrder",
        {
          name: uid,
          qty: Number(stockQuantity),
          price: Number(stockPrice),
          mode: "SELL",
          product: product
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      triggerRefresh();
      closeSellWindow();

    } catch (err) {
      console.error(err);
      alert("Sell failed");
    }
  };

  return (
    <div className="buy-window">

      <div className="buy-card">

        <h2 className="buy-title">Sell {uid}</h2>

        <div className="buy-section">

          <div className="buy-field">
            <label>Product</label>
            <input value={product} disabled />
          </div>

          <div className="buy-field">
            <label>Quantity</label>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
            />
          </div>

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
            Available Qty: {availableQty}
          </span>

          <div className="buy-actions">

            <button className="btn-danger" onClick={handleSellClick}>
              Sell
            </button>

            <button className="btn-secondary" onClick={closeSellWindow}>
              Cancel
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SellActionWindow;