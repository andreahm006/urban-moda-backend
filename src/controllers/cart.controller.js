const { pool } = require('../config/db');

async function listCart(req, res, next) {
  try {
    const clientId = req.query.clientId || req.user?.clientId || 1;
    const result = await pool.query(
      `SELECT ic.id_item_carrito AS id, ic.id_cliente AS "clientId", ic.id_producto AS "productId",
              ic.id_variante AS "productVariantId", ic.cantidad AS quantity,
              p.nombre AS name, p.precio AS price
       FROM items_carrito ic
       JOIN productos p ON p.id_producto = ic.id_producto
       WHERE ic.id_cliente = $1
       ORDER BY ic.id_item_carrito DESC`,
      [clientId]
    );
    res.json(result.rows.map(r => ({ ...r, price: Number(r.price) })));
  } catch (error) { next(error); }
}

async function addCartItem(req, res, next) {
  try {
    const clientId = req.body.clientId || req.user?.clientId || 1;
    const productId = req.body.productId || req.body.id_producto;
    const variantId = req.body.productVariantId || req.body.id_variante || null;
    const quantity = Number(req.body.quantity || req.body.cantidad || 1);
    if (!clientId || !productId) return res.status(400).json({ message: 'clientId y productId son obligatorios' });

    const result = await pool.query(
      `INSERT INTO items_carrito (id_cliente, id_producto, id_variante, cantidad)
       VALUES ($1, $2, $3, $4)
       RETURNING id_item_carrito AS id, id_cliente AS "clientId", id_producto AS "productId", id_variante AS "productVariantId", cantidad AS quantity`,
      [clientId, productId, variantId, quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) { next(error); }
}

async function clearCart(req, res, next) {
  try {
    const clientId = req.query.clientId || req.user?.clientId || 1;
    await pool.query('DELETE FROM items_carrito WHERE id_cliente=$1', [clientId]);
    res.json({ message: 'Carrito vacío' });
  } catch (error) { next(error); }
}

module.exports = { listCart, addCartItem, clearCart };
