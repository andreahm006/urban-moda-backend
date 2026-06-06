const router = require('express').Router();

const {
  listCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  clearCart
} = require('../controllers/cart.controller');

router.get('/', listCart);
router.post('/', addCartItem);
router.patch('/:id', updateCartItem);
router.put('/:id', updateCartItem);
router.delete('/:id', deleteCartItem);
router.delete('/', clearCart);

module.exports = router;