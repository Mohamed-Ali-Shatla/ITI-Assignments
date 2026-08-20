import { Link, useLocation, Navigate } from "react-router-dom";

function formatIndianPrice(value: number): string {
  if (value >= 1e7) return `₹ ${(value / 1e7).toFixed(2)} Cr`;
  if (value >= 1e5) return `₹ ${(value / 1e5).toFixed(2)} Lac`;
  return `₹ ${value.toLocaleString("en-IN")}`;
}

export default function ResultPage() {
  const location = useLocation() as { state?: { predictedPrice?: number } };
  const predictedPrice = location.state?.predictedPrice;

  if (predictedPrice === undefined) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page">
      <h1>Estimated Price</h1>
      <div className="result-card">
        <span className="result-value">{formatIndianPrice(predictedPrice)}</span>
        <span className="result-raw">
          ({predictedPrice.toLocaleString("en-IN")} INR)
        </span>
      </div>
      <Link className="back-link" to="/">
        ← Predict another property
      </Link>
    </div>
  );
}
