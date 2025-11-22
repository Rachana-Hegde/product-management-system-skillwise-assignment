# 📦 Product Inventory Management System

*A Full-Stack Skillwise Assignment (React + Node.js + SQLite)*

This is a full-stack **Product Inventory Management System** built as part of the **Skillwise Assignment**.
The project includes complete **frontend (React)** and **backend (Node.js + Express + SQLite)** implementations along with deployment and live URLs.

---

## 🚀 Tech Stack

### **Frontend**

* React.js
* Axios
* Bootstrap / Tailwind (optional)
* React Router
* Toast Notifications

### **Backend**

* Node.js
* Express.js
* SQLite (better-sqlite3 or sqlite3)
* Multer (CSV upload)
* CSV Parser (fast-csv / csv-parser)

### **Deployment**

* Backend → Render / Railway / Fly.io
* Frontend → Netlify / Vercel
* Database → SQLite (local file storage)

---

# 🎯 Assignment Objective

Build a complete **Product Inventory Management System** with:

* Product listing
* Search + category filtering
* Inline editing
* Inventory history tracking
* CSV import & export
* Fully deployed frontend and backend

---

# ✨ Features Overview

## 🔍 1. Product Search & Filtering (React)

* Search bar → `/api/products/search?name=<query>`
* Category dropdown → real-time filter
* Add Product button (modal optional)
* Import & Export buttons (aligned to the right)

---

## 📋 2. Products Table

Columns:

`Image | Name | Unit | Category | Brand | Stock | Status | Actions`

* **In Stock** → Green label
* **Out of Stock** → Red label
* Edit & Delete actions
* Row click → open Inventory History Panel

---

## 📥 3. CSV Import / Export

### Import

* Upload CSV → POST `/api/products/import`
* Duplicate check by **name** (case-insensitive)
* Shows:

```
{
  added: X,
  skipped: Y,
  duplicates: [{ name, existingId }]
}
```

### Export

* GET `/api/products/export`
* Returns downloadable CSV

---

## ✏️ 4. Inline Editing

* Click **Edit** → row becomes editable
* Fields editable except Image & ID
* Save → `PUT /api/products/:id`
* Cancel → revert row
* Optimistic UI updates

---

## 📑 5. Inventory History Sidebar / Panel

* Displayed when clicking a product row
* Fetch from:
  `GET /api/products/:id/history`
* Columns:

  * Date
  * Old Stock
  * New Stock
  * Changed By
  * Timestamp

---

# 🛠 Backend API Overview (Node.js + SQLite)

### **1. POST /api/products/import**

* Accepts CSV file
* Inserts only new products (name-based duplicate check)

### **2. GET /api/products/export**

* Returns CSV of all products

### **3. GET /api/products**

* Returns full product list

### **4. GET /api/products/search?name=abc**

* Case-insensitive partial search

### **5. PUT /api/products/:id**

Validations:

* Name must be unique
* Stock must be ≥ 0

Also logs inventory changes into `inventory_logs` table.

### **6. GET /api/products/:id/history**

Returns history of stock updates.

---

# ➕ Bonus Features Implemented (Optional)

(Some or all depending on your implementation)

* Pagination
* Sorting (ASC/DESC)
* Basic Authentication
* Responsive UI
* Unit tests (Jest & RTL)
* Advanced error handling

---

# 📂 Project Structure

```
root/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── db/
│   ├── models/
│   └── uploads/
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── utils/
    │   └── App.js
    └── public/
```

---

# ▶️ Setup Instructions

## 🔧 1. Clone Repository

```bash
git clone https://github.com/Rachana-Hegde/product-management-system-skillwise-assignment.git
cd product-management-system-skillwise-assignment
```

---

# 🖥 Backend Setup

```bash
cd backend
npm install
npm start
```

Backend will run on:

`http://localhost:5000`

---

# 🌐 Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will run on:

`http://localhost:3000`

---

# 🌍 Deployment Information

You must provide the following in the final submission:

### ✔ GitHub Repository

`https://github.com/Rachana-Hegde/product-management-system-skillwise-assignment`

### ✔ Live Backend URL

```
[https://your-backend-url.onrender.com](https://product-management-system-skillwise.onrender.com)
```

### ✔ Live Frontend URL

```
[https://your-frontend-url.netlify.app](https://product-management-system-skillwise.vercel.app/)
```

# 📄 CSV Format

```
name, unit, category, brand, stock, status, image
Item 1, PCS, Electronics, LG, 10, In Stock, https://...
Item 2, KG, Grocery, FreshFarm, 0, Out of Stock, https://...
```

---

# 🧪 API Testing

Use:

* Postman
* Thunder Client
* CURL
* Browser (for GET)

---


# 🙌 Acknowledgements

This assignment was developed as part of **Skillwise Full-Stack Developer Evaluation**.


---

## 📬 Contact  

For any inquiries or feedback, feel free to reach out:    
🔗 **GitHub**: [Rachana-Hegde](https://github.com/Rachana-Hegde)  

