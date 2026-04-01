"""
Router: gestión del almacén de encodings faciales.

Endpoint:
  GET /encodings/recargar  →  recarga desde NestJS y retorna cuántos hay en memoria
"""
import logging

from fastapi import APIRouter, HTTPException

from app.core.encoding_store import encoding_store
from app.schemas.face_schemas import RecargarResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get(
    "/recargar",
    response_model=RecargarResponse,
    summary="Recargar encodings desde NestJS",
    description=(
        "Fuerza una recarga del almacén en memoria consultando el endpoint de NestJS. "
        "Llamar después de registrar un cliente nuevo para que Vision lo reconozca "
        "sin necesidad de reiniciar el contenedor."
    ),
)
async def recargar_encodings():
    try:
        total = await encoding_store.cargar()
    except Exception as error:
        logger.error(f"Error al recargar encodings: {error}")
        raise HTTPException(
            status_code=503,
            detail=f"No se pudo conectar con NestJS para cargar encodings: {error}",
        )

    return {
        "mensaje": f"{total} encodings cargados en memoria.",
        "total":   total,
    }


@router.get(
    "/estado",
    summary="Estado del almacén de encodings",
    description="Retorna cuántos encodings hay actualmente en memoria.",
)
def estado_encodings():
    return {
        "listo": encoding_store.listo,
        "total": encoding_store.total,
    }
