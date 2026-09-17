import { Link } from "react-router-dom";

function WineCard({ wine }) {
  return (
    <article className="wine-card">
      <div className="wine-card-media">
        {wine.image_url ? (
          <img
            src={wine.image_url}
            alt={wine.name}
          />
        ) : (
          <div className="wine-card-placeholder">
            <span aria-hidden="true">🍷</span>
          </div>
        )}
      </div>

      <div className="wine-card-content">
        <div className="wine-card-heading">
          <h3>{wine.name}</h3>

          <div className="wine-card-wine-meta">
            {wine.vintage && (
              <p>{wine.vintage}</p>
            )}

            {wine.winery && (
              <p>{wine.winery.name}</p>
            )}
          </div>
        </div>

        <div className="wine-card-details">
          {wine.region && (
            <div>
              <span>Region</span>
              <p>
                {wine.region.name}
                {wine.region.country &&
                  `, ${wine.region.country}`}
              </p>
            </div>
          )}

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
        </div>

        <div className="wine-card-actions">
          <Link to={`/wines/${wine.id}`}>
            View Wine
          </Link>
        </div>
      </div>
    </article>
  );
}

export default WineCard;