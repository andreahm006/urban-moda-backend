const bcrypt = require('bcryptjs');

function normalizeHash(hash) {
  if (!hash) return hash;
  // bcryptjs usa $2a/$2b. Algunos dumps traen $2y desde PHP.
  return hash.startsWith('$2y$') ? '$2a$' + hash.slice(4) : hash;
}

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, normalizeHash(hash));
}

module.exports = { hashPassword, comparePassword };
