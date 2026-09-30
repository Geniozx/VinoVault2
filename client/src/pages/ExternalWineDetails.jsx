import { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";

import { AuthContext } from "../context/authContext";

import EmptyState from "../components/ui/EmptyState";
import ErrorMessage from "../components/ui/ErrorMessage";
import Loading from "../components/ui/Loading";

import {
    getExternalWineDetails,
    importExternalWine,
} from "../services/externalWineService";

function ExternalWineDetails() {
    const { externalId } = useParams();
    const { isAuthenticated } = useContext(AuthContext);

    const [wine, setWine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [importing, setImporting] = useState(false);
    const [importError, setImportError] = useState("");
    const [importedWine, setImportedWine] = useState(null);

    useEffect(() => {
        async function fetchWine() {
        try {
            setLoading(true);
            setError("");

            const data = await getExternalWineDetails(externalId);

            setWine(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        }

        fetchWine();
    }, [externalId]);

    async function handleImport() {
        try {
            setImporting(true);
            setImportError("");

            const data = await importExternalWine(externalId);

            setImportedWine(data);
        } catch (err) {
            setImportError(err.message);
        } finally {
            setImporting(false);
        }
        }

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (!wine) {
        return <EmptyState message="Wine not found." />;
    }

    return (
        <main className="external-wine-details-page">
            <Link
            className="external-wine-details-back-link"
            to="/wines/find"
            >
                ← Back to Wine Search
            </Link>

            <section className="external-wine-details-hero">
                <div className="external-wine-details-hero-content">
                    <p className="external-wine-details-eyebrow">
                        External Wine Discovery
                    </p>

                    <h1>{wine.name}</h1>

                    <div className="external-wine-details-identity">
                        {wine.vintage && <span>{wine.vintage}</span>}

                        {wine.winery && <span>{wine.winery}</span>}

                        {wine.region && (
                            <span>
                            {wine.region}
                            {wine.country ? `, ${wine.country}` : ""}
                            </span>
                        )}
                    </div>

                    {wine.description && (
                        <p className="external-wine-details-description">
                            {wine.description}
                        </p>
                    )}
                </div>
            </section>

            <div className="external-wine-details-content-grid">
                <section className="external-wine-details-profile">
                    <div className="external-wine-details-section-heading">
                        <p>At a Glance</p>
                        <h2>Wine Details</h2>
                    </div>

                    <div className="external-wine-details-profile-grid">
                        {wine.wine_type && (
                            <div>
                                <span>Type</span>
                                <p>{wine.wine_type}</p>
                            </div>
                        )}

                        {wine.varietal && (
                            <div>
                                <span>Varietal</span>
                                <p>{wine.varietal}</p>
                            </div>
                        )}

                        {wine.body && (
                            <div>
                                <span>Body</span>
                                <p>{wine.body}</p>
                            </div>
                        )}

                        {wine.acidity && (
                            <div>
                                <span>Acidity</span>
                                <p>{wine.acidity}</p>
                            </div>
                        )}

                        {wine.alcohol_content && (
                            <div>
                                <span>Alcohol</span>
                                <p>{wine.alcohol_content}%</p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="external-wine-details-market">
                    <div className="external-wine-details-section-heading">
                        <p>Wine Database</p>
                        <h2>External Insights</h2>
                    </div>

                    <div className="external-wine-details-market-grid">
                        {wine.external_rating != null && (
                            <div className="external-wine-details-rating">
                                <span>Rating</span>

                                <p>
                                    <strong>{wine.external_rating}</strong>

                                    {wine.external_rating_count != null && (
                                    <> ({wine.external_rating_count} ratings)</>
                                    )}
                                </p>
                            </div>
                        )}

                        {wine.price_range && (
                            <div>
                                <span>Price Range</span>
                                <p>{wine.price_range}</p>
                            </div>
                        )}
                    </div>

                    {wine.pairings?.length > 0 && (
                    <div className="external-wine-details-pairings">
                        <span>Food Pairings</span>

                        <div className="external-wine-details-pairing-list">
                            {wine.pairings.map((pairing) => (
                                <span key={pairing}>{pairing}</span>
                            ))}
                        </div>
                    </div>
                    )}
                </section>
                </div>

                <section className="external-wine-details-import">
                <div className="external-wine-details-import-content">
                    <p className="external-wine-details-import-eyebrow">
                    Add to VinoVault
                    </p>

                    <h2>Bring This Wine Into Your Collection</h2>

                    <p>
                    Add this wine to the VinoVault catalog so you can track it
                    in your cellar and record your tasting experiences.
                    </p>
                </div>

                <div className="external-wine-details-import-action">
                    {importError && (
                    <ErrorMessage message={importError} />
                    )}

                    {importedWine ? (
                    <div className="external-wine-details-import-success">
                        <p>Wine added to VinoVault.</p>

                        <Link to={`/wines/${importedWine.id}`}>
                        View in VinoVault
                        </Link>
                    </div>
                    ) : isAuthenticated ? (
                    <button
                        type="button"
                        onClick={handleImport}
                        disabled={importing}
                    >
                        {importing
                        ? "Importing..."
                        : "Import to VinoVault"}
                    </button>
                    ) : (
                    <div className="external-wine-details-login">
                        <p>
                        Sign in to add this wine to your VinoVault
                        collection.
                        </p>

                        <Link to="/login">
                        Sign In
                        </Link>
                    </div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default ExternalWineDetails;