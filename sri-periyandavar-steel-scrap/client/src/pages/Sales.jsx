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

    if (!form.customerName || form.items.length === 0) {
      alert("⚠️ Fill all fields");
      return;
    }

    setLoading(true);

    try {
      await API.post("/api/sales", {
        customerName: form.customerName,
        items: form.items,
        total: grandTotal
      });

      alert("✅ Sale Added!");
      fetchData();

      setForm({
        customerName: "",
        items: [{ product: "", weight: "", pricePerKg: "", total: 0 }]
      });

    } catch (err) {
      console.log(err);
      alert("❌ Error");
    } finally {
      setLoading(false);
    }
  };

  // 📅 FILTER
  const handleFilter = async () => {
    if (!fromDate || !toDate) {
      alert("Select dates");
      return;
    }

    const res = await API.get(`/api/sales/filter?from=${fromDate}&to=${toDate}`);
    setFilteredData(res.data);
  };

  const resetFilter = () => {
    setFilteredData(data);
    setFromDate("");
    setToDate("");
  };

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return isNaN(d) ? "-" : d.toLocaleDateString("en-IN");
  };

  const totalAmount = filteredData.reduce((sum, item) => sum + (item.total || 0), 0);

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
      alert("Bill error");
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="card bg-dark border-warning mb-4">
        <div className="card-body d-flex justify-content-between">
          <h3 className="text-warning">Sales</h3>
          <h5 className="text-success">₹{totalAmount}</h5>
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
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
              />

              {form.items.map((item, index) => (
                <div key={index} className="border p-2 mb-2 rounded">
                  <select
                    className="form-control mb-2"
                    value={item.product}
                    onChange={(e) =>
                      handleProductSelect(index, e.target.value)
                    }
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
                    value={item.weight}
                    onChange={(e) =>
                      handleItemChange(index, "weight", e.target.value)
                    }
                  />

                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Price/kg"
                    value={item.pricePerKg}
                    onChange={(e) =>
                      handleItemChange(index, "pricePerKg", e.target.value)
                    }
                  />

                  <p className="text-warning">₹{item.total}</p>

                  {form.items.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="btn btn-secondary mb-2"
                onClick={addItem}
              >
                + Add Product
              </button>

              <h5 className="text-warning">Total: ₹{grandTotal}</h5>

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
                <th>Products</th>
                <th>Weights</th>
                <th>Total</th>
                <th>Date</th>
                <th>Bill</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((d) => (
                <tr key={d._id}>
                  <td>{d.customerName}</td>

                  <td>
                    {d.items?.map((item, i) => (
                      <div key={i}>{item.product}</div>
                    ))}
                  </td>

                  <td>
                    {d.items?.map((item, i) => (
                      <div key={i}>{item.weight} kg</div>
                    ))}
                  </td>

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