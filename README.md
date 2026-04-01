<p align="center">
  <img src="./landing/assets/Component%203.png" width="240" alt="GoFit Logo" />
</p>

<p align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="42" alt="NestJS" />
  </a>
  &nbsp;&nbsp;
  <a href="https://vuejs.org/" target="_blank">
    <img src="https://vuejs.org/images/logo.png" width="42" alt="Vue" />
  </a>
  &nbsp;&nbsp;
  <a href="https://fastapi.tiangolo.com/" target="_blank">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" width="42" alt="FastAPI" />
  </a>
</p>


<p align="center">
  <strong>Sistema integral de gestión fitness</strong><br/>
  Plataforma Full-Stack construida con NestJS · Vue 3 · FastAPI
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-11.0-E0234E?style=flat&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat&logo=vuedotjs&logoColor=white" alt="Vue" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=flat&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/PostgreSQL-latest-336791?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-latest-DC382D?style=flat&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Docker-ready-2496ED?style=flat&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/license-UNLICENSED-red?style=flat" alt="License" />
</p>

---

## 📌 ¿Qué es GoFit?

GoFit es una plataforma de gestión empresarial Full-Stack diseñada para administrar y automatizar procesos de negocio de forma centralizada. Integra un backend robusto con NestJS, un frontend reactivo con Vue 3, y un microservicio de reconocimiento facial con FastAPI — todo orquestado con Docker en una arquitectura de monorepo.

---

## 🏗 Estructura del Monorepo

```text
GoFit/
├── Backend/
│   ├── Docker/          # docker-compose.yml (PostgreSQL + Redis)
│   └── api/             # API RESTful — NestJS + TypeScript
├── Vision/
│   ├── Docker/          # docker-compose.yml (Vision service)
│   └── app/             # Microservicio facial — FastAPI + Python
├── Frontend/            # SPA — Vue 3 + Vite
└── landing/
    └── assets/          # Recursos compartidos (logos, imágenes)
```

---

## 🛠 Stack General

| Capa | Tecnología | Versión |
|:---|:---|:---|
| **Backend** | NestJS, TypeScript, Knex.js | v11 / v5.7 / v3 |
| **Vision** | FastAPI, Python, face_recognition, dlib | v0.115 / v3.11 / v1.3.0 / v20.0 |
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

### 3. Levantar el microservicio Vision

```bash
$ cd ../../Vision/Docker
$ docker compose build vision
$ docker compose up -d
```

> Vision disponible en `http://localhost:8000`

### 4. Iniciar el Backend

```bash
$ cd ../../Backend/api
$ cp .env.example .env
$ pnpm install
$ pnpm run migrate:global
$ pnpm run seed:run:global
$ pnpm run start:dev
```

> API disponible en `http://localhost:3000`

### 5. Iniciar el Frontend

```bash
$ cd ../../Frontend
$ cp .env.example .env
$ npm install
$ npm run dev
```

> UI disponible en `http://localhost:5173`

---

## 📖 Documentación por Módulo

| Módulo | Descripción |
|:---|:---|
| [📦 Backend — NestJS API](./Backend/api/README.md) | API RESTful, auth, módulos de negocio |
| [👁️ Vision — Reconocimiento Facial](./Vision/README.md) | Microservicio biométrico con FastAPI |
| [🎨 Frontend — Vue 3 + Vite](./Frontend/README.md) | SPA, rutas, componentes, estado |

---

## 👨‍💻 Autor

<p align="left" style="display: flex; align-items: center; gap: 8px;">
  <img src="./landing/assets/Component%201.png" width="32" alt="GoFit G" />
  <span>
    <strong>Brayam Herrera Cruz</strong> — Ingeniero en Tecnologías de la Información
  </span>
</p>