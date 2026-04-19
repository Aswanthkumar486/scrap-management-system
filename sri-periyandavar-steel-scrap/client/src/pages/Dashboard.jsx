import React, { useEffect, useState } from "react";
import API from "../utils/api";

function Dashboard() {
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [salesRes, purchasesRes, inventoryRes] = await Promise.all([
        API.get("/api/sales"),
        API.get("/api/purchase"),
        API.get("/api/inventory")
      ]);
      setSales(salesRes.data);
      setPurchases(purchasesRes.data);
      setInventory(inventoryRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalSales = sales.reduce((a, b) => a + (b.total || 0), 0);
  const totalPurchases = purchases.reduce((a, b) => a + (b.total || 0), 0);
  const profit = totalSales - totalPurchases;
  const totalStock = inventory.reduce((a, b) => a + (b.quantity || 0), 0);

  const stats = [
    { label: "Total Sales", value: `₹${totalSales.toLocaleString()}`, icon: "bi-cash-stack", color: "success", bg: "success" },
    { label: "Total Purchases", value: `₹${totalPurchases.toLocaleString()}`, icon: "bi-truck", color: "warning", bg: "warning" },
    { label: "Net Profit", value: `₹${profit.toLocaleString()}`, icon: "bi-graph-up", color: "info", bg: "info" },
    { label: "Inventory Stock", value: `${totalStock.toLocaleString()} kg`, icon: "bi-box-seam", color: "primary", bg: "primary" },
  ];

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-secondary mt-3">Loading scrap yard data...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Banner */}
      <div className="card bg-dark border-warning mb-4 rounded-4 overflow-hidden">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="text-warning fw-bold mb-1">
                <i className="bi bi-tools me-2"></i>
                Scrap Yard Dashboard
              </h2>
              <p className="text-secondary mb-0">
                <i className="bi bi-calendar3 me-1"></i>
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="d-flex gap-2">
              <span className="badge bg-warning text-dark p-2">
                <i className="bi bi-activity me-1"></i> Live
              </span>
              <span className="badge bg-dark text-warning border border-warning p-2">
                <i className="bi bi-weight-scale me-1"></i> Weighbridge Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        {stats.map((stat, idx) => (
          <div className="col-md-3 col-sm-6" key={idx}>
            <div className="card bg-dark border-0 shadow-lg rounded-4 overflow-hidden hover-scale">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <small className="text-secondary text-uppercase fw-semibold">{stat.label}</small>
                    <h3 className={`text-${stat.color} fw-bold mt-2 mb-0`}>{stat.value}</h3>
                  </div>
                  <div className={`bg-${stat.bg} bg-opacity-25 rounded-3 p-3`}>
                    <i className={`bi ${stat.icon} fs-3 text-${stat.color}`}></i>
                  </div>
                </div>
              </div>
              <div className={`card-footer bg-${stat.bg} bg-opacity-10 border-0 py-2`}>
                <small className="text-secondary">
                  <i className="bi bi-arrow-repeat me-1"></i> Updated just now
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card bg-dark border-warning rounded-4">
            <div className="card-header bg-transparent border-warning">
              <h5 className="text-warning mb-0">
                <i className="bi bi-clock-history me-2"></i>Recent Sales
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0">
                  <thead className="border-bottom border-warning">
                    <tr>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.slice(0, 5).map((sale, idx) => (
                      <tr key={idx}>
                        <td>{sale.customerName}</td>
                        <td>{sale.product}</td>
                        <td className="text-success">₹{sale.total?.toLocaleString()}</td>
                      </tr>
                    ))}
                    {sales.length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center text-secondary py-3">
                          No sales recorded
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
                           
        <div className="col-md-6">
          <div className="card bg-dark border-warning rounded-4">
            <div className="card-header bg-transparent border-warning">
              <h5 className="text-warning mb-0">
                <i className="bi bi-truck me-2"></i>Recent Purchases
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0">
                  <thead className="border-bottom border-warning">
                    <tr>
                      <th>Supplier</th>
                      <th>Material</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.slice(0, 5).map((purchase, idx) => (
                      <tr key={idx}>
                        <td>{purchase.customerName}</td>
                        <td>{purchase.material}</td>
                        <td className="text-warning">₹{purchase.total?.toLocaleString()}</td>
                      </tr>
                    ))}
                    {purchases.length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center text-secondary py-3">
                          No purchases recorded
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-scale {
          transition: transform 0.3s ease;
        }
        .hover-scale:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
}

export default Dashboard;