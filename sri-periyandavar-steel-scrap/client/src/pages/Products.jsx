import { useState, useEffect } from "react";
import API from "../utils/api";
import AddProducts from "./AddProducts";

function Products() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/products");
      setData(res.data);
    } catch (err) {
      console.log("Products fetch error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter and sort products
  const filteredData = data
    .filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === "pricePerKg" || sortBy === "stock") {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }
      
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const totalStock = data.reduce((sum, p) => sum + (p.stock || 0), 0);
  const avgPrice = data.reduce((sum, p) => sum + (p.pricePerKg || 0), 0) / (data.length || 1);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="card bg-dark border-warning rounded-4 mb-4 shadow-lg">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h3 className="text-warning fw-bold mb-1">
                <i className="bi bi-cubes me-2"></i>Products Catalog
              </h3>
              <p className="text-secondary mb-0">
                <i className="bi bi-boxes me-1"></i> Manage scrap materials and pricing
              </p>
            </div>
            <div className="d-flex gap-2">
              <div className="bg-dark border border-warning rounded-3 p-3 text-center">
                <small className="text-secondary">Total Products</small>
                <h4 className="text-warning mb-0">{data.length}</h4>
              </div>
              <div className="bg-dark border border-warning rounded-3 p-3 text-center">
                <small className="text-secondary">Total Stock</small>
                <h4 className="text-warning mb-0">{totalStock.toLocaleString()} kg</h4>
              </div>
              <div className="bg-dark border border-warning rounded-3 p-3 text-center">
                <small className="text-secondary">Avg Price</small>
                <h4 className="text-success mb-0">₹{Math.round(avgPrice)}/kg</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Form */}
      <AddProducts refreshProducts={fetchData} />

      {/* Products List Section */}
      <div className="card bg-dark border-warning rounded-4 overflow-hidden shadow-lg mt-4">
        <div className="card-header bg-transparent border-warning py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h5 className="text-warning mb-0">
              <i className="bi bi-list-ul me-2"></i>Product Inventory
            </h5>
            <div className="d-flex gap-2">
              <div className="input-group" style={{ width: "250px" }}>
                <span className="input-group-text bg-dark border-warning text-warning">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-warning"
                  placeholder="Search products..."
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
          </div>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-secondary mt-3">Loading products...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-box-seam fs-1 text-secondary d-block mb-2"></i>
              <p className="text-secondary mb-0">No products found</p>
              <small className="text-secondary">Add your first product using the form above</small>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover mb-0">
                <thead className="border-bottom border-warning">
                  <tr>
                    <th style={{ cursor: "pointer" }} onClick={() => handleSort("name")}>
                      <i className="bi bi-tag me-1"></i> Product Name
                      {sortBy === "name" && (
                        <i className={`ms-1 bi bi-caret-${sortOrder === "asc" ? "up" : "down"}-fill`}></i>
                      )}
                    </th>
                    <th style={{ cursor: "pointer" }} onClick={() => handleSort("pricePerKg")}>
                      <i className="bi bi-currency-rupee me-1"></i> Price / Kg
                      {sortBy === "pricePerKg" && (
                        <i className={`ms-1 bi bi-caret-${sortOrder === "asc" ? "up" : "down"}-fill`}></i>
                      )}
                    </th>
                    <th style={{ cursor: "pointer" }} onClick={() => handleSort("stock")}>
                      <i className="bi bi-weight-scale me-1"></i> Stock (kg)
                      {sortBy === "stock" && (
                        <i className={`ms-1 bi bi-caret-${sortOrder === "asc" ? "up" : "down"}-fill`}></i>
                      )}
                    </th>
                    <th><i className="bi bi-bar-chart me-1"></i> Status</th>
                    <th><i className="bi bi-image me-1"></i> Image</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((p) => (
                    <tr key={p._id} className="border-bottom border-secondary">
                      <td className="fw-semibold">
                        <i className="bi bi-cube text-warning me-2"></i>
                        {p.name}
                      </td>
                      <td className="text-success fw-bold">₹{p.pricePerKg?.toLocaleString()}</td>
                      <td className="text-warning fw-semibold">{p.stock?.toLocaleString()} kg</td>
                      <td>
                        {p.stock > 1000 ? (
                          <span className="badge bg-success">
                            <i className="bi bi-check-circle me-1"></i> High Stock
                          </span>
                        ) : p.stock > 500 ? (
                          <span className="badge bg-info text-dark">
                            <i className="bi bi-database me-1"></i> Medium
                          </span>
                        ) : p.stock > 100 ? (
                          <span className="badge bg-warning text-dark">
                            <i className="bi bi-exclamation-triangle me-1"></i> Low Stock
                          </span>
                        ) : (
                          <span className="badge bg-danger">
                            <i className="bi bi-emoji-frown me-1"></i> Critical
                          </span>
                        )}
                      </td>
                      <td>
                        {p.image ? (
                          <img
                            src={p.image}
                            width="40"
                            height="40"
                            alt={p.name}
                            className="rounded-2 border border-warning"
                            style={{ objectFit: "cover", cursor: "pointer" }}
                            onClick={() => window.open(p.image, "_blank")}
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/40?text=Scrap";
                            }}
                          />
                        ) : (
                          <div className="bg-secondary bg-opacity-25 rounded-2 d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                            <i className="bi bi-cube text-secondary"></i>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-top border-warning">
                  <tr>
                    <td colSpan="5" className="py-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-secondary">
                          <i className="bi bi-info-circle me-1"></i>
                          Showing {filteredData.length} of {data.length} products
                        </small>
                        <small className="text-secondary">
                          Total Value: ₹{(filteredData.reduce((sum, p) => sum + (p.pricePerKg * p.stock), 0)).toLocaleString()}
                        </small>
                      </div>
                    </td>
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

export default Products;