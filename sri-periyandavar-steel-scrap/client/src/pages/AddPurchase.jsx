import { useState, useEffect } from "react";
import API from "../utils/api";

function AddPurchase({ refreshPurchase }) {

  const [form, setForm] = useState({
    customerName: "",
    items: [{ material: "", weight: "", pricePerKg: "", total: 0 }],
    image: ""
  });

  const [scrapList, setScrapList] = useState([]);

  useEffect(() => {
    fetchScrap();
  }, []);

  const fetchScrap = async () => {
    const res = await API.get("/api/scrap");
    setScrapList(res.data);
  };

  // ➕ ADD ROW
  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { material: "", weight: "", pricePerKg: "", total: 0 }]
    });
  };

  // ❌ REMOVE ROW
  const removeItem = (index) => {
    const updated = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: updated });
  };

  // 🔄 CHANGE ITEM
  const handleItemChange = (index, field, value) => {
    const updated = [...form.items];
    updated[index][field] = value;

    const w = Number(updated[index].weight || 0);
    const p = Number(updated[index].pricePerKg || 0);
    updated[index].total = w * p;

    setForm({ ...form, items: updated });
  };

  // 🧠 SELECT MATERIAL
  const handleSelect = (index, value) => {
    const selected = scrapList.find(s => s.material === value);

    if (selected) {
      const updated = [...form.items];
      updated[index].material = selected.material;
      updated[index].pricePerKg = selected.pricePerKg;

      const w = Number(updated[index].weight || 0);
      updated[index].total = w * selected.pricePerKg;

      setForm({ ...form, items: updated });
    }
  };

  // 💰 TOTAL
  const grandTotal = form.items.reduce((sum, i) => sum + i.total, 0);

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.customerName || form.items.length === 0) {
      alert("Fill all fields");
      return;
    }

    await API.post("/api/purchase", {
      customerName: form.customerName,
      items: form.items,
      total: grandTotal,
      image: form.image
    });

    alert("Purchase Added");

    setForm({
      customerName: "",
      items: [{ material: "", weight: "", pricePerKg: "", total: 0 }],
      image: ""
    });

    if (refreshPurchase) refreshPurchase();
  };

  return (
    <div className="card p-3 bg-dark border-warning">
      <form onSubmit={handleSubmit}>

        <input
          className="form-control mb-2"
          placeholder="Supplier Name"
          value={form.customerName}
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
        />

        {form.items.map((item, index) => (
          <div key={index} className="border p-2 mb-2">

            <select
              className="form-control mb-2"
              value={item.material}
              onChange={(e) => handleSelect(index, e.target.value)}
            >
              <option value="">Select Material</option>
              {scrapList.map(s => (
                <option key={s._id} value={s.material}>
                  {s.material} (₹{s.pricePerKg})
                </option>
              ))}
            </select>

            <input
              type="number"
              className="form-control mb-2"
              placeholder="Weight"
              value={item.weight}
              onChange={(e) => handleItemChange(index, "weight", e.target.value)}
            />

            <input
              type="number"
              className="form-control mb-2"
              placeholder="Price/kg"
              value={item.pricePerKg}
              onChange={(e) => handleItemChange(index, "pricePerKg", e.target.value)}
            />

            <p>₹{item.total}</p>

            {form.items.length > 1 && (
              <button type="button" onClick={() => removeItem(index)}>
                Remove
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addItem}>
          + Add Material
        </button>

        <h5>Total: ₹{grandTotal}</h5>

        <button className="btn btn-warning w-100">Save</button>

      </form>
    </div>
  );
}

export default AddPurchase;