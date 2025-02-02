const db = require('../utils/db');

// GET: Kuvab toote lisamise vormi
exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
    });
};

// POST: Lisab uue toote andmebaasi
exports.postAddProduct = async (req, res, next) => {
    const { title, imageUrl, description, price } = req.body;

    try {
        await db.execute(
            'INSERT INTO products (title, imageUrl, description, price) VALUES (?, ?, ?, ?)',
            [title, imageUrl, description, price]
        );
        res.redirect('/admin/products');
    } catch (err) {
        console.error('Error adding product:', err);
        next(err);
    }
};

// GET: Kuvab admin toodete vaadet
exports.getAdminProducts = async (req, res, next) => {
  try {
      const [products] = await db.execute('SELECT * FROM products');
      res.render('admin/admin-products', {
          pageTitle: 'Admin Products',
          path: '/admin/products',
          products: products,
      });
  } catch (err) {
      console.error('Error fetching admin products:', err);
      next(err);
  }
};

// GET: Kuvab toote redigeerimise vormi
exports.getEditProduct = async (req, res, next) => {
  const productId = req.params.productId;

  try {
      const [product] = await db.execute('SELECT * FROM products WHERE id = ?', [productId]);
      if (product.length > 0) {
          res.render('admin/edit-products', {
              pageTitle: 'Edit Product',
              path: '/admin/edit-products',
              product: product[0],
          });
      } else {
          res.redirect('/admin/products');
      }
  } catch (err) {
      console.error('Error fetching product:', err);
      next(err);
  }
};

// POST: Salvestab toote muudatused
exports.postEditProduct = async (req, res, next) => {
  const { id, title, imageUrl, description, price } = req.body;

  try {
      await db.execute(
          'UPDATE products SET title = ?, imageUrl = ?, description = ?, price = ? WHERE id = ?',
          [title, imageUrl, description, price, id]
      );
      res.redirect('/admin/products');
  } catch (err) {
      console.error('Error updating product:', err);
      next(err);
  }
};


// POST: Kustutab toote andmebaasist
exports.postDeleteProduct = async (req, res, next) => {
  const productId = req.params.productId;

  try {
      await db.execute('DELETE FROM products WHERE id = ?', [productId]);
      res.redirect('/admin/products');
  } catch (err) {
      console.error('Error deleting product:', err);
      next(err);
  }
};
