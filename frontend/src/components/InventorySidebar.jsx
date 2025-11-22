import React from "react";

const InventorySidebar = ({ product, history, onClose }) => {
  if (!product) return null;

  return (
    <div className="sidebar">
      <button className="close-btn" onClick={onClose}>×</button>

      <h3 style={{ marginBottom: "15px" }}>Product Details</h3>

      <img
        src={product.image}
        alt={product.name}
        className="sidebar-img"
        onError={(e) => (e.target.style.display = "none")}
      />

      <p><strong>Name:</strong> {product.name}</p>
      <p><strong>Unit:</strong> {product.unit}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Brand:</strong> {product.brand}</p>
      <p><strong>Stock:</strong> {product.stock}</p>

      <p>
        <strong>Status:</strong>{" "}
        <span className={product.stock > 0 ? "status in" : "status out"}>
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </span>
      </p>

      {/* History removed because no backend */}
      <h4 style={{ marginTop: "20px" }}>History (disabled)</h4>
      <p style={{ fontSize: "14px", color: "#777" }}>
        History is only available in admin mode.
      </p>
    </div>
  );
};

export default InventorySidebar;
