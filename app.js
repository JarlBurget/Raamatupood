const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your-password',
  database: 'web-shop'
});

// Connect to MySQL
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

// Route for displaying cart
app.get('/cart/:cartId', (req, res) => {
  const cartId = req.params.cartId;
  db.query('SELECT * FROM cartItems WHERE cartId = ?', [cartId], (err, cartItems) => {
    if (err) throw err;
    db.query('SELECT * FROM products', (err, products) => {
      if (err) throw err;
      res.render('cart', { cartItems, products });
    });
  });
});

// Route for adding product to cart
app.post('/add-to-cart', (req, res) => {
  const { cartId, productId } = req.body;
  db.query('SELECT * FROM cartItems WHERE cartId = ? AND productId = ?', [cartId, productId], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      db.query('UPDATE cartItems SET quantity = quantity + 1 WHERE cartId = ? AND productId = ?', [cartId, productId], (err) => {
        if (err) throw err;
        res.redirect(`/cart/${cartId}`);
      });
    } else {
      db.query('INSERT INTO cartItems (cartId, productId, quantity) VALUES (?, ?, ?)', [cartId, productId, 1], (err) => {
        if (err) throw err;
        res.redirect(`/cart/${cartId}`);
      });
    }
  });
});

// Route for deleting product from cart
app.post('/delete-from-cart', (req, res) => {
  const { cartId, productId } = req.body;
  db.query('DELETE FROM cartItems WHERE cartId = ? AND productId = ?', [cartId, productId], (err) => {
    if (err) throw err;
    res.redirect(`/cart/${cartId}`);
  });
});




// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3030');
});
