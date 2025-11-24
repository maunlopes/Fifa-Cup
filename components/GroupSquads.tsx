
import React, { useState, useEffect } from 'react';
import { Team, Player } from '../types';
import { generateMockPlayers } from '../constants';
import { Shield, Star } from 'lucide-react';
import { useLanguage } from '../contexts';

interface GroupSquadsProps {
  teams: Team[];
}

export const GroupSquads: React.FC<GroupSquadsProps> = ({ teams }) => {
  const { t } = useLanguage();
  const [selectedTeam, setSelectedTeam] = useState<Team>(teams[0]);
  const [squad, setSquad] = useState<Player[]>([]);

  useEffect(() => {
    setSelectedTeam(teams[0]);
  }, [teams]);

  useEffect(() => {
    if (selectedTeam) {
      setSquad(generateMockPlayers(selectedTeam.id));
    }
  }, [selectedTeam]);

  if (!selectedTeam) return null;

  return (
    <div className="animate-fade-in flex flex-col xl:flex-row gap-6 h-full">
      {/* Team Selector Panel */}
      <div className="w-full xl:w-64 flex flex-row xl:flex-col gap-3 overflow-x-auto xl:overflow-visible pb-2 xl:pb-0">
        {teams.map(team => (
            <button
                key={team.id}
                onClick={() => setSelectedTeam(team)}
                className={`flex-shrink-0 relative overflow-hidden p-4 rounded-xl border transition-all text-left flex items-center gap-3 ${
                    selectedTeam.id === team.id
                    ? 'bg-gradient-to-br from-white to-gray-50 dark:from-brand-surface dark:to-slate-800 border-brand-primary ring-1 ring-brand-primary/50'
                    : 'bg-white/50 dark:bg-brand-surface/50 border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400'
                }`}
            >
                <img 
                    src={`https://flagcdn.com/w80/${team.isoCode}.png`} 
                    alt={team.name} 
                    className="w-10 h-7 object-cover rounded shadow-md"
                />
                <span className={`font-display font-bold text-lg ${selectedTeam.id === team.id ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                    {team.name}
                </span>
                {selectedTeam.id === team.id && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-brand-primary"></div>
                )}
            </button>
        ))}
      </div>

      {/* Squad Grid */}
      <div className="flex-1 bg-white dark:bg-brand-surface/30 rounded-2xl border border-gray-200 dark:border-white/5 p-6 shadow-sm">
        <div className="flex justify-between items-end mb-6">
            <div>
                <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    {selectedTeam.name} <span className="text-slate-500 font-sans font-normal text-lg">{t('officialSquad')}</span>
                </h2>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-2">
                    <span className="flex items-center gap-1"><Shield size={14} /> {t('defRating')}: {Math.round(selectedTeam.rating / 20)}</span>
                    <span className="flex items-center gap-1"><Star size={14} /> {t('starPlayer')}: {squad[0]?.name}</span>
                </div>
            </div>
            <div className="hidden sm:block">
                 <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-white/10 font-mono text-brand-accent">
                    ELO: {selectedTeam.rating}
                 </div>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {squad.map(player => (
                <div key={player.id} className="bg-gray-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 border border-gray-200 dark:border-white/5 hover:border-brand-primary/30 rounded-lg p-3 transition-all group flex items-center gap-4 shadow-sm hover:shadow-md">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-slate-700">
                             <img src={player.imageUrl} alt={player.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold border border-white dark:border-slate-900 ${
                            player.position === 'GK' ? 'bg-yellow-500 text-black' :
                            player.position === 'DEF' ? 'bg-blue-500 text-white' :
                            player.position === 'MID' ? 'bg-green-500 text-white' :
                            'bg-red-500 text-white'
                        }`}>
                            {player.position.charAt(0)}
                        </div>
                    </div>
                    <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200 text-sm group-hover:text-brand-primary dark:group-hover:text-white truncate">{player.name}</div>
                        <div className="flex items-center justify-between mt-1 w-24">
                            <span className="text-xs text-slate-500">#{player.number}</span>
                            <div className="h-1 w-12 bg-gray-300 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div style={{width: `${player.rating}%`}} className={`h-full ${player.rating > 85 ? 'bg-brand-accent' : 'bg-slate-500'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
