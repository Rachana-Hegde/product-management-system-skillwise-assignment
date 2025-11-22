const express = require('express');
const db = require('../db');
const { body, validationResult } = require('express-validator');
const upload = require('../middleware/upload');
const fs = require('fs');
const csvParser = require('csv-parser');
const router = express.Router();

function toCSV(data) {
  if (!data || data.length === 0) {
    return 'name,unit,category,brand,stock,status,image\n';
  }
  const headers = ['name', 'unit', 'category', 'brand', 'stock', 'status', 'image'];
  const lines = [headers.join(',')];
  data.forEach((row) => {
    const line = headers
      .map((h) => {
        const value = row[h] !== null && row[h] !== undefined ? String(row[h]) : '';
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(',');
    lines.push(line);
  });
  return lines.join('\n');
}

router.get('/', (req, res) => {
  let { page, limit, sort, order, category, name } = req.query;

  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;
  sort = sort && ['name','stock','category','brand','id','unit','status'].includes(sort) ? sort : 'id';
  order = (order && order.toUpperCase() === 'DESC') ? 'DESC' : 'ASC';

  const offset = (page - 1) * limit;

  // Build filters
  const filters = [];
  const params = [];

  if (category) {
    filters.push('category = ?');
    params.push(category);
  }

  if (name) {
    filters.push('LOWER(name) LIKE ?');
    params.push(`%${name.toLowerCase()}%`);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

  // First: total count
  const countSql = `SELECT COUNT(*) as count FROM products ${whereClause}`;
  db.get(countSql, params, (err, countRow) => {
    if (err) {
      console.error('Error counting products', err);
      return res.status(500).json({ error: 'Failed to count products' });
    }
    const total = countRow?.count || 0;
    const totalPages = Math.ceil(total / limit);

    // Then: fetch page
    const dataSql = `SELECT * FROM products ${whereClause} ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`;
    const dataParams = params.concat([limit, offset]);

    db.all(dataSql, dataParams, (err2, rows) => {
      if (err2) {
        console.error('Error fetching paginated products', err2);
        return res.status(500).json({ error: 'Failed to fetch products' });
      }

      res.json({
        data: rows,
        total,
        page,
        limit,
        totalPages
      });
    });
  });
});

router.get('/search', (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.json([]);
  }
  const sql = 'SELECT * FROM products WHERE LOWER(name) LIKE ?';
  const param = `%${name.toLowerCase()}%`;
  db.all(sql, [param], (err, rows) => {
    if (err) {
      console.error('Error searching products', err);
      return res.status(500).json({ error: 'Failed to search products' });
    }
    res.json(rows);
  });
});

router.get('/:id/history', (req, res) => {
  const { id } = req.params;
  const sql =
    'SELECT * FROM inventory_logs WHERE productId = ? ORDER BY datetime(timestamp) DESC';
  db.all(sql, [id], (err, rows) => {
    if (err) {
      console.error('Error fetching history', err);
      return res.status(500).json({ error: 'Failed to fetch history' });
    }
    res.json(rows);
  });
});

router.put(
  '/:id',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a number >= 0'),
    body('unit').optional().trim(),
    body('category').optional().trim(),
    body('brand').optional().trim(),
    body('status').trim().notEmpty().withMessage('Status is required')
  ],
  (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, unit, category, brand, stock, status, image } = req.body;
    const stockInt = parseInt(stock, 10);

    db.get(
      'SELECT id FROM products WHERE LOWER(name) = LOWER(?) AND id != ?',
      [name, id],
      (err, existing) => {
        if (err) {
          console.error('Error checking name uniqueness', err);
          return res
            .status(500)
            .json({ error: 'Failed to validate product name' });
        }
        if (existing) {
          return res
            .status(400)
            .json({ error: 'Product name must be unique' });
        }

        db.get('SELECT * FROM products WHERE id = ?', [id], (err2, product) => {
          if (err2) {
            console.error('Error fetching product', err2);
            return res
              .status(500)
              .json({ error: 'Failed to fetch product before update' });
          }
          if (!product) {
            return res.status(404).json({ error: 'Product not found' });
          }

          const updateSql = `UPDATE products
            SET name = ?, unit = ?, category = ?, brand = ?, stock = ?, status = ?, image = ?
            WHERE id = ?`;

          db.run(
            updateSql,
            [
              name,
              unit || '',
              category || '',
              brand || '',
              stockInt,
              status,
              image || product.image || '',
              id
            ],
            function (err3) {
              if (err3) {
                console.error('Error updating product', err3);
                return res
                  .status(500)
                  .json({ error: 'Failed to update product' });
              }

              if (product.stock !== stockInt) {
                const logSql =
                  'INSERT INTO inventory_logs (productId, oldStock, newStock, changedBy, timestamp) VALUES (?, ?, ?, ?, ?)';
                const timestamp = new Date().toISOString();
                db.run(
                  logSql,
                  [id, product.stock, stockInt, 'admin', timestamp],
                  (err4) => {
                    if (err4) {
                      console.error(
                        'Error inserting inventory log',
                        err4
                      );
                    }
                  }
                );
              }

              db.get('SELECT * FROM products WHERE id = ?', [id], (err5, row) => {
                if (err5) {
                  console.error('Error fetching updated product', err5);
                  return res
                    .status(500)
                    .json({ error: 'Failed to fetch updated product' });
                }
                res.json(row);
              });
            }
          );
        });
      }
    );
  }
);

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Error deleting product', err);
      return res.status(500).json({ error: 'Failed to delete product' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true });
  });
});

