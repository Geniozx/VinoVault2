import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCellarEntries } from "../services/cellarService";
import { getTastingNotes } from "../services/tastingNoteService";

import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";


function Dashboard() {
    const [cellarEntries, setCellarEntries] = useState([]);
    const [tastingNotes, setTastingNotes] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        async function loadDashboard() {
        try {
            const [cellarData, tastingData] = await Promise.all([
            getCellarEntries(),
            getTastingNotes(),
            ]);

            setCellarEntries(cellarData);
            setTastingNotes(tastingData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        }

        loadDashboard();
    }, []);


    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }


    const totalBottles = cellarEntries.reduce(
        (total, entry) => total + entry.quantity,
        0
    );


    const recentCellarEntries = [...cellarEntries]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3);

    const recentTastingNotes = [...tastingNotes]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3);


    const wineTypeCounts = cellarEntries.reduce((counts, entry) => {
    const type = entry.wine.type || "unknown";

        counts[type] = (counts[type] || 0) + 1;

        return counts;
    }, {});

    const averageRating =
        tastingNotes.length > 0
            ? (
                tastingNotes.reduce(
                (total, note) => total + Number(note.rating),
                0
                ) / tastingNotes.length
            ).toFixed(1)
            : null;


    return (
        <main>
            <h2>Dashboard</h2>

            <section>
                <h3>Collection Overview</h3>

                <p>Unique Wines: {cellarEntries.length}</p>
                <p>Total Bottles: {totalBottles}</p>
                <p>Tasting Notes: {tastingNotes.length}</p>
            </section>


            <section>
                <h3>Collection by Wine Type</h3>

                {Object.keys(wineTypeCounts).length === 0 ? (
                    <p>No collection data yet.</p>
                ) : (
                    Object.entries(wineTypeCounts).map(([type, count]) => (
                    <p key={type}>
                        {type}: {count}
                    </p>
                    ))
                )}
            </section>

            <section>
                <h3>Tasting Summary</h3>

                {averageRating ? (
                    <p>Average Rating: {averageRating} / 5</p>
                ) : (
                    <p>No tasting ratings yet.</p>
                )}
            </section>


            <section>
                <h3>Recent Cellar Additions</h3>

                {recentCellarEntries.length === 0 ? (
                    <p>No wines added to your cellar yet.</p>
                ) : (
                    recentCellarEntries.map((entry) => (
                        <div key={entry.id}>
                            <p>
                            {entry.wine.name}
                            {entry.wine.vintage ? ` (${entry.wine.vintage})` : ""}
                            </p>

                            <p>Quantity: {entry.quantity}</p>

                            <Link to={`/cellar/${entry.id}`}>
                            View Cellar Entry
                            </Link>
                        </div>
                    ))
                )}
            </section>

            <section>
                <h3>Recent Tasting Notes</h3>

                {recentTastingNotes.length === 0 ? (
                    <p>No tasting notes yet.</p>
                ) : (
                    recentTastingNotes.map((note) => (
                        <div key={note.id}>
                            <p>
                            {note.wine.name}
                            {note.wine.vintage ? ` (${note.wine.vintage})` : ""}
                            </p>

                            <p>Rating: {note.rating} / 5</p>

                            <Link to={`/tasting-notes/${note.id}`}>
                            View Tasting Note
                            </Link>
                        </div>
                    ))
                )}
            </section>


            <section>
                <h3>Quick Actions</h3>

                <Link to="/browse">
                    Browse Wines
                </Link>

                <Link to="/cellar">
                    View My Cellar
                </Link>

                <Link to="/tasting-notes">
                    View Tasting Notes
                </Link>
            </section>
        </main>
    );
}


export default Dashboard;