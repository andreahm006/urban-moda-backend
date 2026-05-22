const jwt = require('jsonwebtoken');

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'urban_moda_secret_2026');
    next();
  } catch (_error) {
    return res.status(401).json({ message: 'Token inválido o vencido' });
  }
}

function adminRequired(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Permiso de administrador requerido' });
  }
  next();
}

module.exports = { authRequired, adminRequired };
