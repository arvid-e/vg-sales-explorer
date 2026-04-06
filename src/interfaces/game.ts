export interface IGameDetails {
  _id: string;
  rank: number;
  name: string;
  platform: {
    id: string;
    name: string;
  };
  publisher: {
    id: string;
    name: string;
  };
  year: number;
  genre: string;
  sales: {
    na: number;
    eu: number;
    jp: number;
    other: number;
    global: number;
  };
}

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
