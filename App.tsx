
import React, { useState } from 'react';
import { TEAMS, STADIUMS, GROUPS } from './constants';
import { useWorldCup } from './hooks/useWorldCup';
import { GroupTable } from './components/GroupTable';
import { MatchCard } from './components/MatchCard';
import { MatchModal } from './components/MatchModal';
import { GroupStadiums } from './components/GroupStadiums';
import { GroupSquads } from './components/GroupSquads';
import { KnockoutBracket } from './components/KnockoutBracket';
import { AdPlaceholder } from './components/AdPlaceholder';
import { Match, Stage } from './types';
import { Calendar, Trophy, BarChart3, RotateCcw, Search, MapPin, Users, LayoutGrid, List, Twitter, Instagram, Github, Mail, Moon, Sun, Globe } from 'lucide-react';
import { useTheme, useLanguage } from './contexts';

import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { Lock } from 'lucide-react';

export default function App() {
    const { matches, groupStandings, knockoutMatches, updateMatchScore, resetSimulation, teams } = useWorldCup();
    const [activeView, setActiveView] = useState<'groups' | 'bracket' | 'admin'>('groups');
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { locale, setLocale, t } = useLanguage();
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

    // Group View State
    const [activeGroup, setActiveGroup] = useState('A');
    const [groupTab, setGroupTab] = useState<'matches' | 'standings' | 'stadiums' | 'squads'>('matches');

    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

    const filteredMatches = matches.filter(m => m.stage === Stage.GROUP && m.group === activeGroup);
    const groupTeams = TEAMS.filter(t => filteredMatches.some(m => m.homeTeamId === t.id || m.awayTeamId === t.id));

    const handleMatchClick = (match: Match) => {
        setSelectedMatch(match);
    };

    const getTeam = (id: string | null) => TEAMS.find(t => t.id === id);
    const getStadium = (id: string) => STADIUMS.find(s => s.id === id);

    if (activeView === 'admin') {
        if (!isAdminLoggedIn) {
            return <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />;
        }
        return (
            <AdminDashboard
                matches={matches}
                teams={teams}
                onUpdateScore={updateMatchScore}
                onReset={resetSimulation}
                onLogout={() => {
                    setIsAdminLoggedIn(false);
                    setActiveView('groups');
                }}
            />
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-[#0B0F19] transition-colors duration-300 overflow-hidden text-slate-900 dark:text-slate-100">
            {/* Top Navigation */}
            <nav className="sticky top-0 z-40 glass-panel border-b border-black/5 dark:border-white/5 shrink-0">
                <div className="w-full max-w-[1920px] mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-brand-primary to-brand-secondary p-1.5 rounded-lg shadow-lg shadow-brand-primary/20">
                            <Trophy className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white tracking-tighter leading-none">
                                {t('appTitle')}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* View Switcher */}
                        <div className="flex bg-gray-200 dark:bg-slate-900/50 p-1 rounded-lg border border-transparent dark:border-white/5">
                            <button
                                onClick={() => setActiveView('groups')}
                                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${activeView === 'groups' ? 'bg-white dark:bg-slate-700 text-brand-primary dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-white'}`}
                            >
                                <LayoutGrid size={16} /> <span className="hidden sm:inline">{t('groups')}</span>
                            </button>
                            <button
                                onClick={() => setActiveView('bracket')}
                                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${activeView === 'bracket' ? 'bg-white dark:bg-slate-700 text-brand-primary dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-white'}`}
                            >
                                <BarChart3 size={16} /> <span className="hidden sm:inline">{t('bracket')}</span>
                            </button>
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors"
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Language Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                className={`flex items-center gap-1 p-2 rounded-lg transition-colors ${isLangMenuOpen ? 'bg-gray-200 dark:bg-white/10 text-slate-900 dark:text-white' : 'hover:bg-gray-200 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400'}`}
                            >
                                <Globe size={20} />
                                <span className="uppercase text-xs font-bold">{locale.split('-')[0]}</span>
                            </button>

                            {/* Backdrop */}
                            {isLangMenuOpen && (
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsLangMenuOpen(false)}
                                />
                            )}

                            {/* Menu */}
                            {isLangMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden animate-fade-in z-50">
                                    <button
                                        onClick={() => { setLocale('en'); setIsLangMenuOpen(false); }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                                    >
                                        <img src="https://flagcdn.com/w20/us.png" className="w-5" alt="US" /> English
                                    </button>
                                    <button
                                        onClick={() => { setLocale('es'); setIsLangMenuOpen(false); }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                                    >
                                        <img src="https://flagcdn.com/w20/es.png" className="w-5" alt="ES" /> Español
                                    </button>
                                    <button
                                        onClick={() => { setLocale('pt'); setIsLangMenuOpen(false); }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                                    >
                                        <img src="https://flagcdn.com/w20/br.png" className="w-5" alt="BR" /> Português
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={resetSimulation}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-brand-warning dark:hover:text-brand-warning transition-colors"
                            title={t('reset')}
                        >
                            <RotateCcw size={18} />
                        </button>

                        <button
                            onClick={() => setActiveView('admin')}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-white transition-colors"
                            title="Admin"
                        >
                            <Lock size={18} />
                        </button>

                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-[1920px] mx-auto flex overflow-hidden relative">

                {activeView === 'groups' ? (
                    <>
                        {/* Left Sidebar */}
                        <aside className="w-20 hidden md:flex flex-col items-center py-6 gap-2 border-r border-gray-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/30 overflow-y-auto custom-scrollbar h-full shrink-0 z-30">
                            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">{t('group')}</div>
                            {GROUPS.map(g => (
                                <button
                                    key={g}
                                    onClick={() => setActiveGroup(g)}
                                    className={`group relative flex items-center justify-center w-10 h-10 rounded-xl font-display font-bold text-lg transition-all duration-200 border ${activeGroup === g
                                        ? 'bg-gradient-to-br from-brand-primary to-brand-secondary text-white border-transparent shadow-lg shadow-brand-primary/25 scale-110 z-10'
                                        : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:border-brand-primary/50 hover:text-brand-primary dark:hover:text-white hover:scale-105'
                                        }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </aside>

                        {/* Content Body */}
                        <div className="flex-1 flex flex-col h-full overflow-hidden relative">

                            {/* Header within Content */}
                            <header className="px-8 pt-6 pb-4 shrink-0">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                    <div>
                                        <h2 className="text-4xl font-display font-bold text-slate-800 dark:text-white mb-1">{t('group')} {activeGroup}</h2>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">North America 2026</p>
                                    </div>

                                    {/* Sub Navigation Tabs */}
                                    <div className="flex items-center gap-1 bg-gray-200 dark:bg-slate-800/50 p-1 rounded-xl border border-transparent dark:border-white/5">
                                        {[
                                            { id: 'matches', label: t('matches'), icon: Calendar },
                                            { id: 'standings', label: t('table'), icon: List },
                                            { id: 'stadiums', label: t('stadiums'), icon: MapPin },
                                            { id: 'squads', label: t('squads'), icon: Users },
                                        ].map(tab => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setGroupTab(tab.id as any)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${groupTab === tab.id
                                                    ? 'bg-white dark:bg-brand-primary text-brand-primary dark:text-white shadow-md'
                                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-white/5'
                                                    }`}
                                            >
                                                <tab.icon size={16} />
                                                <span className="hidden lg:inline">{tab.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </header>

                            {/* Content Body - Scrollable */}
                            <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">

                                {groupTab === 'matches' && (
                                    <div className="grid grid-cols-12 gap-8 animate-fade-in">
                                        {/* Matches Grid */}
                                        <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-min">
                                                {filteredMatches.map(match => (
                                                    <MatchCard
                                                        key={match.id}
                                                        match={match}
                                                        homeTeam={getTeam(match.homeTeamId)}
                                                        awayTeam={getTeam(match.awayTeamId)}
                                                        stadium={getStadium(match.stadiumId)}
                                                        onUpdateScore={(h, a) => updateMatchScore(match.id, h, a)}
                                                        onOpenDetails={() => handleMatchClick(match)}
                                                    />
                                                ))}
                                            </div>

                                            {/* --- AD SPACE: IN-FEED / CONTEXTUAL --- */}
                                            {/* <!-- In-Feed Ad (Between Content) --> */}
                                            <div className="w-full mt-4">
                                                <AdPlaceholder size="leaderboard" className="w-full" />
                                            </div>
                                        </div>

                                        {/* Sticky Widget: Mini Table */}
                                        <div className="col-span-12 xl:col-span-4">
                                            <GroupTable
                                                group={activeGroup}
                                                standings={groupStandings[activeGroup] || []}
                                                teams={TEAMS}
                                            />
                                            <div className="mt-4 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
                                                <h4 className="text-blue-600 dark:text-blue-400 font-bold text-sm mb-2 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                                    {t('liveSimulation')}
                                                </h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                                    {t('simulationHint')}
                                                </p>
                                            </div>

                                            {/* --- AD SPACE: SIDEBAR / RECTANGLE --- */}
                                            {/* <!-- Sidebar Ad --> */}
                                            <div className="mt-6">
                                                <AdPlaceholder size="rectangle" className="w-full" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {groupTab === 'standings' && (
                                    <div className="animate-fade-in max-w-4xl flex flex-col gap-6">
                                        <GroupTable
                                            group={activeGroup}
                                            standings={groupStandings[activeGroup] || []}
                                            teams={TEAMS}
                                        />
                                        {/* In-feed Ad for Table View */}
                                        <AdPlaceholder size="leaderboard" />
                                    </div>
                                )}

                                {groupTab === 'stadiums' && (
                                    <div className="flex flex-col gap-6">
                                        <GroupStadiums
                                            matches={filteredMatches}
                                            allStadiums={STADIUMS}
                                        />
                                        {/* In-feed Ad for Stadiums View */}
                                        <AdPlaceholder size="leaderboard" />
                                    </div>
                                )}

                                {groupTab === 'squads' && (
                                    <GroupSquads teams={groupTeams} />
                                )}

                            </div>
                        </div>
                    </>
                ) : (
                    /* Bracket View */
                    <div className="w-full h-full overflow-hidden animate-fade-in flex flex-col">

                        <div className="flex-1 overflow-hidden relative">
                            <KnockoutBracket
                                matches={knockoutMatches}
                                teams={TEAMS}
                                stadiums={STADIUMS}
                                onUpdateScore={updateMatchScore}
                                onMatchClick={handleMatchClick}
                            />
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-white/5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-40 shrink-0">
                <div className="w-full max-w-[1920px] mx-auto px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-100 dark:bg-slate-800 p-1.5 rounded-lg">
                            <Trophy className="text-brand-primary" size={16} />
                        </div>
                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">© 2026 FIFA World Cup Simulator. {t('rights')}</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 border-r border-gray-300 dark:border-white/10 pr-6">
                            <a href="#" className="text-slate-400 hover:text-blue-500 transition-colors">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-pink-500 transition-colors">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <Github size={18} />
                            </a>
                        </div>
                        <a href="#" className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-colors group">
                            <Mail size={16} className="group-hover:animate-bounce" />
                            {t('contact')}
                        </a>
                    </div>
                </div>
            </footer>

            {/* Modal Overlay */}
            {selectedMatch && (
                <MatchModal
                    isOpen={!!selectedMatch}
                    onClose={() => setSelectedMatch(null)}
                    match={selectedMatch}
                    homeTeam={getTeam(selectedMatch.homeTeamId)}
                    awayTeam={getTeam(selectedMatch.awayTeamId)}
                    stadium={getStadium(selectedMatch.stadiumId)}
                />
            )}
        </div>
    );
}
