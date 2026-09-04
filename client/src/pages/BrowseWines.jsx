import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import WineGrid from "../components/wines/WineGrid";
import EmptyState from "../components/ui/EmptyState";
import ErrorMessage from "../components/ui/ErrorMessage";
import Loading from "../components/ui/Loading";

import { getWines } from "../services/wineService";


function BrowseWines() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [wines, setWines] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [wineType, setWineType] = useState(
    searchParams.get("type") || ""
  );

  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") || "name-asc"
  );

  const [varietal, setVarietal] = useState(
    searchParams.get("varietal") || ""
  );

  const [region, setRegion] = useState(
    searchParams.get("region") || ""
  );

  const [country, setCountry] = useState(
    searchParams.get("country") || ""
  );

  const [vintage, setVintage] = useState(
    searchParams.get("vintage") || ""
  );

  useEffect(() => {
    const params = {};

    if (search) params.search = search;
    if (wineType) params.type = wineType;
    if (varietal) params.varietal = varietal;
    if (region) params.region = region;
    if (country) params.country = country;
    if (vintage) params.vintage = vintage;

    if (sortBy !== "name-asc") {
      params.sort = sortBy;
    }

    setSearchParams(params, { replace: true });
  }, [
    search,
    wineType,
    varietal,
    region,
    country,
    vintage,
    sortBy,
    setSearchParams,
  ]);


  const varietals = useMemo(() => {
    return [...new Set(
      wines
        .map((wine) => wine.varietal)
        .filter(Boolean)
    )].sort();
  }, [wines]);

  const regions = useMemo(() => {
    return [...new Set(
      wines
        .map((wine) => wine.region?.name)
        .filter(Boolean)
    )].sort();
  }, [wines]);

  const countries = useMemo(() => {
    return [...new Set(
      wines
        .map((wine) => wine.region?.country)
        .filter(Boolean)
    )].sort();
  }, [wines]);


  const vintages = useMemo(() => {
    return [...new Set(
      wines
        .map((wine) => wine.vintage)
        .filter(Boolean)
    )].sort((a, b) => b - a);
  }, [wines]);



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
    const filtered = wines.filter((wine) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        wine.name.toLowerCase().includes(searchValue) ||
        wine.varietal?.toLowerCase().includes(searchValue) ||
        wine.winery?.name.toLowerCase().includes(searchValue) ||
        wine.region?.name.toLowerCase().includes(searchValue) ||
        wine.region?.country.toLowerCase().includes(searchValue);

      const matchesType =
        !wineType || wine.wine_type === wineType;

      const matchesVarietal =
        !varietal || wine.varietal === varietal;

      const matchesRegion =
        !region || wine.region?.name === region;

      const matchesCountry =
        !country || wine.region?.country === country;

      const matchesVintage = 
        !vintage || wine.vintage === Number(vintage);

      return (
        matchesSearch &&
        matchesType &&
        matchesVarietal &&
        matchesRegion &&
        matchesCountry &&
        matchesVintage
      );
    });

    return filtered.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }

      if (sortBy === "vintage-newest") {
        return (b.vintage || 0) - (a.vintage || 0);
      }

      if (sortBy === "vintage-oldest") {
        return (a.vintage || 0) - (b.vintage || 0);
      }

      return 0;
    });
  }, [
    wines,
    search,
    wineType,
    varietal,
    region,
    country,
    vintage,
    sortBy,
  ]);

  function clearFilters() {
    setSearch("");
    setWineType("");
    setSortBy("name-asc");
    setVarietal("");
    setRegion("");
    setCountry("");
    setVintage("");
  }


  const hasActiveFilters =
  search ||
  wineType ||
  varietal ||
  region ||
  country ||
  vintage ||
  sortBy !== "name-asc";


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


      <div>
        <label htmlFor="wine-sort">
          Sort By
        </label>

        <select
          id="wine-sort"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="name-asc">Name A–Z</option>
          <option value="name-desc">Name Z–A</option>
          <option value="vintage-newest">Vintage Newest</option>
          <option value="vintage-oldest">Vintage Oldest</option>
        </select>
      </div>


      <div>
        <label htmlFor="varietal">
          Varietal
        </label>

        <select
          id="varietal"
          value={varietal}
          onChange={(event) => setVarietal(event.target.value)}
        >
          <option value="">All Varietals</option>

          {varietals.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="region">
          Region
        </label>

        <select
          id="region"
          value={region}
          onChange={(event) => setRegion(event.target.value)}
        >
          <option value="">All Regions</option>

          {regions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="country">
          Country
        </label>

        <select
          id="country"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
        >
          <option value="">All Countries</option>

          {countries.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>


      <div>
        <label htmlFor="vintage">
          Vintage
        </label>

        <select
          id="vintage"
          value={vintage}
          onChange={(event) => setVintage(event.target.value)}
        >
          <option value="">All Vintages</option>

          {vintages.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>


      {!loading && !error && (
        <div>
          <p>
            Showing {filteredWines.length} of {wines.length} wine
            {wines.length === 1 ? "" : "s"}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {loading && <Loading message="Loading wines..." />}

      {error && <ErrorMessage message={error} />}

      {!loading && !error && filteredWines.length === 0 && (
        <EmptyState message="No wines match your search." />
      )}

      {!loading && !error && filteredWines.length > 0 && (
        <WineGrid wines={filteredWines} />
      )}

    </main>
  );
}

export default BrowseWines;