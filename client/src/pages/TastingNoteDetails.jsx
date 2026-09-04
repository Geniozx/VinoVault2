import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import { 
    getTastingNoteById,
    deleteTastingNote,
} from "../services/tastingNoteService";

import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";


function TastingNoteDetails() {
    const { id } = useParams();

    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);


    useEffect(() => {
        async function loadTastingNote() {
        try {
            const data = await getTastingNoteById(id);
            setNote(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        }

        loadTastingNote();
    }, [id]);


    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (!note) {
        return <ErrorMessage message="Tasting note not found." />;
    }


    async function handleDelete() {
        const confirmed = window.confirm(
            "Delete this tasting note?"
        );

        if (!confirmed) {
            return;
        }

        setDeleting(true);
        setError("");

        try {
            await deleteTastingNote(id);
            navigate("/tasting-notes");
        } catch (err) {
            setError(err.message);
        } finally {
            setDeleting(false);
        }
    }


    return (
        <main>
            <Link to="/tasting-notes">
                Back to My Tasting Notes
            </Link>

            <h2>Tasting Note</h2>

            <section>
                <h3>{note.wine.name}</h3>

                {note.wine.vintage && (
                <p>Vintage: {note.wine.vintage}</p>
                )}

                {note.wine.winery && (
                <p>Winery: {note.wine.winery.name}</p>
                )}

                {note.wine.region && (
                <p>
                    Region: {note.wine.region.name}
                    {note.wine.region.country
                    ? `, ${note.wine.region.country}`
                    : ""}
                </p>
                )}
            </section>

            <section>
                <h3>Your Tasting</h3>

                <p>Rating: {note.rating} / 5</p>

                {note.tasted_on && (
                <p>Tasted On: {note.tasted_on}</p>
                )}

                <p>{note.notes}</p>
            </section>

            <Link to={`/tasting-notes/${note.id}/edit`}>
                Edit Tasting Note
            </Link>


            <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                >
                {deleting ? "Deleting..." : "Delete Tasting Note"}
            </button>
        </main>
    );
}


export default TastingNoteDetails;