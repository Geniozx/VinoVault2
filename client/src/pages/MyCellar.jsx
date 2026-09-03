import { useEffect, useState } from "react";

import EmptyState from "../components/ui/EmptyState";
import ErrorMessage from "../components/ui/ErrorMessage";
import Loading from "../components/ui/Loading";

import { getCellarEntries } from "../services/cellarService";
import CellarCard from "../components/cellar/CellarCard";

function MyCellar() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCellar() {
      try {
        const data = await getCellarEntries();
        setEntries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadCellar();
  }, []);

  return (
    <main>
      <h2>My Cellar</h2>

      {loading && <Loading message="Loading your cellar..." />}

      {error && <ErrorMessage message={error} />}

      {!loading && !error && entries.length === 0 && (
        <EmptyState message="Your cellar is empty." />
      )}

      {!loading && !error && entries.length > 0 && (
        <section>
          {entries.map((entry) => (
            <CellarCard
              key={entry.id}
              entry={entry}
            />
          ))}
        </section>
      )}
    </main>
  );
}

export default MyCellar;