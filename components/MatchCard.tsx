
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
    variant?: 'default' | 'compact';
    className?: string;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, homeTeam, awayTeam, stadium, onUpdateScore, onOpenDetails, variant = 'default', className = '' }) => {
    const { t } = useLanguage();
    const isPlayed = match.homeScore !== null && match.awayScore !== null;
    const isTBD = !homeTeam || !awayTeam;

    const handleScoreChange = (type: 'home' | 'away', val: string) => {
        if (val === '') {
            if (type === 'home') onUpdateScore(null as any, match.awayScore);
            else onUpdateScore(match.homeScore, null as any);
            return;
        }

        const num = parseInt(val);
        if (isNaN(num)) return;

        if (type === 'home') onUpdateScore(num, match.awayScore);
        else onUpdateScore(match.homeScore, num);
    };

    if (variant === 'compact') {
        return (
            <div className="relative group bg-white dark:bg-brand-surface/80 border border-gray-200 dark:border-white/5 rounded-lg overflow-hidden hover:border-brand-primary/50 transition-all shadow-sm w-48">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${isPlayed ? 'bg-brand-success' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                <div className="p-1.5 pl-3 flex flex-col gap-0.5">
                    {/* Home */}
                    <div className="flex items-center justify-between h-6">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-4 h-4 shrink-0">
                                {homeTeam ? (
                                    <img src={`https://flagcdn.com/h40/${homeTeam.isoCode}.png`} className="w-full h-full object-cover rounded-full" alt={homeTeam.name} />
                                ) : <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded-full" />}
                            </div>
                            <span className="text-xs font-semibold truncate text-slate-700 dark:text-slate-200 max-w-[80px]">{homeTeam?.name || 'TBD'}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{match.homeScore ?? '-'}</span>
                    </div>
                    {/* Away */}
                    <div className="flex items-center justify-between h-6">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-4 h-4 shrink-0">
                                {awayTeam ? (
                                    <img src={`https://flagcdn.com/h40/${awayTeam.isoCode}.png`} className="w-full h-full object-cover rounded-full" alt={awayTeam.name} />
                                ) : <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded-full" />}
                            </div>
                            <span className="text-xs font-semibold truncate text-slate-700 dark:text-slate-200 max-w-[80px]">{awayTeam?.name || 'TBD'}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{match.awayScore ?? '-'}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={onOpenDetails}
            className={`relative group bg-white dark:bg-brand-surface border border-gray-200 dark:border-white/5 rounded-xl overflow-hidden hover:border-brand-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md ${className}`}
        >
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${isPlayed ? 'bg-brand-success' : 'bg-slate-300 dark:bg-slate-700'}`}></div>

            <div className="p-3 pl-4">
                {/* Header Info */}
                <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                {t(match.stage as any) || match.stage}
                            </span>
                            {match.matchNumber && (
                                <span className="text-[9px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                    #{match.matchNumber}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <MapPin size={8} />
                            <span className="truncate max-w-[120px]">{stadium?.city}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-mono text-[10px] text-brand-accent bg-brand-accent/10 px-1.5 py-0.5 rounded">{match.time}</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">{match.date}</div>
                    </div>
                </div>

                {/* Teams */}
                <div className="flex flex-col gap-2">
                    {/* Home */}
                    <div className="flex items-center justify-between h-8">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 shrink-0 shadow-sm rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                                {homeTeam ? (
                                    <img src={`https://flagcdn.com/h40/${homeTeam.isoCode}.png`} className="w-full h-full object-cover" alt={homeTeam.name} />
                                ) : <div className="w-full h-full bg-slate-200 dark:bg-slate-700" />}
                            </div>
                            <span className="text-sm font-bold truncate text-slate-800 dark:text-slate-100">{homeTeam?.name || 'TBD'}</span>
                        </div>
                        <span className={`text-lg font-display font-bold ${match.homeScore !== null ? 'text-slate-900 dark:text-white' : 'text-slate-300 dark:text-slate-700'}`}>
                            {match.homeScore ?? '-'}
                        </span>
                    </div>

                    {/* Away */}
                    <div className="flex items-center justify-between h-8">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 shrink-0 shadow-sm rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                                {awayTeam ? (
                                    <img src={`https://flagcdn.com/h40/${awayTeam.isoCode}.png`} className="w-full h-full object-cover" alt={awayTeam.name} />
                                ) : <div className="w-full h-full bg-slate-200 dark:bg-slate-700" />}
                            </div>
                            <span className="text-sm font-bold truncate text-slate-800 dark:text-slate-100">{awayTeam?.name || 'TBD'}</span>
                        </div>
                        <span className={`text-lg font-display font-bold ${match.awayScore !== null ? 'text-slate-900 dark:text-white' : 'text-slate-300 dark:text-slate-700'}`}>
                            {match.awayScore ?? '-'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
