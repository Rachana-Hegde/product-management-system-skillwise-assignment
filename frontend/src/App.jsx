import React, { useEffect, useState } from "react";
import api from "./api";
import HeaderBar from "./components/HeaderBar.jsx";
import ProductTable from "./components/ProductTable.jsx";
import InventorySidebar from "./components/InventorySidebar.jsx";
import AddProductModal from "./components/AddProductModal.jsx";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // pagination & filters
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [searchName, setSearchName] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchProducts = async (opts = {}) => {
    try {
      setLoading(true);
      const p = opts.page || page;
      const params = { page: p, limit };
      if (searchName) params.name = searchName;
      if (categoryFilter) params.category = categoryFilter;
      const res = await api.get("/products", { params });
      const body = res.data;
      setProducts(body.data || []);
      setTotalPages(body.totalPages || 1);
      setPage(body.page || p);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts({ page: 1 });
    // eslint-disable-next-line
  }, [searchName, categoryFilter]);

  useEffect(() => {
    fetchProducts({ page });
    // eslint-disable-next-line
  }, [page]);

  const openHistory = async (product) => {
    setSelectedProduct(product);
    try {
      const res = await api.get(`/products/${product.id}/history`);
      setHistory(res.data || []);
    } catch (err) {
      console.error(err);
      setHistory([]);
    }
  };

  const closeHistory = () => {
    setSelectedProduct(null);
    setHistory([]);
  };

  const handleUpdateProduct = async (id, fields) => {
    try {
      await api.put(`/products/${id}`, fields);
      await fetchProducts({ page });
      if (selectedProduct && selectedProduct.id === id) openHistory({ id });
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      await fetchProducts({ page });
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleCreateProduct = async (payload) => {
    // called by AddProductModal
    try {
      await api.post("/products", payload);
      setShowAddModal(false);
      // after creating, go to first page to show new item
      setPage(1);
      await fetchProducts({ page: 1 });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || "Create failed";
      alert(msg);
    }
  };

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <div className="app-container theme-blue page-container">
      <HeaderBar
        searchName={searchName}
        setSearchName={(v) => { setSearchName(v); setPage(1); }}
        categories={categories}
        categoryFilter={categoryFilter}
        setCategoryFilter={(v) => { setCategoryFilter(v); setPage(1); }}
        onImport={async (file) => {
          const fd = new FormData();
          fd.append("file", file);
          try {
            const res = await api.post("/products/import", fd);
            alert(`Imported: added ${res.data.added}, skipped ${res.data.skipped}`);
            setPage(1);
            await fetchProducts({ page: 1 });
          } catch (err) {
            console.error(err);
            alert("Import failed");
          }
        }}
        onExport={() => {
          window.open(`${api.defaults.baseURL}/products/export`, "_blank");
        }}
        onAdd={() => setShowAddModal(true)}
      />

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <ProductTable
          products={products}
          onRowClick={openHistory}
          onUpdate={handleUpdateProduct}
          onDelete={handleDelete}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      )}

      <InventorySidebar product={selectedProduct} history={history} onClose={closeHistory} />

      <AddProductModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreate={handleCreateProduct}
        // sample preview image from uploaded file (will be transformed to public URL in deployment)
        sampleImageUrl={"/mnt/data/21ff32f7-f75e-4446-a124-a8372a753670.png"}
      />
    </div>
  );
}

export default App;
