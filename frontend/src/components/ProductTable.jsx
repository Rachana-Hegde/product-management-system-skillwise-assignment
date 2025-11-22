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
  const [editingId, setEditingId] = useState(null);
  const [edit, setEdit] = useState({});
  const [openMenu, setOpenMenu] = useState(null); // <-- dropdown menu state

  const startEdit = (p, e) => {
    e.stopPropagation();
    setEditingId(p.id);
    setEdit({ ...p });
    setOpenMenu(null);
  };

  const saveEdit = async (e) => {
    e.stopPropagation();
    if (!editingId) return;
    await onUpdate(editingId, edit);
    setEditingId(null);
  };

  const cancelEdit = (e) => {
    e.stopPropagation();
    setEditingId(null);
    setEdit({});
  };

  const updateField = (k, v) =>
    setEdit((prev) => ({
      ...prev,
      [k]: v
    }));

  const prev = () => page > 1 && setPage(page - 1);
  const next = () => page < totalPages && setPage(page + 1);

  return (
    <div className="table-card">
      <table className="products-table">
        <thead>
          <tr>
            <th style={{ width: 40 }}></th>
            <th style={{ width: 72 }}>Image</th>
            <th>Name</th>
            <th>Unit</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Stock</th>
            <th>Status</th>
            <th style={{ minWidth: 120 }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan={9} style={{ textAlign: "center", padding: "28px 0" }}>
                No products found
              </td>
            </tr>
          )}

          {products.map((p) => {
            const editing = editingId === p.id;

            return (
              <tr key={p.id} onClick={() => !editing && onRowClick(p)}>
                <td>
                  <input
                    type="checkbox"
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>

                <td>
                  {p.image ? (
                    <img
                      className="product-image"
                      src={p.image}
                      alt={p.name}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="product-image-fallback">No</div>
                  )}
                </td>

                {/* Name */}
                <td>
                  {editing ? (
                    <input
                      value={edit.name}
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                  ) : (
                    p.name
                  )}
                </td>

                {/* Unit */}
                <td>
                  {editing ? (
                    <input
                      value={edit.unit}
                      onChange={(e) => updateField("unit", e.target.value)}
                    />
                  ) : (
                    p.unit
                  )}
                </td>

                {/* Category */}
                <td>
                  {editing ? (
                    <input
                      value={edit.category}
                      onChange={(e) =>
                        updateField("category", e.target.value)
                      }
                    />
                  ) : (
                    p.category
                  )}
                </td>

                {/* Brand */}
                <td>
                  {editing ? (
                    <input
                      value={edit.brand}
                      onChange={(e) => updateField("brand", e.target.value)}
                    />
                  ) : (
                    p.brand
                  )}
                </td>

                {/* Stock */}
                <td>
                  {editing ? (
                    <input
                      type="number"
                      min="0"
                      value={edit.stock}
                      onChange={(e) =>
                        updateField("stock", Number(e.target.value))
                      }
                    />
                  ) : (
                    p.stock
                  )}
                </td>

                {/* Status */}
                <td>
                  {editing ? (
                    <select
                      value={edit.status}
                      onChange={(e) =>
                        updateField("status", e.target.value)
                      }
                    >
                      <option>In Stock</option>
                      <option>Out of Stock</option>
                    </select>
                  ) : (
                    <span
                      className={`status ${
                        p.stock > 0 ? "in" : "out"
                      }`}
                    >
                      {p.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  )}
                </td>

                {/* ACTIONS with 3-DOT MENU */}
                <td className="action-cell" onClick={(e) => e.stopPropagation()}>
                  {editing ? (
                    <>
                      <button
                        className="btn small primary"
                        onClick={saveEdit}
                      >
                        Save
                      </button>
                      <button className="btn small" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </>
                  ) : (
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
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(p, e);
                            }}
                          >
                            Edit
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(p.id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* FOOTER */}
      <div className="table-footer">
        <div>Page {page} of {totalPages}</div>
        <div>
          <button
            className="btn small"
            onClick={prev}
            disabled={page <= 1}
          >
            Previous
          </button>

          <button
            className="btn small primary"
            style={{ marginLeft: 8 }}
          >
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
