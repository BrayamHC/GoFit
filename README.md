<p align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="55" alt="NestJS" />
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://vuejs.org/" target="_blank">
    <img src="https://vuejs.org/images/logo.png" width="55" alt="Vue" />
  </a>
</p>

<h1 align="center">🏋️‍♂️ GoFit</h1>

<p align="center">
  <strong>Sistema integral de gestión</strong><br/>
  Plataforma Full-Stack construida con NestJS + Vue 3
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-11.0-E0234E?style=flat&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat&logo=vuedotjs&logoColor=white" alt="Vue" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-latest-336791?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-latest-DC382D?style=flat&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Docker-ready-2496ED?style=flat&logo=docker&logoColor=white" alt="Docker" />
</p>

---

## 📌 ¿Qué es GoFit?

GoFit es una plataforma de gestión empresarial Full-Stack diseñada para administrar y automatizar procesos de negocio de forma centralizada. Su arquitectura separa el backend y el frontend en proyectos independientes para mayor escalabilidad y mantenibilidad.

---

## 🏗 Estructura del Monorepo

```text
GoFit/
├── Backend/
│   ├── Docker/      # docker-compose.yml (PostgreSQL + Redis)
│   └── api/         # API RESTful con NestJS + TypeScript
└── Frontend/        # SPA con Vue 3 + Vite
```

---

## 🛠 Stack General

| Capa | Tecnología | Versión |
|:---|:---|:---|
| **Backend** | NestJS, TypeScript, Knex.js | v11 / v5.7 / v3 |
| **Base de Datos** | PostgreSQL | v15+ |
| **Caché / Sesiones** | Redis (ioredis) | v7+ |
| **Frontend** | Vue 3, Vite, Vuetify, TailwindCSS | v3.5 / v7.3 / v3.11 / v4.1 |
| **Estado** | Pinia + Vue Router | v3 / v4.6 |
| **HTTP Client** | Axios | v1.13 |
| **Infraestructura** | Docker / OrbStack | — |
| **Paquetes** | pnpm (backend) · npm (frontend) | v10.25 |

---

## 🚀 Inicio Rápido

### Requisitos Previos
- [Node.js](https://nodejs.org/) v22+
- [pnpm](https://pnpm.io/) v10.25.0
- [Docker](https://www.docker.com/) u [OrbStack](https://orbstack.dev/)

### 1. Clonar el repositorio
```bash
$ git clone https://github.com/BrayamHC/GoFit.git
$ cd GoFit
```

### 2. Levantar la infraestructura (PostgreSQL + Redis)
```bash
$ cd Backend/Docker
$ docker compose up -d
```

### 3. Iniciar el Backend
```bash
$ cd ../api
$ cp .env.example .env       # Configura tus variables de entorno
$ pnpm install
$ pnpm run migrate:global
$ pnpm run seed:run:global
$ pnpm run start:dev
```
> API disponible en `http://localhost:3000`

### 4. Iniciar el Frontend
```bash
$ cd ../../Frontend
$ cp .env.example .env       # Configura VITE_API_URL
$ npm install
$ npm run dev
```
> UI disponible en `http://localhost:5173`

---

## 📖 Documentación por Módulo

- [📦 Backend — NestJS API](./Backend/api/README.md)
- [🎨 Frontend — Vue 3 + Vite](./Frontend/README.md)

---

## 👨‍💻 Autor

**Brayam Herrera Cruz** — Ingeniero en Tecnologías de la Información
