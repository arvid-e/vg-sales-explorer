import { useEffect, useState } from "react";
import type { IGameDetails, IGameFilters } from "../../interfaces/game";
import { fetchGameSales } from "../../services/api";
import styles from "./GameDetailList.module.css";

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
    labels: topGames.map((game) => game.name),
    datasets: [
      {
        label: "Global Sales",
        data: topGames.map((game) => game.sales.global),
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderColor: "#10b981",
        borderWidth: 1,
        hoverBackgroundColor: "#10b981",
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    plugins: {
      title: { color: "#ffffff", display: true, text: "Top Performing Games" },
      legend: { display: false },
    },
    scales: {
      x: { grid: { color: "#1a1a1a" }, ticks: { color: "#d6d2d2ff" } },
      y: { grid: { display: false }, ticks: { color: "#c2c1c1ff" } },
    },
  };

  if (loading) return <div>Loading details...</div>;

  return (
    <div className={styles.detailContainer}>
      {details.length > 0 ? (
        <div className={styles.chartWrapper}>
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <p className={styles.noData}>No games found for this filter.</p>
      )}
    </div>
  );
}

export default GameDetailList;
