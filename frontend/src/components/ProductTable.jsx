import React, { useState } from "react";

const ProductTable = ({
  products,
  onRowClick,
  onUpdate,
  onDelete,
  page,
  setPage,
  totalPages
}) => {
  const [openMenu, setOpenMenu] = useState(null);

  const prev = () => page > 1 && setPage(page - 1);
  const next = () => page < totalPages && setPage(page + 1);

  return (
    <div className="table-card">
      <table className="products-table">
        <thead>
          <tr>
            <th></th>
            <th>Image</th>
            <th>Name</th>
            <th>Unit</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan={9} style={{ textAlign: "center", padding: "24px 0" }}>
                No products found
              </td>
            </tr>
          )}

          {products.map((p) => (
            <tr key={p.id} onClick={() => onRowClick(p)}>
              <td><input type="checkbox" onClick={(e) => e.stopPropagation()} /></td>

              <td>
                <img className="product-image" src={p.image} alt={p.name}
                  onError={(e) => e.target.style.display = "none"} />
              </td>

              <td>{p.name}</td>
              <td>{p.unit}</td>
              <td>{p.category}</td>
              <td>{p.brand}</td>
              <td>{p.stock}</td>

              <td>
                <span className={`status ${p.stock > 0 ? "in" : "out"}`}>
                  {p.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </td>

              <td
                className="action-cell"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="menu-wrapper">
                  <button
                    className="dots-btn"
                    onClick={() =>
                      setOpenMenu(openMenu === p.id ? null : p.id)
                    }
                  >
                    ⋮
                  </button>

                  {openMenu === p.id && (
                    <div className="menu-dropdown">
                      <button onClick={onUpdate}>Edit</button>
                      <button onClick={onDelete}>Delete</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="table-footer">
        <div>Page {page} of {totalPages}</div>

        <div>
          <button className="btn small" onClick={prev} disabled={page <= 1}>
            Previous
          </button>

          <button className="btn small primary" style={{ marginLeft: 8 }}>
            {page}
          </button>

          <button
            className="btn small"
            onClick={next}
            disabled={page >= totalPages}
            style={{ marginLeft: 8 }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
