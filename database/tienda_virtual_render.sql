--
-- PostgreSQL database dump
--


-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-05-15 22:20:41

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16405)
-- Name: categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias (
    id_categoria integer NOT NULL,
    nombre_categoria character varying(255) NOT NULL
);



--
-- TOC entry 221 (class 1259 OID 16404)
-- Name: categorias_id_categoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorias_id_categoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 5127 (class 0 OID 0)
-- Dependencies: 221
-- Name: categorias_id_categoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorias_id_categoria_seq OWNED BY public.categorias.id_categoria;


--
-- TOC entry 238 (class 1259 OID 16514)
-- Name: clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clientes (
    id_cliente integer NOT NULL,
    telefono character varying(50),
    direccion character varying(500),
    id_usuario integer NOT NULL
);



--
-- TOC entry 237 (class 1259 OID 16513)
-- Name: clientes_id_cliente_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clientes_id_cliente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 5128 (class 0 OID 0)
-- Dependencies: 237
-- Name: clientes_id_cliente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clientes_id_cliente_seq OWNED BY public.clientes.id_cliente;


--
-- TOC entry 230 (class 1259 OID 16461)
-- Name: detalles_pedido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalles_pedido (
    id_detalle integer NOT NULL,
    id_pedido integer NOT NULL,
    id_producto integer NOT NULL,
    cantidad integer NOT NULL,
    id_variante_producto integer,
    precio_unitario numeric(10,2) NOT NULL
);



--
-- TOC entry 229 (class 1259 OID 16460)
-- Name: detalles_pedido_id_detalle_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detalles_pedido_id_detalle_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 5129 (class 0 OID 0)
-- Dependencies: 229
-- Name: detalles_pedido_id_detalle_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detalles_pedido_id_detalle_seq OWNED BY public.detalles_pedido.id_detalle;


--
-- TOC entry 234 (class 1259 OID 16487)
-- Name: envios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.envios (
    id_envio integer NOT NULL,
    direccion_envio character varying(500) NOT NULL,
    fecha_envio date NOT NULL,
    estado_envio character varying(100) NOT NULL,
    id_pedido integer NOT NULL
);



--
-- TOC entry 233 (class 1259 OID 16486)
-- Name: envios_id_envio_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.envios_id_envio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 5130 (class 0 OID 0)
-- Dependencies: 233
-- Name: envios_id_envio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.envios_id_envio_seq OWNED BY public.envios.id_envio;


--
-- TOC entry 226 (class 1259 OID 16432)
-- Name: imagenes_producto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.imagenes_producto (
    id_imagen integer NOT NULL,
    id_producto integer NOT NULL,
    url character varying(500) NOT NULL,
    alt character varying(255),
    orden integer DEFAULT 0 NOT NULL
);



--
-- TOC entry 225 (class 1259 OID 16431)
-- Name: imagenes_producto_id_imagen_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.imagenes_producto_id_imagen_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 5131 (class 0 OID 0)
-- Dependencies: 225
-- Name: imagenes_producto_id_imagen_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.imagenes_producto_id_imagen_seq OWNED BY public.imagenes_producto.id_imagen;


--
-- TOC entry 244 (class 1259 OID 16598)
-- Name: items_carrito; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items_carrito (
    id_item_carrito integer NOT NULL,
    id_cliente integer NOT NULL,
    id_producto integer NOT NULL,
    id_variante integer,
    cantidad integer DEFAULT 1 NOT NULL,
    fecha_agregado timestamp with time zone DEFAULT now() NOT NULL,
    fecha_actualizado timestamp with time zone DEFAULT now() NOT NULL
);



--
-- TOC entry 243 (class 1259 OID 16597)
-- Name: items_carrito_id_item_carrito_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.items_carrito_id_item_carrito_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 5132 (class 0 OID 0)
-- Dependencies: 243
-- Name: items_carrito_id_item_carrito_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.items_carrito_id_item_carrito_seq OWNED BY public.items_carrito.id_item_carrito;


--
-- TOC entry 232 (class 1259 OID 16473)
-- Name: pagos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagos (
    id_pago integer NOT NULL,
    fecha_pago timestamp with time zone NOT NULL,
    monto numeric(10,2) NOT NULL,
    metodo_pago character varying(100) NOT NULL,
    id_pedido integer NOT NULL
);



--
-- TOC entry 231 (class 1259 OID 16472)
-- Name: pagos_id_pago_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pagos_id_pago_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 5133 (class 0 OID 0)
-- Dependencies: 231
-- Name: pagos_id_pago_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pagos_id_pago_seq OWNED BY public.pagos.id_pago;


