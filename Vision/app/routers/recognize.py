"""
Router: reconocimiento facial en pase de lista.

Flujo:
  1. Frontend captura foto con la webcam
  2. Envía la imagen a POST /recognize
  3. Vision compara contra el almacén en memoria
  4. Retorna { match, cliente_uuid, distancia }
  5. Frontend envía el resultado a NestJS para registrar la asistencia
"""
import logging

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.encoding_store import encoding_store
from app.schemas.face_schemas import RecognizeResponse
from app.services.face_service import recognize_face

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post(
    "/",
    response_model=RecognizeResponse,
    summary="Reconocer rostro en pase de lista",
    description=(
        "Compara el rostro capturado contra el almacén de encodings en memoria. "
        "Si el almacén está vacío, llama primero a GET /encodings/recargar."
    ),
)
async def recognize_endpoint(image: UploadFile = File(...)):
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="El archivo debe ser una imagen (JPG o PNG)",
        )

    if not encoding_store.listo:
        raise HTTPException(
            status_code=503,
            detail=(
                "El almacén de encodings está vacío. "
                "Llama GET /encodings/recargar para cargar los registros desde NestJS."
            ),
        )

    resultado = recognize_face(await image.read(), encoding_store.registros)

    if resultado is None:
        raise HTTPException(
            status_code=422,
            detail="No se detectó ningún rostro en la imagen capturada.",
        )

    return resultado
