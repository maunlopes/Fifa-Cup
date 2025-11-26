import React from 'react';
import { Match, Team, Stadium, Stage } from '../types';
import { MatchCard } from './MatchCard';
import { Trophy } from 'lucide-react';

interface KnockoutBracketProps {
    matches: Match[];
    teams: Team[];
    stadiums: Stadium[];
    onUpdateScore: (matchId: string, h: number, a: number) => void;
    onMatchClick: (match: Match) => void;
}

export const KnockoutBracket: React.FC<KnockoutBracketProps> = ({ matches, teams, stadiums, onUpdateScore, onMatchClick }) => {
    const [isMobile, setIsMobile] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState<Stage>(Stage.R32);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const getTeam = (id: string | null) => teams.find(t => t.id === id);
    const getStadium = (id: string) => stadiums.find(s => s.id === id);

    // Helper to find match by ID pattern or specific ID
    const findMatch = (stage: Stage, index: number) => {
        const stageMatches = matches.filter(m => m.stage === stage).sort((a, b) => {
            const getNum = (id: string) => {
                const parts = id.split('-');
                return parts.length > 1 ? parseInt(parts[1]) : 0;
            };
            return getNum(a.id) - getNum(b.id);
        });
        return stageMatches[index];
    };

    const renderMatchNode = (match: Match | undefined, isCompact: boolean = false) => {
        if (!match) return <div className="h-24 w-64 opacity-0"></div>;
        const isFuture = !match.homeTeamId || !match.awayTeamId;

        return (
            <div className={`relative z-10 transition-all duration-300 ${isFuture ? 'opacity-60 grayscale' : ''}`}>
                <div className={isCompact ? "w-64" : "w-72"}>
                    <MatchCard
                        match={match}
                        homeTeam={getTeam(match.homeTeamId)}
                        awayTeam={getTeam(match.awayTeamId)}
                        stadium={getStadium(match.stadiumId)}
                        onUpdateScore={(h, a) => onUpdateScore(match.id, h, a)}
                        onOpenDetails={() => onMatchClick(match)}
                        variant={isCompact ? 'compact' : 'default'}
                    />
                </div>
            </div>
        );
    };

    // Tree View for QF+ on Desktop
    const renderTree = () => {
        const qf = Array.from({ length: 4 }).map((_, i) => findMatch(Stage.QF, i));
        const sf = Array.from({ length: 2 }).map((_, i) => findMatch(Stage.SF, i));
        const final = findMatch(Stage.FINAL, 0);

        return (
            <div className="flex gap-16 items-center w-max mx-auto py-10">
                {/* QF Column */}
                <div className="flex flex-col gap-6">
                    {qf.map((m, i) => (
                        <div key={i} className="flex flex-col justify-center h-[398px] relative">
                            {renderMatchNode(m, true)}
                        </div>
                    ))}
                </div>

                {/* SF Column */}
                <div className="flex flex-col gap-6">
                    {sf.map((m, i) => (
                        <div key={i} className="flex flex-col justify-center h-[822px] relative">
                            <div className="absolute -left-8 top-1/2 w-8 h-px bg-slate-300 dark:bg-slate-700"></div>
                            <div className="absolute -left-8 top-0 bottom-0 border-l border-slate-300 dark:border-slate-700 h-[398px] my-auto"></div>
                            {renderMatchNode(m, true)}
                        </div>
                    ))}
                </div>

                {/* Final Column */}
                <div className="flex flex-col justify-center h-[1670px] relative px-8">
                    <div className="absolute -left-8 top-1/2 w-8 h-px bg-slate-300 dark:bg-slate-700"></div>
                    <div className="absolute -left-8 top-0 bottom-0 border-l border-slate-300 dark:border-slate-700 h-[822px] my-auto"></div>

                    <div className="flex flex-col items-center gap-8">
                        <div className="flex flex-col items-center text-brand-primary mb-4">
                            <Trophy size={64} className="drop-shadow-xl" />
                            <span className="font-display font-bold text-2xl tracking-widest uppercase mt-2">Final</span>
                        </div>
                        <div className="transform scale-125">
                            {renderMatchNode(final, false)}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const stages = isMobile
        ? [Stage.R32, Stage.R16, Stage.QF, Stage.SF, Stage.FINAL, Stage.THIRD_PLACE]
        : [Stage.R32, Stage.R16, 'FINAL_STAGES'];

    const getActiveMatches = () => {
        if (activeTab === 'FINAL_STAGES') return []; // Handled by tree view
        return matches.filter(m => m.stage === activeTab).sort((a, b) => {
            const getNum = (id: string) => {
                const parts = id.split('-');
                return parts.length > 1 ? parseInt(parts[1]) : 0;
            };
            return getNum(a.id) - getNum(b.id);
        });
    };

    const currentMatches = getActiveMatches();
    const showTree = !isMobile && activeTab === 'FINAL_STAGES';

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0B0F19]">
            {/* Tabs */}
            <div className="flex overflow-x-auto p-6 gap-3 border-b border-gray-200 dark:border-white/5 shrink-0 custom-scrollbar justify-center">
                {stages.map(stage => (
                    <button
                        key={stage}
                        onClick={() => setActiveTab(stage as any)}
                        className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTab === stage
                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25 scale-105'
                            : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                    >
                        {stage === 'FINAL_STAGES' ? 'Final Stages' : stage}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {showTree ? (
                    renderTree()
                ) : (
                    <div className="w-full max-w-[95%] mx-auto pb-20">
                        {currentMatches.length > 0 ? (
                            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-x-12 gap-y-16">
                                {/* Group matches into pairs for visual connection */}
                                {activeTab !== Stage.FINAL && activeTab !== Stage.THIRD_PLACE ? (
                                    Array.from({ length: Math.ceil(currentMatches.length / 2) }).map((_, i) => {
                                        const match1 = currentMatches[i * 2];
                                        const match2 = currentMatches[i * 2 + 1];

                                        // Determine next stage and match index
                                        let nextStage: Stage | null = null;
                                        if (activeTab === Stage.R32) nextStage = Stage.R16;
                                        else if (activeTab === Stage.R16) nextStage = Stage.QF;

                                        // Calculate destination match index (each pair feeds one match)
                                        // R32 Pair 0 (Match 0,1) -> R16 Match 0
                                        // R32 Pair 1 (Match 2,3) -> R16 Match 1
                                        const nextMatchIndex = i;
                                        const nextMatch = nextStage ? findMatch(nextStage, nextMatchIndex) : undefined;

                                        return (
                                            <div key={i} className="flex flex-col items-center">
                                                {/* Top Row: Current Pair */}
                                                <div className="flex gap-16 relative">
                                                    {/* Match 1 */}
                                                    <div className="flex flex-col items-center">
                                                        <div className="relative z-10">
                                                            {match1 && (
                                                                <MatchCard
                                                                    match={match1}
                                                                    homeTeam={getTeam(match1.homeTeamId)}
                                                                    awayTeam={getTeam(match1.awayTeamId)}
                                                                    stadium={getStadium(match1.stadiumId)}
                                                                    onUpdateScore={(h, a) => onUpdateScore(match1.id, h, a)}
                                                                    onOpenDetails={() => onMatchClick(match1)}
                                                                    variant="default"
                                                                />
                                                            )}
                                                        </div>
                                                        {/* Vertical Line Down */}
                                                        <div className="h-6 w-0.5 bg-slate-300 dark:bg-slate-600"></div>
                                                    </div>

                                                    {/* Match 2 */}
                                                    <div className="flex flex-col items-center">
                                                        <div className="relative z-10">
                                                            {match2 && (
                                                                <MatchCard
                                                                    match={match2}
                                                                    homeTeam={getTeam(match2.homeTeamId)}
                                                                    awayTeam={getTeam(match2.awayTeamId)}
                                                                    stadium={getStadium(match2.stadiumId)}
                                                                    onUpdateScore={(h, a) => onUpdateScore(match2.id, h, a)}
                                                                    onOpenDetails={() => onMatchClick(match2)}
                                                                    variant="default"
                                                                />
                                                            )}
                                                        </div>
                                                        {/* Vertical Line Down */}
                                                        <div className="h-6 w-0.5 bg-slate-300 dark:bg-slate-600"></div>
                                                    </div>

                                                    {/* Horizontal Connector */}
                                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[calc(100%-18rem)] h-0.5 bg-slate-300 dark:bg-slate-600"></div>
                                                </div>

                                                {/* Vertical Line to Next Match */}
                                                <div className="h-12 w-0.5 bg-slate-300 dark:bg-slate-600"></div>

                                                {/* Destination Match (Ghost) */}
                                                <div className="opacity-60 grayscale pointer-events-none">
                                                    {nextMatch ? (
                                                        <MatchCard
                                                            match={nextMatch}
                                                            homeTeam={getTeam(nextMatch.homeTeamId)}
                                                            awayTeam={getTeam(nextMatch.awayTeamId)}
                                                            stadium={getStadium(nextMatch.stadiumId)}
                                                            onUpdateScore={() => { }}
                                                            onOpenDetails={() => { }}
                                                            variant="compact"
                                                        />
                                                    ) : (
                                                        <div className="w-48 h-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-slate-300 text-xs font-bold uppercase tracking-wider">
                                                            Next Round
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    // For Final and Third Place (or Mobile List), just list them
                                    currentMatches.map(match => (
                                        <div key={match.id} className="transform hover:scale-[1.02] transition-transform duration-300 flex justify-center">
                                            <div className="w-full max-w-md">
                                                <MatchCard
                                                    match={match}
                                                    homeTeam={getTeam(match.homeTeamId)}
                                                    awayTeam={getTeam(match.awayTeamId)}
                                                    stadium={getStadium(match.stadiumId)}
                                                    onUpdateScore={(h, a) => onUpdateScore(match.id, h, a)}
                                                    onOpenDetails={() => onMatchClick(match)}
                                                    variant="default"
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                <Trophy size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No matches scheduled for this stage yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

