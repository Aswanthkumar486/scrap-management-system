/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import API from "../utils/api";

function Sales() {
  const [form, setForm] = useState({
    customerName: "",
    product: "",
    weight: "",
    pricePerKg: "",
    total: 0
  });

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [products, setProducts] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

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
      console.log("ERROR:", err.response?.data || err.message);
    }
  };

  // ✅ FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await API.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      console.log("Product fetch error:", err);
    }
  };

  // ✅ SUBMIT SALE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.customerName || !form.product || !form.weight || !form.pricePerKg) {
      alert("⚠️ Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await API.post("/api/sales", {
        ...form,
        weight: Number(form.weight),
        pricePerKg: Number(form.pricePerKg),
        total: Number(form.weight) * Number(form.pricePerKg)
      });

      alert("✅ Sale Added Successfully!");
      fetchData();

      setForm({
        customerName: "",
        product: "",
        weight: "",
        pricePerKg: "",
        total: 0
      });

    } catch (err) {
      console.log("Add sale error:", err);
      alert("❌ Error adding sale");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SELECT PRODUCT
  const handleProductSelect = (e) => {
    const selected = products.find(p => p.name === e.target.value);

    if (selected) {
      setForm({
        ...form,
        product: selected.name,
        pricePerKg: selected.pricePerKg || 0
      });
    }
  };

  // ✅ FILTER
  const handleFilter = async () => {
    if (!fromDate || !toDate) {
      alert("⚠️ Select both dates");
      return;
    }

    try {
      const res = await API.get(`/api/sales/filter?from=${fromDate}&to=${toDate}`);
      setFilteredData(res.data);
    } catch (err) {
      console.log("Filter error:", err);
    }
  };

  const resetFilter = () => {
    setFilteredData(data);
    setFromDate("");
    setToDate("");
  };

  // ✅ SAFE DATE FORMAT (fix crash issue)
  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return isNaN(d) ? "-" : d.toLocaleDateString("en-IN");
  };

  // ✅ BILL DOWNLOAD WITH TOKEN (IMPORTANT FIX)
  const openBill = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`https://scrap-backend-l7w1.onrender.com/api/bill/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url);

    } catch (err) {
      console.log("Bill error:", err);
      alert("❌ Failed to open bill");
    }
  };

  const totalAmount = filteredData.reduce((sum, item) => sum + (item.total || 0), 0);

  return (
    <div>
      {/* HEADER */}
      <div className="card bg-dark border-warning rounded-4 mb-4">
        <div className="card-body p-4 d-flex justify-content-between">
          <div>
            <h3 className="text-warning">Sales Management</h3>
            <p className="text-secondary">Track all scrap sales</p>
          </div>
          <div>
            <h5 className="text-success">₹{totalAmount.toLocaleString()}</h5>
          </div>
        </div>
      </div>

      <div className="row">
        {/* FORM */}
        <div className="col-md-5">
          <div className="card p-3 bg-dark border-warning">
            <form onSubmit={handleSubmit}>
              <input
                className="form-control mb-2"
                placeholder="Customer Name"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              />

              <select
                className="form-control mb-2"
                value={form.product}
                onChange={handleProductSelect}
              >
                <option value="">Select Product</option>
                {products.map(p => (
                  <option key={p._id} value={p.name}>
                    {p.name} (₹{p.pricePerKg}/kg)
                  </option>
                ))}
              </select>

              <input
                type="number"
                className="form-control mb-2"
                placeholder="Weight"
                value={form.weight}
                onChange={(e) => {
                  const w = e.target.value;
                  setForm({
                    ...form,
                    weight: w,
                    total: Number(w) * Number(form.pricePerKg)
                  });
                }}
              />

              <input
                type="number"
                className="form-control mb-2"
                placeholder="Price/kg"
                value={form.pricePerKg}
                onChange={(e) => {
                  const p = e.target.value;
                  setForm({
                    ...form,
                    pricePerKg: p,
                    total: Number(form.weight) * Number(p)
                  });
                }}
              />

              <h5 className="text-warning">Total: ₹{form.total}</h5>

              <button className="btn btn-warning w-100" disabled={loading}>
                {loading ? "Processing..." : "Add Sale"}
              </button>
            </form>
          </div>
        </div>

        {/* TABLE */}
        <div className="col-md-7">
          <table className="table table-dark">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product</th>
                <th>Weight</th>
                <th>Total</th>
                <th>Date</th>
                <th>Bill</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((d) => (
                <tr key={d._id}>
                  <td>{d.customerName}</td>
                  <td>{d.product}</td>
                  <td>{d.weight} kg</td>
                  <td>₹{d.total}</td>
                  <td>{formatDate(d.createdAt)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => openBill(d._id)}
                    >
                      Bill
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Sales;