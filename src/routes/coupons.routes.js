const router = require('express').Router();
const { createCoupon, getCoupon } = require('../controllers/coupons.controller');
router.post('/', createCoupon);
router.get('/:code', getCoupon);
module.exports = router;
