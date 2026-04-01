#!/bin/sh
echo "NESTJS_URL: $NESTJS_URL"
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload