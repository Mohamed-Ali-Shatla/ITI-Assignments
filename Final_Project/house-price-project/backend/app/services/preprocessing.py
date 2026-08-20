import json
from functools import lru_cache

import pandas as pd

from app.core.config import settings
from app.schemas.prediction import PredictionRequest


@lru_cache(maxsize=1)
def get_known_locations() -> set[str]:
    """Load the list of locations the model was actually trained on
    (everything else must be mapped to 'other', exactly like in the notebook)."""
    try:
        with open(settings.LOCATIONS_PATH, "r") as f:
            return set(json.load(f))
    except FileNotFoundError:
        return set()


def request_to_dataframe(request: PredictionRequest) -> pd.DataFrame:
    """Turn a validated PredictionRequest into a single-row DataFrame with exactly
    the column names used during training. The exported model is a full sklearn
    Pipeline (imputation + scaling + one-hot encoding included), so no manual
    encoding is needed here — we just have to match the training column names.
    """
    known_locations = get_known_locations()
    location_grouped = request.location if request.location in known_locations else "other"

    row = {
        "carpet_area_sqft": request.carpet_area_sqft,
        "floor_num": request.floor_num,
        "bathroom": request.bathroom,
        "balcony": request.balcony,
        "location_grouped": location_grouped,
        "Furnishing": request.furnishing,
        "Transaction": request.transaction,
        "Ownership": request.ownership,
        "facing": request.facing,
    }
    return pd.DataFrame([row])
