const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();

// Lisa toote vormi kuvamine
router.get('/add-product', adminController.getAddProduct);

// Lisa toote POST päring
router.post('/add-product', adminController.postAddProduct);

router.get('/products', adminController.getAdminProducts);

router.get('/edit-product/:productId', adminController.getEditProduct);
router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product/:productId', adminController.postDeleteProduct);

module.exports = router;
