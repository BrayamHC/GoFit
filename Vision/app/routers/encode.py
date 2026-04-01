"""
Router: generación de vector facial al registrar un cliente.

Flujo:
  1. Frontend abre la cámara en el formulario de nuevo cliente
  2. Captura foto y la envía a POST /encode
  3. Vision detecta el rostro y retorna el encoding (128 floats)
  4. Frontend agrega el encoding al payload y crea el cliente en NestJS
"""
import logging

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas.face_schemas import EncodeResponse
from app.services.face_service import encode_face

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post(
    "/",
    response_model=EncodeResponse,
    summary="Generar vector facial",
    description=(
        "Recibe una imagen (JPG/PNG) y retorna el encoding facial (128 floats). "
        "Llamado por el Frontend al registrar un cliente nuevo, "
        "antes de enviar el formulario a NestJS."
    ),
)
async def encode_endpoint(image: UploadFile = File(...)):
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="El archivo debe ser una imagen (JPG o PNG)",
        )

    encoding = encode_face(await image.read())

    if encoding is None:
        raise HTTPException(
            status_code=422,
            detail=(
                "No se detectó ningún rostro en la imagen. "
                "Verifica que el rostro esté visible y bien iluminado."
            ),
        )

    return {"encoding": encoding}
