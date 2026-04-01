"""
Servicio de reconocimiento facial.

Único módulo que importa face_recognition.
Si en el futuro se cambia de librería (p.ej. deepface), solo se toca este archivo.
"""
import io
import logging
import os

import face_recognition
import numpy as np

from app.core.encoding_store import RegistroFacial

logger    = logging.getLogger(__name__)
TOLERANCIA = float(os.getenv("TOLERANCE", 0.6))


def encode_face(image_bytes: bytes) -> list[float] | None:
    """
    Genera el vector facial (128 floats) de la primera cara detectada.

    Args:
        image_bytes: bytes crudos de la imagen (JPG o PNG)

    Returns:
        list[float] con 128 valores  → rostro encontrado
        None                         → ningún rostro detectado en la imagen
    """
    imagen     = face_recognition.load_image_file(io.BytesIO(image_bytes))
    encodings  = face_recognition.face_encodings(imagen)

    if not encodings:
        logger.warning("encode_face: no se detectó ningún rostro.")
        return None

    return encodings[0].tolist()


def recognize_face(
    image_bytes: bytes,
    registros:   list[RegistroFacial],
) -> dict | None:
    """
    Compara el rostro capturado contra el almacén en memoria.

    Args:
        image_bytes: bytes de la foto capturada en tiempo real
        registros:   lista de RegistroFacial desde encoding_store

    Returns:
        { match: True,  cliente_uuid: str, distancia: float }  → hay match
        { match: False, distancia: float }                      → nadie reconocido
        None                                                     → sin rostro detectado
    """
    imagen             = face_recognition.load_image_file(io.BytesIO(image_bytes))
    unknown_encodings  = face_recognition.face_encodings(imagen)

    if not unknown_encodings:
        logger.warning("recognize_face: no se detectó ningún rostro en la imagen.")
        return None

    unknown_enc  = unknown_encodings[0]
    known_encs   = np.array([r.encoding for r in registros])
    distancias   = face_recognition.face_distance(known_encs, unknown_enc)

    mejor_idx    = int(np.argmin(distancias))
    mejor_dist   = float(distancias[mejor_idx])

    logger.info(f"Mejor coincidencia: {registros[mejor_idx].cliente_uuid} | distancia: {mejor_dist:.4f}")

    if mejor_dist <= TOLERANCIA:
        return {
            "match":        True,
            "cliente_uuid": registros[mejor_idx].cliente_uuid,
            "distancia":    mejor_dist,
        }

    return {"match": False, "distancia": mejor_dist}
