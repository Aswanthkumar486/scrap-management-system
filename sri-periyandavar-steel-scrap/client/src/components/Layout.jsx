
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Layout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "bi-speedometer2", color: "warning", path: "/dashboard" },
    { id: "purchase", label: "Purchase", icon: "bi-truck", color: "danger", path: "/purchase" },
    { id: "sales", label: "Sales", icon: "bi-cash-stack", color: "success", path: "/sales" },
    { id: "products", label: "Products", icon: "bi-cubes", color: "info", path: "/products" },
    { id: "inventory", label: "Inventory", icon: "bi-box-seam", color: "primary", path: "/inventory" },
    
    { id: "customers", label: "Customers", icon: "bi-people", color: "success", path: "/customers" },
    
  ];

  return (
    <div style={{ backgroundColor: "#0f0e0a", minHeight: "100vh" }}>
      {/* 🔥 SCRAP INDUSTRIAL NAVBAR */}
      <nav className="navbar navbar-expand-lg sticky-top px-4 py-2" style={{ background: "#0b0a07", borderBottom: "3px solid #d97706", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
        <div className="container-fluid">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-warning rounded p-2 d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px" }}>
              <i className="bi bi-tools fs-3 text-dark"></i>
            </div>
            <div>
              <span className="navbar-brand fw-bold fs-4 mb-0" style={{ background: "linear-gradient(135deg, #fbbf24, #d97706)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Sri Periyandavar Steel
              </span>
              <small className="d-block text-secondary" style={{ fontSize: "0.7rem" }}>
                <i className="bi bi-shield-check text-warning me-1"></i> Industrial Scrap Management
              </small>
            </div>
          </div>

          <button className="navbar-toggler bg-warning" type="button" data-bs-toggle="collapse" data-bs-target="#scrapNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="scrapNavbar">
            <ul className="navbar-nav ms-auto gap-2">
              {menuItems.map((item) => (
                <li className="nav-item" key={item.id}>
                  <Link
                    to={item.path}
                    className={`nav-link px-3 rounded-3 d-flex align-items-center gap-2 ${activeMenu === item.id ? "active-nav" : ""}`}
                    style={{
                      color: activeMenu === item.id ? "#d97706" : "#e2d8c8",
                      fontWeight: activeMenu === item.id ? "600" : "400",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (activeMenu !== item.id) e.currentTarget.style.backgroundColor = "rgba(217, 119, 6, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    onClick={() => setActiveMenu(item.id)}
                  >
                    <i className={`bi ${item.icon} fs-5`} style={{ color: `var(--bs-${item.color})` }}></i>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              <li className="nav-item ms-2">
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger px-4 d-flex align-items-center gap-2"
                  style={{ borderRadius: "8px" }}
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* 🔥 PAGE CONTENT with industrial background */}
      <div className="container-fluid mt-4 px-4 pb-5">
        <div className="row">
          <div className="col-12">
            {/* Breadcrumb / Status Bar */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-gear-fill text-warning fs-5"></i>
                <span className="text-secondary">Scrap Yard Operations</span>
                <i className="bi bi-chevron-right text-secondary small"></i>
                <span className="text-warning fw-semibold text-capitalize">{activeMenu}</span>
              </div>
              <div className="d-flex gap-2">
                <span className="badge bg-dark text-warning p-2">
                  <i className="bi bi-weight-scale me-1"></i> Today: 4.2 tons
                </span>
                <span className="badge bg-dark text-success p-2">
                  <i className="bi bi-currency-rupee me-1"></i> Rate: ₹42/kg
                </span>
              </div>
            </div>

            {/* Main Outlet */}
            <Outlet />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-3 border-top border-secondary mt-5" style={{ background: "#0b0a07" }}>
        <small className="text-secondary">
          <i className="bi bi-c-circle me-1"></i> 2025 Sri Periyandavar Steel & Scrap | 
          <i className="bi bi-truck ms-2 me-1"></i> Weighbridge Integrated | 
          <i className="bi bi-shield-check ms-2 me-1"></i> GST Ready
        </small>
      </footer>

      <style>{`
        .active-nav {
          background: rgba(217, 119, 6, 0.2);
          border-left: 3px solid #d97706;
        }
        .nav-link:hover {
          transform: translateY(-2px);
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        ::-webkit-scrollbar-thumb {
          background: #d97706;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default Layout;