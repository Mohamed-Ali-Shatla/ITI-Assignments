from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.prediction import router as prediction_router
from app.core.config import settings
from app.services.inference import load_model
from app.utils.logging_config import configure_logging

configure_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the model once when the app starts, not on every request.
    load_model()
    yield


app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction_router)


@app.get("/", tags=["root"])
def root():
    return {"message": "House Price Prediction API. See /docs for the interactive API docs."}
