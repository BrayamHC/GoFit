"""
Almacén en memoria de encodings faciales.

Responsabilidades:
  - Mantener los encodings cargados desde NestJS
  - Exponerse como singleton al resto de la app
  - Cargar/recargar en cualquier momento sin reiniciar el contenedor
"""
import logging
import os
from dataclasses import dataclass

import httpx
import numpy as np

logger = logging.getLogger(__name__)


@dataclass
class RegistroFacial:
    """Representación en memoria de un registro de registros_faciales."""
    cliente_uuid: str
    encoding:     np.ndarray


class EncodingStore:
    """
    Almacén singleton de encodings faciales.
    Se carga al arrancar la app y se puede recargar vía endpoint.
    """

    def __init__(self) -> None:
        self._registros: list[RegistroFacial] = []

    # ── Propiedades ──────────────────────────────────────────────────────────

    @property
    def total(self) -> int:
        return len(self._registros)

    @property
    def registros(self) -> list[RegistroFacial]:
        return self._registros

    @property
    def listo(self) -> bool:
        """True si hay al menos un encoding cargado."""
        return self._registros != []

    # ── Carga desde NestJS ───────────────────────────────────────────────────

    async def cargar(self) -> int:
        """
        Consume GET {NESTJS_URL}{NESTJS_ENCODINGS_PATH} y almacena los resultados.

        Respuesta esperada de NestJS:
            [{ "cliente_uuid": "...", "encoding": [float x128] }, ...]

        Returns:
            Cantidad de encodings cargados.

        Raises:
            httpx.HTTPError: si NestJS no está disponible o retorna error.
        """
        url = f"{os.getenv('NESTJS_URL')}{os.getenv('NESTJS_ENCODINGS_PATH')}"
        logger.info(f"Cargando encodings desde: {url}")

        async with httpx.AsyncClient(timeout=30.0) as cliente_http:
            respuesta = await cliente_http.get(
                url,
                headers={"x-vision-key": os.getenv("NESTJS_VISION_KEY", "")},
            )
            respuesta.raise_for_status()
            datos: list[dict] = respuesta.json()

        self._registros = [
            RegistroFacial(
                cliente_uuid=item["cliente_uuid"],
                encoding=np.array(item["encoding"], dtype=np.float64),
            )
            for item in datos
        ]

        logger.info(f"{self.total} encodings cargados en memoria.")
        return self.total


# Instancia global — se importa desde cualquier módulo de la app
encoding_store = EncodingStore()
