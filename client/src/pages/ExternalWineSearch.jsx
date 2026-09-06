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
        <main>
            <h1>Find a Wine</h1>

            <p>
                Search for wines outside your current VinoVault catalog.
            </p>

            <form onSubmit={handleSubmit}>
                <label htmlFor="external-wine-search">
                    Wine Name
                </label>

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
            </form>

            {loading && <Loading />}

            {error && <ErrorMessage message={error} />}

            {!loading &&
                !error &&
                hasSearched &&
                wines.length === 0 && (
                    <EmptyState message="No wines found." />
                )
            }

            {!loading && !error && wines.length > 0 && (
                <div>
                    <p>
                        {wines.length} result{wines.length === 1 ? "" : "s"}
                    </p>

                    {wines.map((wine) => (
                        <article key={wine.external_api_id}>
                            <h2>{wine.name}</h2>

                            {wine.vintage && (
                                <p>Vintage: {wine.vintage}</p>
                            )}

                            {wine.winery && (
                                <p>Winery: {wine.winery}</p>
                            )}

                            {wine.region && (
                                <p>
                                    Region: {wine.region}
                                    {wine.country ? `, ${wine.country}` : ""}
                                </p>
                            )}

                            {wine.wine_type && (
                                <p>Type: {wine.wine_type}</p>
                            )}

                            {wine.external_rating && (
                                <p>
                                    Rating: {wine.external_rating} (
                                    {wine.external_rating_count} ratings)
                                </p>
                            )}

                            <Link to={`/wines/find/${wine.external_api_id}`}>
                                View Details
                            </Link>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}

export default ExternalWineSearch;