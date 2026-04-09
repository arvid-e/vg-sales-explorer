import { type IGameFilters, type IGroupedGameSales } from "../interfaces/game";

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

    return games.data;
  } catch (error) {
    console.error("Could not fetch game sales:", error);
  }
};

/**
 * Fetches top 15 game sales by genre, platform or publisher.
 * /api/v1/games/stats
 */
export const fetchGroupedGameSales = async (
  group: string,
): Promise<IGroupedGameSales[]> => {
  const url = new URL("/api/v1/games/stats", window.location.origin);
  url.searchParams.append("groupBy", group);

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const games = await response.json();

    if (Array.isArray(games.data)) {
      return games.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Could not fetch game sales:", error);
    return [];
  }
};

/**
 * Search for individual games using Semantic Search.
 */
export const semanticSearch = async (search: string) => {
  const url = new URL("/api/v1/games", window.location.origin);
  url.searchParams.append("search", search);
  url.searchParams.append("limit", "20");

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const games = await response.json();

    if (Array.isArray(games.data)) {
      return games.data
    } else {
      return [];
    }
  } catch (error) {
    console.error("Could not fetch game sales:", error);
    return [];
  }
};
