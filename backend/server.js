require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const productsRouter = require("./routes/products");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/products", productsRouter);

// Health Check
app.get("/", (req, res) => {
  res.json({ message: "Inventory Backend Running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
