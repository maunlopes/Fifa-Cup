import { Stadium, Team, Stage, Match, Player } from './types';

export const STADIUMS: Stadium[] = [
  { id: 'S1', name: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', capacity: 87523, imageUrl: 'https://images.unsplash.com/photo-1516972238977-89271fb2bab8?auto=format&fit=crop&q=80&w=800' },
  { id: 'S2', name: 'MetLife Stadium', city: 'New York/NJ', country: 'USA', capacity: 82500, imageUrl: 'https://images.unsplash.com/photo-1521404040997-7501b1a0d33e?auto=format&fit=crop&q=80&w=800' },
  { id: 'S3', name: 'AT&T Stadium', city: 'Dallas', country: 'USA', capacity: 80000, imageUrl: 'https://images.unsplash.com/photo-1504159506876-f8338d47a450?auto=format&fit=crop&q=80&w=800' },
  { id: 'S4', name: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA', capacity: 76416, imageUrl: 'https://images.unsplash.com/photo-1551296727-444db8f26035?auto=format&fit=crop&q=80&w=800' },
  { id: 'S5', name: 'NRG Stadium', city: 'Houston', country: 'USA', capacity: 72220, imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&q=80&w=800' },
  { id: 'S6', name: 'Mercedes-Benz Stadium', city: 'Atlanta', country: 'USA', capacity: 71000, imageUrl: 'https://images.unsplash.com/photo-1508614999368-9260051292e5?auto=format&fit=crop&q=80&w=800' },
  { id: 'S7', name: 'SoFi Stadium', city: 'Los Angeles', country: 'USA', capacity: 70240, imageUrl: 'https://images.unsplash.com/photo-1626249495763-7e6181977931?auto=format&fit=crop&q=80&w=800' },
  { id: 'S8', name: 'Lincoln Financial Field', city: 'Philadelphia', country: 'USA', capacity: 69796, imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800' },
  { id: 'S9', name: 'Lumen Field', city: 'Seattle', country: 'USA', capacity: 69000, imageUrl: 'https://images.unsplash.com/photo-1624519968435-08169994dc15?auto=format&fit=crop&q=80&w=800' },
  { id: 'S10', name: 'Levi\'s Stadium', city: 'San Francisco', country: 'USA', capacity: 68500, imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800' },
  { id: 'S11', name: 'Gillette Stadium', city: 'Boston', country: 'USA', capacity: 65878, imageUrl: 'https://images.unsplash.com/photo-1518605335831-50e5616f9f25?auto=format&fit=crop&q=80&w=800' },
  { id: 'S12', name: 'Hard Rock Stadium', city: 'Miami', country: 'USA', capacity: 64767, imageUrl: 'https://images.unsplash.com/photo-1563299796-b729d0af54a5?auto=format&fit=crop&q=80&w=800' },
  { id: 'S13', name: 'BC Place', city: 'Vancouver', country: 'Canada', capacity: 54500, imageUrl: 'https://images.unsplash.com/photo-1566932769119-7a1fb6d7ce23?auto=format&fit=crop&q=80&w=800' },
  { id: 'S14', name: 'Estadio BBVA', city: 'Monterrey', country: 'Mexico', capacity: 53500, imageUrl: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&q=80&w=800' },
  { id: 'S15', name: 'Estadio Akron', city: 'Guadalajara', country: 'Mexico', capacity: 49850, imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&q=80&w=800' },
  { id: 'S16', name: 'BMO Field', city: 'Toronto', country: 'Canada', capacity: 30000, imageUrl: 'https://images.unsplash.com/photo-1533230678074-b5a0340bb36c?auto=format&fit=crop&q=80&w=800' },
];

export const TEAMS: Team[] = [
  // Group A
  { id: 'mx', name: 'Mexico', isoCode: 'mx', rating: 1650 },
  { id: 'eg', name: 'Egypt', isoCode: 'eg', rating: 1500 },
  { id: 'pl', name: 'Poland', isoCode: 'pl', rating: 1550 },
  { id: 'kr', name: 'South Korea', isoCode: 'kr', rating: 1540 },
  // Group B
  { id: 'ca', name: 'Canada', isoCode: 'ca', rating: 1480 },
  { id: 'fr', name: 'France', isoCode: 'fr', rating: 1840 },
  { id: 'ml', name: 'Mali', isoCode: 'ml', rating: 1400 },
  { id: 'au', name: 'Australia', isoCode: 'au', rating: 1490 },
  // Group C
  { id: 'us', name: 'USA', isoCode: 'us', rating: 1670 },
  { id: 'gb-eng', name: 'England', isoCode: 'gb-eng', rating: 1800 },
  { id: 'ir', name: 'Iran', isoCode: 'ir', rating: 1560 },
  { id: 'ua', name: 'Ukraine', isoCode: 'ua', rating: 1530 },
  // Group D
  { id: 'br', name: 'Brazil', isoCode: 'br', rating: 1830 },
  { id: 'co', name: 'Colombia', isoCode: 'co', rating: 1620 },
  { id: 'jp', name: 'Japan', isoCode: 'jp', rating: 1610 },
  { id: 'se', name: 'Sweden', isoCode: 'se', rating: 1580 },
  // Group E
  { id: 'ar', name: 'Argentina', isoCode: 'ar', rating: 1860 },
  { id: 'ma', name: 'Morocco', isoCode: 'ma', rating: 1680 },
  { id: 'ng', name: 'Nigeria', isoCode: 'ng', rating: 1480 },
  { id: 'dk', name: 'Denmark', isoCode: 'dk', rating: 1630 },
  // Group F
  { id: 'es', name: 'Spain', isoCode: 'es', rating: 1750 },
  { id: 'hr', name: 'Croatia', isoCode: 'hr', rating: 1690 },
  { id: 'sn', name: 'Senegal', isoCode: 'sn', rating: 1590 },
  { id: 'nz', name: 'New Zealand', isoCode: 'nz', rating: 1300 },
  // Group G
  { id: 'de', name: 'Germany', isoCode: 'de', rating: 1720 },
  { id: 'nl', name: 'Netherlands', isoCode: 'nl', rating: 1740 },
  { id: 'cl', name: 'Chile', isoCode: 'cl', rating: 1510 },
  { id: 'gh', name: 'Ghana', isoCode: 'gh', rating: 1420 },
  // Group H
  { id: 'pt', name: 'Portugal', isoCode: 'pt', rating: 1730 },
  { id: 'uy', name: 'Uruguay', isoCode: 'uy', rating: 1640 },
  { id: 'sa', name: 'Saudi Arabia', isoCode: 'sa', rating: 1450 },
  { id: 'ch', name: 'Switzerland', isoCode: 'ch', rating: 1650 },
  // Group I
  { id: 'it', name: 'Italy', isoCode: 'it', rating: 1710 },
  { id: 'be', name: 'Belgium', isoCode: 'be', rating: 1760 },
  { id: 'dz', name: 'Algeria', isoCode: 'dz', rating: 1490 },
  { id: 'ec', name: 'Ecuador', isoCode: 'ec', rating: 1480 },
  // Group J
  { id: 'gb-wls', name: 'Wales', isoCode: 'gb-wls', rating: 1520 },
  { id: 'rs', name: 'Serbia', isoCode: 'rs', rating: 1540 },
  { id: 'tn', name: 'Tunisia', isoCode: 'tn', rating: 1500 },
  { id: 'jm', name: 'Jamaica', isoCode: 'jm', rating: 1350 },
  // Group K
  { id: 'pe', name: 'Peru', isoCode: 'pe', rating: 1530 },
  { id: 'tr', name: 'Turkey', isoCode: 'tr', rating: 1490 },
  { id: 'cm', name: 'Cameroon', isoCode: 'cm', rating: 1450 },
  { id: 'no', name: 'Norway', isoCode: 'no', rating: 1480 },
  // Group L
  { id: 'ci', name: 'Ivory Coast', isoCode: 'ci', rating: 1470 },
  { id: 'gr', name: 'Greece', isoCode: 'gr', rating: 1450 },
  { id: 'pa', name: 'Panama', isoCode: 'pa', rating: 1420 },
  { id: 'ie', name: 'Ireland', isoCode: 'ie', rating: 1410 }
];

export const GROUPS = 'ABCDEFGHIJKL'.split('');

// Helper to generate initial matches
export const generateInitialMatches = (): Match[] => {
  const matches: Match[] = [];
  let matchCounter = 1;

  // Group Matches
  GROUPS.forEach((group, index) => {
    const groupTeams = TEAMS.slice(index * 4, index * 4 + 4);
    
    // Round-robin logic (simplified)
    const pairings = [
      [0, 1], [2, 3], // Matchday 1
      [0, 2], [1, 3], // Matchday 2
      [0, 3], [1, 2]  // Matchday 3
    ];

    pairings.forEach((pair, dayIdx) => {
      matches.push({
        id: `M${matchCounter++}`,
        homeTeamId: groupTeams[pair[0]].id,
        awayTeamId: groupTeams[pair[1]].id,
        homeScore: null,
        awayScore: null,
        date: new Date(2026, 5, 11 + dayIdx * 4 + index).toISOString().split('T')[0],
        time: ['13:00', '16:00', '19:00', '21:00'][matchCounter % 4],
        stadiumId: STADIUMS[matchCounter % STADIUMS.length].id,
        stage: Stage.GROUP,
        group: group
      });
    });
  });

  return matches;
};

// Generate Mock Players
const FIRST_NAMES = ['Liam', 'Noah', 'Oliver', 'Elijah', 'Mateo', 'Lucas', 'Leo', 'Santiago', 'Gabriel', 'Julian'];
const LAST_NAMES = ['Smith', 'Silva', 'Kim', 'Muller', 'Hernandez', 'Garcia', 'Popov', 'Kovacic', 'Dubois', 'Santos'];

export const generateMockPlayers = (teamId: string): Player[] => {
  const players: Player[] = [];
  const team = TEAMS.find(t => t.id === teamId);
  if (!team) return [];

  // 1 GK, 4 DEF, 3 MID, 3 FWD (Start XI) + Subs
  const positions: Array<'GK' | 'DEF' | 'MID' | 'FWD'> = [
    'GK', 'DEF', 'DEF', 'DEF', 'DEF', 'MID', 'MID', 'MID', 'FWD', 'FWD', 'FWD',
    'GK', 'DEF', 'MID', 'FWD', 'MID'
  ];

  positions.forEach((pos, idx) => {
    const seed = teamId.charCodeAt(0) + idx;
    const rating = Math.min(99, Math.max(70, Math.floor(team.rating / 20) + (Math.random() * 10 - 5)));
    
    players.push({
      id: `${teamId}-p${idx}`,
      name: `${FIRST_NAMES[(seed + idx) % FIRST_NAMES.length]} ${LAST_NAMES[(seed * 2) % LAST_NAMES.length]}`,
      position: pos,
      number: idx + 1,
      rating: rating,
      imageUrl: `https://ui-avatars.com/api/?name=${FIRST_NAMES[(seed + idx) % FIRST_NAMES.length]}+${LAST_NAMES[(seed * 2) % LAST_NAMES.length]}&background=random`
    });
  });

  return players.sort((a,b) => b.rating - a.rating);
};