const db = require('../utils/db');

exports.getProducts = (req, res, next) => {
    db.execute('SELECT * FROM products')
        .then(([rows]) => {
            res.render('shop/shop', {
                products: rows,
                pageTitle: 'Raamatupood',
                path: '/product-list'
            });
        })
        .catch(err => console.log(err));
};
exports.getProductsList = (req, res, next) => {
    db.execute('SELECT * FROM products')
        .then(([rows]) => {
            res.render('shop/product-list', {
                products: rows,
                pageTitle: 'Raamatupood',
                path: '/product-list'
            });
        })
        .catch(err => console.log(err));
};

exports.getProductDetails = (req, res, next) => {
    const productId = req.params.productId;
    db.execute('SELECT * FROM products WHERE id = ?', [productId])
        .then(([rows]) => {
            if (rows.length > 0) {
                res.render('shop/product-list', {
                    product: rows[0],
                    pageTitle: rows[0].name,
                    path: '/product-details'
                });
            } else {
                res.redirect('/');
            }
        })
        .catch(err => console.log(err));
};


exports.getProductDetails = (req, res, next) => {
    const productId = req.params.productId;
    db.execute('SELECT * FROM products WHERE id = ?', [productId])
        .then(([rows]) => {
            if (rows.length > 0) {
                res.render('shop/product-details', {
                    product: rows[0],
                    pageTitle: rows[0].name,
                    path: '/product-details'
                });
            } else {
                res.redirect('/');
            }
        })
        .catch(err => console.log(err));
};