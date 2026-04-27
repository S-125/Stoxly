import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";
import GeneralContext from "./GeneralContext";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const token = localStorage.getItem("token");

  const { refreshFlag } = useContext(GeneralContext); 

  const fetchHoldings = async () => {
    try {
      const res = await axios.get("https://zerodhabackend-lrq5.onrender.com/allHoldings", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAllHoldings(res.data);
    } catch (err) {
      console.error("Error fetching holdings:", err);
    }
  };


  useEffect(() => {
    fetchHoldings();
  }, [refreshFlag]);

  const labels = allHoldings.map((stock) => stock.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

 
  let totalInvestment = 0;
  let currentValue = 0;

  allHoldings.forEach((stock) => {
    totalInvestment += stock.avg * stock.qty;
    currentValue += stock.price * stock.qty;
  });

  const totalPnL = currentValue - totalInvestment;
  const totalPnLPercent =
    totalInvestment === 0 ? 0 : (totalPnL / totalInvestment) * 100;

  const pnlClass = totalPnL >= 0 ? "profit" : "loss";

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
            </tr>
          </thead>

          <tbody>
            {allHoldings.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const pnl = curValue - stock.avg * stock.qty;
              const net = ((stock.price - stock.avg) / stock.avg) * 100;

              const profClass = pnl >= 0 ? "profit" : "loss";

              return (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>

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

      
      <div className="row">
        <div className="col">
          <h5>
            {totalInvestment.toFixed(2)}
          </h5>
          <p>Total investment</p>
        </div>

        <div className="col">
          <h5>
            {currentValue.toFixed(2)}
          </h5>
          <p>Current value</p>
        </div>

        <div className="col">
          <h5 className={pnlClass}>
            {totalPnL.toFixed(2)} ({totalPnLPercent.toFixed(2)}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>

      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;