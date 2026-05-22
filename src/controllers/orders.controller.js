const { pool } = require('../config/db');

async function createOrder(req, res, next) {
  const client = await pool.connect();

  try {
    const clientId = req.body.clientId || req.user?.clientId || 1;
    const items = Array.isArray(req.body.items) ? req.body.items : [];

    await client.query('BEGIN');

    const orderResult = await client.query(
      `INSERT INTO pedidos (fecha, estado, id_cliente)
       VALUES (NOW() AT TIME ZONE 'America/Bogota', $1, $2)
       RETURNING id_pedido AS id, fecha, estado, id_cliente AS "clientId"`,
      [req.body.status || 'pendiente', clientId]
    );

    const orderId = orderResult.rows[0].id;
    const details = [];

    for (const item of items) {
      const detail = await client.query(
        `INSERT INTO detalles_pedido
         (id_pedido, id_producto, cantidad, id_variante_producto, precio_unitario)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING
          id_detalle AS id,
          id_pedido AS "orderId",
          id_producto AS "productId",
          cantidad AS quantity,
          precio_unitario AS "unitPrice"`,
        [
          orderId,
          item.productId || item.id || item.id_producto,
          item.quantity || 1,
          item.productVariantId || null,
          item.price || item.precio || 0
        ]
      );

      details.push(detail.rows[0]);
    }

    await client.query('COMMIT');

    res.status(201).json({
      order: orderResult.rows[0],
      details
    });

  } catch (error) {
    await client.query('ROLLBACK');
    next(error);

  } finally {
    client.release();
  }
}

async function listOrders(_req, res, next) {
  try {
    const result = await pool.query(
      `SELECT
        id_pedido AS id,
        fecha,
        estado,
        id_cliente AS "clientId"
       FROM pedidos
       ORDER BY id_pedido DESC`
    );

    res.json(result.rows);

  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
  listOrders
};