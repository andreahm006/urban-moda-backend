const router = require('express').Router();

const {
  createUser,
  listUsers,
  updateUser,
  deleteUser
} = require('../controllers/users.controller');

router.get('/', listUsers);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;