const { pool } = require('../config/db');

async function createReview(req, res, next) {
  try {
    const result = await pool.query(
      `INSERT INTO resenas (id_producto, id_cliente, puntuacion, comentario)
       VALUES ($1, $2, $3, $4)
       RETURNING id_resena AS id, id_producto AS "productId", id_cliente AS "clientId", puntuacion AS rating, comentario AS comment`,
      [req.body.productId || req.body.id_producto, req.body.clientId || req.body.id_cliente || 1, req.body.rating || req.body.puntuacion, req.body.comment || req.body.comentario || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) { next(error); }
}

module.exports = { createReview };
