import type { IGameFilters } from "../interfaces/game-filter";

export const fetchGameSales = async (filters: IGameFilters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach( ([key, value]) => {
    if (value != undefined) {
      params.append(key, value.toString());
    }
  })

  const queryString = params.toString();
  const apiUrl = `/api/v1/games${queryString ? `?${queryString}` : ''}`;

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
