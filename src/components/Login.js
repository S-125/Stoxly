import { useState } from "react";
import axios from "axios";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://zerodhabackend-lrq5.onrender.com/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/";
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
         <h1 className="auth__brand">
    Stox<span className="auth__brand-highlight">ly</span>
  </h1>

  <p className="auth__tagline">Trade smart. Track better.</p>
        <h2 className="auth__title">Login to your account</h2>
       
        <form className="auth__form" onSubmit={handleLogin}>
          <input
            className="auth__input"
            type="email"
            placeholder="Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="auth__input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="auth__button" type="submit">
            Login
          </button>
        </form>

        <p className="auth__text">
          Don’t have an account?{" "}
          <a className="auth__link" href="/signup">
            Signup
          </a>
        </p>
      </div>
    </div>
  );
}