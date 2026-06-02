import { useState } from 'react';
import { 
  Flame, 
  Award, 
  RotateCcw,
  Check,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { getRandomQuote, getTodayStr, calculateStreak, getPlantGrowthInfo } from '../utils/dataHelper';
import VirtualPlant from './VirtualPlant';
import { getCategoryIcon } from '../utils/iconHelper';

export default function Dashboard({ habits, checkIns, username, onToggleCheckIn, setActiveTab }) {
  const [quote, setQuote] = useState(getRandomQuote());
  const [timeGreeting] = useState(() => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 18) return 'Good afternoon';
    return 'Good evening';
  });
  const todayStr = getTodayStr();

  const handleRefreshQuote = () => {
    setQuote(getRandomQuote());
  };

  // Get active habits and their completed status today
  const todayCheckIns = checkIns.filter(ci => ci && ci.date === todayStr).map(ci => ci.habitId);
  const completedCount = habits.filter(h => todayCheckIns.includes(h.id)).length;
  const totalCount = habits.length;

  // Streak calculations
  const streaksData = habits.map(h => ({
    habit: h,
    ...calculateStreak(h.id, checkIns)
  }));

  const maxCurrentStreak = streaksData.reduce((acc, curr) => Math.max(acc, curr.currentStreak), 0);
  const maxLongestStreak = streaksData.reduce((acc, curr) => Math.max(acc, curr.longestStreak), 0);

  // Overall consistency over last 30 days (average across all habits)
  const averageConsistency = habits.length > 0
    ? Math.round(streaksData.reduce((acc, s) => acc + s.consistency, 0) / habits.length)
    : 0;

  // Plant details
  const plantInfo = getPlantGrowthInfo(maxCurrentStreak);
  const remainingXP = plantInfo.maxXP - maxCurrentStreak;

  // Visual Evolution stages list
  const evolutionStages = [
    { name: 'Seed', lvl: 1, desc: '1 Day' },
    { name: 'Sprout', lvl: 2, desc: '3 Days' },
    { name: 'Small Plant', lvl: 3, desc: '7 Days' },
    { name: 'Blooming Plant', lvl: 4, desc: '15 Days' },
    { name: 'Young Tree', lvl: 5, desc: '30 Days' },
    { name: 'Flourishing Tree', lvl: 6, desc: '60+ Days' }
  ];

  // Feedback message based on plant stage
  let feedbackMessage = "A blank canvas. Water your seed to grow custom life! 🌱";
  if (plantInfo.level === 1 && maxCurrentStreak > 0) feedbackMessage = "Seedling nurtured! Keep checking habits to sprout leaves. 💧";
  else if (plantInfo.level === 2) feedbackMessage = "Your sprout is drinking and growing! Don't let it droop. 🌿";
  else if (plantInfo.level === 3) feedbackMessage = "A sturdy plant is forming. Consistency breeds solid roots. 🪵";
  else if (plantInfo.level === 4) feedbackMessage = "Your starlight plant is blooming! Beautiful blossoms appeared. 🌷";
  else if (plantInfo.level === 5) feedbackMessage = "A young sapling is established! Branching out into healthy fields. 🌳";
  else if (plantInfo.level === 6) feedbackMessage = "You have unlocked the Flourishing Tree! Shimmering, eternal cosmic wisdom. 🌲";

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Greetings Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-brand-text-primary">
            {timeGreeting}, {username}!
          </h2>
          <p className="text-brand-text-secondary font-medium text-sm mt-1">
            {feedbackMessage}
          </p>
        </div>
        <div className="text-xs text-brand-accent font-extrabold bg-brand-accent/10 py-1.5 px-3 rounded-full border border-brand-accent/20 inline-self-start md:inline-self-auto">
          🌱 "EVERY HABIT PLANTS A FUTURE"
        </div>
      </div>

      {/* Main Grid: Left Column (Plant + Checklist) | Right Column (Stats + Timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: 7-Cols */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Central Living Plant Widget */}
          <div className="p-6 rounded-3xl border border-brand-border bg-brand-card shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center gap-8 card-glow">
            {/* Ambient Background Aura */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Plant SVG Showcase */}
            <div className="shrink-0">
              <VirtualPlant streak={maxCurrentStreak} isDrooping={totalCount > 0 && completedCount === 0} />
            </div>

            {/* Plant Growth Details */}
            <div className="flex-1 w-full space-y-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-brand-accent tracking-wider bg-brand-accent/10 px-2.5 py-1 rounded-full border border-brand-accent/20 inline-block uppercase">
                  Stage {plantInfo.level}: {plantInfo.stage}
                </span>
                <h3 className="font-heading text-2xl font-bold text-brand-text-primary">
                  Living Discipline
                </h3>
                <p className="text-xs text-brand-text-secondary leading-relaxed font-medium">
                  {plantInfo.desc}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-brand-text-secondary">
                  <span>Growth progress</span>
                  <span className="text-brand-text-primary">{maxCurrentStreak} {plantInfo.level < 6 ? `/ ${plantInfo.maxXP} Days` : 'Days'}</span>
                </div>
                
                <div className="w-full h-2.5 rounded-full bg-brand-surface overflow-hidden relative border border-brand-border/40">
                  <div 
                    className="h-full rounded-full bg-brand-accent shadow-[0_0_10px_rgba(16,185,129,0.4)] transition-all duration-700 ease-out"
                    style={{ width: `${plantInfo.ratio * 100}%` }}
                  />
                </div>

                {plantInfo.level < 6 ? (
                  <p className="text-[10px] text-brand-text-secondary font-medium italic">
                    💡 Keep up your streak for {remainingXP} more days to reach the {plantInfo.nextStage} stage ({plantInfo.maxXP} days)!
                  </p>
                ) : (
                  <p className="text-[10px] text-brand-accent font-bold uppercase tracking-wider">
                    ✨ MAX EVOLUTION UNLOCKED!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Today's Habits Checklist */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-brand-text-primary">
                Today's Waterings
              </h3>
              {totalCount > 0 && (
                <span className="text-xs font-bold text-brand-text-secondary">
                  {completedCount} OF {totalCount} HABITS COMPLETED
                </span>
              )}
            </div>

            {totalCount === 0 ? (
              /* Beautiful Empty State */
              <div className="p-12 text-center rounded-3xl border border-dashed border-brand-border bg-brand-card/30 flex flex-col items-center max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-full bg-brand-surface flex items-center justify-center text-3xl mb-5 shadow-inner border border-brand-border text-brand-accent">
                  🍃
                </div>
                <h4 className="font-heading text-lg font-bold mb-2 text-brand-text-primary">
                  Seed Needs Care
                </h4>
                <p className="text-sm text-brand-text-secondary max-w-xs mb-6 font-medium">
                  Create custom routines to water and grow your virtual plant!
                </p>
                <button
                  onClick={() => setActiveTab('habits')}
                  className="py-2.5 px-5 rounded-xl font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 bg-brand-accent hover:bg-brand-accent-hover text-white shadow-md active:scale-98 text-sm"
                >
                  Create Habits
                  <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              /* Habits Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {habits.map((habit) => {
                  const isChecked = todayCheckIns.includes(habit.id);
                  const streakInfo = calculateStreak(habit.id, checkIns);

                  return (
                    <div 
                      key={habit.id}
                      onClick={() => onToggleCheckIn(habit.id, todayStr)}
                      className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer select-none relative flex items-center justify-between group overflow-hidden ${
                        isChecked 
                          ? 'bg-brand-card/50 border-brand-border opacity-70' 
                          : 'bg-brand-card border-brand-border hover:border-brand-accent/50 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Category Icon */}
                        <div className={`w-11 h-11 rounded-xl fill-current flex items-center justify-center text-lg transition duration-300 border ${
                          isChecked 
                            ? 'bg-brand-accent/15 text-brand-accent border-brand-accent/25 scale-105' 
                            : 'bg-brand-surface text-brand-text-secondary border-brand-border'
                        }`}>
                          {getCategoryIcon(habit.category, 20)}
                        </div>
                        
                        <div className="space-y-0.5">
                          <h4 className={`text-sm font-bold transition duration-200 truncate max-w-[180px] sm:max-w-xs ${
                            isChecked 
                              ? 'text-brand-text-secondary line-through decoration-brand-accent/40 opacity-70' 
                              : 'text-brand-text-primary font-bold'
                          }`}>
                            {habit.name}
                          </h4>
                          <p className="text-[10px] text-brand-text-secondary font-bold uppercase tracking-wider">
                            {habit.category} • {habit.frequency}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Individual Streak indicator */}
                        {streakInfo.currentStreak > 0 && (
                          <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                            <Flame size={10} className="fill-current" />
                            <span>{streakInfo.currentStreak}d</span>
                          </div>
                        )}
                        
                        {/* Action Checkmark Circular Container */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition duration-300 ${
                          isChecked 
                            ? 'bg-brand-accent border-brand-accent text-white shadow-[0_0_12px_rgba(16,185,129,0.3)] scale-105' 
                            : 'border-brand-border group-hover:border-brand-accent group-hover:bg-brand-accent/5'
                        }`}>
                          {isChecked ? (
                            <Check size={16} className="stroke-[3] animate-draw" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-brand-accent/40 opacity-0 group-hover:opacity-100 transition duration-200"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: 5-Cols */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Quick Metrics (Streaks & Consistency) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Global Active Streak */}
            <div className="p-5 rounded-2xl border border-brand-border bg-brand-card flex flex-col justify-between shadow-sm card-glow h-[130px]">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-brand-text-secondary tracking-wider uppercase font-heading block">Habit Streaks</span>
                <h3 className="font-heading text-2xl font-bold flex items-baseline gap-1 text-brand-text-primary">
                  {maxCurrentStreak} <span className="text-brand-text-secondary text-sm font-semibold">days active</span>
                </h3>
                <p className="text-[10px] text-brand-text-secondary font-bold">
                  🔥 peak streak: {maxLongestStreak} days
                </p>
              </div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border self-end mt-2 ${
                maxCurrentStreak > 0 
                  ? 'bg-orange-500/10 text-orange-400 border-orange-500/25 animate-pulse' 
                  : 'bg-brand-surface text-brand-text-secondary border-brand-border'
              }`}>
                <Flame size={18} className={maxCurrentStreak > 0 ? 'fill-current' : ''} />
              </div>
            </div>

            {/* 30D Average Consistency */}
            <div className="p-5 rounded-2xl border border-brand-border bg-brand-card flex flex-col justify-between shadow-sm card-glow h-[130px]">
              <span className="text-[10px] font-bold text-brand-text-secondary tracking-wider uppercase font-heading">Consistency</span>
              <h3 className="font-heading text-2xl font-bold text-brand-text-primary mt-2">
                {averageConsistency}%
              </h3>
              <div className="w-9 h-9 rounded-xl bg-brand-accent/10 text-brand-accent border border-brand-accent/25 flex items-center justify-center self-end mt-2">
                <TrendingUp size={18} />
              </div>
            </div>
          </div>

          {/* Plant Evolution Timeline Map */}
          <div className="p-6 rounded-3xl border border-brand-border bg-brand-card shadow-sm space-y-4">
            <h4 className="font-heading text-sm font-bold text-brand-text-secondary tracking-wider flex items-center gap-1.5 uppercase">
              <Award size={16} className="text-brand-accent" />
              Evolution Timeline
            </h4>
            
            <div className="relative pl-4 border-l border-brand-border space-y-4 py-2">
              {evolutionStages.map((stage) => {
                const isActive = plantInfo.stage === stage.name;
                const isCompleted = plantInfo.level > stage.lvl;
                
                return (
                  <div key={stage.name} className="relative flex items-center justify-between text-left">
                    {/* Node Dot marker */}
                    <div className={`absolute -left-[22.5px] w-4 h-4 rounded-full border-2 transition duration-300 flex items-center justify-center ${
                      isActive 
                        ? 'bg-brand-accent border-brand-card scale-110 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse' 
                        : isCompleted
                        ? 'bg-brand-accent border-brand-accent text-brand-card'
                        : 'bg-brand-surface border-brand-border'
                    }`}>
                      {isCompleted && <Check size={10} className="stroke-[3]" />}
                    </div>

                    <div className="pl-3">
                      <h5 className={`text-xs font-bold transition ${
                        isActive 
                          ? 'text-brand-accent' 
                          : isCompleted 
                          ? 'text-brand-text-primary' 
                          : 'text-brand-text-secondary opacity-60'
                      }`}>
                        {stage.name} {isActive ? '• Active' : ''}
                      </h5>
                      <p className="text-[10px] text-brand-text-secondary font-semibold uppercase tracking-wider">{stage.desc}</p>
                    </div>

                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border transition ${
                      isActive 
                        ? 'bg-brand-accent/15 text-brand-accent border-brand-accent/25 shadow-sm' 
                        : isCompleted
                        ? 'bg-brand-surface text-brand-text-secondary border-brand-border'
                        : 'bg-brand-surface/30 text-brand-text-secondary/30 border-brand-border/10'
                    }`}>
                      {isActive ? 'CURRENT' : isCompleted ? 'PASSED' : 'LOCKED'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Motivation Focus */}
          <div className="p-5 rounded-2xl border border-brand-border bg-brand-card flex flex-col justify-between shadow-sm relative overflow-hidden min-h-[140px] card-glow">
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand-accent/5 rounded-full blur-xl pointer-events-none" />
            <div className="space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-brand-accent tracking-wider bg-brand-surface px-2.5 py-1 rounded-full border border-brand-border uppercase">
                  Cultivation Wisdom
                </span>
                <button 
                  onClick={handleRefreshQuote}
                  className="p-1 rounded-lg text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface transition cursor-pointer"
                  title="Refresh wisdom"
                >
                  <RotateCcw size={12} />
                </button>
              </div>
              <p className="text-xs italic font-semibold leading-relaxed text-brand-text-primary">
                "{quote.text}"
              </p>
            </div>
            <p className="text-[10px] text-brand-text-secondary font-bold mt-3 self-end">
              — {quote.author}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
