# ════════════════════════════════════════════════════════════════════════════════
#  GoFit Vision — Dockerfile
#  Multi-stage build:
#    builder  → instala cmake + compila dlib (pesado, solo en build time)
#    runtime  → imagen final limpia, solo lo necesario para ejecutar
# ════════════════════════════════════════════════════════════════════════════════

# ── Stage 1: builder ─────────────────────────────────────────────────────────
FROM python:3.11-slim AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    cmake             \
    build-essential   \
    libopenblas-dev   \
    liblapack-dev     \
    libx11-dev        \
    libgl1            \
    libglib2.0-0      \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build

COPY requirements.txt .

RUN pip install --no-cache-dir --prefix=/deps -r requirements.txt


# ── Stage 2: runtime ─────────────────────────────────────────────────────────
FROM python:3.11-slim AS runtime

RUN apt-get update && apt-get install -y --no-install-recommends \
    libopenblas0  \
    libgomp1      \
    libgl1        \
    libglib2.0-0  \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /deps /usr/local

WORKDIR /app

# ← entrypoint ANTES de COPY . . para que el chmod quede en capa propia
COPY Docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY . .

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["/entrypoint.sh"]