--
-- TOC entry 236 (class 1259 OID 16503)
-- Name: pedidos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pedidos (
    id_pedido integer NOT NULL,
    fecha date NOT NULL,
    estado character varying(50) NOT NULL,
    id_cliente integer NOT NULL
);



--
-- TOC entry 235 (class 1259 OID 16502)
-- Name: pedidos_id_pedido_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pedidos_id_pedido_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 5134 (class 0 OID 0)
-- Dependencies: 235
-- Name: pedidos_id_pedido_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pedidos_id_pedido_seq OWNED BY public.pedidos.id_pedido;


--
-- TOC entry 220 (class 1259 OID 16389)
-- Name: perfiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.perfiles (
    id integer NOT NULL,
    nombres character varying(255) NOT NULL,
    apellidos character varying(255) NOT NULL,
    avatar character varying(255),
    fecha_creacion timestamp with time zone DEFAULT now() NOT NULL,
    fecha_modificacion timestamp with time zone DEFAULT now() NOT NULL
);



--
-- TOC entry 219 (class 1259 OID 16388)
-- Name: perfiles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.perfiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 5135 (class 0 OID 0)
-- Dependencies: 219
-- Name: perfiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.perfiles_id_seq OWNED BY public.perfiles.id;


--
-- TOC entry 228 (class 1259 OID 16446)
-- Name: productos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productos (
    id_producto integer NOT NULL,
    nombre character varying(255) NOT NULL,
    descripcion text,
    precio numeric(10,2) NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    id_categoria integer NOT NULL
);



--
-- TOC entry 227 (class 1259 OID 16445)
-- Name: productos_id_producto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productos_id_producto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 5136 (class 0 OID 0)
-- Dependencies: 227
-- Name: productos_id_producto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productos_id_producto_seq OWNED BY public.productos.id_producto;


--
-- TOC entry 242 (class 1259 OID 16564)
-- Name: resenas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resenas (
    id_resena integer NOT NULL,
    id_producto integer NOT NULL,
    id_cliente integer NOT NULL,
    puntuacion smallint NOT NULL,
    comentario text,
    fecha_creacion timestamp with time zone DEFAULT now() NOT NULL
);



--
-- TOC entry 241 (class 1259 OID 16563)
-- Name: resenas_id_resena_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.resenas_id_resena_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 5137 (class 0 OID 0)
-- Dependencies: 241
-- Name: resenas_id_resena_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.resenas_id_resena_seq OWNED BY public.resenas.id_resena;


--
-- TOC entry 240 (class 1259 OID 16527)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    rol character varying(20) DEFAULT 'client'::character varying NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT now() NOT NULL,
    fecha_modificacion timestamp with time zone DEFAULT now() NOT NULL,
    profile_id integer NOT NULL
);



--
-- TOC entry 239 (class 1259 OID 16526)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 5138 (class 0 OID 0)
-- Dependencies: 239
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 224 (class 1259 OID 16414)
-- Name: variantes_producto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.variantes_producto (
    id_variante integer NOT NULL,
    id_producto integer NOT NULL,
    talla character varying(50) NOT NULL,
    color character varying(50) NOT NULL,
    sku character varying(100) NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    precio_adicional numeric(10,2) DEFAULT '0'::numeric NOT NULL
);



--
-- TOC entry 223 (class 1259 OID 16413)
-- Name: variantes_producto_id_variante_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.variantes_producto_id_variante_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 5139 (class 0 OID 0)
-- Dependencies: 223
-- Name: variantes_producto_id_variante_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.variantes_producto_id_variante_seq OWNED BY public.variantes_producto.id_variante;


--
-- TOC entry 4872 (class 2604 OID 16408)
-- Name: categorias id_categoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id_categoria SET DEFAULT nextval('public.categorias_id_categoria_seq'::regclass);


--
-- TOC entry 4884 (class 2604 OID 16517)
-- Name: clientes id_cliente; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes ALTER COLUMN id_cliente SET DEFAULT nextval('public.clientes_id_cliente_seq'::regclass);


--
-- TOC entry 4880 (class 2604 OID 16464)
-- Name: detalles_pedido id_detalle; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_pedido ALTER COLUMN id_detalle SET DEFAULT nextval('public.detalles_pedido_id_detalle_seq'::regclass);


