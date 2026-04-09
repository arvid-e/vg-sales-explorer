import { useState } from "react";
import type { IGameFilters } from "../../interfaces/game";
import GameDetailList from "../GameDetailList/GameDetailList";
import SalesStackedBar from "../SalesStackedBar/SalesStackedBar";
import styles from "./Dashboard.module.css";

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
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Game Sales Analytics</h1>
        <div className={styles.menu}>
          <select
            className={styles.selectInput}
            value={currentGroup}
            onChange={(e) => handleGroupChange(e.target.value)}
          >
            <option value="genre">By Genre</option>
            <option value="platform">By Platform</option>
            <option value="publisher">By Publisher</option>
          </select>
          <button
            className={styles.clearButton}
            onClick={() => setActiveFilters({})}
          >
            Clear Selection
          </button>
        </div>
      </header>

      <section className={styles.overviewSection}>
        <SalesStackedBar group={currentGroup} onBarClick={handleChartClick} />
      </section>

      <section className={styles.detailSection}>
        {Object.keys(activeFilters).length > 0 ? (
          <>
            <GameDetailList filters={activeFilters} />
          </>
        ) : (
          <p className={styles.emptyState}>
            Click on a bar in the chart to see specific game details.
          </p>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
