import { useEffect, useState } from "react";
import type { IGameDetails, IGameFilters } from "../interfaces/game";
import { fetchGameSales } from "../services/api";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface GameDetailListProps {
  filters: IGameFilters;
}

function GameDetailList({ filters }: GameDetailListProps) {
  const [details, setDetails] = useState<IGameDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await fetchGameSales(filters);
        setDetails(response);
      } catch (error) {
        console.error("API failed", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [filters]);

  const topGames = [...details]
    .sort((a, b) => b.sales.global - a.sales.global)
    .slice(0, 15);

  const chartData = {
    labels: topGames.map((game) => `${game.name} (${game.platform.name})`),
    datasets: [
      {
        label: "Global Sales (Millions)",
        data: topGames.map((game) => game.sales.global),
        backgroundColor: "rgba(101, 219, 255, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Top 15 Games in ${Object.values(filters)[0] || "Selection"}`,
      },
    },
  };

  if (loading) return <div>Loading details...</div>;

  return (
    <div className="detail-view">
      {details.length > 0 ? (
        <>
          <div style={{ height: "600px", marginBottom: "2rem" }}>
            <Bar data={chartData} options={options} />
          </div>
        </>
      ) : (
        <p>No games found for this filter.</p>
      )}
    </div>
  );
}

export default GameDetailList;
