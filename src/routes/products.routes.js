const router = require('express').Router();

const {
  listProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  createVariant
} = require('../controllers/products.controller');

router.get('/', listProducts);
router.post('/', createProduct);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);

router.post('/:id/variants', createVariant);

module.exports = router;