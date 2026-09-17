import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
    <main className="cellar-page">
      <section className="cellar-header">
        <div className="cellar-header-content">
          <p className="cellar-eyebrow">
            Your Collection
          </p>

          <h1>My Cellar</h1>

          <p className="cellar-description">
            Manage the wines in your collection and keep track of
            what you have on hand.
          </p>
        </div>

        <Link
          className="cellar-add-link"
          to="/browse"
        >
          Add Wine
        </Link>
      </section>

      {loading && (
        <Loading message="Loading your cellar..." />
      )}

      {error && (
        <ErrorMessage message={error} />
      )}

      {!loading && !error && entries.length === 0 && (
        <section className="cellar-empty-state">
          <EmptyState message="Your cellar is empty." />

          <p>
            Browse the catalog to find your first bottle.
          </p>

          <Link to="/browse">
            Browse Wines
          </Link>
        </section>
      )}

      {!loading && !error && entries.length > 0 && (
        <section className="cellar-collection">
          <div className="cellar-section-heading">
            <div>
              <p className="cellar-section-eyebrow">
                In Your Cellar
              </p>

              <h2>
                {entries.length}{" "}
                {entries.length === 1 ? "Wine" : "Wines"}
              </h2>
            </div>
          </div>

          <div className="cellar-grid">
            {entries.map((entry) => (
              <CellarCard
                key={entry.id}
                entry={entry}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default MyCellar;