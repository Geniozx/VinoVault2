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
        } catch {
            setError("Unable to load wine details.");
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
        } catch {
            setImportError("Unable to import wine.");
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
        <main>
            <Link to="/wines/find">
                ← Back to Wine Search
            </Link>

            <h1>{wine.name}</h1>

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

            {wine.varietal && (
                <p>Varietal: {wine.varietal}</p>
            )}

            {wine.body && (
                <p>Body: {wine.body}</p>
            )}

            {wine.acidity && (
                <p>Acidity: {wine.acidity}</p>
            )}

            {wine.alcohol_content && (
                <p>Alcohol: {wine.alcohol_content}%</p>
            )}

            {wine.description && (
                <p>{wine.description}</p>
            )}

            {wine.external_rating && (
                <p>
                    Rating: {wine.external_rating} (
                    {wine.external_rating_count} ratings)
                </p>
            )}

            {wine.price_range && (
                <p>Price Range: {wine.price_range}</p>
            )}

            {wine.pairings?.length > 0 && (
                <div>
                    <h2>Food Pairings</h2>

                    <ul>
                        {wine.pairings.map((pairing) => (
                            <li key={pairing}>{pairing}</li>
                        ))}
                    </ul>
                </div>
            )}

            {importError && (
                <ErrorMessage message={importError} />
            )}

            {importedWine ? (
                <div>
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
                        {importing ? "Importing..." : "Import to VinoVault"}
                    </button>
                ) : (
                    <p>
                        <Link to="/login">
                            Log in
                        </Link>{" "}
                        to import this wine to VinoVault.
                    </p>
                )
            }
        </main>
    );
}

export default ExternalWineDetails;