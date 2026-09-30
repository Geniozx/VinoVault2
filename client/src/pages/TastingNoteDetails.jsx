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

    if (error && !note) {
        return (
            <main>
                <ErrorMessage message={error} />
                <Link to="/tasting-notes">
                    Back to My Tasting Notes
                </Link>
            </main>
        );
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
        <main className="tasting-note-details-page">
            <Link
                className="tasting-note-details-back-link"
                to="/tasting-notes"
            >
                Back to My Tasting Notes
            </Link>

            <section className="tasting-note-details-hero">
                <div className="tasting-note-details-hero-content">
                    <p className="tasting-note-details-eyebrow">
                        Tasting Journal
                    </p>

                    <h1>{note.wine.name}</h1>

                    <div className="tasting-note-details-wine-meta">
                        {note.wine.vintage && (
                            <p>{note.wine.vintage}</p>
                        )}

                        {note.wine.winery && (
                            <p>{note.wine.winery.name}</p>
                        )}
                    </div>
                </div>
            </section>

            <section className="tasting-note-details-grid">
                <article className="tasting-note-details-panel">
                    <div className="tasting-note-details-section-heading">
                        <p>Wine Details</p>
                        <h2>About This Wine</h2>
                    </div>

                    <div className="tasting-note-details-info-grid">
                        {note.wine.vintage && (
                            <div>
                            <span>Vintage</span>
                            <p>{note.wine.vintage}</p>
                            </div>
                        )}

                        {note.wine.winery && (
                            <div>
                            <span>Winery</span>
                            <p>{note.wine.winery.name}</p>
                            </div>
                        )}

                        {note.wine.region && (
                            <div>
                            <span>Region</span>

                            <p>
                                {note.wine.region.name}
                                {note.wine.region.country
                                ? `, ${note.wine.region.country}`
                                : ""}
                            </p>
                            </div>
                        )}
                    </div>
                </article>

                <article className="tasting-note-details-panel">
                    <div className="tasting-note-details-section-heading">
                        <p>Your Experience</p>
                        <h2>Your Tasting</h2>
                    </div>

                    <div className="tasting-note-details-info-grid">
                        <div className="tasting-note-details-rating">
                            <span>Rating</span>
                            <p>
                                <strong>{note.rating} / 5</strong>
                            </p>
                        </div>

                        {note.tasted_on && (
                            <div>
                                <span>Tasted On</span>
                                <p>{note.tasted_on}</p>
                            </div>
                        )}
                    </div>

                    {note.notes && (
                    <div className="tasting-note-details-notes">
                        <span>Tasting Notes</span>
                        <p>{note.notes}</p>
                    </div>
                    )}
                </article>
            </section>

            {error && (
                <ErrorMessage message={error} />
            )}

            <section className="tasting-note-details-actions">
                <Link to={`/tasting-notes/${note.id}/edit`}>
                    Edit Tasting Note
                </Link>

                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                >
                    {deleting
                    ? "Deleting..."
                    : "Delete Tasting Note"}
                </button>
            </section>
        </main>
    );
}


export default TastingNoteDetails;