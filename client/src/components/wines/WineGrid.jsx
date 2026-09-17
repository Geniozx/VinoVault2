import WineCard from "./WineCard";

function WineGrid({ wines }) {
  return (
    <div className="wine-grid">
      {wines.map((wine) => (
        <WineCard
          key={wine.id}
          wine={wine}
        />
      ))}
    </div>
  );
}

export default WineGrid;