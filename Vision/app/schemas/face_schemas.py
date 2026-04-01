from pydantic import BaseModel, Field


# ── /encode ───────────────────────────────────────────────────────────────────

class EncodeResponse(BaseModel):
    """Respuesta del endpoint POST /encode"""
    encoding: list[float] = Field(
        ...,
        description="Vector facial de 128 dimensiones generado por face_recognition",
    )


# ── /recognize ────────────────────────────────────────────────────────────────

class RecognizeResponse(BaseModel):
    """Respuesta del endpoint POST /recognize"""
    match:        bool
    cliente_uuid: str | None = Field(None, description="UUID del cliente si hubo match")
    distancia:    float       = Field(...,  description="Distancia euclidiana al mejor candidato (menor = más parecido)")


# ── /encodings ────────────────────────────────────────────────────────────────

class RecargarResponse(BaseModel):
    """Respuesta del endpoint GET /encodings/recargar"""
    mensaje: str
    total:   int = Field(..., description="Encodings actualmente en memoria tras la recarga")
