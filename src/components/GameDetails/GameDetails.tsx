import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from 'chart.js';
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

import type { IGameDetails } from '../../interfaces/game';
import { fetchGameDetails } from '../../services/api';

import styles from './GameDetails.module.css';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface IGameDetailsProps {
  gameId: string;
}

/**
 * Component displaying a detailed view about a single game.
 */
function GameDetails({ gameId }: IGameDetailsProps) {
  const [details, setDetails] = useState<IGameDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await fetchGameDetails(gameId);
        setDetails(response);
      } catch (error) {
        console.error('API failed', error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [gameId]);

  if (loading)
    return <div className={styles.loading}>Searching database...</div>;

  if (!details || !details.sales) {
    return <div className={styles.error}>Game statistics not found.</div>;
  }

  const chartData = {
    labels: ['North America', 'Europe', 'Japan', 'Other'],
    datasets: [
      {
        data: [
          details.sales.na,
          details.sales.eu,
          details.sales.jp,
          details.sales.other,
        ],
        backgroundColor: ['#11e29dff', '#059669', '#064e3b', '#5a5a5aff'],
        borderWidth: 2,
        borderColor: '#0a0a0a',
        hoverOffset: 15,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: '#a3a3a3', padding: 20, usePointStyle: true },
      },
      title: {
        display: true,
        text: 'Regional Sales Breakdown',
        color: '#ffffff',
        font: { size: 16 },
      },
    },
  };

  return (
    <div className={styles.detailsContainer}>
      {/* Header Info */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h2 className={styles.gameTitle}>{details.name}</h2>
          <span className={styles.rankBadge}>Rank #{details.rank}</span>
        </div>
        <div className={styles.metaGrid}>
          <div>
            <label>Platform</label>
            <p>{details.platform.name}</p>
          </div>
          <div>
            <label>Publisher</label>
            <p>{details.publisher.name}</p>
          </div>
          <div>
            <label>Genre</label>
            <p>{details.genre}</p>
          </div>
          <div>
            <label>Year</label>
            <p>{details.year}</p>
          </div>
        </div>
      </div>

      {/* Visual Data Section */}
      <div className={styles.contentBody}>
        <div className={styles.chartWrapper}>
          <Doughnut data={chartData} options={options} />
          <div className={styles.totalCenter}>
            <span className={styles.totalValue}>{details.sales.global}M</span>
            <span className={styles.totalLabel}>Global Sales</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameDetails;
