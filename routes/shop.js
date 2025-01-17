const express = require('express');
const router = express.Router();
const db = require('../utils/db'); // Lisa andmebaasiühendus

// Shop leht
router.get('/', (req, res, next) => {
    db.execute('SELECT * FROM products')
        .then(([rows]) => {
            res.render('shop/shop', { // Lisa "shop/" alamkausta nimi
                products: rows,
                pageTitle: 'Raamatupood',
                path: '/' // Aktiivne link on / (Shop)
            });
        })
        .catch(err => console.log(err));
});

// Cart leht
router.get('/cart', (req, res, next) => {
    db.execute('SELECT * FROM cart') // Kui sul on andmebaasis eraldi "cart" tabel, siis asenda see
        .then(([rows]) => {
            res.render('shop/cart', { // Lisa "shop/" alamkausta nimi
                products: rows,
                pageTitle: 'Cart',
                path: '/cart' // Aktiivne link on /cart
            });
        })
        .catch(err => console.log(err));
});

module.exports = router;
