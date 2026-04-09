import type { ActiveElement, ChartEvent } from "chart.js";
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
import { Bar } from "react-chartjs-2";
import type { IGameDetails } from "../../interfaces/game";
import { semanticSearch } from "../../services/api";

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

  const topResults = [...details];

  const data = {
    labels: topResults.map((game) => game.name),
    datasets: [
      {
        label: "Global Sales",
        data: topResults.map((game) => game.sales.global),
        backgroundColor: "#10b981",
        borderRadius: 4,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    onHover: (event: ChartEvent, elements: ActiveElement[]) => {
      const target = event.native?.target as HTMLElement;
      if (target) {
        target.style.cursor = elements.length > 0 ? "pointer" : "default";
      }
    },
    onClick: (event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const selectedGame = details[index];

        const gameId = selectedGame.gameId;

        if (gameId) {
          onGameClick(gameId);
        } else {
          console.error("Could not find an ID on this game object.");
        }
      }
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Results for: "${searchQuery}"`,
        color: "#ffffff",
      },
    },
    scales: {
      x: { grid: { color: "#1a1a1a" }, ticks: { color: "#bebcbcff" } },
      y: { grid: { display: false }, ticks: { color: "#dadadaff" } },
    },
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", color: "#10b981" }}>Searching...</div>
    );

  return (
    <div
      style={{ background: "#0a0a0a", padding: "2rem", borderRadius: "12px" }}
    >
      {details.length > 0 ? (
        <div style={{ height: "650px" }}>
          <Bar data={data} options={options} />
        </div>
      ) : (
        <p style={{ color: "#737373" }}>No results found.</p>
      )}
    </div>
  );
}

export default SemanticSearch;
