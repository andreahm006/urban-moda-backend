const router = require('express').Router();
const { createUser, listUsers } = require('../controllers/users.controller');
router.get('/', listUsers);
router.post('/', createUser);
module.exports = router;
