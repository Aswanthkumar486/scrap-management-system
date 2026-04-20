/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import API from "../utils/api";

function Sales() {
  const [form, setForm] = useState({
    customerName: "",
    items: [{ product: "", weight: "", pricePerKg: "", total: 0 }]
  });

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [products, setProducts] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
    fetchProducts();
  }, []);

  // ✅ FETCH SALES
  const fetchData = async () => {
    try {
      const res = await API.get("/api/sales");
      setData(res.data);
      setFilteredData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await API.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

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

  // ➕ ADD ITEM
  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { product: "", weight: "", pricePerKg: "", total: 0 }]
    });
  };

  // ❌ REMOVE ITEM
  const removeItem = (index) => {
    const updated = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: updated });
  };

  // 🔄 HANDLE ITEM CHANGE
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = value;

    const w = Number(updatedItems[index].weight || 0);
    const p = Number(updatedItems[index].pricePerKg || 0);
    updatedItems[index].total = w * p;

    setForm({ ...form, items: updatedItems });
  };

  // 🧠 PRODUCT SELECT
  const handleProductSelect = (index, value) => {
    const selected = products.find(p => p.name === value);

    if (selected) {
      const updatedItems = [...form.items];
      updatedItems[index].product = selected.name;
      updatedItems[index].pricePerKg = selected.pricePerKg;

      const w = Number(updatedItems[index].weight || 0);
      updatedItems[index].total = w * selected.pricePerKg;

      setForm({ ...form, items: updatedItems });
    }
  };

  // 💰 GRAND TOTAL
  const grandTotal = form.items.reduce((sum, item) => sum + item.total, 0);

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.customerName || form.items.length === 0 || form.items.some(item => !item.product || !item.weight)) {
      alert("⚠️ Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      await API.post("/api/sales", {
        customerName: form.customerName,
        items: form.items,
        total: grandTotal
      });

      alert("✅ Sale Added Successfully!");
      fetchData();

      setForm({
        customerName: "",
        items: [{ product: "", weight: "", pricePerKg: "", total: 0 }]
      });

    } catch (err) {
      console.log(err);
      alert("❌ Error adding sale");
    } finally {
      setLoading(false);
    }
  };

  // 📅 FILTER
  const handleFilter = async () => {
    if (!fromDate || !toDate) {
      alert("⚠️ Please select both dates");
      return;
    }
    // Filter is already handled by useEffect
  };

  const resetFilter = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
  };

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return isNaN(d) ? "-" : d.toLocaleDateString("en-IN");
  };

  const totalAmount = filteredData.reduce((sum, item) => sum + (item.total || 0), 0);
  const totalItems = filteredData.reduce((sum, item) => sum + (item.items?.length || 0), 0);
  const totalWeight = filteredData.reduce((sum, item) => 
    sum + (item.items?.reduce((s, i) => s + (i.weight || 0), 0) || 0), 0);

  // 🧾 BILL
  const openBill = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://scrap-backend-l7w1.onrender.com/api/bill/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (err) {
      alert("❌ Bill generation error");
    }
  };

  return (
    <div>
      {/* HEADER SECTION */}
      <div className="card bg-dark border-warning rounded-4 mb-4 shadow-lg">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h3 className="text-warning fw-bold mb-1">
                <i className="bi bi-cash-stack me-2"></i>Sales Management
              </h3>
              <p className="text-secondary mb-0">
                <i className="bi bi-shop me-1"></i> Record and track all scrap sales
              </p>
            </div>
            <div className="d-flex gap-2">
              <div className="bg-dark border border-warning rounded-3 p-3 text-center">
                <small className="text-secondary">Total Sales</small>
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

      <div className="row g-4">
        {/* SALES FORM - LEFT COLUMN */}
        <div className="col-md-5">
          <div className="card bg-dark border-warning rounded-4 shadow-lg sticky-top" style={{ top: "20px" }}>
            <div className="card-header bg-transparent border-warning py-3">
              <h5 className="text-warning mb-0">
                <i className="bi bi-plus-circle me-2"></i>New Sale Entry
              </h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Customer Name */}
                <div className="mb-4">
                  <label className="form-label text-secondary fw-semibold">
                    <i className="bi bi-person-fill me-2 text-warning"></i>Customer Name
                  </label>
                  <input
                    className="form-control bg-dark text-light border-warning"
                    style={{ borderLeft: "3px solid #d97706" }}
                    placeholder="Enter customer name"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  />
                </div>

                {/* Items List */}
                <label className="form-label text-secondary fw-semibold mb-3">
                  <i className="bi bi-list-check me-2 text-warning"></i>Products
                </label>

                {form.items.map((item, index) => (
                  <div key={index} className="card bg-dark border-secondary mb-3 rounded-3">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-info mb-0">Item #{index + 1}</h6>
                        {form.items.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeItem(index)}
                          >
                            <i className="bi bi-trash me-1"></i> Remove
                          </button>
                        )}
                      </div>

                      {/* Product Select */}
                      <select
                        className="form-control bg-dark text-light border-secondary mb-2"
                        value={item.product}
                        onChange={(e) => handleProductSelect(index, e.target.value)}
                      >
                        <option value="">Select Product</option>
                        {products.map(p => (
                          <option key={p._id} value={p.name}>
                            {p.name} (Stock: {p.stock}kg | ₹{p.pricePerKg}/kg)
                          </option>
                        ))}
                      </select>

                      <div className="row g-2">
                        <div className="col-6">
                          <input
                            type="number"
                            className="form-control bg-dark text-light border-secondary"
                            placeholder="Weight (kg)"
                            value={item.weight}
                            onChange={(e) => handleItemChange(index, "weight", e.target.value)}
                          />
                        </div>
                        <div className="col-6">
                          <input
                            type="number"
                            className="form-control bg-dark text-light border-secondary"
                            placeholder="Price/kg"
                            value={item.pricePerKg}
                            onChange={(e) => handleItemChange(index, "pricePerKg", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mt-2 p-2 bg-dark rounded-2">
                        <small className="text-secondary">Subtotal:</small>
                        <strong className="text-warning ms-2">₹{item.total.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Item Button */}
                <button
                  type="button"
                  className="btn btn-outline-warning w-100 mb-3"
                  onClick={addItem}
                >
                  <i className="bi bi-plus-circle me-2"></i>Add Another Product
                </button>

                {/* Grand Total */}
                <div className="bg-gradient p-3 rounded-3 mb-3 text-center" style={{ background: "linear-gradient(135deg, #2a241c, #1a1a1a)", border: "1px solid #d97706" }}>
                  <small className="text-secondary text-uppercase">Grand Total</small>
                  <h2 className="text-warning fw-bold mb-0">₹{grandTotal.toLocaleString()}</h2>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-warning w-100 py-2 fw-bold" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Record Sale
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* SALES TABLE - RIGHT COLUMN */}
        <div className="col-md-7">
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
                      placeholder="Search by customer..."
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
                  <button className="btn btn-outline-warning w-100" onClick={resetFilter}>
                    <i className="bi bi-arrow-repeat me-1"></i> Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Records Table */}
          <div className="card bg-dark border-warning rounded-4 overflow-hidden shadow-lg">
            <div className="card-header bg-transparent border-warning py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="text-warning mb-0">
                  <i className="bi bi-database me-2"></i>Sales Records
                </h5>
                <span className="badge bg-warning text-dark">
                  <i className="bi bi-files me-1"></i> {filteredData.length} Records
                </span>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0">
                  <thead className="border-bottom border-warning">
                    <tr>
                      <th><i className="bi bi-person me-1"></i> Customer</th>
                      <th><i className="bi bi-cube me-1"></i> Products</th>
                      <th><i className="bi bi-weight-scale me-1"></i> Weights</th>
                      <th><i className="bi bi-currency-rupee me-1"></i> Total</th>
                      <th><i className="bi bi-calendar me-1"></i> Date</th>
                      <th><i className="bi bi-receipt me-1"></i> Bill</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <i className="bi bi-inbox fs-1 text-secondary d-block mb-2"></i>
                          <p className="text-secondary mb-0">No sales records found</p>
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((d) => (
                        <tr key={d._id} className="border-bottom border-secondary">
                          <td className="fw-semibold">
                            <i className="bi bi-building text-warning me-2"></i>
                            {d.customerName}
                          </td>
                          <td>
                            {d.items?.map((item, i) => (
                              <div key={i} className="mb-1">
                                <span className="badge bg-warning bg-opacity-25 text-warning">
                                  {item.product}
                                </span>
                              </div>
                            ))}
                          </td>
                          <td>
                            {d.items?.map((item, i) => (
                              <div key={i} className="text-secondary">
                                {item.weight} kg
                              </div>
                            ))}
                          </td>
                          <td className="text-success fw-bold">₹{d.total?.toLocaleString()}</td>
                          <td className="text-secondary">
                            <small>{formatDate(d.createdAt)}</small>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => openBill(d._id)}
                            >
                              <i className="bi bi-receipt me-1"></i> Bill
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {filteredData.length > 0 && (
                    <tfoot className="border-top border-warning">
                      <tr className="fw-bold">
                        <td colSpan="2" className="text-end text-secondary">Total:</td>
                        <td className="text-warning">{totalWeight.toLocaleString()} kg</td>
                        <td className="text-success">₹{totalAmount.toLocaleString()}</td>
                        <td colSpan="2"></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sales;