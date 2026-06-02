import { useState } from 'react';
import { 
  BarChart3, 
  Flame, 
  CheckCircle2, 
  Calendar,
  Award,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { getCategoryIcon } from '../utils/iconHelper';
import { 
  getPastDates, 
  calculateStreak, 
  getDayOfWeek 
} from '../utils/dataHelper';

export default function AnalyticsPage({ habits, checkIns, plantXP = 0 }) {
  const [selectedHeatmapDay, setSelectedHeatmapDay] = useState(null);

  // Core Stats
  const streaksData = habits.map(h => calculateStreak(h.id, checkIns));
  
  const allTimeMaxStreak = streaksData.reduce((acc, curr) => Math.max(acc, curr.longestStreak), 0);
  
  const averageConsistency = habits.length > 0
    ? Math.round(streaksData.reduce((acc, s) => acc + s.consistency, 0) / habits.length)
    : 0;

  // Calculate dynamic botanical metrics
  // Height is estimated dynamically based on plant XP: 1 XP = 0.15 cm of growth
  const plantHeight = (plantXP * 0.15).toFixed(1);
  // Estimate leaf count: 1 leaf per 12 XP, minimum 2 leaves
  const leafCount = Math.max(2, Math.floor(plantXP / 12));

  // 1. Weekly Completions Trend Chart Data (Last 7 Days)
  const last7Days = getPastDates(7).reverse(); // oldest first
  const weeklyChartData = last7Days.map(dateStr => {
    const completionsCount = checkIns.filter(ci => ci && ci.date === dateStr).length;
    return {
      date: dateStr,
      dayName: getDayOfWeek(dateStr),
      count: completionsCount
    };
  });

  // Calculate coordinates and scales for Weekly Custom SVG Bar Chart
  const svgWidth = 500;
  const svgHeight = 220;
  const chartPaddingLeft = 40;
  const chartPaddingBottom = 30;
  const chartPaddingTop = 20;
  const chartPaddingRight = 20;

  const chartWidth = svgWidth - chartPaddingLeft - chartPaddingRight;
  const chartHeight = svgHeight - chartPaddingTop - chartPaddingBottom;

  const maxVal = habits.length > 0 ? habits.length : 5;
  const getBarHeight = (count) => (count / maxVal) * chartHeight;

  // 2. Rolling Heatmap Grid Calendar (Last 105 Days)
  const daysInHeatmap = 105;
  const heatmapDates = getPastDates(daysInHeatmap).reverse(); // oldest first
  
  // Arrange dates in grid columns of 7 days (weeks)
  const weeks = [];
  let currentWeek = [];
  
  heatmapDates.forEach(dateStr => {
    const totalCompletionsOnDay = checkIns.filter(ci => ci && ci.date === dateStr).length;
    const completionRatio = habits.length > 0 ? totalCompletionsOnDay / habits.length : 0;
    
    currentWeek.push({
      date: dateStr,
      count: totalCompletionsOnDay,
      ratio: completionRatio
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Get color intensity for heatmap cell (using organic Meadow Moss greens and starlight blue overlays)
  const getHeatmapCellColor = (ratio, count) => {
    if (count === 0) return 'bg-[#171717] hover:bg-[#222222] border-brand-border/40';
    if (ratio <= 0.25) return 'bg-emerald-950/20 text-emerald-500 hover:bg-emerald-950/40 border-emerald-900/10';
    if (ratio <= 0.50) return 'bg-emerald-900/20 text-emerald-450 hover:bg-emerald-900/40 border-emerald-800/10';
    if (ratio <= 0.75) return 'bg-emerald-800/45 text-emerald-350 hover:bg-emerald-800/60 border-emerald-600/20';
    // Perfect day completions glow in custom starlight blue!
    return 'bg-brand-accent text-white hover:bg-brand-accent-hover border-brand-accent/25 shadow-[0_0_8px_rgba(16,185,129,0.35)]';
  };

  // Inspect checklist completed on selected heatmap day
  const getCompletionsForDate = (dateStr) => {
    const checkedIds = checkIns.filter(ci => ci && ci.date === dateStr).map(ci => ci.habitId);
    return habits.map(h => ({
      ...h,
      completed: checkedIds.includes(h.id)
    }));
  };

  // 3. Category Consistency Breakdown
  const categorySummary = [
    'Mindfulness (Rooting)', 
    'Learning (Branching)', 
    'Health (Flowering)', 
    'Fitness (Strengthening)', 
    'Other (Seeding)'
  ].map(cat => {
    const catHabits = habits.filter(h => h.category === cat);
    if (catHabits.length === 0) return null;
    
    const catCompletionsCount = checkIns.filter(ci => {
      const parentHabit = habits.find(h => h && h.id === (ci && ci.habitId));
      return parentHabit && parentHabit.category === cat;
    }).length;

    // Total possible completions in last 30 days
    const totalPotential = catHabits.length * 30;
    const score = totalPotential > 0 ? Math.round((catCompletionsCount / totalPotential) * 100) : 0;

    return {
      category: cat,
      score: Math.min(score, 100),
      habitsCount: catHabits.length
    };
  }).filter(Boolean);

  if (habits.length === 0) {
    return (
      <div className="p-16 text-center rounded-3xl border border-dashed border-brand-border bg-brand-card/30 flex flex-col items-center max-w-lg mx-auto animate-fade-in text-left">
        <div className="w-16 h-16 rounded-full bg-brand-surface flex items-center justify-center text-3xl mb-5 shadow-inner border border-brand-border">
          📊
        </div>
        <h4 className="font-heading text-lg font-bold mb-2 text-brand-text-primary">
          No Analytics Available
        </h4>
        <p className="text-sm text-brand-text-secondary max-w-xs mb-6 font-medium">
          Analytics require active habits and historical completions. Add some habits and record completions to unlock tracking reports.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header section */}
      <div>
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-brand-text-primary">
          Garden Insights
        </h2>
        <p className="text-brand-text-secondary font-medium text-sm mt-1">
          Observe the leaf count, canopy height, and botanical performance of your habits.
        </p>
      </div>

      {/* Global Highlights Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Estimated Canopy Height */}
        <div className="p-5 rounded-3xl border border-brand-border bg-brand-card shadow-sm flex items-center gap-4 card-glow">
          <div className="w-11 h-11 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center border border-brand-accent/20">
            <TrendingUp size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-brand-text-secondary tracking-wider block font-heading">CANOPY HEIGHT</span>
            <span className="text-lg font-bold text-brand-text-primary">{plantHeight} cm</span>
          </div>
        </div>

        {/* Leaf Count */}
        <div className="p-5 rounded-3xl border border-brand-border bg-brand-card shadow-sm flex items-center gap-4 card-glow">
          <div className="w-11 h-11 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center border border-brand-accent/20">
            <Sparkles size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-brand-text-secondary tracking-wider block font-heading">ACTIVE FOLIAGE</span>
            <span className="text-lg font-bold text-brand-text-primary">{leafCount} leaves</span>
          </div>
        </div>

        {/* Record Max Streak */}
        <div className="p-5 rounded-3xl border border-brand-border bg-brand-card shadow-sm flex items-center gap-4 card-glow">
          <div className="w-11 h-11 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/15">
            <Flame size={22} className="fill-current" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-brand-text-secondary tracking-wider block font-heading">PEAK MOMENTUM</span>
            <span className="text-lg font-bold text-brand-text-primary">{allTimeMaxStreak} days</span>
          </div>
        </div>

        {/* 30D Average Consistency */}
        <div className="p-5 rounded-3xl border border-brand-border bg-brand-card shadow-sm flex items-center gap-4 card-glow">
          <div className="w-11 h-11 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center border border-brand-accent/15">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-brand-text-secondary tracking-wider block font-heading">CONSISTENCY</span>
            <span className="text-lg font-bold text-brand-text-primary">{averageConsistency}%</span>
          </div>
        </div>
      </div>

      {/* Main visual graphs grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Weekly SVG completions trend */}
        <div className="lg:col-span-6 p-6 rounded-3xl border border-brand-border bg-brand-card shadow-sm flex flex-col justify-between">
          <div className="space-y-1 mb-4">
            <h3 className="font-heading text-base font-bold flex items-center gap-1.5 text-brand-text-primary">
              <BarChart3 size={18} className="text-brand-accent" />
              Weekly Waterings Trend
            </h3>
            <p className="text-xs text-brand-text-secondary font-medium">habit waterings logged in the last 7 days</p>
          </div>

          <div className="w-full relative flex items-center justify-center">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
              {/* Horizontal Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const y = chartPaddingTop + chartHeight - ratio * chartHeight;
                const gridLabel = Math.round(ratio * maxVal);
                return (
                  <g key={index}>
                    <line
                      x1={chartPaddingLeft}
                      y1={y}
                      x2={svgWidth - chartPaddingRight}
                      y2={y}
                      className="stroke-brand-border/40"
                      strokeWidth="1.2"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={chartPaddingLeft - 10}
                      y={y + 4}
                      className="fill-brand-text-secondary text-[10px] font-bold text-right"
                      textAnchor="end"
                    >
                      {gridLabel}
                    </text>
                  </g>
                );
              })}

              {/* Draw Bars */}
              {weeklyChartData.map((d, index) => {
                const barSpacing = chartWidth / weeklyChartData.length;
                const barWidth = 32;
                const x = chartPaddingLeft + index * barSpacing + (barSpacing - barWidth) / 2;
                const barH = getBarHeight(d.count);
                const y = chartPaddingTop + chartHeight - barH;

                return (
                  <g key={index} className="group/bar cursor-pointer">
                    {/* Hover Glow / Background column */}
                    <rect
                      x={x - 6}
                      y={chartPaddingTop}
                      width={barWidth + 12}
                      height={chartHeight}
                      className="fill-transparent group-hover/bar:bg-brand-accent/5 transition duration-155"
                      rx="6"
                    />
                    
                    {/* Main Bar */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={Math.max(barH, 4)} // Ensure at least a sliver is visible
                      className={`transition-all duration-300 ${
                        d.count > 0 
                          ? 'fill-brand-accent group-hover/bar:fill-emerald-400' 
                          : 'fill-brand-surface border border-brand-border/10'
                      }`}
                      rx="6"
                      ry="6"
                    />

                    {/* Value Label above Bar on hover */}
                    <text
                      x={x + barWidth / 2}
                      y={y - 8}
                      className="fill-brand-text-primary text-[10px] font-extrabold opacity-0 group-hover/bar:opacity-100 transition duration-150"
                      textAnchor="middle"
                    >
                      {d.count} watered
                    </text>

                    {/* X-Axis labels */}
                    <text
                      x={x + barWidth / 2}
                      y={svgHeight - 10}
                      className="fill-brand-text-secondary text-[11px] font-bold"
                      textAnchor="middle"
                    >
                      {d.dayName}
                    </text>
                  </g>
                );
              })}

              {/* Bottom Baseline */}
              <line
                x1={chartPaddingLeft}
                y1={chartPaddingTop + chartHeight}
                x2={svgWidth - chartPaddingRight}
                y2={chartPaddingTop + chartHeight}
                className="stroke-brand-border"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>

        {/* Category breakdown consistency list */}
        <div className="lg:col-span-6 p-6 rounded-3xl border border-brand-border bg-brand-card shadow-sm flex flex-col justify-between">
          <div className="space-y-1 mb-6">
            <h3 className="font-heading text-base font-bold flex items-center gap-1.5 text-brand-text-primary">
              <Award size={18} className="text-brand-accent" />
              Cultivation Integrity (30D)
            </h3>
            <p className="text-xs text-brand-text-secondary font-medium">consistency metrics mapped by category branches</p>
          </div>

          <div className="space-y-5 flex-1 flex flex-col justify-center text-left">
            {categorySummary.length === 0 ? (
              <p className="text-xs italic text-brand-text-secondary text-center py-6">No categorical data available.</p>
            ) : (
              categorySummary.map((c, index) => (
                <div key={index} className="space-y-2 text-left">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(c.category, 14, "text-brand-accent")}
                      <span className="text-brand-text-primary">{c.category}</span>
                      <span className="text-[10px] text-brand-text-secondary font-medium">({c.habitsCount} active)</span>
                    </div>
                    <span className="text-brand-accent">{c.score}%</span>
                  </div>
                  {/* Custom progress track */}
                  <div className="w-full h-2 rounded-full bg-brand-surface overflow-hidden relative border border-brand-border/10">
                    <div 
                      className="h-full rounded-full bg-brand-accent shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-500"
                      style={{ width: `${c.score}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* GitHub-style Heatmap Grid */}
      <div className="p-6 rounded-3xl border border-brand-border bg-brand-card shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="space-y-1">
            <h3 className="font-heading text-base font-bold flex items-center gap-1.5 text-brand-text-primary">
              <Calendar size={18} className="text-brand-accent" />
              Consistency Heatmap
            </h3>
            <p className="text-xs text-brand-text-secondary font-medium">rolling grid of completions over the last 15 weeks (105 days)</p>
          </div>
          
          {/* Heatmap Legend */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-text-secondary">
            <span>Dry</span>
            <div className="w-2.5 h-2.5 rounded-[3px] bg-[#171717] border border-brand-border/40"></div>
            <div className="w-2.5 h-2.5 rounded-[3px] bg-emerald-950/20 border border-emerald-900/10"></div>
            <div className="w-2.5 h-2.5 rounded-[3px] bg-emerald-800/40 border border-emerald-700/20"></div>
            <div className="w-2.5 h-2.5 rounded-[3px] bg-brand-accent border border-brand-accent/20"></div>
            <span>Nurtured</span>
          </div>
        </div>

        {/* Heatmap Grid Wrapper */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1.5 min-w-[550px] justify-between">
            {weeks.map((week, wIndex) => (
              <div key={wIndex} className="flex flex-col gap-1.5">
                {week.map((day, dIndex) => {
                  const isSelected = selectedHeatmapDay?.date === day.date;
                  return (
                    <button
                      key={dIndex}
                      onClick={() => setSelectedHeatmapDay(day)}
                      className={`w-5 h-5 rounded-[4px] cursor-pointer transition-all duration-150 border heatmap-cell ${getHeatmapCellColor(day.ratio, day.count)} ${
                        isSelected 
                          ? 'ring-2 ring-brand-accent border-brand-surface scale-110 z-10' 
                          : 'border-transparent'
                      }`}
                      title={`${day.date}: ${day.count} completed`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Day Inspector Card (Clicking Day shows detail) */}
        <div className="mt-6 pt-5 border-t border-brand-border">
          {selectedHeatmapDay ? (
            <div className="p-4 rounded-2xl bg-brand-surface/40 border border-brand-border space-y-4 animate-fade-in text-left">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-brand-text-secondary tracking-wider">
                  HISTORY LOG: {new Date(selectedHeatmapDay.date.replace(/-/g, '/')).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                </h4>
                <span className="text-xs font-bold text-brand-accent bg-brand-accent/15 px-2.5 py-0.5 rounded-full border border-brand-accent/25">
                  {selectedHeatmapDay.count} / {habits.length} WATERED
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {getCompletionsForDate(selectedHeatmapDay.date).map(h => (
                  <div key={h.id} className="flex items-center justify-between p-3 rounded-xl bg-brand-card border border-brand-border">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="shrink-0">{getCategoryIcon(h.category, 14, h.completed ? "text-brand-accent" : "text-brand-text-secondary")}</span>
                      <span className={`text-xs font-bold truncate ${h.completed ? 'text-brand-text-primary' : 'text-brand-text-secondary line-through opacity-70'}`}>
                        {h.name}
                      </span>
                    </div>
                    
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition ${
                      h.completed 
                        ? 'bg-brand-accent border-brand-accent text-white shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                        : 'border-brand-border bg-brand-bg text-transparent'
                    }`}>
                      {h.completed && <CheckCircle2 size={12} className="stroke-[3]" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs italic text-brand-text-secondary text-center py-2">
              💡 Tip: Click any cell in the heatmap grid above to inspect completed habits for that specific date!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
