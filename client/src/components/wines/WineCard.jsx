import { Link } from "react-router-dom";


function WineCard({ wine }) {
  return (
    <article>
      {wine.image_url && (
        <img
          src={wine.image_url}
          alt={wine.name}
        />
      )}

      <h3>{wine.name}</h3>

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

      <Link to={`/wines/${wine.id}`}>
        View Details
      </Link>
    </article>
  );
}

export default WineCard;