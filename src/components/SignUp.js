import { useState } from "react";
import axios from "axios";
import "./Auth.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://zerodhabackend-lrq5.onrender.com/signup", {
        name,
        email,
        password,
      });

      window.location.href = "/login";
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <h2 className="auth__title">Create your account</h2>

        <form className="auth__form" onSubmit={handleSignup}>
          <input
            className="auth__input"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            Signup
          </button>
        </form>

        <p className="auth__text">
          Already have an account?{" "}
          <a className="auth__link" href="/login">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}