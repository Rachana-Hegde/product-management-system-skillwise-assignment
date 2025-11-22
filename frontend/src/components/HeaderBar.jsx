import React from "react";

const HeaderBar = ({
  searchName,
  setSearchName,
  categories,
  categoryFilter,
  setCategoryFilter,
  onImport,
  onExport,
  onAdd
}) => {

  return (
    <>
      <h2 className="header-title" style={{ textAlign: "center", marginBottom: "20px" }}>
        Inventory Management System
      </h2>

      <div className="search-bar">

        {/* SEARCH */}
        <input
          className="search-input"
          type="text"
          placeholder="Search product..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />

        {/* CATEGORY */}
        <select
          className="category-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>

          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>

        {/* BUTTONS */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
          <button className="btn small" onClick={onImport} style={{ background: "#2f9e44", color: "#fff" }}>
            Import CSV
          </button>

          <button className="btn small primary" onClick={onExport}>
            Export CSV
          </button>

          <button className="btn small primary" onClick={onAdd} style={{ background: "#1c7ed6" }}>
            + Add Product
          </button>
        </div>
      </div>
    </>
  );
};

export default HeaderBar;
