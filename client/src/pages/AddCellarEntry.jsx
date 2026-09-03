import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import ErrorMessage from "../components/ui/ErrorMessage";
import Loading from "../components/ui/Loading";
import { createCellarEntry } from "../services/cellarService";
import { getWineById } from "../services/wineService";

function AddCellarEntry() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const wineId = searchParams.get("wine");

  const [wine, setWine] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [storageLocation, setStorageLocation] = useState("");
  const [personalNotes, setPersonalNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWine() {
      if (!wineId) {
        setError("No wine selected.");
        setLoading(false);
        return;
      }

      try {
        const data = await getWineById(wineId);
        setWine(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadWine();
  }, [wineId]);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const entry = await createCellarEntry({
        wine_id: Number(wineId),
        quantity: Number(quantity),
        purchase_date: purchaseDate || null,
        purchase_price: purchasePrice || null,
        storage_location: storageLocation,
        personal_notes: personalNotes,
      });

      navigate(`/cellar/${entry.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main>
        <Loading message="Loading wine..." />
      </main>
    );
  }

  if (error && !wine) {
    return (
      <main>
        <ErrorMessage message={error} />
        <Link to="/browse">Back to Browse</Link>
      </main>
    );
  }

  return (
    <main>
      <h2>Add to My Cellar</h2>

      <h3>{wine.name}</h3>

      {wine.vintage && (
        <p>Vintage: {wine.vintage}</p>
      )}

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="purchase-date">Purchase Date</label>
          <input
            id="purchase-date"
            type="date"
            value={purchaseDate}
            onChange={(event) => setPurchaseDate(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="purchase-price">Purchase Price</label>
          <input
            id="purchase-price"
            type="number"
            min="0"
            step="0.01"
            value={purchasePrice}
            onChange={(event) => setPurchasePrice(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="storage-location">Storage Location</label>
          <input
            id="storage-location"
            type="text"
            value={storageLocation}
            onChange={(event) => setStorageLocation(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="personal-notes">Personal Notes</label>
          <textarea
            id="personal-notes"
            value={personalNotes}
            onChange={(event) => setPersonalNotes(event.target.value)}
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add to Cellar"}
        </button>
      </form>

      <Link to={`/wines/${wine.id}`}>
        Cancel
      </Link>
    </main>
  );
}

export default AddCellarEntry;