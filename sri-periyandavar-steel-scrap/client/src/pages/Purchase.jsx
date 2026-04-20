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
        item.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const totalItems = filteredData.reduce((sum, item) => sum + (item.items?.length || 0), 0);
  const totalWeight = filteredData.reduce((sum, item) => 
    sum + (item.items?.reduce((s, i) => s + (i.weight || 0), 0) || 0), 0);
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
                <small className="text-secondary">Total Purchases</small>
                <h4 className="text-warning mb-0">{filteredData.length}</h4>
              </div>
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
                  placeholder="Search by supplier..."
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
          ) : filteredData.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox fs-1 text-secondary d-block mb-2"></i>
              <p className="text-secondary mb-0">No purchase records found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover mb-0">
                <thead className="border-bottom border-warning">
                  <tr>
                    <th><i className="bi bi-person me-1"></i> Supplier</th>
                    <th><i className="bi bi-list-ul me-1"></i> Materials</th>
                    <th><i className="bi bi-weight-scale me-1"></i> Total Weight</th>
                    <th><i className="bi bi-currency-rupee me-1"></i> Total Amount</th>
                    <th><i className="bi bi-calendar me-1"></i> Date</th>
                    <th><i className="bi bi-eye me-1"></i> Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((d) => {
                    const purchaseWeight = d.items?.reduce((sum, i) => sum + (i.weight || 0), 0) || 0;
                    return (
                      <tr key={d._id} className="border-bottom border-secondary">
                        <td className="fw-semibold">
                          <i className="bi bi-building text-warning me-2"></i>
                          {d.customerName}
                        </td>
                        <td>
                          {d.items?.map((i, index) => (
                            <div key={index} className="mb-1">
                              <span className="badge bg-warning bg-opacity-25 text-warning me-2">
                                {i.material}
                              </span>
                              <small className="text-secondary">({i.weight} kg @ ₹{i.pricePerKg})</small>
                            </div>
                          ))}
                        </td>
                        <td className="text-warning fw-semibold">{purchaseWeight.toLocaleString()} kg</td>
                        <td className="text-success fw-bold">₹{d.total?.toLocaleString()}</td>
                        <td className="text-secondary">
                          <small>{new Date(d.createdAt).toLocaleDateString('en-IN')}</small>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => {
                              const details = d.items?.map(i => 
                                `${i.material}: ${i.weight}kg @ ₹${i.pricePerKg} = ₹${i.total}`
                              ).join('\n');
                              alert(`Supplier: ${d.customerName}\n\nItems:\n${details}\n\nTotal: ₹${d.total}`);
                            }}
                          >
                            <i className="bi bi-info-circle"></i> View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="border-top border-warning">
                  <tr className="fw-bold">
                    <td colSpan="2" className="text-end text-secondary">Total:</td>
                    <td className="text-warning">{totalWeight.toLocaleString()} kg</td>
                    <td className="text-success">₹{totalAmount.toLocaleString()}</td>
                    <td colSpan="2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Purchase;