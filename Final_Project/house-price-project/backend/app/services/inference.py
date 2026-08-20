import logging

import joblib

from app.core.config import settings
from app.schemas.prediction import PredictionRequest
from app.services.preprocessing import request_to_dataframe

logger = logging.getLogger(__name__)

_model = None


def load_model() -> None:
    """Load the trained pipeline from disk once (called at app startup)."""
    global _model
    logger.info("Loading model from %s", settings.MODEL_PATH)
    _model = joblib.load(settings.MODEL_PATH)
    logger.info("Model loaded successfully")


def is_model_loaded() -> bool:
    return _model is not None


def predict_price(request: PredictionRequest) -> float:
    if _model is None:
        raise RuntimeError("Model is not loaded yet")
    df = request_to_dataframe(request)
    prediction = _model.predict(df)[0]
    return float(prediction)
