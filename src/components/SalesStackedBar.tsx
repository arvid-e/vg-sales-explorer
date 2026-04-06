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
import type { IGroupedGameSales } from "../interfaces/game";
import { fetchGroupedGameSales } from "../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface SalesStackedBarProps {
  group: string;
  onBarClick: (name: string) => void;
}

function SalesStackedBar({ group, onBarClick }: SalesStackedBarProps) {
  const [stats, setStats] = useState<IGroupedGameSales[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await fetchGroupedGameSales(group);
        setStats(response);
      } catch (error) {
        console.error("API failed", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [group]);

  const data = {
    labels: stats.map((item) => item.name),
    datasets: [
      {
        label: "North America",
        data: stats.map((item) => item.na),
        backgroundColor: "rgba(3, 130, 204, 0.8)",
      },
      {
        label: "Europe",
        data: stats.map((item) => item.eu),
        backgroundColor: "rgba(0, 39, 167, 0.8)",
      },
      {
        label: "Japan",
        data: stats.map((item) => item.jp),
        backgroundColor: "rgba(245, 52, 94, 0.8)",
      },
      {
        label: "Other",
        data: stats.map((item) => item.other),
        backgroundColor: "rgba(255, 206, 86, 0.8)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Sales (Millions)" },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
    onClick: (event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const clickedLabel = stats[index].name;

        onBarClick(clickedLabel);
      }
    },
  };

  if (loading) return <div>Loading Chart...</div>;

  return (
    <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
      {stats.length > 0 ? (
        <Bar data={data} options={options} />
      ) : (
        <p>No data available to display.</p>
      )}
    </div>
  );
}

export default SalesStackedBar;
