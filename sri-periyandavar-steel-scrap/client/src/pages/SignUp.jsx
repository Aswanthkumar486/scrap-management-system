import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";

function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.password) {
      alert("⚠️ Please fill all fields");
      return;
    }

    if (form.password.length < 6) {
      alert("⚠️ Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await API.post("/api/auth/register", form);
      alert("✅ Registration Successful! Please login.");
      navigate("/");
    } catch (err) {
      console.log(err);
      alert("❌ Registration Failed. Email may already exist.");
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
        backgroundImage: "radial-gradient(circle at 15% 30%, rgba(217, 119, 6, 0.1) 2%, transparent 2.5%)",
        backgroundSize: "48px 48px",
        pointerEvents: "none"
      }}></div>

      <div className="container" style={{ maxWidth: "450px", position: "relative", zIndex: 1 }}>
        <div className="card bg-dark border-warning rounded-4 shadow-lg overflow-hidden">
          {/* Header with Icon */}
          <div className="card-header bg-transparent border-warning text-center py-4">
            <div className="mb-3">
              <div className="bg-warning rounded-circle d-inline-flex p-3" style={{ width: "70px", height: "70px", alignItems: "center", justifyContent: "center" }}>
                <i className="bi bi-tools fs-1 text-dark"></i>
              </div>
            </div>
            <h3 className="text-warning fw-bold mb-1">Create Account</h3>
            <p className="text-secondary mb-0">Join Sri Periyandavar Steel & Scrap</p>
          </div>

          <div className="card-body p-4">
            <form onSubmit={handleRegister}>
              {/* Full Name Field */}
              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold">
                  <i className="bi bi-person-fill me-2 text-warning"></i>Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  className="form-control bg-dark text-light border-warning"
                  style={{ borderLeft: "3px solid #d97706" }}
                  placeholder="Enter your full name"
                  onChange={handleChange}
                  required
                />
              </div>

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
              <div className="mb-4">
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
                <small className="text-secondary">Password must be at least 6 characters</small>
              </div>

              {/* Register Button */}
              <button 
                type="submit" 
                className="btn btn-warning w-100 py-2 fw-bold mb-3"
                disabled={loading}
                style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)", border: "none" }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus-fill me-2"></i>
                    Register
                  </>
                )}
              </button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-secondary mb-0">
                  Already have an account?{' '}
                  <Link to="/" className="text-warning text-decoration-none fw-semibold">
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="card-footer bg-transparent border-warning text-center py-3">
            <small className="text-secondary">
              <i className="bi bi-shield-check me-1"></i> Secure Registration
            </small>
          </div>
        </div>

        {/* Business Tagline */}
        <div className="text-center mt-4">
          <small className="text-secondary">
            <i className="bi bi-truck me-1"></i> Sri Periyandavar Steel & Scrap - Since 1995
          </small>
        </div>
      </div>
    </div>
  );
}

export default SignUp;