import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import api from "./api/axiosInstance";

import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/SignUp";

function App() {
  const [loading, setLoading] = useState(true);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const wakeBackend = async () => {
      try {
        await Promise.race([
          api.get("/health"),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("timeout")), 15000)
          ),
        ]);
      } catch (err) {
        console.log("Backend wake-up issue:", err.message);
      } finally {
        setLoading(false);
      }
    };

    wakeBackend();
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.brand}>
          Stox<span style={styles.highlight}>ly</span>
        </h1>
        <h2 style={styles.title}>Loading...</h2>
        <p style={styles.subtitle}>
          Please Wait ~15–20 seconds 
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "120px",
    fontFamily: "sans-serif",
  },
  brand: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#0a2540",
    marginBottom: "10px",
  },
  highlight: {
    color: "#00b386",
  },
  title: {
    fontSize: "22px",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "14px",
  },
};

export default App;