import { useState } from 'react';

import type { IGameFilters } from '../../interfaces/game';
import GameDetailList from '../GameDetailList/GameDetailList';
import GameDetails from '../GameDetails/GameDetails';
import SalesStackedBar from '../SalesStackedBar/SalesStackedBar';
import SemanticSearch from '../SemanticSearch/SemanticSearch';

import styles from './Dashboard.module.css';

interface DashboardProps {
  user: { username: string; avatar?: string; email?: string };
  onLogout: () => void;
}

/**
 * Dashboard component that contains the different data visualisation components.
 */
function Dashboard({ user, onLogout }: DashboardProps) {
  const [currentGroup, setCurrentGroup] = useState<string>('genre');
  const [activeFilters, setActiveFilters] = useState<IGameFilters>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [triggeredSearch, setTriggeredSearch] = useState<string>('');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const handleSearchClick = () => {
    setSelectedGameId(null);
    setTriggeredSearch(searchQuery);
    setActiveFilters({});
  };

  const handleClearAll = () => {
    setActiveFilters({});
    setTriggeredSearch('');
    setSearchQuery('');
    setSelectedGameId(null);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1
          className={styles.title}
          onClick={handleClearAll}
          style={{ cursor: 'pointer' }}
        >
          Game Sales Analytics
        </h1>

        

        <div className={styles.searchContainer}>
          <div className={styles.userInfo}>
          <span>{user.username}</span>
          <button className={styles.logoutButton} onClick={onLogout}>
            Logout
          </button>
        </div>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search for a game..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
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
                handleClearAll();
              }}
            >
              <option value="genre">By Genre</option>
              <option value="platform">By Platform</option>
              <option value="publisher">By Publisher</option>
            </select>
            <button className={styles.clearButton} onClick={handleClearAll}>
              Clear
            </button>
          </div>
        </div>
      </header>

      <main>
        {selectedGameId ? (
          <section className={styles.detailSection}>
            <button
              className={styles.clearButton}
              onClick={() => setSelectedGameId(null)}
              style={{ marginBottom: '1.5rem' }}
            >
              ← Back to Results
            </button>
            <GameDetails gameId={selectedGameId} />
          </section>
        ) : triggeredSearch ? (
          /* SEARCH RESULTS VIEW */
          <section className={styles.searchSection}>
            <SemanticSearch
              searchQuery={triggeredSearch}
              onGameClick={(id) => {
                if (id) {
                  console.log('Navigating to Game ID:', id);
                  setSelectedGameId(id);
                } else {
                  console.error(
                    'Error: Received an undefined ID from the chart click.',
                  );
                }
              }}
            />
          </section>
        ) : (
          /* DEFAULT DASHBOARD VIEW */
          <>
            <section className={styles.overviewSection}>
              <SalesStackedBar
                group={currentGroup}
                onBarClick={(name) =>
                  setActiveFilters({ [currentGroup]: name })
                }
              />
            </section>

            <section className={styles.detailSection}>
              {Object.keys(activeFilters).length > 0 ? (
                <GameDetailList
                  filters={activeFilters}
                  onBarClick={(id) => {
                    if (id) {
                      console.log('Navigating to Game ID:', id);
                      setSelectedGameId(id);
                    } else {
                      console.error(
                        'Error: Received an undefined ID from the chart click.',
                      );
                    }
                  }}
                />
              ) : (
                <p className={styles.emptyState}>
                  Click on a bar to see details.
                </p>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
