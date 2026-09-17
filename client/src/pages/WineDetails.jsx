import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getWineById } from "../services/wineService";
import { getTastingNotes } from "../services/tastingNoteService";
import { useAuth } from "../context/useAuth";


function WineDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [wine, setWine] = useState(null);
  const [tastingNotes, setTastingNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWine() {
      try {
        const data = await getWineById(id);
        setWine(data);

        if (isAuthenticated) {
          try {
            const notes = await getTastingNotes();

            const wineNotes = notes.filter(
              (note) => note.wine.id === Number(id)
            );

            setTastingNotes(wineNotes);
          } catch {
            setTastingNotes([]);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadWine();
  }, [id, isAuthenticated]);


  if (loading) {
    return (
      <main>
        <p>Loading wine...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <p>{error}</p>
        <Link to="/browse">Back to Browse</Link>
      </main>
    );
  }

  return (
    <main className="wine-details-page">
      <Link
        className="wine-details-back-link"
        to="/browse"
      >
        Back to Browse
      </Link>

      <section className="wine-details-hero">
        <div className="wine-details-media">
          {wine.image_url ? (
            <img
              src={wine.image_url}
              alt={wine.name}
            />
          ) : (
            <div className="wine-details-placeholder">
              <span aria-hidden="true">🍷</span>
            </div>
          )}
        </div>

        <div className="wine-details-hero-content">
          <p className="wine-details-eyebrow">
            Wine Profile
          </p>

          <h1>{wine.name}</h1>

          <div className="wine-details-identity">
            {wine.vintage && (
              <p>{wine.vintage}</p>
            )}

            {wine.winery && (
              <p>{wine.winery.name}</p>
            )}

            {wine.region && (
              <p>
                {wine.region.name}
                {wine.region.country
                  ? `, ${wine.region.country}`
                  : ""}
              </p>
            )}
          </div>

          {wine.description && (
            <p className="wine-details-description">
              {wine.description}
            </p>
          )}
        </div>
      </section>

      <div className="wine-details-content-grid">    
        <section className="wine-details-profile">
          <div className="wine-details-section-heading">
            <p>At a Glance</p>
            <h2>Wine Details</h2>
          </div>

          <div className="wine-details-profile-grid">
            <div>
              <span>Type</span>
              <p>{wine.wine_type}</p>
            </div>

            {wine.varietal && (
              <div>
                <span>Varietal</span>
                <p>{wine.varietal}</p>
              </div>
            )}

            {wine.body && (
              <div>
                <span>Body</span>
                <p>{wine.body}</p>
              </div>
            )}

            {wine.acidity && (
              <div>
                <span>Acidity</span>
                <p>{wine.acidity}</p>
              </div>
            )}

            {wine.alcohol_content && (
              <div>
                <span>Alcohol</span>
                <p>{wine.alcohol_content}%</p>
              </div>
            )}
          </div>
        </section>

        {isAuthenticated && (
          <section className="wine-details-tasting">
            <div className="wine-details-section-heading">
              <p>Your Journal</p>
              <h2>Your Tasting Notes</h2>
            </div>

            {tastingNotes.length === 0 ? (
              <div className="wine-details-tasting-empty">
                <p>
                  You have not added a tasting note for this wine yet.
                </p>

                <Link
                  to={`/tasting-notes/add?wine=${wine.id}`}
                >
                  Add Tasting Note
                </Link>
              </div>
            ) : (
              <div className="wine-details-tasting-grid">
                {tastingNotes.map((note) => (
                  <article
                    className="wine-details-tasting-card"
                    key={note.id}
                  >
                    <div className="wine-details-tasting-meta">
                      <div>
                        <span>Rating</span>
                        <p className="wine-details-tasting-rating">
                          {note.rating} / 5
                        </p>
                      </div>

                      {note.tasted_on && (
                        <div>
                          <span>Tasted On</span>
                          <p>{note.tasted_on}</p>
                        </div>
                      )}
                    </div>

                    <p className="wine-details-tasting-notes">
                      {note.notes}
                    </p>

                    <Link to={`/tasting-notes/${note.id}`}>
                      View Tasting Note
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </ div>

      <section className="wine-details-actions">
        {isAuthenticated ? (
          <>
            <div className="wine-details-actions-content">
              <p>Make It Yours</p>
              <h2>Add This Wine</h2>
              <p>
                Save it to your cellar or record your experience
                in your tasting journal.
              </p>
            </div>

            <div className="wine-details-action-links">
              <Link
                className="wine-details-primary-action"
                to={`/cellar/add?wine=${wine.id}`}
              >
                Add to My Cellar
              </Link>

              <Link
                className="wine-details-secondary-action"
                to={`/tasting-notes/add?wine=${wine.id}`}
              >
                Add Tasting Note
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="wine-details-actions-content">
              <p>Build Your Collection</p>
              <h2>Save Your Wine Journey</h2>
              <p>
                Sign in to save this wine to your cellar and record
                your tasting notes.
              </p>
            </div>

            <div className="wine-details-action-links">
              <Link
                className="wine-details-primary-action"
                to="/login"
              >
                Sign In
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default WineDetails;