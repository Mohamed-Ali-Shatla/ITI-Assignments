# House Price Predictor 🏠

## 🚀 Just want to run it? (easiest way)

You don't need to type any commands. Just make sure these two things are installed once:

- **Python 3.12** → https://www.python.org/downloads/release/python-31210/ (tick "Add python.exe to PATH" during install!)
- **Node.js (LTS)** → https://nodejs.org

Then:

- **Windows:** Run As Administrator **`START.bat`** (in this folder)
- **Mac:** Run As Administrator **`START.command`** (in this folder)
- **Linux:** run `./START.sh`

Two black windows will open (the backend "brain" and the website) and a browser tab will
open automatically at **http://localhost:5173** after a few seconds — fill in the form and
get a predicted price. The first run installs everything automatically and can take a
couple of minutes; after that it starts in seconds. Keep the two black windows open while
you use the app; closing them stops the app.

> Before your very first run, make sure the dataset CSV is in
> `notebooks/data/house_prices.csv` (see "Dataset" below) — this is only needed if you
> want to re-train the model yourself; the app already ships with a pre-trained model in
> `backend/models/house_price.pkl`, so you can skip this for just running the app.

---


An end-to-end machine-learning web app that predicts Indian residential property prices
from listing details (location, area, floor, furnishing, etc.). Raw data → cleaned &
modeled in a Jupyter notebook → served by a FastAPI backend → consumed by a React
frontend.

