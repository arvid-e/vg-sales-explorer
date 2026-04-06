export interface IGameFilters {
  limit?: number;
  page?: number;
  genre?: string;
  platform?: string;
  publisher?: string;
}

export interface IGroupedGameSales {
  name: string;
  na: number;
  eu: number;
  jp: number;
  other: number;
  total: number;
  count: number;
}
