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
import type { IGroupedGameSales } from "../../interfaces/game";
import { fetchGroupedGameSales } from "../../services/api";
import styles from "./SalesStackedBar.module.css";

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
        backgroundColor: "#11e29dff",
        borderWidth: 0,
      },
      {
        label: "Europe",
        data: stats.map((item) => item.eu),
        backgroundColor: "#059669",
        borderWidth: 0,
      },
      {
        label: "Japan",
        data: stats.map((item) => item.jp),
        backgroundColor: "#064e3b",
        borderWidth: 0,
      },
      {
        label: "Other",
        data: stats.map((item) => item.other),
        backgroundColor: "#5a5a5aff",
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      bar: {
        borderSkipped: false,
      },
    },
    layout: {
      padding: { top: 10, bottom: 10, left: 10, right: 20 },
    },
    plugins: {
      legend: {
        position: "top" as const,
        align: "center" as const,
        labels: {
          color: "#a5a2a2ff",
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
        },
      },
      title: {
        display: true,
        text: "Global Sales Distribution",
        color: "#ffffff",
        font: { size: 18, weight: "bold" as const },
        padding: { bottom: 20 },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { color: "#c9c9c9ff" },
      },
      y: {
        stacked: true,
        grid: {
          color: "#171717",
        },
        ticks: {
          color: "#c7c7c7ff",
        },
      },
    },
    onHover: (event: ChartEvent, elements: ActiveElement[]) => {
      const target = event.native?.target as HTMLElement;

      if (target) {
        target.style.cursor = elements.length > 0 ? "pointer" : "default";
      }
    },
    onClick: (event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const clickedLabel = stats[index].name;

        onBarClick(clickedLabel);
      }
    },
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.pulse} />
        <p>Loading Sales Data...</p>
      </div>
    );
  }

  return (
    <div className={styles.chartCard}>
      {stats.length > 0 ? (
        <div className={styles.chartContainer}>
          <Bar data={data} options={options} />
        </div>
      ) : (
        <div className={styles.loadingWrapper}>
          <p>No sales data available for this group.</p>
        </div>
      )}
    </div>
  );
}

export default SalesStackedBar;
