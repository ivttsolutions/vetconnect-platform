# VetConnect Backend - Authentication & User Management

## 📦 Archivos Incluidos

```
src/
├── app.ts                          # Configuración de Express
├── server.ts                       # Punto de entrada del servidor
├── config/
│   └── prisma.ts                   # Cliente de Prisma
├── controllers/
│   ├── auth.controller.ts          # Controlador de autenticación
│   └── user.controller.ts          # Controlador de usuarios
├── services/
│   ├── auth.service.ts             # Lógica de negocio de auth
│   └── user.service.ts             # Lógica de negocio de users
├── middleware/
│   ├── auth.middleware.ts          # Verificación JWT
│   └── validate.middleware.ts      # Validación de requests
├── routes/
│   ├── index.ts                    # Router principal
│   ├── auth.routes.ts              # Rutas de autenticación
│   └── user.routes.ts              # Rutas de usuarios
├── validators/
│   └── auth.validator.ts           # Validadores con express-validator
├── utils/
│   ├── jwt.util.ts                 # Funciones JWT
│   ├── password.util.ts            # Hash y validación de contraseñas
│   └── response.util.ts            # Respuestas HTTP estandarizadas
└── types/
    └── index.ts                    # Tipos TypeScript personalizados
```

## 🚀 Instalación

### 1. Copiar archivos al proyecto

Copia todo el contenido de la carpeta `src/` a `backend/src/` en tu proyecto.

### 2. Instalar dependencias adicionales

```bash
npm install jsonwebtoken bcrypt express-validator
npm install --save-dev @types/jsonwebtoken @types/bcrypt
```

### 3. Subir a GitHub

```bash
git add backend/src/
git commit -m "Add authentication and user management backend"
git push
```

### 4. Redeploy en Coolify

Después del push, haz redeploy en Coolify para que los cambios se apliquen.

## 🔑 Endpoints Disponibles

### Autenticación

#### POST /api/auth/register
Registrar nuevo usuario

**Body:**
```json
{
  "email": "vet@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "userType": "USER"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

#### POST /api/auth/login
Iniciar sesión

**Body:**
```json
{
  "email": "vet@example.com",
  "password": "SecurePass123"
}
```

#### POST /api/auth/refresh
Renovar access token

**Body:**
```json
{
  "refreshToken": "eyJ..."
}
```

#### POST /api/auth/logout
Cerrar sesión (requiere autenticación)

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "refreshToken": "eyJ..."
}
```

#### GET /api/auth/me
Obtener información del usuario actual (requiere autenticación)

**Headers:**
```
Authorization: Bearer {accessToken}
```

### Usuarios

#### GET /api/users/profile
Obtener mi perfil completo (requiere autenticación)

#### PUT /api/users/profile
Actualizar mi perfil (requiere autenticación)

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Veterinarian with 10 years of experience",
  "phone": "+34123456789",
  "country": "Spain",
  "city": "Madrid",
  "specialization": ["Small Animals", "Surgery"],
  "yearsOfExperience": 10
}
```

#### GET /api/users/:userId
Obtener perfil de otro usuario (requiere autenticación)

#### GET /api/users/search?q={query}&limit={limit}
Buscar usuarios (requiere autenticación)

**Query params:**
- `q`: Texto de búsqueda
- `limit`: Máximo de resultados (default: 10)

### Health Check

#### GET /api/health
Verificar estado del API

## 🧪 Probar con Postman/Thunder Client

### 1. Registro

```http
POST http://192.168.1.132:4000/api/auth/register
Content-Type: application/json

{
  "email": "test@vetconnect.com",
  "password": "Test1234",
  "firstName": "Test",
  "lastName": "User",
  "userType": "USER"
}
```

### 2. Login

```http
POST http://192.168.1.132:4000/api/auth/login
Content-Type: application/json

{
  "email": "test@vetconnect.com",
  "password": "Test1234"
}
```

### 3. Obtener perfil (con el accessToken del login)

```http
GET http://192.168.1.132:4000/api/users/profile
Authorization: Bearer {accessToken}
```

## ✅ Características Implementadas

- ✅ Registro de usuarios con validación
- ✅ Login con JWT (access + refresh tokens)
- ✅ Refresh token automático
- ✅ Logout seguro
- ✅ Gestión de perfiles
- ✅ Búsqueda de usuarios
- ✅ Middleware de autenticación
- ✅ Middleware de autorización por roles
- ✅ Validación de datos con express-validator
- ✅ Hash seguro de contraseñas con bcrypt
- ✅ Respuestas HTTP estandarizadas
- ✅ Manejo de errores centralizado

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt (10 rounds)
- JWT con expiración configurable
- Refresh tokens almacenados en base de datos
- Validación de entrada en todos los endpoints
- CORS configurado
- Helmet para headers de seguridad

## 📝 Notas

- Los access tokens expiran en 15 minutos (configurable)
- Los refresh tokens expiran en 7 días (configurable)
- Las contraseñas deben tener mínimo 8 caracteres, 1 mayúscula, 1 minúscula y 1 número
- El email se valida y normaliza automáticamente
