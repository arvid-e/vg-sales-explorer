import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import type { IGameDetails } from "../../interfaces/game";
import { semanticSearch } from "../../services/api";
import styles from "./SemanticSearch.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface ElasticSearchProps {
  searchQuery: string;
  onGameClick: (gameId: string) => void;
}

function SemanticSearch({ searchQuery, onGameClick }: ElasticSearchProps) {
  const [details, setDetails] = useState<IGameDetails[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      if (!searchQuery) return;
      try {
        setLoading(true);
        const response = await semanticSearch(searchQuery);
        setDetails(response);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [searchQuery]);

  if (loading)
    return (
      <div style={{ textAlign: "center", color: "#10b981" }}>Searching...</div>
    );

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Results for: "{searchQuery}"</h3>

      {details.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.headerRow}>
                <th className={styles.headerCell}>Name</th>
                <th className={styles.headerCell}>Platform</th>
                <th className={styles.headerCell}>Global Sales</th>
              </tr>
            </thead>
            <tbody>
              {details.map((game) => (
                <tr
                  key={game.gameId}
                  className={styles.row}
                  onClick={() => onGameClick(game.gameId)}
                >
                  <td className={`${styles.cell} ${styles.nameCell}`}>
                    {game.name}
                  </td>
                  <td className={`${styles.cell} ${styles.platformCell}`}>
                    {game.platform?.name || "Unknown"}
                  </td>
                  <td className={`${styles.cell} ${styles.salesCell}`}>
                    {game.sales.global.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className={styles.noResults}>No results found.</p>
      )}
    </div>
  );
}

export default SemanticSearch;
