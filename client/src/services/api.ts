import {
  type IGameDetails,
  type IGameFilters,
  type IGroupedGameSales,
} from '../interfaces/game';

/**
 * Fetched ranked game sales data from all games with optionals filters.
 * /api/v1/games
 */
export const fetchGameSales = async (filters: IGameFilters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value != undefined) {
      params.append(key, value.toString());
    }
  });

  const queryString = params.toString();
  const apiUrl = `/api/v1/games${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(apiUrl);

  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const games = await response.json();

  return games.data;
};

/**
 * Fetch sales details about a single game.
 */
export const fetchGameDetails = async (id: string): Promise<IGameDetails> => {
  const url = new URL(`/api/v1/games/${id}`, window.location.origin);

  const response = await fetch(url);

  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();

  return Array.isArray(data) ? data[0].data : data.data;
};

/**
 * Fetches top 15 game sales by genre, platform or publisher.
 * /api/v1/games/stats
 */
export const fetchGroupedGameSales = async (
  group: string,
): Promise<IGroupedGameSales[]> => {
  const url = new URL('/api/v1/games/stats', window.location.origin);
  url.searchParams.append('groupBy', group);

  const response = await fetch(url.toString());

  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const games = await response.json();

  if (Array.isArray(games.data)) {
    return games.data;
  } else {
    return [];
  }
};
