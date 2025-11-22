-- CLEAR OLD DATA
DELETE FROM products;
DELETE FROM inventory_logs;

-- INSERT NEW 8 PRODUCTS
INSERT INTO products (name, unit, category, brand, stock, status, image) VALUES
('Premium Whole Wheat Flour – 5kg', 'Bag', 'Grocery', 'Aashirvaad', 250, 'In Stock',
'https://tse2.mm.bing.net/th/id/OIP.DiVOhWoXlo3EgieYIEqLjQHaHa?pid=Api&P=0&h=180'),

('Bluetooth Wireless Earbuds (Noise-Cancelling)', 'Pcs', 'Electronics', 'Boat', 120, 'In Stock',
'https://tse4.mm.bing.net/th/id/OIP.ktQ8kKkyjONgsNOT2k69ngHaJy?pid=Api&P=0&h=180'),

('Stainless Steel Water Bottle – 1L', 'Pcs', 'Kitchen Essentials', 'Milton', 300, 'In Stock',
'https://tse1.mm.bing.net/th/id/OIP.DGVSPUDYEyZ8tEi0WBs6-gHaHa?pid=Api&P=0&h=180'),

('Velvet Touch Bath Towel – Large', 'Pcs', 'Home Essentials', 'Welspun', 180, 'In Stock',
'https://tse3.mm.bing.net/th/id/OIP.41Z4zlckza6UXpDZwsZS1wHaHa?pid=Api&P=0&h=180'),

('Herbal Anti-Dandruff Shampoo – 200ml', 'Bottle', 'Personal Care', 'Dove', 130, 'In Stock',
'https://tse2.mm.bing.net/th/id/OIP.WJ2GcIe94Vn9nI-MpkYFXAHaHa?pid=Api&P=0&h=180'),

('Office Ballpoint Pen – Blue (Pack of 10)', 'Pack', 'Stationery', 'Cello', 500, 'In Stock',
'https://tse3.mm.bing.net/th/id/OIP.FkwPhgE1N6gfevLgTpakSgHaHa?pid=Api&P=0&h=180'),

('Rechargeable LED Table Lamp', 'Pcs', 'Home Decor', 'Philips', 90, 'In Stock',
'https://tse1.mm.bing.net/th/id/OIP.DBpzLFY61iOOqzA74REe9AHaHa?pid=Api&P=0&h=180'),

('Organic Masala Tea – 250g', 'Jar', 'Beverages', 'Tata Tea', 200, 'In Stock',
'https://tse3.mm.bing.net/th/id/OIP.OgXGAz_MvI0wEpcR4JzOrwHaHa?pid=Api&P=0&h=180');

-- INSERT INVENTORY LOGS (initial)
INSERT INTO inventory_logs (productId, oldStock, newStock, changedBy, timestamp) VALUES
(1, 0, 250, 'admin', datetime('now')),
(2, 0, 120, 'admin', datetime('now')),
(3, 0, 300, 'admin', datetime('now')),
(4, 0, 180, 'admin', datetime('now')),
(5, 0, 130, 'admin', datetime('now')),
(6, 0, 500, 'admin', datetime('now')),
(7, 0, 90, 'admin', datetime('now')),
(8, 0, 200, 'admin', datetime('now'));
