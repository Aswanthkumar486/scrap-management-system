import { useEffect, useState } from "react";
import API from "../utils/api";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const [salesRes, purchaseRes] = await Promise.all([
        API.get("/api/sales"),
        API.get("/api/purchase")
      ]);

      const all = [...salesRes.data, ...purchaseRes.data];
      const unique = [...new Map(all.map(d => [d.customerName, d])).values()];

      const details = unique.map(c => ({
        name: c.customerName,
        totalPurchases: purchaseRes.data.filter(p => p.customerName === c.customerName).reduce((sum, p) => sum + (p.total || 0), 0),
        totalSales: salesRes.data.filter(s => s.customerName === c.customerName).reduce((sum, s) => sum + (s.total || 0), 0),
        transactionCount: all.filter(a => a.customerName === c.customerName).length
      }));

      setCustomerDetails(details);
      setCustomers(unique.map(c => c.customerName));
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customerDetails.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="card bg-dark border-warning rounded-4 mb-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h3 className="text-warning fw-bold mb-1">
                <i className="bi bi-people-fill me-2"></i>Customer Directory
              </h3>
              <p className="text-secondary mb-0">Manage buyers and suppliers</p>
            </div>
            <div className="bg-dark border border-warning rounded-3 p-3">
              <small className="text-secondary">Total Customers</small>
              <h4 className="text-warning mb-0">{customers.length}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="input-group">
          <span className="input-group-text bg-dark border-warning text-warning">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control bg-dark text-light border-warning"
            placeholder="Search customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Customer Cards */}
      <div className="row g-4">
        {filteredCustomers.map((c, i) => (
          <div className="col-md-6 col-lg-4" key={i}>
            <div className="card bg-dark border-warning rounded-4 h-100 hover-scale">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-warning bg-opacity-25 rounded-circle p-3">
                    <i className="bi bi-person-circle fs-2 text-warning"></i>
                  </div>
                  <div>
                    <h5 className="text-warning fw-bold mb-0">{c.name}</h5>
                    <small className="text-secondary">{c.transactionCount} transactions</small>
                  </div>
                </div>
                <hr className="border-secondary" />
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">Total Purchases:</span>
                  <span className="text-warning fw-bold">₹{c.totalPurchases.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary">Total Sales:</span>
                  <span className="text-success fw-bold">₹{c.totalSales.toLocaleString()}</span>
                </div>
              </div>
              <div className="card-footer bg-transparent border-warning py-2">
                <button className="btn btn-sm btn-outline-warning w-100">
                  <i className="bi bi-eye me-1"></i> View Details
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredCustomers.length === 0 && (
          <div className="col-12 text-center py-5">
            <i className="bi bi-people fs-1 text-secondary d-block mb-2"></i>
            <p className="text-secondary">No customers found</p>
          </div>
        )}
      </div>

      <style>{`
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

export default Customers;