const router = require('express').Router();
const { listCart, addCartItem, clearCart } = require('../controllers/cart.controller');
router.get('/', listCart);
router.post('/', addCartItem);
router.delete('/', clearCart);
module.exports = router;
