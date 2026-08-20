from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    """Input schema — mirrors the features used to train the model in the notebook."""

    location: str = Field(..., description="City / area name, e.g. 'thane', 'mumbai'")
    carpet_area_sqft: float = Field(..., gt=0, description="Carpet (or super) area in square feet")
    floor_num: int = Field(..., ge=-1, description="Floor number (0 = Ground, -1 = Basement)")
    bathroom: int = Field(..., ge=0, description="Number of bathrooms")
    balcony: int = Field(..., ge=0, description="Number of balconies")
    furnishing: str = Field(..., description="'Furnished' | 'Semi-Furnished' | 'Unfurnished'")
    transaction: str = Field(..., description="'New Property' | 'Resale' | 'Rent/Lease' | 'Other'")
    ownership: str = Field(..., description="'Freehold' | 'Leasehold' | 'Co-operative Society' | 'Power Of Attorney'")
    facing: str = Field(..., description="e.g. 'East', 'North - West', 'South'")

    model_config = {
        "json_schema_extra": {
            "example": {
                "location": "thane",
                "carpet_area_sqft": 650,
                "floor_num": 3,
                "bathroom": 2,
                "balcony": 1,
                "furnishing": "Semi-Furnished",
                "transaction": "Resale",
                "ownership": "Freehold",
                "facing": "East",
            }
        }
    }


class PredictionResponse(BaseModel):
    predicted_price: float


class HealthResponse(BaseModel):
    status: str
