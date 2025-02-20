import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container container-narrow">
      <div className="card">
        <h1>404 — Page not found</h1>
        <p className="muted">The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">
          Back to catalog
        </Link>
      </div>
    </div>
  );
}
