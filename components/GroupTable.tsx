
import React from 'react';
import { GroupStanding, Team } from '../types';
import { useLanguage } from '../contexts';

interface GroupTableProps {
  group: string;
  standings: GroupStanding[];
  teams: Team[];
}

export const GroupTable: React.FC<GroupTableProps> = ({ group, standings, teams }) => {
  const { t } = useLanguage();

  return (
    <div className="glass-panel border border-gray-200 dark:border-white/5 rounded-xl shadow-2xl overflow-hidden bg-white dark:bg-transparent">
      <div className="bg-gray-100 dark:bg-slate-900/80 p-4 border-b border-gray-200 dark:border-white/5 flex justify-between items-center">
        <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">{t('table')}</h3>
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-white/5 px-2 py-1 rounded border border-gray-200 dark:border-white/5">
            {t('group')} {group}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-gray-50 dark:bg-slate-800/30">
            <tr>
                <th className="px-4 py-3 w-8">{t('pos')}</th>
                <th className="px-3 py-3">{t('nation')}</th>
                <th className="px-2 py-3 text-center">{t('mp')}</th>
                <th className="px-2 py-3 text-center">{t('gd')}</th>
                <th className="px-4 py-3 text-center font-bold text-slate-800 dark:text-white">{t('pts')}</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {standings.map((row, idx) => {
                const team = teams.find(t => t.id === row.teamId);
                const isQualifying = idx < 2;
                const isThird = idx === 2;
                
                return (
                <tr key={row.teamId} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-3">
                    <div className={`flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold ${
                        isQualifying ? 'bg-brand-success text-slate-900' : 
                        isThird ? 'bg-brand-warning text-slate-900' : 
                        'text-slate-500 bg-gray-200 dark:bg-slate-800'
                    }`}>
                        {idx + 1}
                    </div>
                    </td>
                    <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                            {team && (
                                <img src={`https://flagcdn.com/w40/${team.isoCode}.png`} className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm opacity-80 group-hover:opacity-100" alt="" />
                            )}
                            <span className={`font-medium truncate max-w-[120px] ${isQualifying ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{team?.name}</span>
                        </div>
                    </td>
                    <td className="px-2 py-3 text-center text-slate-500 font-mono text-xs">{row.played}</td>
                    <td className="px-2 py-3 text-center text-slate-500 font-mono text-xs">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                    <td className="px-4 py-3 text-center font-display font-bold text-slate-900 dark:text-white text-base">{row.points}</td>
                </tr>
                );
            })}
            </tbody>
        </table>
      </div>
    </div>
  );
};
