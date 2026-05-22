const { pool } = require('../config/db');

async function createImage(req, res, next) {
  try {
    const productId = req.body.productId || req.body.id_producto;
    const url = req.body.url;
    if (!productId || !url) return res.status(400).json({ message: 'productId y url son obligatorios' });
    const result = await pool.query(
      `INSERT INTO imagenes_producto (id_producto, url, alt, orden)
       VALUES ($1, $2, $3, $4)
       RETURNING id_imagen AS id, id_producto AS "productId", url, alt, orden AS "order"`,
      [productId, url, req.body.alt || null, req.body.order || req.body.orden || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) { next(error); }
}

module.exports = { createImage };
