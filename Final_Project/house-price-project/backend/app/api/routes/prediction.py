import logging

from fastapi import APIRouter, HTTPException

from app.schemas.prediction import HealthResponse, PredictionRequest, PredictionResponse
from app.services import inference

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["health"])
def health() -> HealthResponse:
    if not inference.is_model_loaded():
        raise HTTPException(status_code=503, detail="Model not loaded")
    return HealthResponse(status="ok")


@router.post("/predict", response_model=PredictionResponse, tags=["prediction"])
def predict(request: PredictionRequest) -> PredictionResponse:
    try:
        price = inference.predict_price(request)
    except RuntimeError as exc:
        logger.exception("Prediction failed because the model isn't loaded")
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001 - surface any unexpected inference error as 500
        logger.exception("Unexpected error while predicting")
        raise HTTPException(status_code=500, detail="Prediction failed") from exc

    return PredictionResponse(predicted_price=round(price, 2))
