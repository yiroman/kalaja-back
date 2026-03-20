# Kalaja System — Backend

API REST para gestión de inventario 3D, producción, pedidos y usuarios. Construida con Express.js, MongoDB y Redis.

## Autor

- Jair Mendez Lopez

## Tecnologías

- **Framework:** Express.js 4
- **Lenguaje:** JavaScript (Node.js)
- **Base de datos:** MongoDB 8 + Mongoose
- **Caché / Sesiones:** Redis 7
- **Autenticación:** JWT + express-session
- **Archivos:** Multer + Sharp (imágenes)
- **Reportes:** jsPDF, ExcelJS, QRCode
- **Logging:** Winston + Morgan
- **Seguridad:** Helmet, bcrypt, express-validator

## Requisitos

- Node.js >= 18
- Docker y Docker Compose (recomendado)

## Instalación

### Con Docker (recomendado)

```bash
cd app
docker compose up -d
```

Servicios levantados:

| Servicio | Puerto |
|---|---|
| API (Express) | `3020` |
| MongoDB | `27317` |
| Redis | `6379` |

### Sin Docker

```bash
cd app
npm install
npm run dev     # Desarrollo con nodemon
npm start       # Producción
```

Requiere MongoDB y Redis corriendo localmente.

## Variables de entorno

Configurar en `docker-compose.yml` o `.env`:

| Variable | Descripción |
|---|---|
| `JWT_SECRET` | Clave secreta para tokens JWT |
| `MONGO_URI` | URI de conexión a MongoDB |
| `REDIS_HOST` | Host de Redis |
| `COOKIE_SECRET` | Secreto para cookies de sesión |

## Estructura

```
app/
├── bin/www             # Entrada del servidor
├── app.js              # Configuración principal
├── config/
│   ├── jwtConfig.js
│   ├── middlewares.js
│   ├── redis.js
│   ├── roles.js
│   └── winston.js
├── models/
│   ├── UsuarioModel.js
│   ├── ProductoModel.js
│   ├── Producto3DModel.js
│   ├── PedidoModel.js
│   ├── ProduccionModel.js
│   ├── VentasModel.js
│   └── ...
├── routes/
│   ├── usuariosRouters.js
│   ├── productosRouters.js
│   ├── productos3DRouters.js
│   ├── pedidosRouters.js
│   └── ...
├── validators/
├── utils/
└── uploads/            # Archivos subidos
```

## API

Base URL: `http://localhost:3020/api/v1`

| Recurso | Ruta |
|---|---|
| Usuarios | `/usuarios` |
| Roles | `/roles` |
| Pedidos | `/pedidos` |
| Productos | `/productos` |
| Productos 3D | `/productos3d` |
| Dependencias | `/dependencias` |
| Estatus usuario | `/usuario_estatus` |
| Datos estáticos | `/datos_estaticos` |

## Seguridad

- Helmet para cabeceras HTTP seguras
- CORS restringido a `localhost:4200` y `kalaja.com.mx`
- Sesiones con Redis (TTL: 4 horas)
- Cookies HttpOnly
- Validación de entrada con express-validator
- Contraseñas hasheadas con bcrypt

## Integración con Odoo

Ver [estrategia_integracion_kalaja_odoo.md](../kalaja_front/estrategia_integracion_kalaja_odoo.md) para detalles de la integración con Odoo 19 vía JSON-RPC (ventas, inventario, sincronización).

## CI/CD

Pipeline automatizado definido en `Jenkinsfile`.
