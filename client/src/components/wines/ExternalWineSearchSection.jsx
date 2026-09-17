import { useState } from "react";
import { Link } from "react-router-dom";

import EmptyState from "../ui/EmptyState";
import ErrorMessage from "../ui/ErrorMessage";
import Loading from "../ui/Loading";

import { searchExternalWines } from "../../services/externalWineService";

function ExternalWineSearchSection() {
  const [query, setQuery] = useState("");
  const [wines, setWines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const searchQuery = query.trim();

    if (!searchQuery) {
      setError("Enter a wine name.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setHasSearched(true);

      const data = await searchExternalWines(searchQuery);

      setWines(data);
    } catch {
      setError("Unable to search wines right now.");
      setWines([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="external-wine-section">
      <div className="external-wine-header">
        <div>
          <p className="external-wine-eyebrow">
            Expand Your Search
          </p>

          <h2>Find More Wines</h2>

          <p className="external-wine-description">
            Search beyond the VinoVault catalog and discover wines
            you can import into your collection.
          </p>
        </div>
      </div>

      <form
        className="external-wine-search-form"
        onSubmit={handleSubmit}
      >
        <div className="external-wine-search-field">
          <label htmlFor="external-wine-search">
            Search Wine Database
          </label>

          <div className="external-wine-search-controls">
            <input
              id="external-wine-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try Opus One"
            />

            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          <p className="external-wine-search-helper">
            Search by wine name to explore wines outside your
            current catalog.
          </p>
        </div>
      </form>

      {loading && (
        <Loading message="Searching wines..." />
      )}

      {error && (
        <ErrorMessage message={error} />
      )}

      {!loading &&
        !error &&
        hasSearched &&
        wines.length === 0 && (
          <EmptyState message="No external wines found." />
        )}

      {!loading && !error && wines.length > 0 && (
        <div className="external-wine-results">
          <div className="external-wine-results-heading">
            <div>
              <p className="external-wine-results-eyebrow">
                Search Results
              </p>

              <h3>
                {wines.length}{" "}
                {wines.length === 1 ? "Wine" : "Wines"} Found
              </h3>
            </div>
          </div>

          <div className="external-wine-grid">
            {wines.map((wine) => (
              <article
                className="external-wine-card"
                key={wine.external_api_id}
              >
                <div className="external-wine-card-heading">
                  <h3>{wine.name}</h3>

                  <div className="external-wine-card-meta">
                    {wine.vintage && (
                      <p>{wine.vintage}</p>
                    )}

                    {wine.winery && (
                      <p>{wine.winery}</p>
                    )}
                  </div>
                </div>

                <div className="external-wine-card-details">
                  {wine.region && (
                    <div>
                      <span>Region</span>

                      <p>
                        {wine.region}
                        {wine.country
                          ? `, ${wine.country}`
                          : ""}
                      </p>
                    </div>
                  )}

                  {wine.wine_type && (
                    <div>
                      <span>Type</span>
                      <p>{wine.wine_type}</p>
                    </div>
                  )}

                  {wine.external_rating && (
                    <div className="external-wine-card-rating">
                      <span>Rating</span>

                      <p>
                        <strong>{wine.external_rating}</strong>

                        {wine.external_rating_count != null && (
                          <>
                            {" "}
                            ({wine.external_rating_count} ratings)
                          </>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                <div className="external-wine-card-actions">
                  <Link
                    to={`/wines/find/${wine.external_api_id}`}
                  >
                    View Wine
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default ExternalWineSearchSection;