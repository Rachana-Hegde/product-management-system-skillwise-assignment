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

  // hidden file input for CSV import
  const fileInputRef = React.useRef(null);

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      onImport(e.target.files[0]);
    }
  };

  return (
    <>
      {/* ---- PAGE TITLE ---- */}
      <h2 className="header-title" style={{ textAlign: "center", marginBottom: "20px" }}>
        Inventory Management System
      </h2>

      {/* ---- SEARCH + CATEGORY + BUTTONS ---- */}
      <div className="search-bar">

        {/* SEARCH BOX */}
        <input
          className="search-input"
          type="text"
          placeholder="Search product..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />

        {/* CATEGORY DROPDOWN (DYNAMIC) */}
        <select
          className="category-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>

          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* RIGHT SIDE BUTTONS */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>

          {/* Hidden Input for CSV Import */}
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <button
            className="btn small"
            onClick={handleImportClick}
            style={{ background: "#2f9e44", color: "#fff" }}
          >
            Import CSV
          </button>

          <button className="btn small primary" onClick={onExport}>
            Export CSV
          </button>

          <button
            className="btn small primary"
            onClick={onAdd}
            style={{ background: "#1c7ed6" }}
          >
            + Add Product
          </button>
        </div>
      </div>
    </>
  );
};

export default HeaderBar;
