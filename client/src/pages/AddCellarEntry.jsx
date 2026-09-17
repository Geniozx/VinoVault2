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
    <main className="add-cellar-page">
      <section className="add-cellar-header">
        <div>
          <p className="add-cellar-eyebrow">
            Cellar Management
          </p>

          <h1>Add to My Cellar</h1>

          {wine && (
            <div className="add-cellar-wine-summary">
              <h2>{wine.name}</h2>

              <div>
                {wine.vintage && (
                  <p>{wine.vintage}</p>
                )}

                {wine.winery && (
                  <p>{wine.winery.name}</p>
                )}
              </div>
            </div>
          )}

          <p className="add-cellar-description">
            Add this wine to your collection and record any purchase
            or storage details you want to keep.
          </p>
        </div>
      </section>

      {error && (
        <ErrorMessage message={error} />
      )}

      <form
        className="add-cellar-form"
        onSubmit={handleSubmit}
      >
        <section className="add-cellar-form-section">
          <div className="add-cellar-section-heading">
            <p>Collection Details</p>
            <h2>Inventory Information</h2>
          </div>

          <div className="add-cellar-form-grid">
            <div className="add-cellar-field">
              <label htmlFor="quantity">
                Quantity
              </label>

              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                required
              />
            </div>

            <div className="add-cellar-field">
              <label htmlFor="purchase-date">
                Purchase Date <span>(Optional)</span>
              </label>

              <input
                id="purchase-date"
                type="date"
                value={purchaseDate}
                onChange={(event) => setPurchaseDate(event.target.value)}
              />
            </div>

            <div className="add-cellar-field">
              <label htmlFor="purchase-price">
                Purchase Price <span>(Optional)</span>
              </label>

              <input
                id="purchase-price"
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={purchasePrice}
                onChange={(event) => setPurchasePrice(event.target.value)}
              />
            </div>

            <div className="add-cellar-field">
              <label htmlFor="storage-location">
                Storage Location <span>(Optional)</span>
              </label>

              <input
                id="storage-location"
                type="text"
                value={storageLocation}
                onChange={(event) => setStorageLocation(event.target.value)}
              />

              <p className="add-cellar-helper">
                Example: Wine fridge, rack 2, kitchen cabinet.
              </p>
            </div>
          </div>
        </section>

        <section className="add-cellar-form-section">
          <div className="add-cellar-section-heading">
            <p>Personal Details</p>
            <h2>Notes</h2>
          </div>

          <div className="add-cellar-field">
            <label htmlFor="personal-notes">
              Personal Notes <span>(Optional)</span>
            </label>

            <textarea
              id="personal-notes"
              rows="6"
              value={personalNotes}
              onChange={(event) => setPersonalNotes(event.target.value)}
            />
          </div>
        </section>

        <div className="add-cellar-actions">
          <button
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Adding..." : "Add to Cellar"}
          </button>

          <Link to={`/wines/${wine.id}`}>
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}

export default AddCellarEntry;