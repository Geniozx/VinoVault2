import { useEffect, useState } from "react";
import { 
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { createTastingNote } from "../services/tastingNoteService";
import { getWineById } from "../services/wineService";

import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";


function AddTastingNote() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const wineId = searchParams.get("wine");

  const [wine, setWine] = useState(null);
  const [rating, setRating] = useState("");
  const [notes, setNotes] = useState("");
  const [tastedOn, setTastedOn] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    async function loadWine() {
      if (!wineId) {
        setError("No wine selected.");
        setLoading(false);
        return;
      }

      try {
        const data = await getWineById(wineId);
        setWine(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadWine();
  }, [wineId]);


  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const tastingNote = await createTastingNote({
        wine_id: Number(wineId),
        rating: Number(rating),
        notes,
        tasted_on: tastedOn || null,
      });

      navigate(`/tasting-notes/${tastingNote.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }


  if (loading) {
    return <Loading />;
  }

  if (error && !wine) {
    return <ErrorMessage message={error} />;
  }


  return (
    <main className="add-tasting-note-page">
      <section className="add-tasting-note-header">
        <div>
          <p className="add-tasting-note-eyebrow">
            Tasting Journal
          </p>

          <h1>Add Tasting Note</h1>

          {wine && (
            <div className="add-tasting-note-wine-summary">
              <h2>{wine.name}</h2>

              <div>
                {wine.vintage && (
                  <p>{wine.vintage}</p>
                )}

                {wine.winery && (
                  <p>{wine.winery.name}</p>
                )}
              </div>
            </div>
          )}

          <p className="add-tasting-note-description">
            Record your rating and tasting impressions for this wine.
          </p>
        </div>
      </section>

      {error && (
        <ErrorMessage message={error} />
      )}

      <form
        className="add-tasting-note-form"
        onSubmit={handleSubmit}
      >
        <div className="add-tasting-note-form-layout">
          <section className="add-tasting-note-form-section">
            <div className="add-tasting-note-section-heading">
              <p>Your Experience</p>
              <h2>Tasting Details</h2>
            </div>

            <div className="add-tasting-note-form-grid">
              <div className="add-tasting-note-field add-tasting-note-rating-field">
                <label htmlFor="rating">
                  Rating
                </label>

                <input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(event) => setRating(event.target.value)}
                  required
                />

                <p className="add-tasting-note-helper">
                  Rate this wine from 1 to 5.
                </p>
              </div>

              <div className="add-tasting-note-field add-tasting-note-date-field">
                <label htmlFor="tastedOn">
                  Tasting Date <span>(Optional)</span>
                </label>

                <input
                  id="tastedOn"
                  type="date"
                  value={tastedOn}
                  onChange={(event) => setTastedOn(event.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="add-tasting-note-form-section">
            <div className="add-tasting-note-section-heading">
              <p>Your Impressions</p>
              <h2>Tasting Notes</h2>
            </div>

            <div className="add-tasting-note-field">
              <label htmlFor="notes">
                Notes
              </label>

              <textarea
                id="notes"
                rows="7"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                required
              />

              <p className="add-tasting-note-helper">
                Describe what stood out, such as aroma, flavor,
                finish, or overall impression.
              </p>
            </div>
          </section>
        </div>

        <div className="add-tasting-note-actions">
          <button
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : "Save Tasting Note"}
          </button>

          <Link to={`/wines/${wine.id}`}>
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}


export default AddTastingNote;