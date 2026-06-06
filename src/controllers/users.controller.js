const { pool } = require('../config/db');
const { hashPassword } = require('../utils/password');

async function createUser(req, res, next) {
  const client = await pool.connect();

  try {
    const { email, password, role = 'client', profile = {}, client: clientData = {} } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    await client.query('BEGIN');

    const profileResult = await client.query(
      `INSERT INTO perfiles (nombres, apellidos, avatar)
       VALUES ($1, $2, $3)
       RETURNING id, nombres, apellidos, avatar`,
      [
        profile.name || profile.nombres || 'Cliente',
        profile.lastName || profile.apellidos || 'Urban Moda',
        profile.avatar || null
      ]
    );

    const passwordHash = await hashPassword(password);

    const userResult = await client.query(
      `INSERT INTO usuarios (email, password, rol, profile_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, rol, profile_id`,
      [email, passwordHash, role, profileResult.rows[0].id]
    );

    let cliente = null;

    if (role === 'client') {
      const clienteResult = await client.query(
        `INSERT INTO clientes (telefono, direccion, id_usuario)
         VALUES ($1, $2, $3)
         RETURNING id_cliente, telefono, direccion, id_usuario`,
        [
          clientData.phone || clientData.telefono || null,
          clientData.address || clientData.direccion || null,
          userResult.rows[0].id
        ]
      );

      cliente = clienteResult.rows[0];
    }

    await client.query('COMMIT');

    res.status(201).json({
      user: userResult.rows[0],
      profile: profileResult.rows[0],
      client: cliente
    });
  } catch (error) {
    await client.query('ROLLBACK');

    if (error.code === '23505') {
      error.status = 409;
      error.message = 'El correo ya está registrado';
    }

    next(error);
  } finally {
    client.release();
  }
}

async function listUsers(_req, res, next) {
  try {
    const result = await pool.query(
      `SELECT 
        u.id, 
        u.email, 
        u.rol AS role, 
        p.nombres, 
        p.apellidos, 
        p.avatar,
        c.id_cliente,
        c.telefono,
        c.direccion
       FROM usuarios u
       LEFT JOIN perfiles p ON p.id = u.profile_id
       LEFT JOIN clientes c ON c.id_usuario = u.id
       ORDER BY u.id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { email, role, nombres, apellidos, avatar, telefono, direccion } = req.body;

    const userExists = await client.query(
      `SELECT id, profile_id FROM usuarios WHERE id = $1`,
      [id]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await client.query('BEGIN');

    const currentUser = userExists.rows[0];

    const userResult = await client.query(
      `UPDATE usuarios
       SET 
        email = COALESCE($1, email),
        rol = COALESCE($2, rol)
       WHERE id = $3
       RETURNING id, email, rol AS role, profile_id`,
      [email || null, role || null, id]
    );

    const profileResult = await client.query(
      `UPDATE perfiles
       SET
        nombres = COALESCE($1, nombres),
        apellidos = COALESCE($2, apellidos),
        avatar = COALESCE($3, avatar)
       WHERE id = $4
       RETURNING id, nombres, apellidos, avatar`,
      [
        nombres || null,
        apellidos || null,
        avatar || null,
        currentUser.profile_id
      ]
    );

    let clientResult = null;

    const clienteExiste = await client.query(
      `SELECT id_cliente FROM clientes WHERE id_usuario = $1`,
      [id]
    );

    if (clienteExiste.rows.length > 0) {
      const updatedClient = await client.query(
        `UPDATE clientes
         SET
          telefono = COALESCE($1, telefono),
          direccion = COALESCE($2, direccion)
         WHERE id_usuario = $3
         RETURNING id_cliente, telefono, direccion, id_usuario`,
        [telefono || null, direccion || null, id]
      );

      clientResult = updatedClient.rows[0];
    }

    await client.query('COMMIT');

    res.json({
      message: 'Usuario actualizado correctamente',
      user: userResult.rows[0],
      profile: profileResult.rows[0],
      client: clientResult
    });
  } catch (error) {
    await client.query('ROLLBACK');

    if (error.code === '23505') {
      error.status = 409;
      error.message = 'El correo ya está registrado por otro usuario';
    }

    next(error);
  } finally {
    client.release();
  }
}

async function deleteUser(req, res, next) {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    const userExists = await client.query(
      `SELECT id, profile_id FROM usuarios WHERE id = $1`,
      [id]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await client.query('BEGIN');

    await client.query(
      `DELETE FROM clientes WHERE id_usuario = $1`,
      [id]
    );

    await client.query(
      `DELETE FROM usuarios WHERE id = $1`,
      [id]
    );

    await client.query(
      `DELETE FROM perfiles WHERE id = $1`,
      [userExists.rows[0].profile_id]
    );

    await client.query('COMMIT');

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    await client.query('ROLLBACK');

    if (error.code === '23503') {
      return res.status(409).json({
        message: 'No se puede eliminar el usuario porque tiene información relacionada en el sistema'
      });
    }

    next(error);
  } finally {
    client.release();
  }
}

module.exports = {
  createUser,
  listUsers,
  updateUser,
  deleteUser
};