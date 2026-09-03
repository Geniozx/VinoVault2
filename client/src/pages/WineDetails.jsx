import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getWineById } from "../services/wineService";
import { useAuth } from "../context/useAuth";


function WineDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [wine, setWine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWine() {
      try {
        const data = await getWineById(id);
        setWine(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadWine();
  }, [id]);

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


      {isAuthenticated ? (
        <Link to={`/cellar/add?wine=${wine.id}`}>
          Add to My Cellar
        </Link>
      ) : (
        <Link to="/login">
          Login to Add to Cellar
        </Link>
      )}
    </main>
  );
}

export default WineDetails;