const router = require('express').Router();
const { createImage } = require('../controllers/images.controller');
router.post('/', createImage);
module.exports = router;
