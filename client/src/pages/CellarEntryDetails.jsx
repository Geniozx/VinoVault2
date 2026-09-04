import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import ErrorMessage from "../components/ui/ErrorMessage";
import Loading from "../components/ui/Loading";

import { 
  deleteCellarEntry,
  getCellarEntryById,
} from "../services/cellarService";


function CellarEntryDetails() {
  const { id } = useParams();

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadEntry() {
      try {
        const data = await getCellarEntryById(id);
        setEntry(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEntry();
  }, [id]);

  if (loading) {
    return (
      <main>
        <Loading message="Loading cellar entry..." />
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <ErrorMessage message={error} />
        <Link to="/cellar">Back to My Cellar</Link>
      </main>
    );
  }


  async function handleDelete() {
    const confirmed = window.confirm(
      "Remove this wine from your cellar?"
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await deleteCellarEntry(id);
      navigate("/cellar");
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }


  return (
    <main>
      <Link to="/cellar">Back to My Cellar</Link>

      <h2>{entry.wine.name}</h2>

      {entry.wine.vintage && (
        <p>Vintage: {entry.wine.vintage}</p>
      )}

      {entry.wine.winery && (
        <p>Winery: {entry.wine.winery.name}</p>
      )}

      {entry.wine.region && (
        <p>
          Region: {entry.wine.region.name}, {entry.wine.region.country}
        </p>
      )}

      <p>Type: {entry.wine.wine_type}</p>

      {entry.wine.varietal && (
        <p>Varietal: {entry.wine.varietal}</p>
      )}

      <hr />

      <h3>Cellar Information</h3>

      <p>Quantity: {entry.quantity}</p>

      {entry.purchase_date && (
        <p>Purchase Date: {entry.purchase_date}</p>
      )}

      {entry.purchase_price && (
        <p>Purchase Price: ${entry.purchase_price}</p>
      )}

      {entry.storage_location && (
        <p>Storage Location: {entry.storage_location}</p>
      )}

      {entry.personal_notes && (
        <p>Notes: {entry.personal_notes}</p>
      )}

      <Link to={`/cellar/${entry.id}/edit`}>
        Edit Entry
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? "Removing..." : "Remove from Cellar"}
      </button>
    </main>
  );
}

export default CellarEntryDetails;