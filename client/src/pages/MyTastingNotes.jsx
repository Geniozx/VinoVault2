import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getTastingNotes } from "../services/tastingNoteService";

import TastingNoteCard from "../components/cellar/TastingNoteCard";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyState from "../components/ui/EmptyState";

function MyTastingNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTastingNotes() {
      try {
        const data = await getTastingNotes();
        setNotes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTastingNotes();
  }, []);

  return (
    <main className="tasting-notes-page">
      <section className="tasting-notes-header">
        <div className="tasting-notes-header-content">
          <p className="tasting-notes-eyebrow">
            Your Tasting Journal
          </p>

          <h1>My Tasting Notes</h1>

          <p className="tasting-notes-description">
            Keep track of the wines you have tasted, your ratings,
            and the impressions you want to remember.
          </p>
        </div>

        <Link
          className="tasting-notes-find-link"
          to="/browse"
        >
          Find a Wine
        </Link>
      </section>

      {loading && (
        <Loading message="Loading your tasting notes..." />
      )}

      {error && (
        <ErrorMessage message={error} />
      )}

      {!loading && !error && notes.length === 0 && (
        <section className="tasting-notes-empty-state">
          <EmptyState message="You have not added any tasting notes yet." />

          <p>
            Browse the catalog to find a wine and record your first
            tasting note.
          </p>

          <Link to="/browse">
            Browse Wines
          </Link>
        </section>
      )}

      {!loading && !error && notes.length > 0 && (
        <section className="tasting-notes-collection">
          <div className="tasting-notes-section-heading">
            <div>
              <p className="tasting-notes-section-eyebrow">
                Tasting History
              </p>

              <h2>
                {notes.length}{" "}
                {notes.length === 1
                  ? "Tasting Note"
                  : "Tasting Notes"}
              </h2>
            </div>
          </div>

          <div className="tasting-notes-grid">
            {notes.map((note) => (
              <TastingNoteCard
                key={note.id}
                note={note}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default MyTastingNotes;