import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import GeneralContext from "./GeneralContext";

import { Tooltip, Grow } from "@mui/material";

import {
  // BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  //MoreHoriz,
} from "@mui/icons-material";

import { watchlist } from "../data/data";
import { DoughnutChart } from "./DoughnutChart";

const WatchList = () => {
  const [livePrices, setLivePrices] = useState({});

  const labels = watchlist.map((stock) => stock.name);

 
  const fetchLivePrices = async () => {
    try {
      const symbols = watchlist.map((s) => s.name).join(",");

      const res = await axios.get("https://zerodhabackend-lrq5.onrender.com/prices", {
  params: {
    symbols
  }
});

      const priceMap = {};

      res.data.data.forEach((item) => {
        priceMap[item.symbol] = item.close;
      });

      setLivePrices(priceMap);

    } catch (err) {
      console.error("Marketstack error:", err);
    }
  };

  
  useEffect(() => {
    fetchLivePrices();

    const interval = setInterval(fetchLivePrices, 10000);
    return () => clearInterval(interval);
  }, []);

  
  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: watchlist.map(
          (stock) => livePrices[stock.name] || stock.price
        ),
        backgroundColor: [ "rgba(255, 99, 132, 0.5)", 
          "rgba(54, 162, 235, 0.5)", 
          "rgba(255, 206, 86, 0.5)", 
          "rgba(75, 192, 192, 0.5)", 
          "rgba(153, 102, 255, 0.5)",
           "rgba(255, 159, 64, 0.5)", ],
            borderColor: [ 
              "rgba(255, 99, 132, 1)", 
              "rgba(54, 162, 235, 1)", 
              "rgba(255, 206, 86, 1)", 
              "rgba(75, 192, 192, 1)", 
              "rgba(153, 102, 255, 1)",
               "rgba(255, 159, 64, 1)", ], 
               borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search eg: infy, bse, nifty..."
          className="search"
        />
        <span className="counts"> {watchlist.length} / 50</span>
      </div>

      <ul className="list">
        {watchlist.map((stock, index) => (
          <WatchListItem
            stock={stock}
            livePrice={livePrices[stock.name]}
            key={index}
          />
        ))}
      </ul>

      <DoughnutChart data={data} />
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock, livePrice }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  const price = livePrice || stock.price;

  return (
    <li
      onMouseEnter={() => setShowWatchlistActions(true)}
      onMouseLeave={() => setShowWatchlistActions(false)}
    >
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>
          {stock.name}
        </p>

        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>

          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="up" />
          )}

          <span className="price">{price}</span>
        </div>
      </div>

      {showWatchlistActions && (
        <WatchListActions uid={stock.name} />
      )}
    </li>
  );
};

const WatchListActions = ({ uid }) => {
  const { openBuyWindow, openSellWindow } = useContext(GeneralContext);

  return (
    <span className="actions">
      <span>
        <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow}>
          <button className="buy" onClick={() => openBuyWindow(uid)}>
            Buy
          </button>
        </Tooltip>

        <Tooltip title="Sell (S)" placement="top" arrow TransitionComponent={Grow}>
          <button className="sell" onClick={() => openSellWindow(uid)}>
            Sell
          </button>
        </Tooltip>

        {/* <Tooltip title="Analytics (A)" placement="top" arrow TransitionComponent={Grow}>
          <button className="action">
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>

        <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
          <button className="action">
            <MoreHoriz className="icon" />
          </button>
        </Tooltip> */}
      </span>
    </span>
  );
};