--
-- TOC entry 4882 (class 2604 OID 16490)
-- Name: envios id_envio; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.envios ALTER COLUMN id_envio SET DEFAULT nextval('public.envios_id_envio_seq'::regclass);


--
-- TOC entry 4876 (class 2604 OID 16435)
-- Name: imagenes_producto id_imagen; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imagenes_producto ALTER COLUMN id_imagen SET DEFAULT nextval('public.imagenes_producto_id_imagen_seq'::regclass);


--
-- TOC entry 4891 (class 2604 OID 16601)
-- Name: items_carrito id_item_carrito; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items_carrito ALTER COLUMN id_item_carrito SET DEFAULT nextval('public.items_carrito_id_item_carrito_seq'::regclass);


--
-- TOC entry 4881 (class 2604 OID 16476)
-- Name: pagos id_pago; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos ALTER COLUMN id_pago SET DEFAULT nextval('public.pagos_id_pago_seq'::regclass);


--
-- TOC entry 4883 (class 2604 OID 16506)
-- Name: pedidos id_pedido; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos ALTER COLUMN id_pedido SET DEFAULT nextval('public.pedidos_id_pedido_seq'::regclass);


--
-- TOC entry 4869 (class 2604 OID 16392)
-- Name: perfiles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles ALTER COLUMN id SET DEFAULT nextval('public.perfiles_id_seq'::regclass);


--
-- TOC entry 4878 (class 2604 OID 16449)
-- Name: productos id_producto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos ALTER COLUMN id_producto SET DEFAULT nextval('public.productos_id_producto_seq'::regclass);


--
-- TOC entry 4889 (class 2604 OID 16567)
-- Name: resenas id_resena; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resenas ALTER COLUMN id_resena SET DEFAULT nextval('public.resenas_id_resena_seq'::regclass);


--
-- TOC entry 4885 (class 2604 OID 16530)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4873 (class 2604 OID 16417)
-- Name: variantes_producto id_variante; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variantes_producto ALTER COLUMN id_variante SET DEFAULT nextval('public.variantes_producto_id_variante_seq'::regclass);


--
-- TOC entry 5099 (class 0 OID 16405)
-- Dependencies: 222
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorias (id_categoria, nombre_categoria) FROM stdin;
1	Ropa
\.


--
-- TOC entry 5115 (class 0 OID 16514)
-- Dependencies: 238
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clientes (id_cliente, telefono, direccion, id_usuario) FROM stdin;
1	123456789	Mi casa	3
\.


--
-- TOC entry 5107 (class 0 OID 16461)
-- Dependencies: 230
-- Data for Name: detalles_pedido; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detalles_pedido (id_detalle, id_pedido, id_producto, cantidad, id_variante_producto, precio_unitario) FROM stdin;
\.


--
-- TOC entry 5111 (class 0 OID 16487)
-- Dependencies: 234
-- Data for Name: envios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.envios (id_envio, direccion_envio, fecha_envio, estado_envio, id_pedido) FROM stdin;
\.


--
-- TOC entry 5103 (class 0 OID 16432)
-- Dependencies: 226
-- Data for Name: imagenes_producto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.imagenes_producto (id_imagen, id_producto, url, alt, orden) FROM stdin;
\.


--
-- TOC entry 5121 (class 0 OID 16598)
-- Dependencies: 244
-- Data for Name: items_carrito; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items_carrito (id_item_carrito, id_cliente, id_producto, id_variante, cantidad, fecha_agregado, fecha_actualizado) FROM stdin;
\.


--
-- TOC entry 5109 (class 0 OID 16473)
-- Dependencies: 232
-- Data for Name: pagos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pagos (id_pago, fecha_pago, monto, metodo_pago, id_pedido) FROM stdin;
\.


--
-- TOC entry 5113 (class 0 OID 16503)
-- Dependencies: 236
-- Data for Name: pedidos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pedidos (id_pedido, fecha, estado, id_cliente) FROM stdin;
9	2026-03-30	pendiente	1
10	2026-03-31	pendiente	1
11	2026-03-31	pendiente	1
12	2026-03-31	pendiente	1
14	2026-03-31	pendiente	1
\.


--
-- TOC entry 5097 (class 0 OID 16389)
-- Dependencies: 220
-- Data for Name: perfiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.perfiles (id, nombres, apellidos, avatar, fecha_creacion, fecha_modificacion) FROM stdin;
1	Admin	Principal	\N	2026-03-23 00:40:21.685087-05	2026-03-23 00:40:21.685087-05
\.


