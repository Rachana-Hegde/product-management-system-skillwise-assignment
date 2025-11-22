import React, { useState, useEffect } from "react";

const defaultState = {
  name: "", unit: "", category: "", brand: "",
  stock: 0, status: "In Stock", image: ""
};

const AddProductModal = ({ open, onClose, onCreate, sampleImageUrl }) => {
  const [form, setForm] = useState(defaultState);
  const [preview, setPreview] = useState(sampleImageUrl || "");

  useEffect(() => {
    if (!open) {
      setForm(defaultState);
      setPreview(sampleImageUrl || "");
    }
  }, [open, sampleImageUrl]);

  const handleChange = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (k === "image") setPreview(v);
  };

  const submit = async () => {
    // basic validation
    if (!form.name.trim()) return alert("Name required");
    if (isNaN(Number(form.stock)) || Number(form.stock) < 0) return alert("Stock must be >= 0");
    // create
    await onCreate({
      name: form.name,
      unit: form.unit,
      category: form.category,
      brand: form.brand,
      stock: Number(form.stock),
      status: form.status,
      image: form.image || preview || ""
    });
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Add New Product</h3>
          <button className="btn small" onClick={onClose}>Close</button>
        </div>

        <div className="modal-body">
          <div className="modal-left">
            <div className="form-row">
              <label>Name</label>
              <input value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
            </div>
            <div className="form-row">
              <label>Unit</label>
              <input value={form.unit} onChange={(e) => handleChange("unit", e.target.value)} />
            </div>
            <div className="form-row">
              <label>Category</label>
              <input value={form.category} onChange={(e) => handleChange("category", e.target.value)} />
            </div>
            <div className="form-row">
              <label>Brand</label>
              <input value={form.brand} onChange={(e) => handleChange("brand", e.target.value)} />
            </div>
            <div className="form-row">
              <label>Stock</label>
              <input type="number" value={form.stock} onChange={(e) => handleChange("stock", e.target.value)} />
            </div>
            <div className="form-row">
              <label>Status</label>
              <select value={form.status} onChange={(e) => handleChange("status", e.target.value)}>
                <option>In Stock</option>
                <option>Out of Stock</option>
              </select>
            </div>
            <div className="form-row">
              <label>Image URL</label>
              <input value={form.image} onChange={(e) => handleChange("image", e.target.value)} placeholder="https://..." />
            </div>
          </div>

          <div className="modal-right">
            <div className="preview-box">
              {preview ? (
                <img src={preview} alt="preview" className="preview-image" onError={(e)=> e.target.style.display='none'} />
              ) : (
                <div className="preview-placeholder">Image preview</div>
              )}
            </div>
            <div style={{ marginTop: 12 }}>
              <button className="btn primary" onClick={submit}>Create Product</button>
              <button className="btn" onClick={onClose} style={{ marginLeft: 8 }}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
