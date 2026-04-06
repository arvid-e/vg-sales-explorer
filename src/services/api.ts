import { type IGameFilters } from "../interfaces/game";

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
  const apiUrl = `/api/v1/games${queryString ? `?${queryString}` : ""}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const games = await response.json();

    return games;
  } catch (error) {
    console.error("Could not fetch game sales:", error);
  }
};

/**
 * Fetches top 15 game sales by genre, platform or publisher.
 * /api/v1/games/stats
 */
export const fetchGroupedGameSales = async (group: string) => {
  const params = new URLSearchParams();
  params.append('groupedBy', group);
  const queryString = params.toString();
  
  const apiUrl = `/api/v1/games/stats${queryString ? `?${queryString}` : ""}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const games = await response.json();

    return games;
  } catch (error) {
    console.error("Could not fetch game sales:", error);
  }
};
