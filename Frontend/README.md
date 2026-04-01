<p align="center">
  <img src="../landing/assets/Component 3.png" width="240" alt="GoFit Logo" />
</p>
<h1 align="center">Frontend</h1>

<p align="center">
  <strong>Sistema integral de gestión</strong><br/>
  Frontend construido con Vue 3 + Vite + Vuetify + TailwindCSS
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat&logo=vuedotjs&logoColor=white" alt="Vue" />
  <img src="https://img.shields.io/badge/Vite-7.3-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Vuetify-3.11-1867C0?style=flat&logo=vuetify&logoColor=white" alt="Vuetify" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Pinia-3.0-FFD859?style=flat&logo=pinia&logoColor=black" alt="Pinia" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/license-UNLICENSED-red?style=flat" alt="License" />
</p>

---

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) `^20.19.0` o `>=22.12.0`
- [npm](https://www.npmjs.com/)

---

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
$ npm install
```

### 2. Configurar variables de entorno

```bash
$ cp .env.example .env
```

Edita el archivo `.env` con la URL de tu API:

```env
VITE_API_URL=http://localhost:3000
```

### 3. Iniciar servidor de desarrollo

```bash
$ npm run dev
```

> La interfaz estará disponible en `http://localhost:5173`

---

## 📦 Scripts Disponibles

```bash
# Servidor de desarrollo con hot-reload
$ npm run dev

# Build optimizado para producción
$ npm run build

# Vista previa del build de producción
$ npm run preview

# Lint y corrección automática con ESLint
$ npm run lint

# Formatear código con Prettier
$ npm run format
```

---

## 🛠 Stack Tecnológico

| Tecnología | Versión | Rol |
|:---|:---|:---|
| [Vue 3](https://vuejs.org/) | v3.5 | Framework frontend principal |
| [Vite](https://vitejs.dev/) | v7.3 | Bundler y servidor de desarrollo |
| [TypeScript](https://www.typescriptlang.org/) | v5 | Tipado estático |
| [Vuetify](https://vuetifyjs.com/) | v3.11 | Componentes Material Design |
| [PrimeVue](https://primevue.org/) | v4.5 | Componentes UI avanzados |
| [Pinia](https://pinia.vuejs.org/) | v3 | Gestión de estado global |
| [Vue Router](https://router.vuejs.org/) | v4.6 | Enrutamiento SPA |
| [Axios](https://axios-http.com/) | v1.13 | Cliente HTTP |
| [TailwindCSS](https://tailwindcss.com/) | v4.1 | Estilos utilitarios |
| [MDI Font](https://materialdesignicons.com/) | v7 | Íconos Material Design |

---

## 🧩 IDE y Herramientas Recomendadas

- **Editor**: [VS Code](https://code.visualstudio.com/) con la extensión **[Vue - Official (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)**
- Desactiva **Vetur** si lo tienes instalado para evitar conflictos

### Vue DevTools (Navegador)
- Chrome/Edge/Brave: [Vue.js DevTools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- Firefox: [Vue.js DevTools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

> El proyecto incluye [vite-plugin-vue-devtools](https://devtools.vuejs.org/) integrado para debugging durante desarrollo.

---

## 📂 Estructura del Proyecto

```text
src/
├── assets/        # Imágenes, fuentes y recursos estáticos
├── components/    # Componentes Vue reutilizables
├── composables/   # Lógica reutilizable con Composition API
├── router/        # Configuración de Vue Router
├── stores/        # Stores de Pinia (estado global)
├── views/         # Páginas/vistas de la aplicación
├── App.vue        # Componente raíz
└── main.ts        # Punto de entrada
```

## 👨‍💻 Autor

<p align="left" style="display: flex; align-items: center; gap: 8px;">
  <img src="../landing/assets/Component 1.png" width="32" alt="GoFit G" />
  <span>
    <strong>Brayam Herrera Cruz</strong> — Ingeniero en Tecnologías de la Información
  </span>
</p>