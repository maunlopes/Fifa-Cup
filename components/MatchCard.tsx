
import React from 'react';
import { Match, Team, Stadium, Stage } from '../types';
import { MapPin, Info } from 'lucide-react';
import { useLanguage } from '../contexts';

interface MatchCardProps {
  match: Match;
  homeTeam?: Team;
  awayTeam?: Team;
  stadium?: Stadium;
  onUpdateScore: (h: number, a: number) => void;
  onOpenDetails: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, homeTeam, awayTeam, stadium, onUpdateScore, onOpenDetails }) => {
  const { t } = useLanguage();
  const isPlayed = match.homeScore !== null && match.awayScore !== null;
  const isTBD = !homeTeam || !awayTeam;

  const handleScoreChange = (type: 'home' | 'away', val: string) => {
    const num = parseInt(val);
    if (isNaN(num)) return;
    
    if (type === 'home') onUpdateScore(num, match.awayScore ?? 0);
    else onUpdateScore(match.homeScore ?? 0, num);
  };

  return (
    <div className="relative group bg-white dark:bg-brand-surface/60 border border-gray-200 dark:border-white/5 rounded-xl overflow-hidden hover:border-brand-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/20">
      
      {/* Background Gradient Accent */}
      <div className={`absolute top-0 left-0 w-1 h-full transition-colors duration-300 ${isPlayed ? 'bg-brand-success' : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-brand-primary'}`}></div>

      <div className="p-5 pl-7">
        {/* Header Info */}
        <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {t(match.stage as any) || match.stage}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin size={10} />
                    <span className="truncate max-w-[150px]">{stadium?.city}</span>
                </div>
            </div>
            <div className="text-right">
                <div className="font-mono text-xs text-brand-accent bg-brand-accent/10 px-2 py-1 rounded">{match.time}</div>
                <div className="text-[10px] text-slate-400 mt-1">{match.date}</div>
            </div>
        </div>

        {/* Teams & Scores Layout */}
        <div className="flex items-center justify-between gap-2">
            
            {/* Home Team */}
            <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer" onClick={onOpenDetails}>
                <div className="relative w-10 h-10 flex-shrink-0">
                    {homeTeam ? (
                        <img 
                            src={`https://flagcdn.com/h80/${homeTeam.isoCode}.png`} 
                            alt={homeTeam.name} 
                            className="w-full h-full object-cover rounded-full border-2 border-slate-200 dark:border-slate-700 shadow-md"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    )}
                </div>
                <span className={`font-display font-semibold text-lg truncate ${homeTeam ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-600'}`}>
                    {homeTeam?.name || t('tbd')}
                </span>
            </div>

            {/* Scoreboard */}
            <div className="flex items-center gap-2 px-3">
                {isTBD ? (
                     <div className="w-20 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800/50 rounded text-slate-400 dark:text-slate-600 text-xs font-bold">
                        {t('vs')}
                     </div>
                ) : (
                    <>
                        <input 
                            type="text" 
                            inputMode="numeric"
                            value={match.homeScore ?? ''}
                            placeholder="-"
                            onChange={(e) => handleScoreChange('home', e.target.value)}
                            className={`w-10 h-10 text-center text-xl font-display font-bold rounded-lg border focus:ring-2 focus:ring-brand-primary outline-none transition-all ${
                                match.homeScore !== null 
                                ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white' 
                                : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 focus:bg-white dark:focus:bg-slate-800'
                            }`}
                        />
                        <span className="text-slate-400 font-bold">:</span>
                        <input 
                            type="text" 
                            inputMode="numeric"
                            value={match.awayScore ?? ''}
                            placeholder="-"
                            onChange={(e) => handleScoreChange('away', e.target.value)}
                            className={`w-10 h-10 text-center text-xl font-display font-bold rounded-lg border focus:ring-2 focus:ring-brand-primary outline-none transition-all ${
                                match.awayScore !== null 
                                ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white' 
                                : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 focus:bg-white dark:focus:bg-slate-800'
                            }`}
                        />
                    </>
                )}
            </div>

            {/* Away Team */}
            <div className="flex items-center justify-end gap-3 flex-1 min-w-0 cursor-pointer" onClick={onOpenDetails}>
                <span className={`font-display font-semibold text-lg truncate text-right ${awayTeam ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-600'}`}>
                    {awayTeam?.name || t('tbd')}
                </span>
                <div className="relative w-10 h-10 flex-shrink-0">
                    {awayTeam ? (
                        <img 
                            src={`https://flagcdn.com/h80/${awayTeam.isoCode}.png`} 
                            alt={awayTeam.name} 
                            className="w-full h-full object-cover rounded-full border-2 border-slate-200 dark:border-slate-700 shadow-md"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    )}
                </div>
            </div>

        </div>
      </div>
      
      {/* Details Trigger Area */}
      <button 
        onClick={onOpenDetails}
        className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <Info size={16} className="text-slate-400 hover:text-brand-primary cursor-pointer" onClick={onOpenDetails}/>
      </div>
    </div>
  );
};