--
-- TOC entry 5105 (class 0 OID 16446)
-- Dependencies: 228
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.productos (id_producto, nombre, descripcion, precio, stock, id_categoria) FROM stdin;
2	Camiseta negra	Camiseta básica	50000.00	10	1
\.


--
-- TOC entry 5119 (class 0 OID 16564)
-- Dependencies: 242
-- Data for Name: resenas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resenas (id_resena, id_producto, id_cliente, puntuacion, comentario, fecha_creacion) FROM stdin;
\.


--
-- TOC entry 5117 (class 0 OID 16527)
-- Dependencies: 240
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, email, password, rol, fecha_creacion, fecha_modificacion, profile_id) FROM stdin;
3	andrea@gmail.com	$2y$10$0WtdOI85LIzbNQFJt5M7v.n4eetBssPdwxkKy9GTL.Jsb1VI.nGlq	client	2026-03-30 19:52:04.856015-05	2026-03-30 19:52:04.856015-05	1
\.


--
-- TOC entry 5101 (class 0 OID 16414)
-- Dependencies: 224
-- Data for Name: variantes_producto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.variantes_producto (id_variante, id_producto, talla, color, sku, stock, precio_adicional) FROM stdin;
4	2	M	Negro	CAM-NEG-M-005	5	0.00
10	2	M	Negro	CAM-NEG-M-101	5	0.00
\.


--
-- TOC entry 5140 (class 0 OID 0)
-- Dependencies: 221
-- Name: categorias_id_categoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_id_categoria_seq', 1, true);


--
-- TOC entry 5141 (class 0 OID 0)
-- Dependencies: 237
-- Name: clientes_id_cliente_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clientes_id_cliente_seq', 1, true);


--
-- TOC entry 5142 (class 0 OID 0)
-- Dependencies: 229
-- Name: detalles_pedido_id_detalle_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detalles_pedido_id_detalle_seq', 1, false);


--
-- TOC entry 5143 (class 0 OID 0)
-- Dependencies: 233
-- Name: envios_id_envio_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.envios_id_envio_seq', 1, false);


--
-- TOC entry 5144 (class 0 OID 0)
-- Dependencies: 225
-- Name: imagenes_producto_id_imagen_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.imagenes_producto_id_imagen_seq', 1, false);


--
-- TOC entry 5145 (class 0 OID 0)
-- Dependencies: 243
-- Name: items_carrito_id_item_carrito_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.items_carrito_id_item_carrito_seq', 3, true);


--
-- TOC entry 5146 (class 0 OID 0)
-- Dependencies: 231
-- Name: pagos_id_pago_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pagos_id_pago_seq', 1, false);


--
-- TOC entry 5147 (class 0 OID 0)
-- Dependencies: 235
-- Name: pedidos_id_pedido_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pedidos_id_pedido_seq', 14, true);


--
-- TOC entry 5148 (class 0 OID 0)
-- Dependencies: 219
-- Name: perfiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.perfiles_id_seq', 1, true);


--
-- TOC entry 5149 (class 0 OID 0)
-- Dependencies: 227
-- Name: productos_id_producto_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productos_id_producto_seq', 2, true);


--
-- TOC entry 5150 (class 0 OID 0)
-- Dependencies: 241
-- Name: resenas_id_resena_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.resenas_id_resena_seq', 1, false);


--
-- TOC entry 5151 (class 0 OID 0)
-- Dependencies: 239
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 3, true);


--
-- TOC entry 5152 (class 0 OID 0)
-- Dependencies: 223
-- Name: variantes_producto_id_variante_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.variantes_producto_id_variante_seq', 10, true);


--
-- TOC entry 4898 (class 2606 OID 16412)
-- Name: categorias PK_04bae980e284752e914bce1cbc7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT "PK_04bae980e284752e914bce1cbc7" PRIMARY KEY (id_categoria);


--
-- TOC entry 4914 (class 2606 OID 16499)
-- Name: envios PK_22585763a400257119fe237b9fc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.envios
    ADD CONSTRAINT "PK_22585763a400257119fe237b9fc" PRIMARY KEY (id_envio);


--
-- TOC entry 4908 (class 2606 OID 16471)
-- Name: detalles_pedido PK_33ffb96d29aa94633b4587c7019; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_pedido
    ADD CONSTRAINT "PK_33ffb96d29aa94633b4587c7019" PRIMARY KEY (id_detalle);


