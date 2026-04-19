import { useState } from "react";
import API from "../utils/api";

function AddProducts({ refreshProducts }) {
  const [form, setForm] = useState({
    name: "",
    pricePerKg: "",
    stock: "",
    image: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.pricePerKg || !form.stock) {
      alert("⚠️ Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      await API.post("/api/products", {
        name: form.name,
        pricePerKg: Number(form.pricePerKg),
        stock: Number(form.stock),
        image: form.image
      });
      alert("✅ Product Added Successfully!");

      setForm({ name: "", pricePerKg: "", stock: "", image: "" });
      if (refreshProducts) refreshProducts();
    } catch (err) {
      console.log(err);
      alert("❌ Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-dark border-warning rounded-4 shadow-lg overflow-hidden">
      <div className="card-header bg-gradient border-warning py-3" style={{ background: "linear-gradient(135deg, #2a241c, #1a1a1a)" }}>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-cube-fill fs-4 text-warning"></i>
          <h4 className="mb-0 text-warning fw-bold">Add New Product</h4>
          <span className="ms-auto badge bg-warning text-dark">
            <i className="bi bi-plus-circle me-1"></i> New Entry
          </span>
        </div>
      </div>

      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-secondary fw-semibold">
              <i className="bi bi-tag me-2 text-warning"></i>Product Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Copper Scrap, HMS, Stainless Steel"
              className="form-control bg-dark text-light border-secondary"
              style={{ borderLeft: "3px solid #d97706" }}
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label text-secondary fw-semibold">
                <i className="bi bi-currency-rupee me-2 text-warning"></i>Price per Kg
              </label>
              <input
                type="number"
                name="pricePerKg"
                placeholder="Enter rate"
                className="form-control bg-dark text-light border-secondary"
                value={form.pricePerKg}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label text-secondary fw-semibold">
                <i className="bi bi-weight-scale me-2 text-warning"></i>Stock (Kg)
              </label>
              <input
                type="number"
                name="stock"
                placeholder="Available quantity"
                className="form-control bg-dark text-light border-secondary"
                value={form.stock}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-secondary fw-semibold">
              <i className="bi bi-image me-2 text-warning"></i>Image URL (Optional)
            </label>
            <input
              type="text"
              name="image"
              placeholder="https://example.com/product-image.jpg"
              className="form-control bg-dark text-light border-secondary"
              value={form.image}
              onChange={handleChange}
            />
          </div>

          {form.image && (
            <div className="text-center mb-3 p-3 bg-dark rounded-3">
              <img
                src={form.image}
                alt="preview"
                className="rounded-3 shadow"
                style={{ width: "100px", height: "100px", objectFit: "cover", border: "2px solid #d97706" }}
                onError={(e) => { e.target.src = "https://via.placeholder.com/100?text=Scrap" }}
              />
            </div>
          )}

          <button
            className="btn btn-warning w-100 py-2 fw-bold mt-2"
            disabled={loading}
            style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)", border: "none" }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Adding...
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle me-2"></i>
                Add Product to Inventory
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProducts;