import React, { useState } from 'react';
import { Match, Team, Stage } from '../types';
import { Search, Save, RotateCcw, LogOut, Filter } from 'lucide-react';

interface AdminDashboardProps {
    matches: Match[];
    teams: Team[];
    onUpdateScore: (matchId: string, home: number | null, away: number | null) => void;
    onReset: () => void;
    onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
    matches,
    teams,
    onUpdateScore,
    onReset,
    onLogout
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStage, setFilterStage] = useState<string>('all');

    const getTeamName = (id: string | null) => {
        if (!id) return 'TBD';
        return teams.find(t => t.id === id)?.name || id;
    };

    const filteredMatches = matches.filter(m => {
        const search = searchTerm.toLowerCase();
        const home = getTeamName(m.homeTeamId).toLowerCase();
        const away = getTeamName(m.awayTeamId).toLowerCase();
        const matchesSearch = home.includes(search) || away.includes(search) || m.id.toLowerCase().includes(search);
        const matchesStage = filterStage === 'all' || m.stage === filterStage;
        return matchesSearch && matchesStage;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100">
            {/* Header */}
            <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-white/5 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold font-display">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onReset}
                            className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <RotateCcw size={16} /> Reset All
                        </button>
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search teams or match ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                        />
                    </div>
                    <div className="relative w-full md:w-64">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <select
                            value={filterStage}
                            onChange={(e) => setFilterStage(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 appearance-none"
                        >
                            <option value="all">All Stages</option>
                            {Object.values(Stage).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Matches Table */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-white/5">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-slate-500">ID</th>
                                    <th className="px-6 py-4 font-semibold text-slate-500">Stage</th>
                                    <th className="px-6 py-4 font-semibold text-slate-500 text-right">Home</th>
                                    <th className="px-6 py-4 font-semibold text-slate-500 text-center">Score</th>
                                    <th className="px-6 py-4 font-semibold text-slate-500">Away</th>
                                    <th className="px-6 py-4 font-semibold text-slate-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                                {filteredMatches.map(match => (
                                    <MatchRow
                                        key={match.id}
                                        match={match}
                                        homeName={getTeamName(match.homeTeamId)}
                                        awayName={getTeamName(match.awayTeamId)}
                                        onSave={(h, a) => onUpdateScore(match.id, h, a)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

const MatchRow = ({ match, homeName, awayName, onSave }: { match: Match, homeName: string, awayName: string, onSave: (h: number, a: number) => void }) => {
    const [homeScore, setHomeScore] = useState(match.homeScore?.toString() || '');
    const [awayScore, setAwayScore] = useState(match.awayScore?.toString() || '');
    const [isDirty, setIsDirty] = useState(false);

    const handleSave = () => {
        const h = parseInt(homeScore);
        const a = parseInt(awayScore);
        if (!isNaN(h) && !isNaN(a)) {
            onSave(h, a);
            setIsDirty(false);
        }
    };

    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 text-slate-400 font-mono text-xs">{match.id}</td>
            <td className="px-6 py-4">
                <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-slate-700 text-xs font-medium">
                    {match.stage}
                </span>
            </td>
            <td className="px-6 py-4 text-right font-medium">{homeName}</td>
            <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                    <input
                        type="number"
                        value={homeScore}
                        onChange={(e) => { setHomeScore(e.target.value); setIsDirty(true); }}
                        className="w-12 text-center p-1 rounded bg-gray-100 dark:bg-slate-900 border border-transparent focus:border-brand-primary outline-none"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                        type="number"
                        value={awayScore}
                        onChange={(e) => { setAwayScore(e.target.value); setIsDirty(true); }}
                        className="w-12 text-center p-1 rounded bg-gray-100 dark:bg-slate-900 border border-transparent focus:border-brand-primary outline-none"
                    />
                </div>
            </td>
            <td className="px-6 py-4 font-medium">{awayName}</td>
            <td className="px-6 py-4">
                {isDirty && (
                    <button
                        onClick={handleSave}
                        className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                        title="Save changes"
                    >
                        <Save size={18} />
                    </button>
                )}
            </td>
        </tr>
    );
};
