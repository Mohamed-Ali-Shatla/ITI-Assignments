export type Furnishing = "Furnished" | "Semi-Furnished" | "Unfurnished";
export type Transaction = "New Property" | "Resale" | "Rent/Lease" | "Other";
export type Ownership =
  | "Freehold"
  | "Leasehold"
  | "Co-operative Society"
  | "Power Of Attorney";
export type Facing =
  | "East"
  | "West"
  | "North"
  | "South"
  | "North - East"
  | "North - West"
  | "South - East"
  | "South -West";

export interface PredictionRequest {
  location: string;
  carpet_area_sqft: number;
  floor_num: number;
  bathroom: number;
  balcony: number;
  furnishing: Furnishing;
  transaction: Transaction;
  ownership: Ownership;
  facing: Facing;
}

export interface PredictionResponse {
  predicted_price: number;
}
