import { useState, useEffect } from "react";
import API from "../utils/api";

function AddPurchase({ refreshPurchase }) {
  const [form, setForm] = useState({
    customerName: "",
    items: [{ material: "", weight: "", pricePerKg: "", total: 0 }]
  });
  const [scrapList, setScrapList] = useState([]);
  const [newMaterial, setNewMaterial] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [activeTab, setActiveTab] = useState("purchase");

  useEffect(() => {
    fetchScrap();
  }, []);

  const fetchScrap = async () => {
    try {
      const res = await API.get("/api/scrap");
      setScrapList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Add Scrap
  const addScrap = async () => {
    if (!newMaterial || !newPrice) return alert("⚠️ Please enter material and price");
    await API.post("/api/scrap", { material: newMaterial, pricePerKg: newPrice });
    setNewMaterial("");
    setNewPrice("");
    fetchScrap();
    alert("✅ Scrap material added successfully!");
  };

  // Update Scrap Price
  const updatePrice = async (id, price) => {
    await API.put(`/api/scrap/${id}`, { pricePerKg: price });
    fetchScrap();
    alert("✅ Price updated successfully!");
  };

  // Delete Scrap
  const deleteScrap = async (id) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      await API.delete(`/api/scrap/${id}`);
      fetchScrap();
      alert("✅ Material deleted successfully!");
    }
  };

  // Add item row
  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { material: "", weight: "", pricePerKg: "", total: 0 }]
    });
  };

  // Remove item
  const removeItem = (i) => {
    const updated = form.items.filter((_, index) => index !== i);
    setForm({ ...form, items: updated });
  };

  // Change item
  const handleChange = (i, field, value) => {
    const updated = [...form.items];
    updated[i][field] = value;
    const w = Number(updated[i].weight || 0);
    const p = Number(updated[i].pricePerKg || 0);
    updated[i].total = w * p;
    setForm({ ...form, items: updated });
  };

  // Select material
  const handleSelect = (i, value) => {
    const selected = scrapList.find(s => s.material === value);
    if (selected) {
      const updated = [...form.items];
      updated[i].material = selected.material;
      updated[i].pricePerKg = selected.pricePerKg;
      const w = Number(updated[i].weight || 0);
      updated[i].total = w * selected.pricePerKg;
      setForm({ ...form, items: updated });
    }
  };

  const grandTotal = form.items.reduce((sum, i) => sum + i.total, 0);

  // Submit Purchase
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName || form.items.some(item => !item.material || !item.weight)) {
      alert("⚠️ Please fill all required fields");
      return;
    }
    await API.post("/api/purchase", {
      customerName: form.customerName,
      items: form.items,
      total: grandTotal
    });
    alert("✅ Purchase Added Successfully!");
    setForm({
      customerName: "",
      items: [{ material: "", weight: "", pricePerKg: "", total: 0 }]
    });
    refreshPurchase();
  };

  return (
    <div className="card bg-dark border-warning rounded-4 shadow-lg overflow-hidden mb-4">
      {/* Card Header with Tabs */}
      <div className="card-header bg-transparent border-warning py-3">
        <ul className="nav nav-tabs card-header-tabs" style={{ borderBottom: "none" }}>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "purchase" ? "active bg-warning text-dark fw-bold" : "text-secondary"}`}
              onClick={() => setActiveTab("purchase")}
              style={{ borderRadius: "8px 8px 0 0" }}
            >
              <i className="bi bi-cart-plus me-2"></i>New Purchase
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "scrap" ? "active bg-warning text-dark fw-bold" : "text-secondary"}`}
              onClick={() => setActiveTab("scrap")}
              style={{ borderRadius: "8px 8px 0 0" }}
            >
              <i className="bi bi-gear me-2"></i>Manage Scrap Materials
            </button>
          </li>
        </ul>
      </div>

      <div className="card-body p-4">
        {activeTab === "purchase" ? (
          // PURCHASE FORM
          <form onSubmit={handleSubmit}>
            {/* Supplier Name */}
            <div className="mb-4">
              <label className="form-label text-warning fw-semibold">
                <i className="bi bi-person-fill me-2"></i>Supplier Name
              </label>
              <input
                className="form-control bg-dark text-light border-warning"
                style={{ borderLeft: "3px solid #d97706" }}
                placeholder="Enter supplier name"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              />
            </div>

            {/* Items List */}
            <label className="form-label text-warning fw-semibold mb-3">
              <i className="bi bi-list-check me-2"></i>Purchase Items
            </label>

            {form.items.map((item, i) => (
              <div key={i} className="card bg-dark border-secondary mb-3 rounded-3">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="text-info mb-0">Item #{i + 1}</h6>
                    {form.items.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeItem(i)}
                      >
                        <i className="bi bi-trash me-1"></i> Remove
                      </button>
                    )}
                  </div>

                  {/* Material Select */}
                  <select
                    className="form-control bg-dark text-light border-secondary mb-2"
                    value={item.material}
                    onChange={(e) => handleSelect(i, e.target.value)}
                  >
                    <option value="">Select Material</option>
                    {scrapList.map(s => (
                      <option key={s._id} value={s.material}>
                        {s.material} (₹{s.pricePerKg}/kg)
                      </option>
                    ))}
                  </select>

                  <div className="row g-2">
                    <div className="col-md-6">
                      <input
                        type="number"
                        className="form-control bg-dark text-light border-secondary"
                        placeholder="Weight (kg)"
                        value={item.weight}
                        onChange={(e) => handleChange(i, "weight", e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="number"
                        className="form-control bg-dark text-light border-secondary"
                        placeholder="Price per kg"
                        value={item.pricePerKg}
                        onChange={(e) => handleChange(i, "pricePerKg", e.target.value)}
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
            <button type="button" className="btn btn-outline-warning w-100 mb-3" onClick={addItem}>
              <i className="bi bi-plus-circle me-2"></i>Add Another Item
            </button>

            {/* Grand Total */}
            <div className="bg-gradient p-3 rounded-3 mb-3 text-center" style={{ background: "linear-gradient(135deg, #2a241c, #1a1a1a)", border: "1px solid #d97706" }}>
              <small className="text-secondary text-uppercase">Grand Total</small>
              <h2 className="text-warning fw-bold mb-0">₹{grandTotal.toLocaleString()}</h2>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-warning w-100 py-2 fw-bold">
              <i className="bi bi-check-circle me-2"></i>Save Purchase
            </button>
          </form>
        ) : (
          // SCRAP MANAGEMENT SECTION
          <div>
            {/* Add New Scrap */}
            <div className="card bg-dark border-info rounded-3 mb-4">
              <div className="card-header bg-transparent border-info">
                <h5 className="text-info mb-0">
                  <i className="bi bi-plus-circle me-2"></i>Add New Scrap Material
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-2">
                  <div className="col-md-5">
                    <input
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Material name"
                      value={newMaterial}
                      onChange={(e) => setNewMaterial(e.target.value)}
                    />
                  </div>
                  <div className="col-md-5">
                    <input
                      type="number"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Price per kg"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <button className="btn btn-success w-100" onClick={addScrap}>
                      <i className="bi bi-plus-lg"></i> Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrap Materials List */}
            <div className="card bg-dark border-warning rounded-3">
              <div className="card-header bg-transparent border-warning">
                <h5 className="text-warning mb-0">
                  <i className="bi bi-database me-2"></i>Scrap Materials List
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-dark table-hover mb-0">
                    <thead className="border-bottom border-warning">
                      <tr>
                        <th>Material</th>
                        <th>Price per Kg</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scrapList.map((s) => (
                        <tr key={s._id}>
                          <td className="fw-semibold">
                            <i className="bi bi-cube text-warning me-2"></i>
                            {s.material}
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control form-control-sm bg-dark text-warning border-warning"
                              style={{ width: "120px" }}
                              value={s.pricePerKg}
                              onChange={(e) => {
                                const updated = scrapList.map(item =>
                                  item._id === s._id ? { ...item, pricePerKg: e.target.value } : item
                                );
                                setScrapList(updated);
                              }}
                            />
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => updatePrice(s._id, s.pricePerKg)}
                              >
                                <i className="bi bi-pencil"></i> Update
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => deleteScrap(s._id)}
                              >
                                <i className="bi bi-trash"></i> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {scrapList.length === 0 && (
                        <tr>
                          <td colSpan="3" className="text-center py-4 text-secondary">
                            <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                            No scrap materials added yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddPurchase;