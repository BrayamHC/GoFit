<p align="center">
  <img src="../../landing/assets/Component 3.png" width="240" alt="GoFit Logo" />
</p>

<h1 align="center">API Backend</h1>

<p align="center">
  <strong>Sistema integral de gestión</strong><br/>
  Backend construido con NestJS + TypeScript + PostgreSQL
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-11.0-E0234E?style=flat&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-latest-336791?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-latest-DC382D?style=flat&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/pnpm-10.25.0-F69220?style=flat&logo=pnpm&logoColor=white" alt="pnpm" />
  <img src="https://img.shields.io/badge/license-UNLICENSED-red?style=flat" alt="License" />
</p>

---

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) v22+
- [pnpm](https://pnpm.io/) v10.25.0
- [Docker](https://www.docker.com/) / [OrbStack](https://orbstack.dev/) y Docker Compose

---

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
$ pnpm install
```

### 2. Configurar variables de entorno

```bash
$ cp .env.example .env
```

Edita el archivo `.env` con tus credenciales locales:

```env
# Aplicación
PORT=3000

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=gofit

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Auth
JWT_SECRET=tu_clave_secreta
```

### 3. Levantar servicios de infraestructura

```bash
$ cd ../Docker
$ docker compose up -d
```

### 4. Ejecutar migraciones

```bash
$ pnpm run migrate:global
```

### 5. Ejecutar seeds (datos iniciales)

```bash
$ pnpm run seed:run:global
```

### 6. Iniciar la API

```bash
# Desarrollo con hot-reload
$ pnpm run start:dev

# Debug mode
$ pnpm run start:debug

# Producción
$ pnpm run start:prod
```

> La API estará disponible en `http://localhost:3000`

---

## 🗄 Migraciones y Seeds

```bash
# Crear nueva migración
$ pnpm run migrate:make:global -- NombreDeLaMigracion

# Ejecutar migraciones pendientes
$ pnpm run migrate:global

# Revertir última migración
$ pnpm run migrate:rollback:global

# Crear nuevo seed
$ pnpm run seed:make:global -- NombreDelSeed

# Ejecutar seeds
$ pnpm run seed:run:global
```

---

## 🛠 Stack Tecnológico

| Tecnología | Versión | Rol |
|:---|:---|:---|
| [NestJS](https://nestjs.com/) | v11 | Framework principal |
| [TypeScript](https://www.typescriptlang.org/) | v5.7 | Lenguaje tipado |
| [PostgreSQL](https://www.postgresql.org/) | v15+ | Base de datos relacional |
| [Redis](https://redis.io/) | v7+ | Caché y sesiones (via `ioredis`) |
| [Knex.js](https://knexjs.org/) | v3 | Query builder y migraciones |
| [Zod](https://zod.dev/) | v4 | Validación de esquemas |
| [class-validator](https://github.com/typestack/class-validator) | v0.14 | Validación de DTOs |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | v6 | Hash de contraseñas |
| [Winston](https://github.com/winstonjs/winston) | v3 | Logging con rotación de archivos |
| [NestJS Throttler](https://github.com/nestjs/throttler) | v6 | Rate limiting |

---

## 🧪 Tests y Calidad de Código

```bash
# Pruebas unitarias
$ pnpm run test

# Pruebas en modo watch
$ pnpm run test:watch

# Cobertura de código
$ pnpm run test:cov

# Pruebas e2e
$ pnpm run test:e2e

# Formatear código con Prettier
$ pnpm run format

# Lint con ESLint
$ pnpm run lint
```

---

## 📂 Estructura del Proyecto

```text
src/
├── common/        # Interfaces, DTOs y tipos compartidos
├── config/        # Configuración de variables de entorno
├── constantes/    # Enumeraciones y constantes globales
├── controllers/   # Capa de enrutamiento HTTP
├── coordinators/  # Orquestadores de lógica entre módulos
├── database/      # Configuración de Knex y conexión a la BD
├── guards/        # Autenticación (JWT) y Autorización (Roles)
├── middleware/    # Middleware global (logging, validación, etc.)
├── modules/       # Módulos de dominio del negocio
├── repo/          # Repositorios y acceso a datos
├── services/      # Lógica de negocio principal
├── utils/         # Helpers y utilidades reutilizables
├── app.module.ts  # Módulo raíz de la aplicación
└── main.ts        # Punto de entrada (bootstrap)
```


## 👨‍💻 Autor

<p align="left" style="display: flex; align-items: center; gap: 8px;">
  <img src="../../landing/assets/Component 1.png" width="32" alt="GoFit G" />
  <span>
    <strong>Brayam Herrera Cruz</strong> — Ingeniero en Tecnologías de la Información
  </span>
</p>