// CREATE NEW PRODUCT
router.post('/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be >= 0'),
    body('unit').optional().trim(),
    body('category').optional().trim(),
    body('brand').optional().trim(),
    body('status').trim().notEmpty().withMessage('Status is required'),
    body('image').optional().trim()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, unit, category, brand, stock, status, image } = req.body;

    // Ensure name is unique
    db.get(
      'SELECT id FROM products WHERE LOWER(name) = LOWER(?)',
      [name],
      (err, existing) => {
        if (err) return res.status(500).json({ error: 'DB error' });

        if (existing)
          return res.status(400).json({ error: 'Product already exists' });

        const sql = `
        INSERT INTO products (name, unit, category, brand, stock, status, image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(
          sql,
          [name, unit || '', category || '', brand || '', stock, status, image || ''],
          function (err2) {
            if (err2) {
              console.log(err2);
              return res.status(500).json({ error: 'Insert failed' });
            }

            const newId = this.lastID;
            const timestamp = new Date().toISOString();

            // Insert log
            db.run(
              'INSERT INTO inventory_logs (productId, oldStock, newStock, changedBy, timestamp) VALUES (?, ?, ?, ?, ?)',
              [newId, 0, stock, 'admin', timestamp],
              () => {}
            );

            // Return newly created product
            db.get('SELECT * FROM products WHERE id = ?', [newId], (e, row) => {
              if (e) return res.status(500).json({ error: 'Fetch failed' });
              res.status(201).json(row);
            });
          }
        );
      }
    );
  }
);

router.post('/import', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'CSV file is required' });
  }

  const filePath = req.file.path;

  let added = 0;
  let skipped = 0;
  const duplicates = [];

  const productsToInsert = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      const product = {
        name: row.name?.trim(),
        unit: row.unit?.trim() || '',
        category: row.category?.trim() || '',
        brand: row.brand?.trim() || '',
        stock: parseInt(row.stock || '0', 10),
        status: row.status?.trim() || 'In Stock',
        image: row.image?.trim() || ''
      };
      if (product.name) {
        productsToInsert.push(product);
      }
    })
    .on('end', () => {
      const processNext = (index) => {
        if (index >= productsToInsert.length) {
          fs.unlink(filePath, () => {});
          return res.json({ added, skipped, duplicates });
        }

        const p = productsToInsert[index];

        db.get(
          'SELECT id FROM products WHERE LOWER(name) = LOWER(?)',
          [p.name],
          (err, existing) => {
            if (err) {
              console.error('Error checking duplicate', err);
              skipped++;
              return processNext(index + 1);
            }
            if (existing) {
              skipped++;
              duplicates.push({ name: p.name, existingId: existing.id });
              return processNext(index + 1);
            }

            db.run(
              'INSERT INTO products (name, unit, category, brand, stock, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
              [
                p.name,
                p.unit,
                p.category,
                p.brand,
                isNaN(p.stock) ? 0 : p.stock,
                p.status,
                p.image
              ],
              function (err2) {
                if (err2) {
                  console.error('Error inserting product', err2);
                  skipped++;
                } else {
                  added++;
                }
                processNext(index + 1);
              }
            );
          }
        );
      };

      processNext(0);
    })
    .on('error', (err) => {
      console.error('Error parsing CSV', err);
      fs.unlink(filePath, () => {});
      res.status(500).json({ error: 'Failed to parse CSV' });
    });
});


router.get('/export', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      console.error('Error exporting products', err);
      return res.status(500).json({ error: 'Failed to export products' });
    }

    const data = rows.map((r) => ({
      name: r.name,
      unit: r.unit,
      category: r.category,
      brand: r.brand,
      stock: r.stock,
      status: r.status,
      image: r.image
    }));

    const csvData = toCSV(data);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="products.csv"'
    );
    res.status(200).send(csvData);
  });
});

module.exports = router;
