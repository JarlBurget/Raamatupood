const db = require('../utils/db');

// Näita kaardi vaadet
exports.getCart = async (req, res, next) => {
    try {
        // Võta kõik kaardi tooted kasutaja cartId järgi
        let [cartId]  = await db.execute('SELECT id FROM carts')
        cartId = cartId[0].id  
        const [cartItems] = await db.execute(
            'SELECT ci.id, ci.quantity, p.title, p.imageUrl, p.price FROM cartItems ci JOIN products p ON ci.productId = p.id WHERE ci.cartId = ?',
            [cartId]
        );

        const sql = `SELECT ci.id, ci.quantity, p.title, p.imageUrl, p.price FROM cartItems ci JOIN products p ON ci.productId = p.id WHERE ci.cartId = ${cartId}`
        
        console.log(sql)

        console.log(cartItems)

        // Arvuta kogusumma
        let totalPrice = 0;
        cartItems.forEach(item => {
            totalPrice += item.price * item.quantity;
        });

        // Renderda kaardi vaade
        res.render('shop/cart', {
            pageTitle: 'Your Cart',
            products: cartItems,
            totalPrice: totalPrice,
            path: '/cart'
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// Lisa toode kaardile
exports.addToCart = async (req, res, next) => {
    const productId = req.body.productId;
    
    console.log(productId)

    try {
        let [cartId]  = await db.execute('SELECT id FROM carts')
        cartId = cartId[0].id 
        // Kontrolli, kas toode on juba kaardil
        const [existingItem] = await db.execute(
            'SELECT id, quantity FROM cartItems WHERE cartId = ? AND productId = ?',
            [cartId, productId]
        );

        if (existingItem.length > 0) {
            // Kui toode on juba kaardil, uuenda kogust
            const newQuantity = existingItem[0].quantity + 1;
            await db.execute(
                'UPDATE cartItems SET quantity = ? WHERE id = ?',
                [newQuantity, existingItem[0].id]
            );
        } else {
            // Kui toodet pole veel kaardil, lisa see
            await db.execute(
                'INSERT INTO cartItems (cartId, productId, quantity) VALUES (?, ?, ?)',
                [cartId, productId, quantity]
            );
        }

        // Suuna kasutaja kaardi vaatesse
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// Eemalda toode kaardilt
exports.removeFromCart = async (req, res, next) => {
    const itemId = req.params.id; // Kasutame dünaamilist ID-d

    try {
        console.log(`Attempting to delete item with id: ${itemId}`);

        // Kustuta rida cartItems tabelist
        const [result] = await db.execute('DELETE FROM cartItems WHERE id = ?', [itemId]);

        if (result.affectedRows === 0) {
            console.error(`No item found with id: ${itemId}`);
        } else {
            console.log(`Item with id: ${itemId} successfully deleted`);
        }

        // Suuna tagasi kaardi vaatesse
        res.redirect('/cart');
    } catch (err) {
        console.error('Error while deleting item from cart:', err);
        next(err);
    }
};

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

        let totalPrice = 0;
        cartItems.forEach(item => {
            totalPrice += item.price * item.quantity;
        });

        res.render('shop/cart', {
            pageTitle: 'Your Cart',
            products: cartItems,
            totalPrice: totalPrice,
            path: '/cart',
        });
    } catch (err) {
        console.error('Error fetching cart:', err);
        next(err);
    }
};

exports.addToCart = async (req, res, next) => {
    const productId = req.body.productId;

    console.log(productId);

    try {
        // Hangi cartId
        let [cartId] = await db.execute('SELECT id FROM carts');
        cartId = cartId[0].id;

        // Kontrolli, kas toode on juba kaardil
        const [existingItem] = await db.execute(
            'SELECT id, quantity FROM cartItems WHERE cartId = ? AND productId = ?',
            [cartId, productId]
        );

        if (existingItem.length > 0) {
            // Kui toode on juba kaardil, uuenda kogust
            const newQuantity = existingItem[0].quantity + 1;
            await db.execute(
                'UPDATE cartItems SET quantity = ? WHERE id = ?',
                [newQuantity, existingItem[0].id]
            );
        } else {
            // Kui toodet pole veel kaardil, lisa see
            const quantity = 1; // Lisa vaikimisi kogus
            await db.execute(
                'INSERT INTO cartItems (cartId, productId, quantity) VALUES (?, ?, ?)',
                [cartId, productId, quantity]
            );
        }

        // Suuna kasutaja kaardi vaatesse
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        next(err);
    }
};