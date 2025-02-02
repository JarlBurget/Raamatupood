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
                path: '/products'
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

// Show Cart Page
exports.getCart = async (req, res, next) => {
    try {
        // Retrieve cart items for the user (assumes user session has cartId)
        const [cartItems] = await db.execute(
            'SELECT ci.id, ci.quantity, p.title, p.imageUrl, p.price FROM cart_items ci JOIN products p ON ci.productId = p.id WHERE ci.cartId = ?',
            [req.session.cartId]
        );

        // Calculate the total price
        let totalPrice = 0;
        cartItems.forEach(item => {
            totalPrice += item.price * item.quantity;
        });

        // Render cart view
        res.render('cart', {
            pageTitle: 'Your Cart',
            cartItems: cartItems,
            totalPrice: totalPrice
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// Add Product to Cart
exports.addToCart = async (req, res, next) => {
    const productId = req.body.productId;
    const quantity = req.body.quantity || 1; // Default to 1 if no quantity is provided

    try {
        // Check if product is already in the cart
        const [existingItem] = await db.execute(
            'SELECT id, quantity FROM cart_items WHERE cartId = ? AND productId = ?',
            [req.session.cartId, productId]
        );

        if (existingItem.length > 0) {
            // Update the existing item quantity if it's already in the cart
            const newQuantity = existingItem[0].quantity + quantity;
            await db.execute(
                'UPDATE cart_items SET quantity = ? WHERE id = ?',
                [newQuantity, existingItem[0].id]
            );
        } else {
            // Otherwise, add the new item to the cart
            await db.execute(
                'INSERT INTO cart_items (cartId, productId, quantity) VALUES (?, ?, ?)',
                [req.session.cartId, productId, quantity]
            );
        }

        // Redirect to the cart page
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// Remove Product from Cart
exports.removeFromCart = async (req, res, next) => {
    const itemId = req.params.id;

    try {
        // Delete the item from the cart
        await db.execute('DELETE FROM cart_items WHERE id = ?', [itemId]);

        // Redirect back to the cart page
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        next(err);
    }
};