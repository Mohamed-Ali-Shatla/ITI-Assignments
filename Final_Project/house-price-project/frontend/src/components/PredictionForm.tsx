import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLocations, predictPrice, ApiError } from "../api/predictionClient";
import type { PredictionRequest } from "../types/prediction";

const FURNISHING_OPTIONS = ["Unfurnished", "Semi-Furnished", "Furnished"];
const TRANSACTION_OPTIONS = ["Resale", "New Property", "Rent/Lease", "Other"];
const OWNERSHIP_OPTIONS = [
  "Freehold",
  "Leasehold",
  "Co-operative Society",
  "Power Of Attorney",
];
const FACING_OPTIONS = [
  "East",
  "West",
  "North",
  "South",
  "North - East",
  "North - West",
  "South - East",
  "South -West",
];

const initialForm = {
  location: "",
  carpet_area_sqft: "",
  floor_num: "",
  bathroom: "",
  balcony: "",
  furnishing: FURNISHING_OPTIONS[0],
  transaction: TRANSACTION_OPTIONS[0],
  ownership: OWNERSHIP_OPTIONS[0],
  facing: FACING_OPTIONS[0],
};

export default function PredictionForm() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<string[]>([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations().then(setLocations);
  }, []);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.location.trim()) next.location = "Please choose a location.";
    const area = Number(form.carpet_area_sqft);
    if (!form.carpet_area_sqft || Number.isNaN(area) || area <= 0) {
      next.carpet_area_sqft = "Area must be a number greater than 0.";
    }
    if (form.floor_num === "" || Number.isNaN(Number(form.floor_num))) {
      next.floor_num = "Please enter a floor number.";
    }
    if (form.bathroom === "" || Number(form.bathroom) < 0) {
      next.bathroom = "Please enter the number of bathrooms.";
    }
    if (form.balcony === "" || Number(form.balcony) < 0) {
      next.balcony = "Please enter the number of balconies.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setApiError(null);
    if (!validate()) return;

    const payload: PredictionRequest = {
      location: form.location,
      carpet_area_sqft: Number(form.carpet_area_sqft),
      floor_num: Number(form.floor_num),
      bathroom: Number(form.bathroom),
      balcony: Number(form.balcony),
      furnishing: form.furnishing as PredictionRequest["furnishing"],
      transaction: form.transaction as PredictionRequest["transaction"],
      ownership: form.ownership as PredictionRequest["ownership"],
      facing: form.facing as PredictionRequest["facing"],
    };

    setLoading(true);
    try {
      const result = await predictPrice(payload);
      navigate("/result", { state: { predictedPrice: result.predicted_price } });
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="prediction-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="location">Location</label>
        <select
          id="location"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
        >
          <option value="">Select a location…</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        {errors.location && <span className="error">{errors.location}</span>}
      </div>

      <div className="field">
        <label htmlFor="carpet_area_sqft">Carpet area (sqft)</label>
        <input
          id="carpet_area_sqft"
          type="number"
          min="1"
          value={form.carpet_area_sqft}
          onChange={(e) => update("carpet_area_sqft", e.target.value)}
        />
        {errors.carpet_area_sqft && (
          <span className="error">{errors.carpet_area_sqft}</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="floor_num">Floor number</label>
        <input
          id="floor_num"
          type="number"
          value={form.floor_num}
          onChange={(e) => update("floor_num", e.target.value)}
        />
        {errors.floor_num && <span className="error">{errors.floor_num}</span>}
      </div>

      <div className="field">
        <label htmlFor="bathroom">Bathrooms</label>
        <input
          id="bathroom"
          type="number"
          min="0"
          value={form.bathroom}
          onChange={(e) => update("bathroom", e.target.value)}
        />
        {errors.bathroom && <span className="error">{errors.bathroom}</span>}
      </div>

      <div className="field">
        <label htmlFor="balcony">Balconies</label>
        <input
          id="balcony"
          type="number"
          min="0"
          value={form.balcony}
          onChange={(e) => update("balcony", e.target.value)}
        />
        {errors.balcony && <span className="error">{errors.balcony}</span>}
      </div>

      <div className="field">
        <label htmlFor="furnishing">Furnishing</label>
        <select
          id="furnishing"
          value={form.furnishing}
          onChange={(e) => update("furnishing", e.target.value)}
        >
          {FURNISHING_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="transaction">Transaction</label>
        <select
          id="transaction"
          value={form.transaction}
          onChange={(e) => update("transaction", e.target.value)}
        >
          {TRANSACTION_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="ownership">Ownership</label>
        <select
          id="ownership"
          value={form.ownership}
          onChange={(e) => update("ownership", e.target.value)}
        >
          {OWNERSHIP_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="facing">Facing</label>
        <select
          id="facing"
          value={form.facing}
          onChange={(e) => update("facing", e.target.value)}
        >
          {FACING_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      {apiError && <div className="api-error">{apiError}</div>}

      <button type="submit" disabled={loading}>
        {loading ? "Predicting…" : "Predict price"}
      </button>
    </form>
  );
}
