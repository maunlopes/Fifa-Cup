
import React, { useEffect, useState } from 'react';
import { Match, Team, Stadium } from '../types';
import { X, Cpu, TrendingUp, Users } from 'lucide-react';
import { useLanguage } from '../contexts';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match;
  homeTeam?: Team;
  awayTeam?: Team;
  stadium?: Stadium;
}

export const MatchModal: React.FC<MatchModalProps> = ({ isOpen, onClose, match, homeTeam, awayTeam, stadium }) => {
  const { t } = useLanguage();
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setAnalysis(''); // Reset on open
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const generateAIAnalysis = async () => {
    if (!homeTeam || !awayTeam) return;
    setLoading(true);
    
    setTimeout(() => {
      setAnalysis(`**${homeTeam.name} vs ${awayTeam.name} Analysis:**\n\nBased on current form (ELO ${homeTeam.rating} vs ${awayTeam.rating}), ${homeTeam.rating > awayTeam.rating ? homeTeam.name : awayTeam.name} has a slight statistical advantage. Key battle will be in the midfield. Predicted high intensity match at ${stadium?.name}.`);
      setLoading(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header Image */}
        <div className="h-48 w-full relative">
          <img 
            src={stadium?.imageUrl || 'https://via.placeholder.com/800x400'} 
            className="w-full h-full object-cover" 
            alt="Stadium" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full hover:bg-white/20 transition">
            <X className="text-white" />
          </button>
          <div className="absolute bottom-4 left-6">
            <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white drop-shadow-lg">{stadium?.name}</h2>
            <p className="text-slate-100 dark:text-slate-300 flex items-center gap-2 drop-shadow-md"><MapPinIcon /> {stadium?.city}, {stadium?.country}</p>
          </div>
        </div>

        <div className="p-6">
          {/* Match Score Header */}
          <div className="flex justify-between items-center mb-8 bg-gray-100 dark:bg-slate-800/50 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
             <div className="text-center">
                <div className="text-xl sm:text-4xl font-bold mb-1 text-slate-900 dark:text-white">{homeTeam?.name}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{t('home')}</div>
             </div>
             <div className="text-3xl sm:text-5xl font-mono font-bold text-brand-primary">
               {match.homeScore ?? '-'} : {match.awayScore ?? '-'}
             </div>
             <div className="text-center">
                <div className="text-xl sm:text-4xl font-bold mb-1 text-slate-900 dark:text-white">{awayTeam?.name}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{t('away')}</div>
             </div>
          </div>

          {/* Stats Grid (Mock) */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-brand-accent mb-2">
                    <TrendingUp size={18} />
                    <span className="font-semibold">{t('winProb')}</span>
                </div>
                <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                    <div style={{width: `${(homeTeam?.rating || 1500) / 30}%`}} className="bg-blue-500"></div>
                    <div className="flex-1 bg-red-500"></div>
                </div>
                <div className="flex justify-between text-xs mt-1 text-slate-500 dark:text-slate-400">
                    <span>{homeTeam?.name}</span>
                    <span>{awayTeam?.name}</span>
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-brand-accent mb-2">
                    <Users size={18} />
                    <span className="font-semibold">{t('capacity')}</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{stadium?.capacity.toLocaleString()}</div>
            </div>
          </div>

          {/* Gemini Analysis Button */}
          <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
            {!analysis && (
                <button 
                onClick={generateAIAnalysis}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                {loading ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                ) : (
                    <>
                    <Cpu size={20} /> {t('aiAnalysis')}
                    </>
                )}
                </button>
            )}
            
            {analysis && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-500/30 p-4 rounded-lg animate-fade-in">
                    <h4 className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-2">
                        <Cpu size={16} /> {t('geminiInsights')}
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{analysis}</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
