"""
GoFit Vision — Entry point de la aplicación FastAPI.

Startup:
  1. Intenta cargar encodings desde NestJS al arrancar.
  2. Si NestJS no está disponible (p.ej. arranca antes que el Backend),
     Vision sigue funcionando y loguea una advertencia.
     El frontend debe llamar GET /encodings/recargar una vez NestJS esté listo.
"""
import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.encoding_store import encoding_store
from app.routers import encode, encodings, recognize

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


# ── Ciclo de vida de la aplicación ───────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ──────────────────────────────────────────────────────────────
    logger.info("Iniciando GoFit Vision...")
    try:
        total = await encoding_store.cargar()
        logger.info(f"Listo. {total} encodings en memoria.")
    except Exception as error:
        logger.warning(
            f"No se pudieron cargar encodings al arrancar: {error}. "
            "Llama GET /encodings/recargar cuando NestJS esté disponible."
        )

    yield

    # ── Shutdown ─────────────────────────────────────────────────────────────
    logger.info("GoFit Vision apagado.")


# ── Aplicación ───────────────────────────────────────────────────────────────
app = FastAPI(
    title=os.getenv("APP_NAME", "GoFit Vision"),
    version=os.getenv("APP_VERSION", "1.0.0"),
    description="Servicio de reconocimiento facial para GoFit",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "").split(","),
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(encode.router,    prefix="/encode",    tags=["Encode"])
app.include_router(recognize.router, prefix="/recognize", tags=["Recognize"])
app.include_router(encodings.router, prefix="/encodings", tags=["Encodings"])


@app.get("/health", tags=["Health"])
def health():
    return {
        "status":           "ok",
        "service":          os.getenv("APP_NAME", "GoFit Vision"),
        "version":          os.getenv("APP_VERSION", "1.0.0"),
        "encodings_memoria": encoding_store.total,
    }
