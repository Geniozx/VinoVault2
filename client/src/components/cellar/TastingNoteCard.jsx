import { Link } from "react-router-dom";

function TastingNoteCard({ note }) {
  return (
    <article className="tasting-note-card">
      <div className="tasting-note-card-media">
        {note.wine.image_url ? (
          <img
            src={note.wine.image_url}
            alt={note.wine.name}
          />
        ) : (
          <div
            className="tasting-note-card-placeholder"
            aria-hidden="true"
          >
            🍷
          </div>
        )}
      </div>

      <div className="tasting-note-card-content">
        <div className="tasting-note-card-heading">
          <h3>{note.wine.name}</h3>

          <div className="tasting-note-card-wine-meta">
            {note.wine.vintage && (
              <p>{note.wine.vintage}</p>
            )}

            {note.wine.winery && (
              <p>{note.wine.winery.name}</p>
            )}
          </div>
        </div>

        <div className="tasting-note-card-details">
          {note.rating && (
            <div className="tasting-note-card-rating">
              <span>Rating</span>
              <strong>{note.rating} / 5</strong>
            </div>
          )}

          {note.tasted_on && (
            <div>
              <span>Tasted</span>
              <p>{note.tasted_on}</p>
            </div>
          )}
        </div>

        {note.notes && (
          <div className="tasting-note-card-notes">
            <span>Tasting Notes</span>
            <p>{note.notes}</p>
          </div>
        )}

        <div className="tasting-note-card-actions">
          <Link to={`/tasting-notes/${note.id}`}>
            View Tasting Note
          </Link>

          <Link to={`/wines/${note.wine.id}`}>
            View Wine
          </Link>
        </div>
      </div>
    </article>
  );
}

export default TastingNoteCard;