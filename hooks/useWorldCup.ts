import { useState, useMemo, useEffect } from 'react';
import { Match, Team, GroupStanding, Stage } from '../types';
import { TEAMS, generateInitialMatches } from '../constants';
import { calculateGroupStandings, getBestThirdPlaceTeams, generateKnockoutBracket } from '../utils/simulation';

export const useWorldCup = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams] = useState<Team[]>(TEAMS);

  // Initialize
  useEffect(() => {
    const initial = generateInitialMatches();
    setMatches(initial);
  }, []);

  const groupStandings = useMemo(() => calculateGroupStandings(matches, teams), [matches, teams]);
  
  const bestThirdPlace = useMemo(() => getBestThirdPlaceTeams(groupStandings), [groupStandings]);

  const knockoutMatches = useMemo(() => 
    generateKnockoutBracket(groupStandings, bestThirdPlace, matches.filter(m => m.stage !== Stage.GROUP)), 
    [groupStandings, bestThirdPlace, matches]
  );

  const updateMatchScore = (matchId: string, homeScore: number | null, awayScore: number | null) => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return { ...m, homeScore, awayScore, isSimulated: true };
      }
      return m;
    }));
  };

  const resetSimulation = () => {
    setMatches(generateInitialMatches());
  };

  return {
    teams,
    matches,
    groupStandings,
    bestThirdPlace,
    knockoutMatches,
    updateMatchScore,
    resetSimulation
  };
};