import { useEffect, useState } from "react";

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


  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (notes.length === 0) {
    return (
      <EmptyState message="You have not added any tasting notes yet." />
    );
  }


  return (
    <main>
      <h2>My Tasting Notes</h2>

      <section>
        {notes.map((note) => (
          <TastingNoteCard
            key={note.id}
            note={note}
          />
        ))}
      </section>
    </main>
  );
}


export default MyTastingNotes;