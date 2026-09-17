import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import ErrorMessage from "../components/ui/ErrorMessage";
import Loading from "../components/ui/Loading";

import { 
  deleteCellarEntry,
  getCellarEntryById,
} from "../services/cellarService";


function CellarEntryDetails() {
  const { id } = useParams();

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadEntry() {
      try {
        const data = await getCellarEntryById(id);
        setEntry(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEntry();
  }, [id]);

  if (loading) {
    return (
      <main>
        <Loading message="Loading cellar entry..." />
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <ErrorMessage message={error} />
        <Link to="/cellar">Back to My Cellar</Link>
      </main>
    );
  }


  async function handleDelete() {
    const confirmed = window.confirm(
      "Remove this wine from your cellar?"
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await deleteCellarEntry(id);
      navigate("/cellar");
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }


  return (
    <main className="cellar-entry-page">
      <Link
        className="cellar-entry-back-link"
        to="/cellar"
      >
        Back to My Cellar
      </Link>

      <section className="cellar-entry-hero">
        <div className="cellar-entry-hero-content">
          <p className="cellar-entry-eyebrow">
            Cellar Entry
          </p>

          <h1>{entry.wine.name}</h1>

          {entry.wine.vintage && (
            <p className="cellar-entry-vintage">
              {entry.wine.vintage}
            </p>
          )}

          {entry.wine.winery && (
            <p className="cellar-entry-winery">
              {entry.wine.winery.name}
            </p>
          )}
        </div>
      </section>

      <section className="cellar-entry-details-grid">
        <article className="cellar-entry-panel">
          <div className="cellar-entry-section-heading">
            <p className="cellar-entry-section-eyebrow">
              Wine Details
            </p>

            <h2>About This Wine</h2>
          </div>

          <div className="cellar-entry-info-grid">
            {entry.wine.region && (
              <div>
                <span>Region</span>
                <p>
                  {entry.wine.region.name}, {entry.wine.region.country}
                </p>
              </div>
            )}

            <div>
              <span>Type</span>
              <p>{entry.wine.wine_type}</p>
            </div>

            {entry.wine.varietal && (
              <div>
                <span>Varietal</span>
                <p>{entry.wine.varietal}</p>
              </div>
            )}
          </div>
        </article>

        <article className="cellar-entry-panel">
          <div className="cellar-entry-section-heading">
            <p className="cellar-entry-section-eyebrow">
              Collection Details
            </p>

            <h2>Cellar Information</h2>
          </div>

          <div className="cellar-entry-info-grid">
            <div>
              <span>Quantity</span>
              <p>{entry.quantity}</p>
            </div>

            {entry.purchase_date && (
              <div>
                <span>Purchase Date</span>
                <p>{entry.purchase_date}</p>
              </div>
            )}

            {entry.purchase_price && (
              <div>
                <span>Purchase Price</span>
                <p>${entry.purchase_price}</p>
              </div>
            )}

            {entry.storage_location && (
              <div>
                <span>Storage Location</span>
                <p>{entry.storage_location}</p>
              </div>
            )}
          </div>

          {entry.personal_notes && (
            <div className="cellar-entry-notes">
              <span>Personal Notes</span>
              <p>{entry.personal_notes}</p>
            </div>
          )}
        </article>
      </section>

      <section className="cellar-entry-actions">
        <Link to={`/cellar/${entry.id}/edit`}>
          Edit Entry
        </Link>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "Removing..." : "Remove from Cellar"}
        </button>
      </section>
    </main>
  );
}

export default CellarEntryDetails;