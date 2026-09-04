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
    <main>
      <Link to={`/tasting-notes/${id}`}>
        Back to Tasting Note
      </Link>

      <h2>Edit Tasting Note</h2>

      <h3>{note.wine.name}</h3>

      {error && (
        <ErrorMessage message={error} />
      )}

      <form onSubmit={handleSubmit}>
        <div>
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
        </div>

        <div>
          <label htmlFor="tastedOn">
            Tasting Date
          </label>

          <input
            id="tastedOn"
            type="date"
            value={tastedOn}
            onChange={(event) => setTastedOn(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="notes">
            Tasting Notes
          </label>

          <textarea
            id="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </main>
  );
}


export default EditTastingNote;