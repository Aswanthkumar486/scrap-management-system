import React, { useEffect, useState } from "react";
import API from "../utils/api";

function Inventory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await API.get("/api/inventory");
      setData(res.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item =>
    item.material?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStock = data.reduce((sum, item) => sum + (item.quantity || 0), 0);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="card bg-dark border-warning rounded-4 mb-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h3 className="text-warning fw-bold mb-1">
                <i className="bi bi-box-seam me-2"></i>Scrap Inventory
              </h3>
              <p className="text-secondary mb-0">Real-time stock management</p>
            </div>
            <div className="d-flex gap-2">
              <div className="bg-dark border border-warning rounded-3 p-3 text-center">
                <small className="text-secondary">Total Stock</small>
                <h4 className="text-warning mb-0">{totalStock.toLocaleString()} kg</h4>
              </div>
              <div className="bg-dark border border-warning rounded-3 p-3 text-center">
                <small className="text-secondary">Categories</small>
                <h4 className="text-warning mb-0">{data.length}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="input-group">
          <span className="input-group-text bg-dark border-warning text-warning">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control bg-dark text-light border-warning"
            placeholder="Search material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="btn btn-outline-warning" onClick={() => setSearchTerm("")}>
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card bg-dark border-warning rounded-4 overflow-hidden">
        <div className="card-header bg-transparent border-warning py-3">
          <h5 className="text-warning mb-0">
            <i className="bi bi-database me-2"></i>Stock Details
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-dark table-hover mb-0">
              <thead className="border-bottom border-warning">
                <tr>
                  <th>#</th>
                  <th><i className="bi bi-cube me-1"></i> Material</th>
                  <th><i className="bi bi-weight-scale me-1"></i> Quantity (kg)</th>
                  <th><i className="bi bi-bar-chart me-1"></i> Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((d, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td className="fw-semibold">{d.material}</td>
                    <td className="text-warning fw-bold">{d.quantity?.toLocaleString()} kg</td>
                    <td>
                      {d.quantity > 1000 ? (
                        <span className="badge bg-success">High Stock</span>
                      ) : d.quantity > 500 ? (
                        <span className="badge bg-info text-dark">Medium</span>
                      ) : d.quantity > 100 ? (
                        <span className="badge bg-warning text-dark">Low Stock</span>
                      ) : (
                        <span className="badge bg-danger">Critical</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-secondary py-5">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      No inventory items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inventory;