--
-- TOC entry 4920 (class 2606 OID 16523)
-- Name: clientes PK_4b7c4b981b60b5c6b1d04c84a54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT "PK_4b7c4b981b60b5c6b1d04c84a54" PRIMARY KEY (id_cliente);


--
-- TOC entry 4896 (class 2606 OID 16403)
-- Name: perfiles PK_50d8a0a9bdea75489c5f230ce27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles
    ADD CONSTRAINT "PK_50d8a0a9bdea75489c5f230ce27" PRIMARY KEY (id);


--
-- TOC entry 4900 (class 2606 OID 16428)
-- Name: variantes_producto PK_5b41e7f4043d66e4054d4f309c7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variantes_producto
    ADD CONSTRAINT "PK_5b41e7f4043d66e4054d4f309c7" PRIMARY KEY (id_variante);


--
-- TOC entry 4906 (class 2606 OID 16459)
-- Name: productos PK_8c832a65b374c16cbd8135d6be5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT "PK_8c832a65b374c16cbd8135d6be5" PRIMARY KEY (id_producto);


--
-- TOC entry 4932 (class 2606 OID 16612)
-- Name: items_carrito PK_8ccccc933859e49ed9a1b9899d0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items_carrito
    ADD CONSTRAINT "PK_8ccccc933859e49ed9a1b9899d0" PRIMARY KEY (id_item_carrito);


--
-- TOC entry 4918 (class 2606 OID 16512)
-- Name: pedidos PK_9a67e2a4917b3656d2d23fe8b5e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT "PK_9a67e2a4917b3656d2d23fe8b5e" PRIMARY KEY (id_pedido);


--
-- TOC entry 4910 (class 2606 OID 16483)
-- Name: pagos PK_9de763d4d92bbba9933371456de; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT "PK_9de763d4d92bbba9933371456de" PRIMARY KEY (id_pago);


--
-- TOC entry 4930 (class 2606 OID 16577)
-- Name: resenas PK_bfd17dd77843f845b21f99ac160; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resenas
    ADD CONSTRAINT "PK_bfd17dd77843f845b21f99ac160" PRIMARY KEY (id_resena);


--
-- TOC entry 4904 (class 2606 OID 16444)
-- Name: imagenes_producto PK_d18627939affe10839ea3764fb0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imagenes_producto
    ADD CONSTRAINT "PK_d18627939affe10839ea3764fb0" PRIMARY KEY (id_imagen);


--
-- TOC entry 4924 (class 2606 OID 16544)
-- Name: usuarios PK_d7281c63c176e152e4c531594a8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY (id);


--
-- TOC entry 4926 (class 2606 OID 16548)
-- Name: usuarios REL_ca703457be468790bd9bbacd31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "REL_ca703457be468790bd9bbacd31" UNIQUE (profile_id);


--
-- TOC entry 4916 (class 2606 OID 16501)
-- Name: envios UQ_181c49b0811e1b1e3e6cdaf9ddf; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.envios
    ADD CONSTRAINT "UQ_181c49b0811e1b1e3e6cdaf9ddf" UNIQUE (id_pedido);


--
-- TOC entry 4922 (class 2606 OID 16525)
-- Name: clientes UQ_20685bc9ec0369e71246c2b113e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT "UQ_20685bc9ec0369e71246c2b113e" UNIQUE (id_usuario);


--
-- TOC entry 4928 (class 2606 OID 16546)
-- Name: usuarios UQ_446adfc18b35418aac32ae0b7b5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE (email);


--
-- TOC entry 4912 (class 2606 OID 16485)
-- Name: pagos UQ_7bd61c5e148b4a9e320c87ec7e2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT "UQ_7bd61c5e148b4a9e320c87ec7e2" UNIQUE (id_pedido);


--
-- TOC entry 4902 (class 2606 OID 16430)
-- Name: variantes_producto UQ_86cae081c04f72309229a68b5d1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variantes_producto
    ADD CONSTRAINT "UQ_86cae081c04f72309229a68b5d1" UNIQUE (sku);


--
-- TOC entry 4941 (class 2606 OID 16653)
-- Name: pedidos FK_084336bed940d710a81fa96e59c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT "FK_084336bed940d710a81fa96e59c" FOREIGN KEY (id_cliente) REFERENCES public.clientes(id_cliente);


--
-- TOC entry 4933 (class 2606 OID 16613)
-- Name: variantes_producto FK_13dbc448174649593453ae3cc39; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variantes_producto
    ADD CONSTRAINT "FK_13dbc448174649593453ae3cc39" FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto) ON DELETE CASCADE;


