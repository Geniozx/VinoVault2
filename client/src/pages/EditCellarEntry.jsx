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
    <main>
      <h2>Edit Cellar Entry</h2>

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
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <Link to={`/cellar/${id}`}>
        Cancel
      </Link>
    </main>
  );
}

export default EditCellarEntry;