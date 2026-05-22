const { pool } = require('../config/db');

async function listCategories(_req, res, next) {
  try {
    const result = await pool.query('SELECT id_categoria AS id, nombre_categoria AS name FROM categorias ORDER BY id_categoria');
    res.json(result.rows);
  } catch (error) { next(error); }
}

async function createCategory(req, res, next) {
  try {
    const name = req.body.name || req.body.nombre_categoria;
    if (!name) return res.status(400).json({ message: 'Nombre requerido' });
    const result = await pool.query(
      'INSERT INTO categorias (nombre_categoria) VALUES ($1) RETURNING id_categoria AS id, nombre_categoria AS name',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) { next(error); }
}

module.exports = { listCategories, createCategory };
