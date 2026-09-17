import { useState } from "react";
import { Link } from "react-router-dom";

import EmptyState from "../components/ui/EmptyState";
import ErrorMessage from "../components/ui/ErrorMessage";
import Loading from "../components/ui/Loading";

import { searchExternalWines } from "../services/externalWineService";

function ExternalWineSearch() {
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
        <main className="external-search-page">
            <section className="external-search-hero">
                <div className="external-search-hero-content">
                    <p className="external-search-eyebrow">
                        Discover Beyond VinoVault
                    </p>

                    <h1>Find a Wine</h1>

                    <p className="external-search-description">
                        Search beyond the VinoVault catalog to discover new wines
                        and bring them into your collection.
                    </p>
                </div>
            </section>

            <section className="external-search-panel">
                <div className="external-search-panel-heading">
                    <p>Wine Database</p>
                    <h2>Search for a Wine</h2>
                </div>

                <form
                    className="external-search-form"
                    onSubmit={handleSubmit}
                >
                    <div className="external-search-field">
                        <label htmlFor="external-wine-search">
                            Wine Name
                        </label>

                        <div className="external-search-controls">
                            <input
                            id="external-wine-search"
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Try Opus One"
                            />

                            <button
                            type="submit"
                            disabled={loading}
                            >
                            {loading ? "Searching..." : "Search"}
                            </button>
                        </div>

                        <p className="external-search-helper">
                            Search by wine name to explore wines outside the
                            current VinoVault catalog.
                        </p>
                    </div>
                </form>
            </section>

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
                <EmptyState message="No wines found." />
            )}

            {!loading && !error && wines.length > 0 && (
            <section className="external-search-results">
                <div className="external-search-results-heading">
                    <div>
                        <p className="external-search-results-eyebrow">
                            Search Results
                        </p>

                        <h2>
                            {wines.length}{" "}
                            {wines.length === 1 ? "Wine" : "Wines"} Found
                        </h2>
                    </div>
                </div>

                <div className="external-search-grid">
                    {wines.map((wine) => (
                        <article
                        className="external-search-card"
                        key={wine.external_api_id}
                        >
                            <div className="external-search-card-heading">
                                <h3>{wine.name}</h3>

                                <div className="external-search-card-meta">
                                {wine.vintage && (
                                    <p>{wine.vintage}</p>
                                )}

                                {wine.winery && (
                                    <p>{wine.winery}</p>
                                )}
                                </div>
                            </div>

                            <div className="external-search-card-details">
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
                                <div className="external-search-card-rating">
                                    <span>Rating</span>

                                    <p>
                                    <strong>
                                        {wine.external_rating}
                                    </strong>

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

                            <div className="external-search-card-actions">
                                <Link
                                to={`/wines/find/${wine.external_api_id}`}
                                >
                                    View Wine
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
            )}
        </main>
    );
}

export default ExternalWineSearch;