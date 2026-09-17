import { Link } from "react-router-dom";

function CellarCard({ entry }) {
  return (
    <article className="cellar-card">
      <div className="cellar-card-media">
        {entry.wine.image_url ? (
          <img
            src={entry.wine.image_url}
            alt={entry.wine.name}
          />
        ) : (
          <div
            className="cellar-card-placeholder"
            aria-hidden="true"
          >
            🍷
          </div>
        )}
      </div>

      <div className="cellar-card-content">
        <div className="cellar-card-heading">
          <h3>{entry.wine.name}</h3>

          {entry.wine.vintage && (
            <p>{entry.wine.vintage}</p>
          )}
        </div>

        <div className="cellar-card-details">
          {entry.wine.winery && (
            <p>
              <span>Winery</span>
              {entry.wine.winery.name}
            </p>
          )}

          <p>
            <span>Quantity</span>
            {entry.quantity}
          </p>

          {entry.storage_location && (
            <p>
              <span>Storage</span>
              {entry.storage_location}
            </p>
          )}
        </div>

        <div className="cellar-card-actions">
          <Link to={`/cellar/${entry.id}`}>
            View Cellar Entry
          </Link>

          <Link to={`/wines/${entry.wine.id}`}>
            View Wine
          </Link>
        </div>
      </div>
    </article>
  );
}

export default CellarCard;