/**
 * Search for individual games using Semantic Search.
 */
export const semanticSearch = async (search: string) => {
  const url = new URL('/api/v1/games', window.location.origin);
  url.searchParams.append('search', search);
  url.searchParams.append('limit', '20');

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
    console.error('Could not fetch game sales:', error);
    return [];
  }
};