import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="page">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link className="back-link" to="/">
        ← Go home
      </Link>
    </div>
  );
}
