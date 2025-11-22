import React from "react";

const InventorySidebar = ({ product, history, onClose }) => {
  if (!product) return null;
  return (
    <div className="sidebar open">
      <div className="sidebar-header">
        <h3>Inventory History</h3>
        <button className="btn small" onClick={onClose}>Close</button>
      </div>
      <div className="sidebar-body">
        <p><strong>{product.name}</strong></p>
        <p>Current stock: {product.stock}</p>

        <table className="history-table">
          <thead>
            <tr><th>Date</th><th>Old</th><th>New</th><th>User</th></tr>
          </thead>
          <tbody>
            {history.length===0 && <tr><td colSpan={4}>No history</td></tr>}
            {history.map(h => (
              <tr key={h.id}>
                <td>{new Date(h.timestamp).toLocaleDateString()}</td>
                <td>{h.oldStock}</td>
                <td>{h.newStock}</td>
                <td>{h.changedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventorySidebar;
