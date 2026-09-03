import WineCard from "./WineCard";


function WineGrid({ wines }) {
  return (
    <section>
      {wines.map((wine) => (
        <WineCard
          key={wine.id}
          wine={wine}
        />
      ))}
    </section>
  );
}

export default WineGrid;