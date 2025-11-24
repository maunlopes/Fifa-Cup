import { Match, GroupStanding, Team, Stage } from '../types';

export const calculateGroupStandings = (matches: Match[], allTeams: Team[]): Record<string, GroupStanding[]> => {
  const standings: Record<string, Record<string, GroupStanding>> = {};

  // Initialize
  matches.filter(m => m.stage === Stage.GROUP).forEach(match => {
    if (!match.group) return;
    if (!standings[match.group]) standings[match.group] = {};
    
    [match.homeTeamId, match.awayTeamId].forEach(tid => {
      if (tid && !standings[match.group!][tid]) {
        standings[match.group!][tid] = {
          teamId: tid, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, rank: 0
        };
      }
    });

    if (match.homeScore !== null && match.awayScore !== null && match.homeTeamId && match.awayTeamId) {
      const home = standings[match.group!][match.homeTeamId];
      const away = standings[match.group!][match.awayTeamId];

      home.played++;
      away.played++;
      home.gf += match.homeScore;
      away.gf += match.awayScore;
      home.ga += match.awayScore;
      away.ga += match.homeScore;
      home.gd = home.gf - home.ga;
      away.gd = away.gf - away.ga;

      if (match.homeScore > match.awayScore) {
        home.won++;
        home.points += 3;
        away.lost++;
      } else if (match.homeScore < match.awayScore) {
        away.won++;
        away.points += 3;
        home.lost++;
      } else {
        home.drawn++;
        away.drawn++;
        home.points += 1;
        away.points += 1;
      }
    }
  });

  const finalStandings: Record<string, GroupStanding[]> = {};
  
  Object.keys(standings).forEach(group => {
    finalStandings[group] = Object.values(standings[group]).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });
    // Assign ranks
    finalStandings[group].forEach((s, i) => s.rank = i + 1);
  });

  return finalStandings;
};

export const getBestThirdPlaceTeams = (standings: Record<string, GroupStanding[]>): GroupStanding[] => {
  const thirdPlaceTeams: GroupStanding[] = [];
  Object.values(standings).forEach(group => {
    if (group.length >= 3) {
      thirdPlaceTeams.push(group[2]);
    }
  });

  return thirdPlaceTeams.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return b.gf - a.gf;
  }).slice(0, 8); // Top 8 advance
};

// Simplified Knockout logic for demo purposes
// In reality, FIFA 2026 bracket logic is extremely complex based on WHICH 3rd place teams qualify.
export const generateKnockoutBracket = (standings: Record<string, GroupStanding[]>, bestThirds: GroupStanding[], existingMatches: Match[]): Match[] => {
  const knockoutMatches: Match[] = [];
  
  // R32 Config (Simplified static mapping)
  // Format: [HomeSource, AwaySource]
  // '1A' = Winner Group A, '2B' = Runner up B, '3rd' = one of the best 3rds
  const r32Pairings = [
     // Left Bracket
    ['1A', '3rd'], ['1B', '3rd'], ['1C', '2L'], ['1D', '3rd'], 
    ['2A', '2B'],  ['1E', '3rd'], ['1F', '2C'], ['1G', '3rd'],
    // Right Bracket
    ['1H', '3rd'], ['1I', '3rd'], ['1J', '2H'], ['1K', '3rd'],
    ['2D', '2E'],  ['1L', '2I'],  ['2F', '2G'], ['2J', '2K'] 
  ];

  // Helper to find Team ID from Code
  const getTeamId = (code: string, idx: number): string | null => {
    if (code === '3rd') {
      // Distribute best 3rds sequentially for this demo
      return bestThirds[idx % bestThirds.length]?.teamId || null;
    }
    const group = code.charAt(1);
    const pos = parseInt(code.charAt(0));
    return standings[group]?.[pos-1]?.teamId || null;
  };

  let matchIdCounter = 100;

  // Generate R32
  const r32Matches = r32Pairings.map((pair, idx) => {
    const existing = existingMatches.find(m => m.id === `R32-${idx}`);
    if (existing) return existing;

    const homeId = getTeamId(pair[0], idx);
    const awayId = getTeamId(pair[1], idx);

    return {
      id: `R32-${idx}`,
      homeTeamId: homeId,
      awayTeamId: awayId,
      homeScore: null,
      awayScore: null,
      date: '2026-06-28',
      time: 'TBD',
      stadiumId: 'S1',
      stage: Stage.R32,
      bracketId: `R32-${idx}`
    } as Match;
  });

  return r32Matches;
};