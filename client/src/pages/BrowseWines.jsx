import { useEffect, useState } from "react";

import { getWines } from "../services/wineService";


function BrowseWines() {
  const [wines, setWines] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWines() {
      try {
        const data = await getWines();
        setWines(data);
      } catch (err) {
        setError(err.message);
      }
    }

    loadWines();
  }, []);

  return (
    <main>
      <h2>Browse Wines</h2>

      {error && <p>{error}</p>}

      {wines.map((wine) => (
        <p key={wine.id}>
          {wine.name}
        </p>
      ))}
    </main>
  );
}

export default BrowseWines;