import { useState, useEffect } from "react";
import API from "../utils/api";

function AddPurchase({ refreshPurchase }) {
  const [form, setForm] = useState({
    customerName: "",
    material: "",
    weight: "",
    pricePerKg: "",
    total: 0,
    image: ""
  });

  const [scrapList, setScrapList] = useState([]);
  const [newScrap, setNewScrap] = useState({ material: "", pricePerKg: "" });
  const [activeTab, setActiveTab] = useState("purchase");

  useEffect(() => {
    fetchScrap();
  }, []);

  const fetchScrap = async () => {
    const res = await API.get("/api/scrap");
    setScrapList(res.data);
  };

  const addScrap = async () => {
    if (!newScrap.material || !newScrap.pricePerKg) {
      alert("⚠️ Fill all fields");
      return;
    }
    await API.post("/api/scrap", newScrap);
    setNewScrap({ material: "", pricePerKg: "" });
    fetchScrap();
    alert("✅ Scrap material added");
  };

  const updateScrapPrice = async (id) => {
    const price = prompt("Enter new price per kg:");
    if (!price) return;
    await API.put(`/api/scrap/${id}`, { pricePerKg: Number(price) });
    fetchScrap();
  };

  const handleChange = (e) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    const weight = Number(newForm.weight || 0);
    const price = Number(newForm.pricePerKg || 0);
    newForm.total = weight * price;
    setForm(newForm);
  };

  const handleSelect = (e) => {
    const selected = scrapList.find(s => s.material === e.target.value);
    if (!selected) return;
    const updated = {
      ...form,
      material: selected.material,
      pricePerKg: selected.pricePerKg
    };
    updated.total = Number(updated.weight || 0) * selected.pricePerKg;
    setForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName || !form.material || !form.weight || !form.pricePerKg) {
      alert("⚠️ Please fill all required fields");
      return;
    }
    await API.post("/api/purchase", {
      customerName: form.customerName,
      material: form.material,
      weight: Number(form.weight),
      pricePerKg: Number(form.pricePerKg),
      total: form.total,
      image: form.image
    });
    alert("✅ Purchase Added Successfully!");
    setForm({ customerName: "", material: "", weight: "", pricePerKg: "", total: 0, image: "" });
    if (refreshPurchase) refreshPurchase();
  };

  return (
    <div className="card bg-dark border-warning rounded-4 shadow-lg">
      <div className="card-header bg-transparent border-warning py-3">
        <ul className="nav nav-tabs card-header-tabs" style={{ borderBottom: "none" }}>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "purchase" ? "active bg-warning text-dark" : "text-secondary"}`}
              onClick={() => setActiveTab("purchase")}
              style={{ borderRadius: "8px 8px 0 0" }}
            >
              <i className="bi bi-cart-plus me-2"></i>Add Purchase
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "scrap" ? "active bg-warning text-dark" : "text-secondary"}`}
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
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-secondary">
                <i className="bi bi-person-fill me-2 text-warning"></i>Supplier/Customer Name
              </label>
              <input
                className="form-control bg-dark text-light border-secondary"
                style={{ borderLeft: "3px solid #d97706" }}
                placeholder="Enter name"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary">
                <i className="bi bi-list-ul me-2 text-warning"></i>Select Scrap Material
              </label>
              <select className="form-control bg-dark text-light border-secondary" onChange={handleSelect}>
                <option value="">-- Select Material --</option>
                {scrapList.map(s => (
                  <option key={s._id} value={s.material}>
                    {s.material} (₹{s.pricePerKg}/kg)
                  </option>
                ))}
              </select>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label text-secondary">
                  <i className="bi bi-weight-scale me-2 text-warning"></i>Weight (Kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Enter weight"
                  value={form.weight}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-secondary">
                  <i className="bi bi-currency-rupee me-2 text-warning"></i>Price per Kg
                </label>
                <input
                  type="number"
                  name="pricePerKg"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Rate"
                  value={form.pricePerKg}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary">
                <i className="bi bi-image me-2 text-warning"></i>Bill/Receipt Image URL
              </label>
              <input
                className="form-control bg-dark text-light border-secondary"
                placeholder="Image URL"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </div>

            <div className="mb-3 p-3 bg-dark rounded-3">
              <label className="form-label text-warning fw-bold mb-2">
                <i className="bi bi-calculator-fill me-2"></i>Total Amount
              </label>
              <h3 className="text-warning fw-bold mb-0">₹{form.total.toLocaleString()}</h3>
            </div>

            <button type="submit" className="btn btn-warning w-100 py-2 fw-bold">
              <i className="bi bi-check-circle me-2"></i>Save Purchase
            </button>
          </form>
        ) : (
          <div>
            <h5 className="text-warning mb-3">
              <i className="bi bi-plus-circle me-2"></i>Add New Scrap Material
            </h5>
            <div className="row g-2 mb-4">
              <div className="col-md-5">
                <input
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Material Name"
                  value={newScrap.material}
                  onChange={(e) => setNewScrap({ ...newScrap, material: e.target.value })}
                />
              </div>
              <div className="col-md-5">
                <input
                  type="number"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Price per Kg"
                  value={newScrap.pricePerKg}
                  onChange={(e) => setNewScrap({ ...newScrap, pricePerKg: e.target.value })}
                />
              </div>
              <div className="col-md-2">
                <button className="btn btn-success w-100" onClick={addScrap}>
                  <i className="bi bi-plus"></i> Add
                </button>
              </div>
            </div>

            <h5 className="text-warning mb-3">
              <i className="bi bi-database me-2"></i>Existing Scrap Materials
            </h5>
            <div className="table-responsive">
              <table className="table table-dark table-hover">
                <thead className="border-bottom border-warning">
                  <tr>
                    <th>Material</th>
                    <th>Price per Kg</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {scrapList.map(s => (
                    <tr key={s._id}>
                      <td><i className="bi bi-cube text-warning me-2"></i>{s.material}</td>
                      <td className="text-success fw-bold">₹{s.pricePerKg}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-warning" onClick={() => updateScrapPrice(s._id)}>
                          <i className="bi bi-pencil"></i> Edit Price
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddPurchase;