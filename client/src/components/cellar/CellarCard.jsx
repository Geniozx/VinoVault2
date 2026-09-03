import { Link } from "react-router-dom";

function CellarCard({ entry }) {
  return (
    <article>
      <h3>{entry.wine.name}</h3>

      {entry.wine.vintage && (
        <p>Vintage: {entry.wine.vintage}</p>
      )}

      {entry.wine.winery && (
        <p>Winery: {entry.wine.winery.name}</p>
      )}

      <p>Quantity: {entry.quantity}</p>

      {entry.storage_location && (
        <p>Storage: {entry.storage_location}</p>
      )}

      <Link to={`/cellar/${entry.id}`}>
        View Details
      </Link>
    </article>
  );
}

export default CellarCard;