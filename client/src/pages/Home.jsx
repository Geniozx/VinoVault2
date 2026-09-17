import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/useAuth";
import { getCellarEntries } from "../services/cellarService";
import { getTastingNotes } from "../services/tastingNoteService";

function Home() {
  const { isAuthenticated, user } = useAuth();

  const [cellarEntries, setCellarEntries] = useState([]);
  const [tastingNotes, setTastingNotes] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    async function loadSummary() {
      try {
        setLoadingSummary(true);
        setSummaryError("");

        const [cellarData, tastingData] = await Promise.all([
          getCellarEntries(),
          getTastingNotes(),
        ]);

        setCellarEntries(cellarData);
        setTastingNotes(tastingData);
      } catch (err) {
        setSummaryError(err.message);
      } finally {
        setLoadingSummary(false);
      }
    }

    loadSummary();
  }, [isAuthenticated]);


  const totalBottles = cellarEntries.reduce(
    (total, entry) => total + entry.quantity,
    0
  );

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
    <main
      className={
        isAuthenticated
          ? "member-home"
          : "public-home"
      }
    >
      <section
        className={
          isAuthenticated
            ? "member-home-hero-section"
            : "public-home-hero-section"
        }
      >
        {isAuthenticated ? (
          <div className="member-home-hero">
            <div className="member-home-hero-content">
              <p className="member-home-eyebrow">
                Welcome Back
              </p>

              <h1>
                Welcome to VinoVault
                {user?.username ? `, ${user.username}` : ""}.
              </h1>

              <p className="member-home-description">
                Manage your cellar, record your tasting notes,
                and discover your next bottle.
              </p>

              <div className="member-home-actions">
                <Link to="/dashboard">
                  Go to Dashboard
                </Link>

                <Link to="/browse">
                  Browse Wines
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="public-home-hero">
            <div className="public-home-overlay">
              <div className="public-home-content">
                <p className="public-home-eyebrow">
                  More Than a Collection
                </p>

                <h1>
                  A Deeper Sip Awaits
                </h1>

                <p className="public-home-description">
                  VinoVault helps you discover, track, and remember
                  the wines that make life more meaningful.
                </p>

                <div className="public-home-actions">
                  <Link to="/register">
                    Get Started
                  </Link>

                  <Link to="/browse">
                    Learn More
                  </Link>
                </div>

                <p className="public-home-tagline">
                  Great wine. Lasting memories.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {!isAuthenticated && (
        <section className="public-home-features">
          <article>
            <h3>Track Your Collection</h3>
            <p>
              Keep every bottle in one place.
            </p>
          </article>

          <article>
            <h3>Discover New Wines</h3>
            <p>
              Explore new regions, varietals, and vintages.
            </p>
          </article>

          <article>
            <h3>Log Tasting Notes</h3>
            <p>
              Capture what you love and remember every pour.
            </p>
          </article>

          <article>
            <h3>See Your Journey</h3>
            <p>
              Turn your collection and tasting history into insight.
            </p>
          </article>
        </section>
      )}

      {isAuthenticated && (
        <>
          <section className="member-home-summary">
            <div className="member-home-section-heading">
              <div>
                <p className="member-home-section-eyebrow">
                  Your Collection
                </p>

                <h2>Your VinoVault</h2>
              </div>

              <Link to="/dashboard">
                View Full Dashboard
              </Link>
            </div>

            {loadingSummary && (
              <p>Loading your collection...</p>
            )}

            {summaryError && (
              <p>Unable to load your collection summary.</p>
            )}

            {!loadingSummary && !summaryError && (
              <div className="member-home-stats">
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
            )}
          </section>

          <section className="member-home-journey">
            <div className="member-home-section-heading">
              <div>
                <p className="member-home-section-eyebrow">
                  Explore VinoVault
                </p>

                <h2>Continue Your Wine Journey</h2>
              </div>
            </div>

            <div className="member-home-journey-grid">
              <article className="member-home-journey-card">
                <h3>My Cellar</h3>
                <p>
                  View and manage the wines currently in your
                  collection.
                </p>

                <Link to="/cellar">
                  View My Cellar
                </Link>
              </article>

              <article className="member-home-journey-card">
                <h3>Tasting Notes</h3>
                <p>
                  Revisit your ratings and tasting experiences.
                </p>

                <Link to="/tasting-notes">
                  View Tasting Notes
                </Link>
              </article>

              <article className="member-home-journey-card">
                <h3>Discover More</h3>
                <p>
                  Browse the catalog or search for additional
                  wines to add to VinoVault.
                </p>

                <Link to="/browse">
                  Discover Wines
                </Link>
              </article>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default Home;