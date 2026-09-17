import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCellarEntries } from "../services/cellarService";
import { getTastingNotes } from "../services/tastingNoteService";

import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";


function Dashboard() {
    const [cellarEntries, setCellarEntries] = useState([]);
    const [tastingNotes, setTastingNotes] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        async function loadDashboard() {
        try {
            const [cellarData, tastingData] = await Promise.all([
            getCellarEntries(),
            getTastingNotes(),
            ]);

            setCellarEntries(cellarData);
            setTastingNotes(tastingData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        }

        loadDashboard();
    }, []);


    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }


    const totalBottles = cellarEntries.reduce(
        (total, entry) => total + entry.quantity,
        0
    );


    const recentCellarEntries = [...cellarEntries]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3);

    const recentTastingNotes = [...tastingNotes]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3);


    const wineTypeCounts = cellarEntries.reduce((counts, entry) => {
    const type = entry.wine.wine_type || "unknown";

        counts[type] = (counts[type] || 0) + 1;

        return counts;
    }, {});

    const averageRating =
        tastingNotes.length > 0
            ? (
                tastingNotes.reduce(
                (total, note) => total + Number(note.rating),
                0
                ) / tastingNotes.length
            ).toFixed(1)
            : null;


  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <p className="dashboard-eyebrow">
          Your VinoVault
        </p>

        <h1>Dashboard</h1>

        <p className="dashboard-description">
          Review your collection, tasting activity, and recent
          additions in one place.
        </p>
      </section>

      <section className="dashboard-overview">
        <div className="dashboard-section-heading">
          <div>
            <p className="dashboard-section-eyebrow">
              Collection Summary
            </p>

            <h2>Collection Overview</h2>
          </div>

          <Link to="/cellar">
            View My Cellar
          </Link>
        </div>

        <div className="dashboard-stats">
          <article>
            <p>Unique Wines</p>
            <strong>{cellarEntries.length}</strong>
          </article>

          <article>
            <p>Total Bottles</p>
            <strong>{totalBottles}</strong>
          </article>

          <article>
            <p>Tasting Notes</p>
            <strong>{tastingNotes.length}</strong>
          </article>

          <article>
            <p>Average Rating</p>
            <strong>
              {averageRating ? `${averageRating} / 5` : "—"}
            </strong>
          </article>
        </div>
      </section>

      <section className="dashboard-breakdown">
        <div className="dashboard-section-heading">
          <div>
            <p className="dashboard-section-eyebrow">
              Cellar Composition
            </p>

            <h2>Collection Breakdown</h2>
          </div>
        </div>

        {Object.keys(wineTypeCounts).length === 0 ? (
          <div className="dashboard-empty-state">
            <p>No collection data yet.</p>

            <Link to="/browse">
              Find Wines
            </Link>
          </div>
        ) : (
          <div className="dashboard-breakdown-grid">
            {Object.entries(wineTypeCounts).map(([type, count]) => (
              <article
                className="dashboard-breakdown-card"
                key={type}
              >
                <p>{type}</p>
                <strong>{count}</strong>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-recent-section">
        <div className="dashboard-section-heading">
          <div>
            <p className="dashboard-section-eyebrow">
              Recently Added
            </p>

            <h2>Recent Cellar Additions</h2>
          </div>

          <Link to="/cellar">
            View All
          </Link>
        </div>

        {recentCellarEntries.length === 0 ? (
          <div className="dashboard-empty-state">
            <p>No wines added to your cellar yet.</p>

            <Link to="/browse">
              Browse Wines
            </Link>
          </div>
        ) : (
          <div className="dashboard-recent-grid">
            {recentCellarEntries.map((entry) => (
              <article
                className="dashboard-recent-card"
                key={entry.id}
              >
                <h3>
                  {entry.wine.name}
                  {entry.wine.vintage
                    ? ` (${entry.wine.vintage})`
                    : ""}
                </h3>

                <p>
                  Quantity: {entry.quantity}
                </p>

                <Link to={`/cellar/${entry.id}`}>
                  View Cellar Entry
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-recent-section">
        <div className="dashboard-section-heading">
          <div>
            <p className="dashboard-section-eyebrow">
              Recent Activity
            </p>

            <h2>Recent Tasting Notes</h2>
          </div>

          <Link to="/tasting-notes">
            View All
          </Link>
        </div>

        {recentTastingNotes.length === 0 ? (
          <div className="dashboard-empty-state">
            <p>No tasting notes yet.</p>

            <Link to="/browse">
              Find a Wine
            </Link>
          </div>
        ) : (
          <div className="dashboard-recent-grid">
            {recentTastingNotes.map((note) => (
              <article
                className="dashboard-recent-card"
                key={note.id}
              >
                <h3>
                  {note.wine.name}
                  {note.wine.vintage
                    ? ` (${note.wine.vintage})`
                    : ""}
                </h3>

                <p>
                  Rating: {note.rating} / 5
                </p>

                <Link to={`/tasting-notes/${note.id}`}>
                  View Tasting Note
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-quick-actions">
        <div className="dashboard-section-heading">
          <div>
            <p className="dashboard-section-eyebrow">
              Keep Exploring
            </p>

            <h2>Quick Actions</h2>
          </div>
        </div>

        <div className="dashboard-actions">
          <Link to="/browse">
            Browse Wines
          </Link>

          <Link to="/cellar">
            View My Cellar
          </Link>

          <Link to="/tasting-notes">
            View Tasting Notes
          </Link>
        </div>
      </section>
    </main>
  );
}


export default Dashboard;