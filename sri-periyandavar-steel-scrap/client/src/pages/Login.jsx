import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("⚠️ Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/api/auth/login", form);
      const token = res.data.token;

      if (!token) {
        alert("❌ Token not received!");
        return;
      }

      // Save token with remember me option
      if (rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      login(token);
      alert("✅ Login Successful!");
      navigate("/dashboard");

    } catch (err) {
      console.log(err);
      alert("❌ Invalid Credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ 
      background: "linear-gradient(135deg, #0f0e0a 0%, #1a1814 100%)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Pattern */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "radial-gradient(circle at 75% 70%, rgba(217, 119, 6, 0.1) 2%, transparent 2.5%)",
        backgroundSize: "48px 48px",
        pointerEvents: "none"
      }}></div>

      {/* Animated Elements */}
      <div style={{
        position: "absolute",
        top: "10%",
        right: "5%",
        opacity: 0.1,
        fontSize: "100px"
      }}>
        <i className="bi bi-truck"></i>
      </div>
      <div style={{
        position: "absolute",
        bottom: "10%",
        left: "5%",
        opacity: 0.1,
        fontSize: "80px"
      }}>
        <i className="bi bi-tools"></i>
      </div>

      <div className="container" style={{ maxWidth: "450px", position: "relative", zIndex: 1 }}>
        <div className="card bg-dark border-warning rounded-4 shadow-lg overflow-hidden">
          {/* Header with Icon */}
          <div className="card-header bg-transparent border-warning text-center py-4">
            <div className="mb-3">
              <div className="bg-warning rounded-circle d-inline-flex p-3" style={{ width: "80px", height: "80px", alignItems: "center", justifyContent: "center" }}>
                <i className="bi bi-building fs-1 text-dark"></i>
              </div>
            </div>
            <h3 className="text-warning fw-bold mb-1">Welcome Back</h3>
            <p className="text-secondary mb-0">Login to Sri Periyandavar Steel & Scrap</p>
          </div>

          <div className="card-body p-4">
            <form onSubmit={handleLogin}>
              {/* Email Field */}
              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold">
                  <i className="bi bi-envelope-fill me-2 text-warning"></i>Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  className="form-control bg-dark text-light border-warning"
                  style={{ borderLeft: "3px solid #d97706" }}
                  placeholder="Enter your email"
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold">
                  <i className="bi bi-lock-fill me-2 text-warning"></i>Password
                </label>
                <div className="input-group">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="form-control bg-dark text-light border-warning"
                    style={{ borderLeft: "3px solid #d97706" }}
                    placeholder="Enter your password"
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input bg-dark border-warning"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="form-check-label text-secondary" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-warning text-decoration-none small">
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button 
                type="submit" 
                className="btn btn-warning w-100 py-2 fw-bold mb-3"
                disabled={loading}
                style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)", border: "none" }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Login
                  </>
                )}
              </button>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-secondary mb-0">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-warning text-decoration-none fw-semibold">
                    Create one here
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Footer with Stats */}
          <div className="card-footer bg-transparent border-warning py-3">
            <div className="d-flex justify-content-around text-center">
              <div>
                <small className="text-secondary">Active Users</small>
                <p className="text-warning mb-0 fw-bold">1,234+</p>
              </div>
              <div>
                <small className="text-secondary">Scrap Yards</small>
                <p className="text-warning mb-0 fw-bold">5</p>
              </div>
              <div>
                <small className="text-secondary">Tons Daily</small>
                <p className="text-warning mb-0 fw-bold">50+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Info */}
        <div className="text-center mt-4">
          <small className="text-secondary">
            <i className="bi bi-shield-check me-1"></i> Secure Login | 
            <i className="bi bi-truck ms-2 me-1"></i> Weighbridge Integrated |
            <i className="bi bi-clock ms-2 me-1"></i> 24/7 Support
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;