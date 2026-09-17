import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import ErrorMessage from "../components/ui/ErrorMessage";
import Loading from "../components/ui/Loading";
import {
  getCellarEntryById,
  updateCellarEntry,
} from "../services/cellarService";

function EditCellarEntry() {
  const { id } = useParams();
  const navigate = useNavigate();

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
    async function loadEntry() {
      try {
        const entry = await getCellarEntryById(id);

        setWine(entry.wine);
        setQuantity(entry.quantity);
        setPurchaseDate(entry.purchase_date || "");
        setPurchasePrice(entry.purchase_price || "");
        setStorageLocation(entry.storage_location || "");
        setPersonalNotes(entry.personal_notes || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEntry();
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await updateCellarEntry(id, {
        quantity: Number(quantity),
        purchase_date: purchaseDate || null,
        purchase_price: purchasePrice || null,
        storage_location: storageLocation,
        personal_notes: personalNotes,
      });

      navigate(`/cellar/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main>
        <Loading message="Loading cellar entry..." />
      </main>
    );
  }



  return (
    <main className="edit-cellar-page">
      <section className="edit-cellar-header">
        <div>
          <p className="edit-cellar-eyebrow">
            Cellar Management
          </p>

          <h1>Edit Cellar Entry</h1>

          {wine && (
            <div className="edit-cellar-wine-summary">
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

          <p className="edit-cellar-description">
            Update the quantity, purchase information, storage
            location, or personal notes for this cellar entry.
          </p>
        </div>
      </section>

      {error && (
        <ErrorMessage message={error} />
      )}

      <form
        className="edit-cellar-form"
        onSubmit={handleSubmit}
      >
        <section className="edit-cellar-form-section">
          <div className="edit-cellar-section-heading">
            <p>Collection Details</p>
            <h2>Inventory Information</h2>
          </div>

          <div className="edit-cellar-form-grid">
            <div className="edit-cellar-field">
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

            <div className="edit-cellar-field">
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

            <div className="edit-cellar-field">
              <label htmlFor="purchase-price">
                Purchase Price <span>(Optional)</span>
              </label>

              <input
                id="purchase-price"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={purchasePrice}
                onChange={(event) => setPurchasePrice(event.target.value)}
              />
            </div>

            <div className="edit-cellar-field">
              <label htmlFor="storage-location">
                Storage Location <span>(Optional)</span>
              </label>

              <input
                id="storage-location"
                type="text"
                value={storageLocation}
                onChange={(event) => setStorageLocation(event.target.value)}
              />

              <p className="edit-cellar-helper">
                Example: Wine fridge, rack 2, kitchen cabinet.
              </p>
            </div>
          </div>
        </section>

        <section className="edit-cellar-form-section">
          <div className="edit-cellar-section-heading">
            <p>Personal Details</p>
            <h2>Notes</h2>
          </div>

          <div className="edit-cellar-field">
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

        <div className="edit-cellar-actions">
          <button
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>

          <Link to={`/cellar/${id}`}>
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}

export default EditCellarEntry;