import { useState, useMemo, useEffect } from 'react';
import { Match, Team, GroupStanding, Stage } from '../types';
import { TEAMS, generateInitialMatches } from '../constants';
import { calculateGroupStandings, getBestThirdPlaceTeams, generateKnockoutBracket } from '../utils/simulation';

export const useWorldCup = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams] = useState<Team[]>(TEAMS);

  // Initialize
  useEffect(() => {
    const savedMatches = localStorage.getItem('fifa_wc_matches');
    if (savedMatches) {
      try {
        setMatches(JSON.parse(savedMatches));
      } catch (e) {
        console.error("Failed to parse matches from local storage", e);
        setMatches(generateInitialMatches());
      }
    } else {
      setMatches(generateInitialMatches());
    }
  }, []);

  // Persist matches whenever they change
  useEffect(() => {
    if (matches.length > 0) {
      localStorage.setItem('fifa_wc_matches', JSON.stringify(matches));
    }
  }, [matches]);

  const groupStandings = useMemo(() => calculateGroupStandings(matches, teams), [matches, teams]);

  const bestThirdPlace = useMemo(() => getBestThirdPlaceTeams(groupStandings), [groupStandings]);

  const knockoutMatches = useMemo(() =>
    generateKnockoutBracket(groupStandings, bestThirdPlace, matches.filter(m => m.stage !== Stage.GROUP)),
    [groupStandings, bestThirdPlace, matches]
  );

  const updateMatchScore = (matchId: string, homeScore: number | null, awayScore: number | null) => {
    setMatches(prev => {
      const existing = prev.find(m => m.id === matchId);
      if (existing) {
        return prev.map(m => {
          if (m.id === matchId) {
            return { ...m, homeScore, awayScore, isSimulated: true };
          }
          return m;
        });
      } else {
        // Match doesn't exist in state yet (it was dynamically generated in the view), so we add it.
        // We need to find the match details from the current knockoutMatches to add it correctly with all metadata.
        // However, we can't access knockoutMatches here easily without a ref or passing it.
        // A safer way is to trust the ID and basic info, but we need the full object.

        // BETTER APPROACH: The UI passes the ID. If we can't find it, we can't update it easily without the full object.
        // BUT, we know `knockoutMatches` is derived from `matches`.
        // If `generateKnockoutBracket` returns a match that isn't in `matches`, it's a "virtual" match.
        // When we edit it, we must "materialize" it into the state.

        // To do this cleanly, we need to know the match details.
        // Let's look at where updateMatchScore is called. It's called from App.tsx.
        // We can change the signature of updateMatchScore to accept the full match object optionally, OR
        // we can search for the match in the `knockoutMatches` list if we have access to it.
        // But `knockoutMatches` depends on state, so using it inside setState is tricky.

        // ALTERNATIVE: We can just construct a partial match or require the caller to pass the match object if it's new.
        // Let's try to find it in the current `knockoutMatches` (we can access the latest value via a ref or just pass it).

        // For now, let's try to find it in the `matches` array. If not found, we assume it's a new knockout match.
        // We can reconstruct it? No.

        // Let's modify the signature to accept the `match` object itself if needed, or just finding it in the `knockoutMatches` which we can access if we move this function inside the component body properly or use a Ref.

        // Actually, `knockoutMatches` is available in the scope of `useWorldCup`!
        // But `setMatches` callback `prev` is the state. `knockoutMatches` is the *current* render's derived value.
        // It might be slightly stale inside the callback if multiple updates happen, but for a user input it's fine.

        const matchFromKnockout = knockoutMatches.find(m => m.id === matchId);
        if (matchFromKnockout) {
          return [...prev, { ...matchFromKnockout, homeScore, awayScore, isSimulated: true }];
        }

        return prev;
      }
    });
  };

  const resetSimulation = () => {
    localStorage.removeItem('fifa_wc_matches');
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