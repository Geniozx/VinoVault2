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
    <main>
      <Link to="/browse">Back to Browse</Link>

      {wine.image_url && (
        <img
          src={wine.image_url}
          alt={wine.name}
        />
      )}

      <h2>{wine.name}</h2>

      {wine.vintage && (
        <p>Vintage: {wine.vintage}</p>
      )}

      {wine.winery && (
        <p>Winery: {wine.winery.name}</p>
      )}

      {wine.region && (
        <p>
          Region: {wine.region.name}, {wine.region.country}
        </p>
      )}

      <p>Type: {wine.wine_type}</p>

      {wine.varietal && (
        <p>Varietal: {wine.varietal}</p>
      )}

      {wine.description && (
        <p>{wine.description}</p>
      )}


      {isAuthenticated && (
        <section>
          <h3>Your Tasting Notes</h3>

          {tastingNotes.length === 0 ? (
            <p>You have not added a tasting note for this wine yet.</p>
          ) : (
            tastingNotes.map((note) => (
              <div key={note.id}>
                <p>Rating: {note.rating} / 5</p>

                {note.tasted_on && (
                  <p>Tasted On: {note.tasted_on}</p>
                )}

                <p>{note.notes}</p>

                <Link to={`/tasting-notes/${note.id}`}>
                  View Tasting Note
                </Link>
              </div>
            ))
          )}
        </section>
      )}


      {isAuthenticated ? (
        <Link to={`/cellar/add?wine=${wine.id}`}>
          Add to My Cellar
        </Link>
      ) : (
        <Link to="/login">
          Login to Add to Cellar
        </Link>
      )}

      {isAuthenticated && (
        <Link to={`/tasting-notes/add?wine=${wine.id}`}>
          Add Tasting Note
        </Link>
      )}
    </main>
  );
}

export default WineDetails;