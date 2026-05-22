const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { comparePassword } = require('../utils/password');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email y contraseña son obligatorios' });

    const result = await pool.query(
      `SELECT u.id, u.email, u.password, u.rol, c.id_cliente
       FROM usuarios u
       LEFT JOIN clientes c ON c.id_usuario = u.id
       WHERE u.email = $1`,
      [email]
    );

    if (result.rowCount === 0) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const user = result.rows[0];
    const ok = await comparePassword(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const payload = {
      id: user.id,
      email: user.email,
      role: user.rol,
      clientId: user.id_cliente || null,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'urban_moda_secret_2026', { expiresIn: '8h' });
    res.json({ token, access_token: token, user: payload });
  } catch (error) {
    next(error);
  }
}

module.exports = { login };
