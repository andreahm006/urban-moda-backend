# Urban Moda Backend

Backend nuevo para el proyecto **Tienda de Moda Virtual / Urban Moda**.

## Tecnologías

- Node.js
- Express
- PostgreSQL
- JWT
- bcryptjs
- Docker
- HTML/CSS/JS frontend incluido en `public/`

## Estructura

```txt
urban-moda-backend/
├── database/tienda_virtual.sql
├── public/
│   ├── index.html
│   ├── productos.html
│   ├── carrito.html
│   ├── login.html
│   ├── registro.html
│   ├── admin.html
│   ├── css/styles.css
│   └── js/*.js
├── src/
│   ├── config/db.js
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   └── utils/
├── Dockerfile
├── docker-compose.yml
├── package.json
└── server.js
```

## Configuración local sin Docker

1. Copia `.env.example` y renómbralo a `.env`.
2. Cambia la contraseña:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5434
DB_NAME=tienda_virtual
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_AQUI
JWT_SECRET=urban_moda_secret_2026
```

3. Instala dependencias:

```bash
npm install
```

4. Ejecuta:

```bash
npm run dev
```

5. Abre el frontend desde el mismo backend:

```txt
http://localhost:3000/index.html
```

## Ejecutar con Docker usando PostgreSQL local

1. Copia `.docker.env.example` como `.env`.
2. Cambia `DB_PASSWORD`.
3. Ejecuta:

```bash
docker compose up --build
```

El backend queda en:

```txt
http://localhost:3000
```

## Rutas principales

- `GET /health`
- `POST /auth/login`
- `POST /users`
- `GET /users`
- `GET /products`
- `POST /products`
- `GET /products/:id`
- `PUT /products/:id`
- `DELETE /products/:id`
- `POST /products/:id` crea variante
- `GET /categories`
- `POST /categories`
- `GET /cart`
- `POST /cart`
- `DELETE /cart`
- `GET /orders`
- `POST /orders`
- `POST /reviews`
- `POST /products-images`
- `POST /coupons`
- `GET /coupons/:code`

## Nota importante sobre login

Tu dump trae un usuario existente, pero si no recuerdas esa contraseña, registra un usuario nuevo desde `registro.html`.

Luego inicia sesión desde `login.html`.
