import { Link } from "react-router-dom";

function TastingNoteCard({ note }) {
  return (
    <article>
      <h3>{note.wine.name}</h3>

      {note.wine.vintage && (
        <p>Vintage: {note.wine.vintage}</p>
      )}

      {note.rating && (
        <p>Rating: {note.rating} / 5</p>
      )}

      {note.tasted_on && (
        <p>Tasted: {note.tasted_on}</p>
      )}

      <p>{note.notes}</p>

      <Link to={`/tasting-notes/${note.id}`}>
        View Tasting Note
      </Link>
    </article>
  );
}

export default TastingNoteCard;