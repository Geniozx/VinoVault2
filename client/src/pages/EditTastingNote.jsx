import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getTastingNoteById,
  updateTastingNote,
} from "../services/tastingNoteService";

import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";


function EditTastingNote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);

  const [rating, setRating] = useState("");
  const [tastedOn, setTastedOn] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    async function loadTastingNote() {
      try {
        const data = await getTastingNoteById(id);

        setNote(data);
        setRating(data.rating ?? "");
        setTastedOn(data.tasted_on ?? "");
        setNotes(data.notes ?? "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTastingNote();
  }, [id]);


  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      await updateTastingNote(id, {
        rating: Number(rating),
        tasted_on: tastedOn || null,
        notes,
      });

      navigate(`/tasting-notes/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }


  if (loading) {
    return <Loading />;
  }

  if (error && !note) {
    return <ErrorMessage message={error} />;
  }


  return (
    <main className="edit-tasting-note-page">
      <Link
        className="edit-tasting-note-back-link"
        to={`/tasting-notes/${id}`}
      >
        Back to Tasting Note
      </Link>

      <section className="edit-tasting-note-header">
        <div>
          <p className="edit-tasting-note-eyebrow">
            Tasting Journal
          </p>

          <h1>Edit Tasting Note</h1>

          {note?.wine && (
            <div className="edit-tasting-note-wine-summary">
              <h2>{note.wine.name}</h2>

              <div>
                {note.wine.vintage && (
                  <p>{note.wine.vintage}</p>
                )}

                {note.wine.winery && (
                  <p>{note.wine.winery.name}</p>
                )}
              </div>
            </div>
          )}

          <p className="edit-tasting-note-description">
            Update your rating, tasting date, or notes for this wine.
          </p>
        </div>
      </section>

      {error && (
        <ErrorMessage message={error} />
      )}

      <form
        className="edit-tasting-note-form"
        onSubmit={handleSubmit}
      >
        <div className="edit-tasting-note-form-layout">
          <section className="edit-tasting-note-form-section">
            <div className="edit-tasting-note-section-heading">
              <p>Your Experience</p>
              <h2>Tasting Details</h2>
            </div>

            <div className="edit-tasting-note-form-grid">
              <div className="edit-tasting-note-field edit-tasting-note-rating-field">
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

                <p className="edit-tasting-note-helper">
                  Rate this wine from 1 to 5.
                </p>
              </div>

              <div className="edit-tasting-note-field edit-tasting-note-date-field">
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

          <section className="edit-tasting-note-form-section">
            <div className="edit-tasting-note-section-heading">
              <p>Your Impressions</p>
              <h2>Tasting Notes</h2>
            </div>

            <div className="edit-tasting-note-field">
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

              <p className="edit-tasting-note-helper">
                Describe what stood out, such as aroma, flavor,
                finish, or overall impression.
              </p>
            </div>
          </section>
        </div>

        <div className="edit-tasting-note-actions">
          <button
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : "Save Changes"}
          </button>

          <Link to={`/tasting-notes/${id}`}>
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}


export default EditTastingNote;