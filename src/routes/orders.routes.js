const router = require('express').Router();

const {
  createOrder,
  listOrders
} = require('../controllers/orders.controller');

router.get('/', listOrders);
router.post('/', createOrder);

module.exports = router;