import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="not-found-page">
      <section className="not-found-panel">
        <div className="not-found-content">
          <p className="not-found-code">404</p>

          <p className="not-found-eyebrow">
            Lost in the Cellar
          </p>

          <h1>This Bottle Isn't Here</h1>

          <p className="not-found-description">
            The page you're looking for may have been moved,
            removed, or never made it into the VinoVault.
          </p>

          <div className="not-found-actions">
            <Link
              className="not-found-primary"
              to="/"
            >
              Return Home
            </Link>

            <Link
              className="not-found-secondary"
              to="/browse"
            >
              Browse Wines
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default NotFound;