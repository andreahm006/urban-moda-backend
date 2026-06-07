const { pool } = require('../config/db');

function getDefaultImage(id) {
  const images = [
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=300&h=400&fit=crop'
  ];

  return images[id % images.length];
}

function mapProduct(row) {
  return {
    id: row.id_producto,
    name: row.nombre,
    description: row.descripcion,
    price: Number(row.precio || 0),
    stock: row.stock,
    category: row.nombre_categoria || 'Sin categoría',
    categoryId: row.id_categoria,
    image: row.image || getDefaultImage(row.id_producto)
  };
}

async function listProducts(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT p.*, c.nombre_categoria
      FROM productos p
      LEFT JOIN categorias c
      ON c.id_categoria = p.id_categoria
      ORDER BY p.id_producto DESC
    `);

    res.json(result.rows.map(mapProduct));
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const {
      name,
      description,
      price,
      stock,
      categoryId,
      image
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO productos
      (
        nombre,
        descripcion,
        precio,
        stock,
        id_categoria,
        image
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        name,
        description,
        price,
        stock || 10,
        categoryId,
        image || ''
      ]
    );

    const productWithCategory = await pool.query(
      `
      SELECT p.*, c.nombre_categoria
      FROM productos p
      LEFT JOIN categorias c
      ON c.id_categoria = p.id_categoria
      WHERE p.id_producto = $1
      `,
      [result.rows[0].id_producto]
    );

    res.status(201).json(mapProduct(productWithCategory.rows[0]));
  } catch (error) {
    next(error);
  }
}

async function getProduct(req, res, next) {
  try {
    const result = await pool.query(
      `
      SELECT p.*, c.nombre_categoria
      FROM productos p
      LEFT JOIN categorias c
      ON c.id_categoria = p.id_categoria
      WHERE p.id_producto = $1
      `,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }

    res.json(mapProduct(result.rows[0]));
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const {
      name,
      description,
      price,
      stock,
      categoryId,
      image
    } = req.body;

    const result = await pool.query(
      `
      UPDATE productos
      SET
        nombre = $1,
        descripcion = $2,
        precio = $3,
        stock = $4,
        id_categoria = $5,
        image = $6
      WHERE id_producto = $7
      RETURNING *
      `,
      [
        name,
        description,
        price,
        stock || 10,
        categoryId,
        image || '',
        req.params.id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }

    const productWithCategory = await pool.query(
      `
      SELECT p.*, c.nombre_categoria
      FROM productos p
      LEFT JOIN categorias c
      ON c.id_categoria = p.id_categoria
      WHERE p.id_producto = $1
      `,
      [req.params.id]
    );

    res.json(mapProduct(productWithCategory.rows[0]));
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const result = await pool.query(
      `
      DELETE FROM productos
      WHERE id_producto = $1
      RETURNING *
      `,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }

    res.json({
      message: 'Producto eliminado'
    });
  } catch (error) {
    next(error);
  }
}

async function createVariant(req, res, next) {
  try {
    res.json({
      message: 'Variant creada'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  createVariant
};