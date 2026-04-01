<p align="center">
  <img src="../landing/assets/Go Fit Vision.png" width="220" alt="GoFit Logo" />
</p>
<h1 align="center">Vision</h1>

<p align="center">
  <strong>Servicio de reconocimiento facial</strong><br/>
  Microservicio construido con FastAPI + Python + face_recognition
</p>

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=flat&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?style=flat&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Docker-multi--stage-2496ED?style=flat&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/dlib-20.0-orange?style=flat" alt="dlib" />
  <img src="https://img.shields.io/badge/face__recognition-1.3.0-blueviolet?style=flat" alt="face_recognition" />
  <img src="https://img.shields.io/badge/license-UNLICENSED-red?style=flat" alt="License" />
</p>

***

## 📋 Requisitos Previos

- [Docker](https://www.docker.com/) y Docker Compose
- NestJS API corriendo en el puerto `5000`

> ⚠️ Vision **no se instala localmente**. Todo corre dentro de Docker.
> La primera build tarda ~10-15 min por la compilación de `dlib`.

***

## 🚀 Inicio Rápido

### 1. Configurar variables de entorno

```bash
cp .env.example .env
```

```env
APP_NAME=GoFit Vision
APP_VERSION=1.0.0
APP_PORT=8000

ALLOWED_ORIGINS=http://localhost:4200,http://localhost:3000
TOLERANCE=0.6

# En WSL2 obtén la IP con: ip route show default | awk '{print $3}'
NESTJS_URL=http://172.17.176.1:5000
NESTJS_ENCODINGS_PATH=/registros-faciales/encodings
NESTJS_VISION_KEY=tu_clave_compartida_con_nestjs
```

En `Backend/.env` agrega:

```env
VISION_API_KEY=tu_clave_compartida_con_nestjs   # idéntica a NESTJS_VISION_KEY
```

### 2. Build y arranque

```bash
cd Docker

# Primera vez o al cambiar Dockerfile / entrypoint.sh
docker compose build vision && docker compose up -d && docker compose logs -f vision

# Solo relanzar (cambios en código Python — hot-reload lo hace automático)
docker compose up -d && docker compose logs -f vision
```

Salida esperada:

```
NESTJS_URL: http://172.17.176.1:5000
INFO — 2 encodings cargados en memoria.
INFO — Application startup complete.
```

***

## 🔄 Comandos Frecuentes

```bash
docker compose logs -f vision        # Ver logs en tiempo real
docker compose down                  # Detener
docker compose down -v               # Detener y limpiar volúmenes
docker exec -it visionGoFit sh       # Entrar al contenedor
```

***

## ⚠️ Si cambia la IP del host (tras reiniciar Windows)

```bash
# Obtén la IP actual
ip route show default | awk '{print $3}'

# Actualiza Vision/.env
NESTJS_URL=http://<nueva-ip>:5000

# Reinicia sin rebuild
docker compose down && docker compose up -d
```

***

## 🌐 Endpoints

| Método | Ruta | Descripción |
|:---|:---|:---|
| `GET`  | `/health`             | Estado del servicio y encodings en memoria       |
| `POST` | `/encode`             | Genera vector facial (128 floats) desde una foto |
| `POST` | `/recognize`          | Compara foto contra el almacén en memoria        |
| `GET`  | `/encodings/recargar` | Recarga encodings desde NestJS sin reiniciar     |
| `GET`  | `/encodings/estado`   | Cuántos encodings hay actualmente en memoria     |
| `GET`  | `/docs`               | Documentación Swagger interactiva                |

***

## 🛠 Stack Tecnológico

| Tecnología | Versión | Rol |
|:---|:---|:---|
| [FastAPI](https://fastapi.tiangolo.com/) | v0.115 | Framework web |
| [Python](https://www.python.org/) | v3.11 | Lenguaje principal |
| [face_recognition](https://github.com/ageitgey/face_recognition) | v1.3.0 | Reconocimiento facial |
| [dlib](http://dlib.net/) | v20.0 | Motor de detección facial |
| [numpy](https://numpy.org/) | v1.26 | Operaciones con vectores |
| [Pillow](https://python-pillow.org/) | v11.1 | Procesamiento de imágenes |
| [httpx](https://www.python-httpx.org/) | v0.27 | Cliente HTTP async |
| [uvicorn](https://www.uvicorn.org/) | v0.34 | Servidor ASGI |

***

## 📂 Estructura del Proyecto

```text
Vision/
├── Docker/
│   ├── Dockerfile          # Multi-stage: builder (dlib) + runtime (ligero)
│   ├── docker-compose.yml  # Servicio vision con hot-reload
│   └── entrypoint.sh       # Arranca uvicorn e imprime NESTJS_URL activa
├── app/
│   ├── core/
│   │   └── encoding_store.py   # Almacén singleton en memoria
│   ├── routers/
│   │   ├── encode.py           # POST /encode
│   │   ├── recognize.py        # POST /recognize
│   │   └── encodings.py        # GET /encodings/recargar y /estado
│   ├── schemas/
│   │   └── face_schemas.py     # Modelos Pydantic de entrada/salida
│   ├── services/
│   │   └── face_service.py     # Lógica pura de face_recognition
│   └── main.py                 # Entry point FastAPI + lifespan + CORS
├── .env                    # Variables locales (no se commitea)
├── .env.example            # Plantilla de variables
├── .dockerignore
└── requirements.txt
```

***

## 👨‍💻 Autor

**Brayam Herrera Cruz** — Ingeniero en Tecnologías de la Información