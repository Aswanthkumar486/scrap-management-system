import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", icon: "bi-speedometer2", label: "Dashboard", color: "warning" },
   
    { path: "/customers", icon: "bi-people-fill", label: "Customers", color: "success" },
    { path: "/inventory", icon: "bi-box-seam", label: "Inventory", color: "primary" },
   
    { path: "/purchase", icon: "bi-truck", label: "Purchase", color: "warning" },
    { path: "/sales", icon: "bi-cash-stack", label: "Sales", color: "success" },
    { path: "/products", icon: "bi-cubes", label: "Products", color: "info" },
  ];

  return (
    <div 
      className="bg-dark vh-100 position-fixed" 
      style={{ 
        width: "280px", 
        top: 0, 
        left: 0, 
        overflowY: "auto", 
        boxShadow: "4px 0 20px rgba(0,0,0,0.5)", 
        borderRight: "3px solid #d97706",
        zIndex: 1000
      }}
    >
      {/* Logo Section */}
      <div className="text-center py-4 border-bottom border-warning mb-3">
        <div className="mb-2">
          <div className="bg-warning rounded-circle d-inline-flex p-3" style={{ width: "70px", height: "70px", alignItems: "center", justifyContent: "center" }}>
            <i className="bi bi-tools fs-1 text-dark"></i>
          </div>
        </div>
        <h5 className="text-warning fw-bold mb-0">Sri Periyandavar</h5>
        <small className="text-secondary">Steel & Scrap</small>
        <div className="mt-2">
          <span className="badge bg-warning text-dark">
            <i className="bi bi-database me-1"></i> Weighbridge Active
          </span>
        </div>
      </div>

      {/* Menu Items */}
      <ul className="nav flex-column px-3">
        {menuItems.map((item) => (
          <li className="nav-item mb-2" key={item.path}>
            <Link
              to={item.path}
              className={`nav-link d-flex align-items-center gap-3 rounded-3 py-3 px-3 transition-all ${
                location.pathname === item.path
                  ? "bg-warning text-dark fw-bold shadow"
                  : "text-light hover-glass"
              }`}
              style={{
                transition: "all 0.3s ease",
                backgroundColor: location.pathname === item.path ? "#d97706" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = "rgba(217, 119, 6, 0.2)";
                  e.currentTarget.style.transform = "translateX(5px)";
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.transform = "translateX(0)";
                }
              }}
            >
              <i className={`bi ${item.icon} fs-5 ${location.pathname === item.path ? "text-dark" : `text-${item.color}`}`}></i>
              <span>{item.label}</span>
              {location.pathname === item.path && (
                <i className="bi bi-arrow-right-short ms-auto fs-4"></i>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* Bottom Stats */}
      <div className="position-absolute bottom-0 start-0 w-100 p-3 border-top border-secondary" style={{ background: "#1a1a1a" }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <small className="text-secondary">
            <i className="bi bi-weight-scale me-1"></i> Today's Scrap
          </small>
          <span className="text-warning fw-bold">4,280 kg</span>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <small className="text-secondary">
            <i className="bi bi-currency-rupee me-1"></i> Avg Rate
          </small>
          <span className="text-success fw-bold">₹42/kg</span>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-secondary">
            <i className="bi bi-building me-1"></i> Version
          </small>
          <span className="text-info small">v2.0</span>
        </div>
      </div>

      <style>{`
        .hover-glass:hover {
          background: rgba(217, 119, 6, 0.15) !important;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        ::-webkit-scrollbar-thumb {
          background: #d97706;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;