--
-- TOC entry 4940 (class 2606 OID 16648)
-- Name: envios FK_181c49b0811e1b1e3e6cdaf9ddf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.envios
    ADD CONSTRAINT "FK_181c49b0811e1b1e3e6cdaf9ddf" FOREIGN KEY (id_pedido) REFERENCES public.pedidos(id_pedido);


--
-- TOC entry 4942 (class 2606 OID 16658)
-- Name: clientes FK_20685bc9ec0369e71246c2b113e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT "FK_20685bc9ec0369e71246c2b113e" FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id);


--
-- TOC entry 4936 (class 2606 OID 16633)
-- Name: detalles_pedido FK_283f2be8f2d218c7f26d17b4098; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_pedido
    ADD CONSTRAINT "FK_283f2be8f2d218c7f26d17b4098" FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto);


--
-- TOC entry 4937 (class 2606 OID 16706)
-- Name: detalles_pedido FK_410b252a2657925ccebff09eab0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_pedido
    ADD CONSTRAINT "FK_410b252a2657925ccebff09eab0" FOREIGN KEY (id_variante_producto) REFERENCES public.variantes_producto(id_variante);


--
-- TOC entry 4934 (class 2606 OID 16618)
-- Name: imagenes_producto FK_47ef556a7e1d14cb02be0fa72c6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imagenes_producto
    ADD CONSTRAINT "FK_47ef556a7e1d14cb02be0fa72c6" FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto) ON DELETE CASCADE;


--
-- TOC entry 4938 (class 2606 OID 16628)
-- Name: detalles_pedido FK_4c6addd6905fc3410ee969d8bbf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_pedido
    ADD CONSTRAINT "FK_4c6addd6905fc3410ee969d8bbf" FOREIGN KEY (id_pedido) REFERENCES public.pedidos(id_pedido);


--
-- TOC entry 4946 (class 2606 OID 16693)
-- Name: items_carrito FK_608eae3333a5ca9d08ea174dccd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items_carrito
    ADD CONSTRAINT "FK_608eae3333a5ca9d08ea174dccd" FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto) ON DELETE CASCADE;


--
-- TOC entry 4935 (class 2606 OID 16623)
-- Name: productos FK_67e14062fdfd39fba436bccaff3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT "FK_67e14062fdfd39fba436bccaff3" FOREIGN KEY (id_categoria) REFERENCES public.categorias(id_categoria);


--
-- TOC entry 4939 (class 2606 OID 16643)
-- Name: pagos FK_7bd61c5e148b4a9e320c87ec7e2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT "FK_7bd61c5e148b4a9e320c87ec7e2" FOREIGN KEY (id_pedido) REFERENCES public.pedidos(id_pedido);


--
-- TOC entry 4947 (class 2606 OID 16688)
-- Name: items_carrito FK_ae552213e5a4349640f72dd9784; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items_carrito
    ADD CONSTRAINT "FK_ae552213e5a4349640f72dd9784" FOREIGN KEY (id_cliente) REFERENCES public.clientes(id_cliente) ON DELETE CASCADE;


--
-- TOC entry 4943 (class 2606 OID 16663)
-- Name: usuarios FK_ca703457be468790bd9bbacd313; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "FK_ca703457be468790bd9bbacd313" FOREIGN KEY (profile_id) REFERENCES public.perfiles(id);


--
-- TOC entry 4948 (class 2606 OID 16698)
-- Name: items_carrito FK_d9b977df03149c9b3cb8b9cfdec; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items_carrito
    ADD CONSTRAINT "FK_d9b977df03149c9b3cb8b9cfdec" FOREIGN KEY (id_variante) REFERENCES public.variantes_producto(id_variante) ON DELETE CASCADE;


--
-- TOC entry 4944 (class 2606 OID 16683)
-- Name: resenas FK_e1b147f9e62592fa0023881278b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resenas
    ADD CONSTRAINT "FK_e1b147f9e62592fa0023881278b" FOREIGN KEY (id_cliente) REFERENCES public.clientes(id_cliente) ON DELETE CASCADE;


--
-- TOC entry 4945 (class 2606 OID 16678)
-- Name: resenas FK_ea81d262fde09b5f73c2dd707d5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resenas
    ADD CONSTRAINT "FK_ea81d262fde09b5f73c2dd707d5" FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto) ON DELETE CASCADE;


-- Completed on 2026-05-15 22:20:41

--
-- PostgreSQL database dump complete
--


