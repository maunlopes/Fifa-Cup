
import React from 'react';
import { Stadium, Match } from '../types';
import { MapPin, Users } from 'lucide-react';
import { useLanguage } from '../contexts';

interface GroupStadiumsProps {
  matches: Match[];
  allStadiums: Stadium[];
}

export const GroupStadiums: React.FC<GroupStadiumsProps> = ({ matches, allStadiums }) => {
  const { t } = useLanguage();
  const uniqueStadiumIds = Array.from(new Set(matches.map(m => m.stadiumId)));
  const groupStadiums = allStadiums.filter(s => uniqueStadiumIds.includes(s.id));

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {groupStadiums.map(stadium => (
          <div key={stadium.id} className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 hover:border-brand-primary/50 transition-all duration-300 shadow-lg">
            {/* Image Background */}
            <div className="h-64 overflow-hidden relative">
              <img 
                src={stadium.imageUrl} 
                alt={stadium.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Host Badge */}
              <div className="absolute top-4 right-4 bg-brand-primary/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {stadium.country}
              </div>
            </div>

            {/* Content */}
            <div className="relative p-6 -mt-16 z-10">
              <h3 className="text-2xl font-display font-bold text-white mb-1 drop-shadow-md">{stadium.name}</h3>
              <div className="flex items-center gap-2 text-brand-accent text-sm font-medium mb-4 drop-shadow-sm">
                <MapPin size={14} />
                {stadium.city}
              </div>

              <div className="bg-white/90 dark:bg-slate-800/80 backdrop-blur-md rounded-xl p-4 border border-gray-200 dark:border-white/5 space-y-3">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{t('capacity')}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Users size={14} className="text-slate-500" />
                        {stadium.capacity.toLocaleString()}
                    </span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{t('matchesHosted')}</span>
                    <span className="font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">
                        {matches.filter(m => m.stadiumId === stadium.id).length}
                    </span>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
