import type { PredictionRequest, PredictionResponse } from "../types/prediction";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export class ApiError extends Error {}

export async function predictPrice(
  payload: PredictionRequest
): Promise<PredictionResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ApiError(
      "Could not reach the prediction API. Is the backend running?"
    );
  }

  if (!response.ok) {
    let detail = "Prediction request failed.";
    try {
      const body = await response.json();
      detail = body?.detail ? JSON.stringify(body.detail) : detail;
    } catch {
      // ignore body parse errors
    }
    throw new ApiError(detail);
  }

  return (await response.json()) as PredictionResponse;
}

export async function fetchLocations(): Promise<string[]> {
  try {
    const response = await fetch("/locations.json");
    if (!response.ok) return [];
    return (await response.json()) as string[];
  } catch {
    return [];
  }
}
