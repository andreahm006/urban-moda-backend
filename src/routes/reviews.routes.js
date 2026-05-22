const router = require('express').Router();
const { createReview } = require('../controllers/reviews.controller');
router.post('/', createReview);
module.exports = router;
