import { useState } from "react";
import type { IGameFilters } from "../../interfaces/game";
import SemanticSearch from "../SemanticSearch/SemanticSearch";
import GameDetailList from "../GameDetailList/GameDetailList";
import SalesStackedBar from "../SalesStackedBar/SalesStackedBar";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const [currentGroup, setCurrentGroup] = useState<string>("genre");
  const [activeFilters, setActiveFilters] = useState<IGameFilters>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [triggeredSearch, setTriggeredSearch] = useState<string>("");

  const handleSearchClick = () => {
    setTriggeredSearch(searchQuery);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Game Sales Analytics</h1>

        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search for a game..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
            />
            <button className={styles.searchButton} onClick={handleSearchClick}>
              Search
            </button>
          </div>

          <div className={styles.menu}>
            <select
              className={styles.selectInput}
              value={currentGroup}
              onChange={(e) => {
                setCurrentGroup(e.target.value);
                setActiveFilters({});
                setTriggeredSearch("");
              }}
            >
              <option value="genre">By Genre</option>
              <option value="platform">By Platform</option>
              <option value="publisher">By Publisher</option>
            </select>
            <button
              className={styles.clearButton}
              onClick={() => {
                setActiveFilters({});
                setTriggeredSearch("");
                setSearchQuery("");
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </header>

      {/* Only show ElasticSearch when a search has been triggered */}
      {triggeredSearch && (
        <section className={styles.searchSection}>
          <SemanticSearch searchQuery={triggeredSearch} />
        </section>
      )}

      {/* Hide the overview if we are looking at search results */}
      {!triggeredSearch && (
        <>
          <section className={styles.overviewSection}>
            <SalesStackedBar
              group={currentGroup}
              onBarClick={(name) => setActiveFilters({ [currentGroup]: name })}
            />
          </section>

          <section className={styles.detailSection}>
            {Object.keys(activeFilters).length > 0 ? (
              <GameDetailList filters={activeFilters} />
            ) : (
              <p className={styles.emptyState}>
                Click on a bar to see details.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Dashboard;
