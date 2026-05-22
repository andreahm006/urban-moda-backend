const router = require('express').Router();
const { listCategories, createCategory } = require('../controllers/categories.controller');
router.get('/', listCategories);
router.post('/', createCategory);
module.exports = router;
