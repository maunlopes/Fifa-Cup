
import React from 'react';
import { useLanguage } from '../contexts';

interface AdPlaceholderProps {
  className?: string;
  size?: 'leaderboard' | 'rectangle' | 'banner';
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ className = '', size = 'leaderboard' }) => {
  const { t } = useLanguage();

  let sizeClasses = '';
  // CLS Protection: Strict min-heights
  switch (size) {
    case 'leaderboard':
      // Mobile: 320x50 or 320x100 | Desktop: 728x90
      sizeClasses = 'h-[50px] sm:h-[90px] w-full max-w-[320px] sm:max-w-[728px]';
      break;
    case 'rectangle':
      // Standard 300x250
      sizeClasses = 'h-[250px] w-[300px]';
      break;
    case 'banner':
      // Fluid width
      sizeClasses = 'w-full h-[60px] sm:h-[90px] max-w-[970px]';
      break;
    default:
      sizeClasses = 'h-[90px] w-full';
  }

  return (
    <div className={`flex flex-col items-center justify-center bg-gray-200/50 dark:bg-slate-800/50 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg mx-auto overflow-hidden ${sizeClasses} ${className}`}>
        {/* Ad Label */}
        <span className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-1 opacity-70 selection:bg-none">
          {t('advertisement')}
        </span>
        
        {/* Placeholder Graphic (Simulating Ad Content) */}
        {/* <!-- GOOGLE ADS SCRIPT GOES HERE --> */}
        <div className="flex gap-1 opacity-20">
            <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500"></div>
            <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500"></div>
            <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500"></div>
        </div>
        {/* <!-- END GOOGLE ADS SCRIPT --> */}
    </div>
  );
};
