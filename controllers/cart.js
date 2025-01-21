const db = require('../utils/db');

// Näita kaardi vaadet
exports.getCart = async (req, res, next) => {
    try {
        const [cartId] = await db.execute('SELECT id FROM carts');
        const [cartItems] = await db.execute(
            `SELECT ci.id AS cartItemId, ci.quantity, p.id AS productId, p.title, p.imageUrl, p.price
             FROM cartItems ci
             JOIN products p ON ci.productId = p.id
             WHERE ci.cartId = ?`,
            [cartId[0].id]
        );

        const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        res.render('shop/cart', {
            pageTitle: 'Your Cart',
            products: cartItems,
            totalPrice,
            path: '/cart',
        });
    } catch (err) {
        console.error('Error fetching cart:', err);
        next(err);
    }
};

// Lisa toode kaardile
exports.addToCart = async (req, res, next) => {
    const productId = req.body.productId;

    try {
        const [cartId] = await db.execute('SELECT id FROM carts');
        const [existingItem] = await db.execute(
            'SELECT id, quantity FROM cartItems WHERE cartId = ? AND productId = ?',
            [cartId[0].id, productId]
        );

        if (existingItem.length > 0) {
            const newQuantity = existingItem[0].quantity + 1;
            await db.execute(
                'UPDATE cartItems SET quantity = ? WHERE id = ?',
                [newQuantity, existingItem[0].id]
            );
        } else {
            const quantity = 1;
            await db.execute(
                'INSERT INTO cartItems (cartId, productId, quantity) VALUES (?, ?, ?)',
                [cartId[0].id, productId, quantity]
            );
        }

        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// Eemalda toode kaardilt
exports.removeFromCart = async (req, res, next) => {
    const itemId = req.params.id;

    try {
        const [result] = await db.execute('DELETE FROM cartItems WHERE id = ?', [itemId]);

        if (result.affectedRows === 0) {
            console.error(`No item found with id: ${itemId}`);
        }

        res.redirect('/cart');
    } catch (err) {
        console.error('Error while deleting item from cart:', err);
        next(err);
    }
};
