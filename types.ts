export enum Stage {
  GROUP = 'Group Stage',
  R32 = 'Round of 32',
  R16 = 'Round of 16',
  QF = 'Quarter Finals',
  SF = 'Semi Finals',
  FINAL = 'Final',
  THIRD_PLACE = 'Third Place'
}

export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: 'USA' | 'Canada' | 'Mexico';
  capacity: number;
  imageUrl: string;
}

export interface Team {
  id: string;
  name: string;
  isoCode: string; // for flagcdn
  rating: number; // mock ELO rating for prediction
}

export interface Player {
  id: string;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  number: number;
  rating: number;
  imageUrl: string;
}

export interface Match {
  id: string;
  homeTeamId: string | null; // Null if TBD (knockouts)
  awayTeamId: string | null;
  homeScore: number | null;
  awayScore: number | null;
  date: string;
  time: string;
  stadiumId: string;
  stage: Stage;
  group?: string; // Only for group stage
  bracketId?: string; // To track knockout path (e.g., W49 vs W50)
  isSimulated?: boolean;
}

export interface GroupStanding {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  rank: number;
}

export interface BracketNode {
  matchId: string;
  nextMatchId: string | null;
}