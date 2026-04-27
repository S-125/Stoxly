import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const { refreshFlag } = useContext(GeneralContext); 

  useEffect(() => {
      const token = localStorage.getItem("token");
    const fetchPositions = async () => {
    try {
      const res = await axios.get("https://zerodhabackend-lrq5.onrender.com/allPositions", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAllPositions(res.data);
    } catch (err) {
      console.error("Error fetching positions:", err);
    }
  };

    fetchPositions();
  }, [refreshFlag]);

  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Net %</th>
            </tr>
          </thead>

          <tbody>
            {allPositions.map((stock, index) => {
              const pnl = (stock.price - stock.avg) * stock.qty;
              const net = ((stock.price - stock.avg) / stock.avg) * 100;

              const isProfit = pnl >= 0;
              const profClass = isProfit ? "profit" : "loss";

              return (
                <tr key={index}>
                  <td>{stock.product}</td>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>

                  <td className={profClass}>
                    {pnl.toFixed(2)}
                  </td>

                  <td className={profClass}>
                    {net.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;