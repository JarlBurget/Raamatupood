const express = require('express');
const router = express.Router();
const db = require('../utils/db'); // Lisa andmebaasiühendus

router.get('/', (req, res, next) => {
    // Tõmba andmed products tabelist
    db.execute('SELECT * FROM products')
        .then(([rows]) => {
            // Renderda EJS mall toodete kuvamiseks
            res.render('shop', { 
                products: rows, 
                pageTitle: 'Web Shop', 
                path: '/' 
            });
        })
        .catch(err => console.log(err));
});

module.exports = router;
