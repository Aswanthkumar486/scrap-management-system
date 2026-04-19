import { useState, useEffect } from "react";
import API from "../utils/api";
import AddPurchase from "./AddPurchase";

function Purchase() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const fetchPurchase = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/purchase");
      setData(res.data);
      setFilteredData(res.data);
    } catch (err) {
      console.log("Error fetching purchase:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchase();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...data];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.material?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (fromDate && toDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.createdAt).toISOString().split('T')[0];
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }

    setFilteredData(filtered);
  }, [searchTerm, fromDate, toDate, data]);

  const totalWeight = filteredData.reduce((sum, item) => sum + (item.weight || 0), 0);
  const totalAmount = filteredData.reduce((sum, item) => sum + (item.total || 0), 0);

  const resetFilters = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
  };

  return (
    <div>
      {/* Header Section */}
      <div className="card bg-dark border-warning rounded-4 mb-4 shadow-lg">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h3 className="text-warning fw-bold mb-1">
                <i className="bi bi-truck me-2"></i>Purchase Management
              </h3>
              <p className="text-secondary mb-0">
                <i className="bi bi-shop me-1"></i> Track all scrap purchases and supplier transactions
              </p>
            </div>
            <div className="d-flex gap-2">
              <div className="bg-dark border border-warning rounded-3 p-3 text-center">
                <small className="text-secondary">Total Weight</small>
                <h4 className="text-warning mb-0">{totalWeight.toLocaleString()} kg</h4>
              </div>
              <div className="bg-dark border border-warning rounded-3 p-3 text-center">
                <small className="text-secondary">Total Amount</small>
                <h4 className="text-success mb-0">₹{totalAmount.toLocaleString()}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Purchase Form */}
      <AddPurchase refreshPurchase={fetchPurchase} />

      {/* Filters Section */}
      <div className="card bg-dark border-warning rounded-4 mb-4">
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-dark border-warning text-warning">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-warning"
                  placeholder="Search by customer or material..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control bg-dark text-light border-warning"
                placeholder="From Date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control bg-dark text-light border-warning"
                placeholder="To Date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-warning w-100" onClick={resetFilters}>
                <i className="bi bi-arrow-repeat me-1"></i> Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Records Table */}
      <div className="card bg-dark border-warning rounded-4 overflow-hidden shadow-lg">
        <div className="card-header bg-transparent border-warning py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="text-warning mb-0">
              <i className="bi bi-database me-2"></i>Purchase Records
            </h5>
            <span className="badge bg-warning text-dark">
              <i className="bi bi-files me-1"></i> {filteredData.length} Records
            </span>
          </div>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-secondary mt-3">Loading purchase records...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover mb-0">
                <thead className="border-bottom border-warning">
                  <tr>
                    <th><i className="bi bi-person me-1"></i> Supplier</th>
                    <th><i className="bi bi-cube me-1"></i> Material</th>
                    <th><i className="bi bi-image me-1"></i> Image</th>
                    <th><i className="bi bi-weight-scale me-1"></i> Weight</th>
                    <th><i className="bi bi-currency-rupee me-1"></i> Price/kg</th>
                    <th><i className="bi bi-calculator me-1"></i> Total</th>
                    <th><i className="bi bi-calendar me-1"></i> Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        <i className="bi bi-inbox fs-1 d-block mb-2 text-secondary"></i>
                        <p className="text-secondary mb-0">No purchase records found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((d) => (
                      <tr key={d._id} className="border-bottom border-secondary">
                        <td className="fw-semibold">{d.customerName}</td>
                        <td>
                          <span className="badge bg-warning bg-opacity-25 text-warning">
                            {d.material}
                          </span>
                        </td>
                        <td>
                          {d.image ? (
                            <img
                              src={d.image}
                              width="45"
                              height="45"
                              alt="purchase"
                              className="rounded-3 border border-warning"
                              style={{ objectFit: "cover", cursor: "pointer" }}
                              onClick={() => window.open(d.image, "_blank")}
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/45?text=Scrap";
                              }}
                            />
                          ) : (
                            <div className="bg-secondary bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center" style={{ width: "45px", height: "45px" }}>
                              <i className="bi bi-image text-secondary"></i>
                            </div>
                          )}
                        </td>
                        <td className="text-warning fw-semibold">{d.weight} kg</td>
                        <td>₹{d.pricePerKg?.toLocaleString()}</td>
                        <td className="text-success fw-bold">₹{d.total?.toLocaleString()}</td>
                        <td className="text-secondary">
                          <small>{new Date(d.createdAt).toLocaleDateString('en-IN')}</small>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {filteredData.length > 0 && (
                  <tfoot className="border-top border-warning">
                    <tr className="fw-bold">
                      <td colSpan="3" className="text-end text-secondary">Total:</td>
                      <td className="text-warning">{totalWeight.toLocaleString()} kg</td>
                      <td></td>
                      <td className="text-success">₹{totalAmount.toLocaleString()}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Purchase;