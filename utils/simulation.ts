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
    ['2A', '2B'], ['1E', '3rd'], ['1F', '2C'], ['1G', '3rd'],
    // Right Bracket
    ['1H', '3rd'], ['1I', '3rd'], ['1J', '2H'], ['1K', '3rd'],
    ['2D', '2E'], ['1L', '2I'], ['2F', '2G'], ['2J', '2K']
  ];

  // Helper to find Team ID from Code
  const getTeamId = (code: string, idx: number): string | null => {
    if (code === '3rd') {
      // Distribute best 3rds sequentially for this demo
      return bestThirds[idx % bestThirds.length]?.teamId || null;
    }
    const group = code.charAt(1);
    const pos = parseInt(code.charAt(0));
    return standings[group]?.[pos - 1]?.teamId || null;
  };

  // Helper to get winner of a match
  const getWinnerId = (matchId: string): string | null => {
    const match = existingMatches.find(m => m.id === matchId);
    if (!match || match.homeScore === null || match.awayScore === null) return null;
    if (match.homeScore > match.awayScore) return match.homeTeamId;
    if (match.awayScore > match.homeScore) return match.awayTeamId;
    // Penalties would go here, for now random if draw (shouldn't happen in knockout with penalties logic, but for safety)
    return match.homeTeamId;
  };

  // Helper to get loser of a match (for 3rd place)
  const getLoserId = (matchId: string): string | null => {
    const match = existingMatches.find(m => m.id === matchId);
    if (!match || match.homeScore === null || match.awayScore === null) return null;
    if (match.homeScore < match.awayScore) return match.homeTeamId;
    if (match.awayScore < match.homeScore) return match.awayTeamId;
    return match.awayTeamId;
  };

  // 1. Generate R32 (16 matches)
  const r32Matches = r32Pairings.map((pair, idx) => {
    const id = `R32-${idx + 1}`;
    const existing = existingMatches.find(m => m.id === id);
    if (existing) return existing;

    return {
      id,
      homeTeamId: getTeamId(pair[0], idx),
      awayTeamId: getTeamId(pair[1], idx),
      homeScore: null,
      awayScore: null,
      date: '2026-06-28',
      time: 'TBD',
      stadiumId: 'S1',
      stage: Stage.R32,
      bracketId: id
    } as Match;
  });

  knockoutMatches.push(...r32Matches);

  // Initialize arrays for R16, QF, SF matches
  const baseMatchTemplate = (stage: Stage, date: string, stadiumId: string) => ({
    homeTeamId: null, awayTeamId: null, homeScore: null, awayScore: null,
    date, time: 'TBD', stadiumId, stage, bracketId: ''
  });

  const r16Matches: Match[] = Array.from({ length: 8 }, (_, i) => ({
    ...baseMatchTemplate(Stage.R16, '2026-07-04', 'S2'),
    id: `R16-${i + 1}`,
    bracketId: `R16-${i + 1}`
  }));
  const qfMatches: Match[] = Array.from({ length: 4 }, (_, i) => ({
    ...baseMatchTemplate(Stage.QF, '2026-07-11', 'S3'),
    id: `QF-${i + 1}`,
    bracketId: `QF-${i + 1}`
  }));
  const sfMatches: Match[] = Array.from({ length: 2 }, (_, i) => ({
    ...baseMatchTemplate(Stage.SF, '2026-07-15', 'S4'),
    id: `SF-${i + 1}`,
    bracketId: `SF-${i + 1}`
  }));

  // 2. Generate R16 (8 matches)
  // Winner of R32-1 vs R32-2, R32-3 vs R32-4, // R16
  for (let i = 0; i < 8; i++) {
    const id = `R16-${i + 1}`;
    const existing = existingMatches.find(m => m.id === id);
    const match = r16Matches[i];

    const homeSourceId = `R32-${i * 2 + 1}`;
    const awaySourceId = `R32-${i * 2 + 2}`;

    if (existing) {
      Object.assign(match, existing);
    } else {
      match.homeTeamId = getWinnerId(homeSourceId);
      match.awayTeamId = getWinnerId(awaySourceId);
      match.date = '2026-07-04';
      match.time = 'TBD';
      match.stadiumId = 'S2';
      match.bracketId = id;
    }
    if (match.homeTeamId || match.awayTeamId || existing) {
      knockoutMatches.push(match);
    }
  }

  // QF
  for (let i = 0; i < 4; i++) {
    const id = `QF-${i + 1}`;
    const existing = existingMatches.find(m => m.id === id);
    const match = qfMatches[i];

    const homeSourceId = `R16-${i * 2 + 1}`;
    const awaySourceId = `R16-${i * 2 + 2}`;

    if (existing) {
      Object.assign(match, existing);
    } else {
      match.homeTeamId = getWinnerId(homeSourceId);
      match.awayTeamId = getWinnerId(awaySourceId);
      match.date = '2026-07-11';
      match.time = 'TBD';
      match.stadiumId = 'S3';
      match.bracketId = id;
    }
    if (match.homeTeamId || match.awayTeamId || existing) {
      knockoutMatches.push(match);
    }
  }

  // SF
  for (let i = 0; i < 2; i++) {
    const id = `SF-${i + 1}`;
    const existing = existingMatches.find(m => m.id === id);
    const match = sfMatches[i];

    const homeSourceId = `QF-${i * 2 + 1}`;
    const awaySourceId = `QF-${i * 2 + 2}`;

    if (existing) {
      Object.assign(match, existing);
    } else {
      match.homeTeamId = getWinnerId(homeSourceId);
      match.awayTeamId = getWinnerId(awaySourceId);
      match.date = '2026-07-15';
      match.time = 'TBD';
      match.stadiumId = 'S4';
      match.bracketId = id;
    }
    if (match.homeTeamId || match.awayTeamId || existing) {
      knockoutMatches.push(match);
    }
  }

  // 5. Generate Final and Third Place
  const sf1Id = 'SF-1';
  const sf2Id = 'SF-2';

  // Final
  const finalId = 'FINAL';
  const existingFinal = existingMatches.find(m => m.id === finalId);
  const finalHomeId = existingFinal?.homeTeamId || getWinnerId(sf1Id);
  const finalAwayId = existingFinal?.awayTeamId || getWinnerId(sf2Id);

  if (existingFinal) {
    knockoutMatches.push(existingFinal);
  } else if (finalHomeId || finalAwayId) {
    knockoutMatches.push({
      id: finalId,
      homeTeamId: finalHomeId,
      awayTeamId: finalAwayId,
      homeScore: null,
      awayScore: null,
      date: '2026-07-19',
      time: '20:00',
      stadiumId: 'S1', // Azteca or MetLife
      stage: Stage.FINAL,
      bracketId: finalId
    });
  }

  // Third Place
  const thirdId = 'THIRD';
  const existingThird = existingMatches.find(m => m.id === thirdId);
  const thirdHomeId = existingThird?.homeTeamId || getLoserId(sf1Id);
  const thirdAwayId = existingThird?.awayTeamId || getLoserId(sf2Id);

  if (existingThird) {
    knockoutMatches.push(existingThird);
  } else if (thirdHomeId || thirdAwayId) {
    knockoutMatches.push({
      id: thirdId,
      homeTeamId: thirdHomeId,
      awayTeamId: thirdAwayId,
      homeScore: null,
      awayScore: null,
      date: '2026-07-18',
      time: '18:00',
      stadiumId: 'S5',
      stage: Stage.THIRD_PLACE,
      bracketId: thirdId
    });
  }

  return knockoutMatches;
};