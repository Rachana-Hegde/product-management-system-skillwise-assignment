import React, { useEffect, useState } from "react";
import HeaderBar from "./components/HeaderBar.jsx";
import ProductTable from "./components/ProductTable.jsx";
import InventorySidebar from "./components/InventorySidebar.jsx";
import AddProductModal from "./components/AddProductModal.jsx";
import "./App.css";

// STATIC PRODUCTS
const STATIC_PRODUCTS = [
  {
    id: 1,
    name: "Premium Whole Wheat Flour – 5kg",
    unit: "Bag",
    category: "Grocery",
    brand: "Aashirvaad",
    stock: 250,
    status: "In Stock",
    image: "https://tse2.mm.bing.net/th/id/OIP.DiVOhWoXlo3EgieYIEqLjQHaHa?pid=Api&P=0&h=180"
  },
  {
    id: 2,
    name: "Bluetooth Wireless Earbuds (Noise-Cancelling)",
    unit: "Pcs",
    category: "Electronics",
    brand: "Boat",
    stock: 120,
    status: "In Stock",
    image: "https://tse4.mm.bing.net/th/id/OIP.ktQ8kKkyjONgsNOT2k69ngHaJy?pid=Api&P=0&h=180"
  },
  {
    id: 3,
    name: "Stainless Steel Water Bottle – 1L",
    unit: "Pcs",
    category: "Kitchen Essentials",
    brand: "Milton",
    stock: 300,
    status: "In Stock",
    image: "https://tse1.mm.bing.net/th/id/OIP.DGVSPUDYEyZ8tEi0WBs6-gHaHa?pid=Api&P=0&h=180"
  },
  {
    id: 4,
    name: "Velvet Touch Bath Towel – Large",
    unit: "Pcs",
    category: "Home Essentials",
    brand: "Welspun",
    stock: 0,
    status: "Out Of Stock",
    image: "https://tse3.mm.bing.net/th/id/OIP.41Z4zlckza6UXpDZwsZS1wHaHa?pid=Api&P=0&h=180"
  },
  {
    id: 5,
    name: "Herbal Anti-Dandruff Shampoo – 200ml",
    unit: "Bottle",
    category: "Personal Care",
    brand: "Dove",
    stock: 130,
    status: "In Stock",
    image: "https://tse2.mm.bing.net/th/id/OIP.WJ2GcIe94Vn9nI-MpkYFXAHaHa?pid=Api&P=0&h=180"
  },
  {
    id: 6,
    name: "Office Ballpoint Pen – Blue (Pack of 10)",
    unit: "Pack",
    category: "Stationery",
    brand: "Cello",
    stock: 0,
    status: "Out Of Stock",
    image: "https://tse3.mm.bing.net/th/id/OIP.FkwPhgE1N6gfevLgTpakSgHaHa?pid=Api&P=0&h=180"
  },
  {
    id: 7,
    name: "Rechargeable LED Table Lamp",
    unit: "Pcs",
    category: "Home Decor",
    brand: "Philips",
    stock: 90,
    status: "In Stock",
    image: "https://tse1.mm.bing.net/th/id/OIP.DBpzLFY61iOOqzA74REe9AHaHa?pid=Api&P=0&h=180"
  },
  {
    id: 8,
    name: "Organic Masala Tea – 250g",
    unit: "Jar",
    category: "Beverages",
    brand: "Tata Tea",
    stock: 200,
    status: "In Stock",
    image: "https://tse3.mm.bing.net/th/id/OIP.OgXGAz_MvI0wEpcR4JzOrwHaHa?pid=Api&P=0&h=180"
  }
];

function App() {
  const [allProducts] = useState(STATIC_PRODUCTS);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // popup
  const [errorPopup, setErrorPopup] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const limit = 5;

  const [searchName, setSearchName] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Load products from static list
  useEffect(() => {
    let filtered = [...allProducts];

    // search
    if (searchName.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // category
    if (categoryFilter.trim() !== "") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    // pagination
    const start = (page - 1) * limit;
    const end = start + limit;

    setProducts(filtered.slice(start, end));
  }, [page, searchName, categoryFilter, allProducts]);

  const totalPages = Math.ceil(
    (allProducts.filter((p) =>
      searchName ? p.name.toLowerCase().includes(searchName.toLowerCase()) : true
    ).filter((p) =>
      categoryFilter ? p.category === categoryFilter : true
    ).length) / limit
  );

  const openHistory = (product) => {
    setSelectedProduct(product);
  };

  const closeHistory = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="app-container theme-blue page-container">
      <HeaderBar
        searchName={searchName}
        setSearchName={(v) => { setSearchName(v); setPage(1); }}
        categories={[...new Set(allProducts.map((p) => p.category))]}
        categoryFilter={categoryFilter}
        setCategoryFilter={(v) => { setCategoryFilter(v); setPage(1); }}
        onAdd={() => setErrorPopup("❌ Only admin can do this action")}
        onImport={() => setErrorPopup("❌ Only admin can do this action")}
        onExport={() => setErrorPopup("❌ Only admin can do this action")}
      />

      <ProductTable
        products={products}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        onRowClick={openHistory}
        onDelete={() => setErrorPopup("❌ Only admin can do this action")}
        onUpdate={() => setErrorPopup("❌ Only admin can do this action")}
      />

      <InventorySidebar product={selectedProduct} history={[]} onClose={closeHistory} />

      {/* ERROR POPUP */}
      {errorPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>{errorPopup}</p>
            <button onClick={() => setErrorPopup("")}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
