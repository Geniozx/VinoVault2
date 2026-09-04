import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
    <main>
      <h2>Add Tasting Note</h2>

      <h3>{wine.name}</h3>

      {wine.vintage && (
        <p>Vintage: {wine.vintage}</p>
      )}

      {wine.winery && (
        <p>Winery: {wine.winery.name}</p>
      )}

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
          {submitting ? "Saving..." : "Save Tasting Note"}
        </button>
      </form>
    </main>
  );
}


export default AddTastingNote;