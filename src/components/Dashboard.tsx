import { useState } from "react";
import type { IGameFilters } from "../interfaces/game";
import GameDetailList from "./GameDetailList"; // Import your detailed view
import SalesStackedBar from "./SalesStackedBar";

function Dashboard() {
  const [currentGroup, setCurrentGroup] = useState<string>("genre");
  const [activeFilters, setActiveFilters] = useState<IGameFilters>({});

  const handleGroupChange = (newGroup: string) => {
    setCurrentGroup(newGroup);
    setActiveFilters({});
  };

  const handleChartClick = (name: string) => {
    setActiveFilters({ [currentGroup]: name });
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Game Sales Analytics</h1>
        <select
          value={currentGroup}
          onChange={(e) => handleGroupChange(e.target.value)}
        >
          <option value="genre">By Genre</option>
          <option value="platform">By Platform</option>
          <option value="publisher">By Publisher</option>
        </select>
      </header>

      <section className="overview-section">
        <SalesStackedBar group={currentGroup} onBarClick={handleChartClick} />
      </section>

      <hr />

      <section className="detail-section">
        {Object.keys(activeFilters).length > 0 ? (
          <>
            <button onClick={() => setActiveFilters({})}>
              Clear Selection
            </button>
            <GameDetailList filters={activeFilters} />
          </>
        ) : (
          <p>Click on a bar in the chart to see specific game details.</p>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
