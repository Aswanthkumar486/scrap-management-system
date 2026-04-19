import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post("/api/auth/login", form);

    console.log("FULL RESPONSE:", res.data);

    const token = res.data.token;

    if (!token) {
      alert("Token not received!");
      return;
    }

    // SAVE TOKEN
    localStorage.setItem("token", token);

    console.log("Saved Token:", localStorage.getItem("token"));

    login(token);

    alert("Login Successful ✅");

    navigate("/dashboard");

  } catch (err) {
    console.log(err);
    alert("Invalid Credentials ❌");
  }
};

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <div className="card p-4 shadow">
        <h3 className="text-center mb-3">Login</h3>

        <form onSubmit={handleLogin}>
          <input
            name="email"
            className="form-control mb-3"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <p className="mt-3 text-center">
          Don’t have an account? <Link to="/signup">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;