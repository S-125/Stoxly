import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
 

  useEffect(() => {
     const token = localStorage.getItem("token");
    const fetchOrders = async () => {
    try {
      const res = await axios.get("https://zerodhabackend-lrq5.onrender.com/allOrders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };
    fetchOrders();
  }, []);

  

  return (
    <div className="orders">

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders placed yet</p>
        </div>
      ) : (
        <>
          <h3 className="title">Orders ({orders.length})</h3>

          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Stock</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order, index) => {
                  const total = order.qty * order.price;
                  const typeClass =
                    order.mode === "BUY" ? "profit" : "loss";

                  return (
                    <tr key={index}>
                      <td className={typeClass}>{order.mode}</td>
                      <td>{order.name}</td>
                      <td>{order.qty}</td>
                      <td>{order.price}</td>
                      <td>{total.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;