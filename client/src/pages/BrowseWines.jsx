import { useEffect, useState, useMemo } from "react";

import WineGrid from "../components/wines/WineGrid";
import EmptyState from "../components/ui/EmptyState";
import ErrorMessage from "../components/ui/ErrorMessage";
import Loading from "../components/ui/Loading";

import { getWines } from "../services/wineService";


function BrowseWines() {
  const [wines, setWines] = useState([]);
  const [search, setSearch] = useState("");
  const [wineType, setWineType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWines() {
      try {
        const data = await getWines();
        setWines(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadWines();
  }, []);


  const filteredWines = useMemo(() => {
    return wines.filter((wine) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        wine.name.toLowerCase().includes(searchValue) ||
        wine.varietal?.toLowerCase().includes(searchValue) ||
        wine.winery?.name.toLowerCase().includes(searchValue) ||
        wine.region?.name.toLowerCase().includes(searchValue) ||
        wine.region?.country.toLowerCase().includes(searchValue);

      const matchesType =
        !wineType || wine.wine_type === wineType;

      return matchesSearch && matchesType;
    });
  }, [wines, search, wineType]);


  return (
    <main>
      <h2>Browse Wines</h2>

      <div>
        <label htmlFor="wine-search">
          Search Wines
        </label>

        <input
          id="wine-search"
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by wine, varietal, winery, region..."
        />
      </div>

      <div>
        <label htmlFor="wine-type">
          Wine Type
        </label>

        <select
          id="wine-type"
          value={wineType}
          onChange={(event) => setWineType(event.target.value)}
        >
          <option value="">All Types</option>
          <option value="red">Red</option>
          <option value="white">White</option>
          <option value="rose">Rosé</option>
          <option value="sparkling">Sparkling</option>
          <option value="dessert">Dessert</option>
          <option value="fortified">Fortified</option>
        </select>
      </div>

      {loading && <Loading message="Loading wines..." />}

      {error && <ErrorMessage message={error} />}

      {!loading && !error && filteredWines.length === 0 && (
        <EmptyState message="No wines match your search." />
      )}

      {!loading && !error && filteredWines.length > 0 && (
        <WineGrid wines={filteredWines} />
      )}

      <WineGrid wines={filteredWines} />
    </main>
  );
}

export default BrowseWines;