> Dataset: [House Price by Juhi Bhojani](https://www.kaggle.com/datasets/juhibhojani/house-price) (Kaggle, ~187k Indian property listings).

## Overview

1. **`notebooks/`** — a Jupyter notebook that loads the raw Kaggle CSV, explores it,
   cleans/engineers features, trains & compares two regression models, evaluates them,
   and exports the winning model as a scikit-learn `Pipeline` (`house_price.pkl`).
2. **`backend/`** — a FastAPI service that loads that pipeline once at startup and
   exposes a `POST /predict` endpoint.
3. **`frontend/`** — a React + TypeScript + Vite single-page app where a user fills in
   property details and sees the predicted price.

## Architecture

```
                     ┌───────────────────────┐
                     │   notebooks/           │
                     │   house_price_model    │
                     │   .ipynb                │
                     │  (train & export .pkl) │
                     └──────────┬─────────────┘
                                │ house_price.pkl
                                │ locations.json
                                ▼
┌────────────────┐   HTTP    ┌──────────────────────┐
│  React (Vite)  │ ───────▶ │   FastAPI backend     │
│  frontend/      │  JSON    │   backend/             │
│  :5173          │ ◀─────── │   :8000                │
└────────────────┘   JSON    └──────────────────────┘
     PredictionForm              /health   /predict
     → ResultPage                (model loaded once
                                   at startup, served
                                   from models/*.pkl)
```

## Tech stack

| Layer     | Tech |
|-----------|------|
| Modeling  | Python, pandas, scikit-learn, matplotlib, seaborn, Jupyter |
| Backend   | FastAPI, Pydantic v2 / pydantic-settings, Uvicorn, joblib |
| Frontend  | React 19, TypeScript, Vite, react-router-dom |
| Testing   | pytest + FastAPI `TestClient` |

## Project structure

```
house-price-project/
├── notebooks/
│   ├── data/house_prices.csv        # raw dataset (NOT committed — see below)
│   ├── house_price_model.ipynb      # full training notebook (EDA → export)
│   ├── house_price.pkl              # exported trained pipeline
│   ├── locations.json               # allowed locations (for frontend dropdown)
│   └── metrics.json                 # final model metrics
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app, CORS, lifespan model loading
│   │   ├── api/routes/prediction.py # GET /health, POST /predict
│   │   ├── core/config.py           # settings from .env (pydantic-settings)
│   │   ├── schemas/prediction.py    # PredictionRequest / PredictionResponse
│   │   ├── services/
│   │   │   ├── preprocessing.py     # request → one-row DataFrame
│   │   │   └── inference.py         # load .pkl, run predict
│   │   └── utils/logging_config.py
│   ├── models/house_price.pkl       # copied from the notebook
│   ├── models/locations.json
│   ├── tests/test_prediction.py
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/predictionClient.ts
│   │   ├── components/PredictionForm.tsx
│   │   ├── pages/{HomePage,ResultPage,NotFoundPage}.tsx
│   │   ├── types/prediction.ts
│   │   └── App.tsx
│   ├── public/locations.json        # copied from the notebook
│   └── .env.example
├── .gitignore
└── README.md
```

## Dataset

- **Source:** [Kaggle — House Price by Juhi Bhojani](https://www.kaggle.com/datasets/juhibhojani/house-price)
- **File:** `house_prices.csv` (~187,000 rows)

### Download instructions

**Option A — manual:** open the dataset page above, click **Download**, unzip, and
place `house_prices.csv` inside `notebooks/data/`.

**Option B — Kaggle CLI:**
```bash
pip install kaggle
# Get an API token: Kaggle → Settings → API → "Create New Token"
# Put kaggle.json in ~/.kaggle/ (macOS/Linux) or C:\Users\<you>\.kaggle\ (Windows)
kaggle datasets download -d juhibhojani/house-price -p notebooks/data --unzip
```

The raw CSV is **not committed to git** (it's large) — `.gitignore` excludes it, so
always download it yourself before running the notebook.

## Backend — manual setup & run (advanced / optional)

> Most people should just use `START.bat` / `START.command` from the top of this README.
> Use the manual steps below only if you want more control, or you're on Linux.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Open http://localhost:8000/docs to try `/predict` from the interactive Swagger UI.

### Environment variables (`backend/.env`)

| Variable         | Default                     | Description                                   |
|------------------|------------------------------|------------------------------------------------|
| `APP_NAME`       | `House Price Prediction API` | Shown in the OpenAPI docs                     |
| `MODEL_PATH`     | `models/house_price.pkl`     | Path to the exported scikit-learn pipeline    |
| `LOCATIONS_PATH` | `models/locations.json`      | Path to the list of trained-on locations      |
| `CORS_ORIGINS`   | `http://localhost:5173`      | Comma-separated list of allowed frontend origins |
| `LOG_LEVEL`      | `INFO`                       | Python logging level                          |

### Run tests

```bash
cd backend
pytest -v
```

## Frontend — manual setup & run (advanced / optional)

> Most people should just use `START.bat` / `START.command` from the top of this README.

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173, fill in the form, and submit to see a real prediction
(make sure the backend is running on port 8000 first).

### Environment variables (`frontend/.env`)

| Variable              | Default                  | Description                     |
|-----------------------|---------------------------|----------------------------------|
| `VITE_API_BASE_URL`   | `http://localhost:8000`  | Base URL of the FastAPI backend |

## API reference

### `GET /health`
Returns `{"status": "ok"}` once the model has loaded successfully (503 otherwise).

### `POST /predict`

Request body:

```json
{
  "location": "thane",
  "carpet_area_sqft": 650,
  "floor_num": 3,
  "bathroom": 2,
  "balcony": 1,
  "furnishing": "Semi-Furnished",
  "transaction": "Resale",
  "ownership": "Freehold",
  "facing": "East"
}
```

Response:

```json
{ "predicted_price": 8231398.67 }
```

curl example:

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
        "location": "thane",
        "carpet_area_sqft": 650,
        "floor_num": 3,
        "bathroom": 2,
        "balcony": 1,
        "furnishing": "Semi-Furnished",
        "transaction": "Resale",
        "ownership": "Freehold",
        "facing": "East"
      }'
```

Locations outside the top-50 the model was trained on are automatically mapped to an
`"other"` bucket server-side, so the endpoint accepts any location string.

## Model summary

Two models were trained and compared on a held-out 20% test split (see
`notebooks/house_price_model.ipynb` under "Evaluating the models" for the full comparison table and plots):

| Model                          | MAE (₹)     | RMSE (₹)    | R²     |
|---------------------------------|------------:|------------:|-------:|
| Linear Regression (baseline)    | 4,135,324   | 6,724,961   | 0.679  |
| RandomForest (log target)       | 1,085,234   | 3,214,506   | 0.927  |
| **RandomForestRegressor (final)** | **1,155,772** | **3,122,312** | **0.931** |

**Winning model: `RandomForestRegressor`** (`n_estimators=50, max_depth=16,
min_samples_leaf=2`) trained inside a scikit-learn `Pipeline` (median/most-frequent
imputation → scaling / one-hot encoding → forest). It was chosen over the linear
baseline and over a log-target variant because it gives the best accuracy on the test
set while staying simple to serve (no log/inverse-transform bookkeeping needed in the
backend). Exact numbers, the predicted-vs-actual plot, and the 3-fold cross-validation
scores are all in the notebook.

> The forest size/depth were tuned down from the guide's suggested `n_estimators=200`
> because this project was trained on a single-CPU-core machine; increase them back up
> if you have more compute available and want to squeeze out a bit more accuracy.

## Screenshots

![Home page - property details form](photos/screenshot-home.png)
*The property-details form*

![Result page - predicted price](photos/screenshot-result.png)
*The predicted-price result page*


