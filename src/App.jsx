import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  Sun, 
  Moon, 
  Sparkles,
  Flame
} from 'lucide-react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import HabitsPage from './components/HabitsPage';
import AnalyticsPage from './components/AnalyticsPage';
import SettingsPage from './components/SettingsPage';
import { 
  DEFAULT_HABITS, 
  generateMockCheckIns, 
  calculateStreak,
  formatDate,
  getPlantGrowthInfo
} from './utils/dataHelper';

export default function App() {
  // --- 1. State Initialization ---
  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem('berd_habits');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter to ensure all habits are valid objects with id and name
          const valid = parsed.filter(h => h && typeof h === 'object' && h.id && h.name);
          return valid.length > 0 ? valid : DEFAULT_HABITS;
        }
      }
      return DEFAULT_HABITS;
    } catch (e) {
      console.error("Corrupt habits data parsed, resetting to defaults", e);
      return DEFAULT_HABITS;
    }
  });

  const [checkIns, setCheckIns] = useState(() => {
    try {
      const saved = localStorage.getItem('berd_checkins');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Ensure all check-ins are valid objects with habitId and date
          return parsed.filter(ci => ci && typeof ci === 'object' && ci.habitId && ci.date);
        }
      }
      return [];
    } catch (e) {
      console.error("Corrupt check-in history parsed, resetting", e);
      return [];
    }
  });

  const [username, setUsername] = useState(() => {
    return localStorage.getItem('berd_username') || 'Habit Builder';
  });

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('berd_active_tab') || 'landing';
  });

  const [theme] = useState('obsidian');

  const [celebrate, setCelebrate] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [nurtureSparkle, setNurtureSparkle] = useState(false);

  // --- 2. Local Storage Synchronization ---
  useEffect(() => {
    localStorage.setItem('berd_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('berd_checkins', JSON.stringify(checkIns));
  }, [checkIns]);

  useEffect(() => {
    localStorage.setItem('berd_username', username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem('berd_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('berd_theme', 'obsidian');
    document.documentElement.classList.add('dark');
    document.documentElement.classList.add('theme-obsidian');
    document.documentElement.classList.remove('theme-slate');
  }, []);

  // --- 3. Habit Management Actions ---
  const handleAddHabit = (newHabit) => {
    setHabits(prev => [...prev, newHabit]);
  };

  const handleUpdateHabit = (updatedHabit) => {
    setHabits(prev => prev.map(h => h.id === updatedHabit.id ? updatedHabit : h));
  };

  const handleDeleteHabit = (habitId) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
    // Clean up related check-ins
    setCheckIns(prev => prev.filter(ci => ci.habitId !== habitId));
  };

  const handleToggleCheckIn = (habitId, dateStr) => {
    const checkInId = `ci_${habitId}_${dateStr}`;
    const alreadyChecked = checkIns.some(ci => ci.habitId === habitId && ci.date === dateStr);

    let newCheckIns;
    if (alreadyChecked) {
      newCheckIns = checkIns.filter(ci => !(ci.habitId === habitId && ci.date === dateStr));
      // Reset habit's lastCompleted date to the previous latest check-in for this habit
      setHabits(prev => prev.map(h => {
        if (h.id === habitId) {
          const remainingCompletions = newCheckIns.filter(ci => ci.habitId === habitId).map(ci => ci.date);
          const lastDate = remainingCompletions.length > 0 ? [...remainingCompletions].sort().pop() : '';
          return { ...h, lastCompleted: lastDate };
        }
        return h;
      }));
    } else {
      newCheckIns = [...checkIns, { id: checkInId, habitId, date: dateStr }];
      setNurtureSparkle(true);
      setTimeout(() => setNurtureSparkle(false), 1200);
      
      // Update habit lastCompleted date string
      setHabits(prev => prev.map(h => {
        if (h.id === habitId) {
          return { ...h, lastCompleted: dateStr };
        }
        return h;
      }));
    }
    
    setCheckIns(newCheckIns);

    // Trigger celebration if checking a habit makes all of today's habits completed
    if (!alreadyChecked) {
      // Find today's habits (could filter based on frequency later, but currently checking all active habits)
      const activeToday = habits; 
      const completionsToday = newCheckIns.filter(ci => ci.date === dateStr).map(ci => ci.habitId);
      
      const allDone = activeToday.length > 0 && activeToday.every(h => completionsToday.includes(h.id));
      if (allDone) {
        const encouragementMessages = [
          "Incredible! 100% of today's habits completed! 🌱",
          "You crushed it today! Keep up the momentum! ✨",
          "Consistency level: Elite! You completed everything today! 🏆",
          "One perfect day recorded. Great job building consistency! 💪"
        ];
        const randomMsg = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
        setCelebrationMessage(randomMsg);
        setCelebrate(true);
      }
    }
  };

  // --- 4. Utilities Actions ---
  const handleNurtureMockXP = () => {
    if (habits.length === 0) {
      alert("Please plant at least one habit first to anchor growth logs!");
      return;
    }
    const newLogs = [];
    const today = new Date();
    // Generate 15 consecutive daily completions backwards from today
    for (let i = 0; i < 15; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = formatDate(d);
      
      const alreadyChecked = checkIns.some(ci => ci.habitId === habits[0].id && ci.date === dateStr);
      if (!alreadyChecked) {
        newLogs.push({
          id: `ci_nurture_${Date.now()}_${i}`,
          habitId: habits[0].id,
          date: dateStr
        });
      }
    }
    setCheckIns(prev => [...prev, ...newLogs]);
    
    // Update the habit's lastCompleted date to today
    setHabits(prev => prev.map((h, index) => index === 0 ? { ...h, lastCompleted: formatDate(today) } : h));
  };

  const handlePopulateMockData = () => {
    // Overwrite checkins with a beautiful generated mock set
    const mockCheckIns = generateMockCheckIns();
    setCheckIns(mockCheckIns);
    
    // Reset habits to default just in case they were deleted
    setHabits(DEFAULT_HABITS);
  };

  const handleClearAllData = () => {
    setHabits([]);
    setCheckIns([]);
    setUsername('Habit Builder');
    localStorage.removeItem('berd_habits');
    localStorage.removeItem('berd_checkins');
    localStorage.removeItem('berd_username');
  };

  // Calculate quick stats for display
  const totalStreak = habits.reduce((acc, h) => {
    const streakData = calculateStreak(h.id, checkIns);
    return Math.max(acc, streakData.currentStreak);
  }, 0);

  // Derive dynamic plant growth Experience Points (XP)
  // 10 XP per all-time check-in log + 5 XP per day of active streak momentum
  const plantXP = (checkIns.length * 10) + (totalStreak * 5);

  // Detect plant evolution milestones
  useEffect(() => {
    if (habits.length === 0) return;
    const currentStage = getPlantGrowthInfo(totalStreak).stage;
    const savedStage = localStorage.getItem('berd_last_plant_stage');
    
    if (savedStage && savedStage !== currentStage) {
      const stageLevels = {
        'Seed': 1,
        'Sprout': 2,
        'Small Plant': 3,
        'Blooming Plant': 4,
        'Young Tree': 5,
        'Flourishing Tree': 6
      };
      
      const oldLevel = stageLevels[savedStage] || 1;
      const newLevel = stageLevels[currentStage] || 1;
      
      if (newLevel > oldLevel) {
        // Plant has evolved!
        const evolutionMessages = {
          'Sprout': "Your seed has sprouted! 🌿 A fragile green stem has pushed through the rich obsidian soil. You are cultivating daily consistency!",
          'Small Plant': "Incredible! Your sprout has grown into a Small Plant! ☘️ Strong roots are anchoring your daily routine.",
          'Blooming Plant': "Magnificent! Your plant is now a Blooming Plant! 🌷 Beautiful blossoms have emerged. Your consistency is showing its true colors!",
          'Young Tree': "Tremendous achievement! Your plant has grown into a Young Tree! 🌳 Establishing a sturdy wooden trunk and wide branches.",
          'Flourishing Tree': "Unbelievable discipline! You have unlocked the Flourishing Tree! 🌲 An eternal, cosmic masterpiece. You have mastered consistency!"
        };
        
        const msg = evolutionMessages[currentStage] || `Your plant has evolved to the ${currentStage} stage! 🎉`;
        setTimeout(() => {
          setCelebrationMessage(msg);
          setCelebrate(true);
        }, 100);
      }
    }
    
    // Always persist the latest stage
    localStorage.setItem('berd_last_plant_stage', currentStage);
  }, [totalStreak, habits.length]);

  // --- 5. Render Core View ---
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            habits={habits}
            checkIns={checkIns}
            username={username}
            onToggleCheckIn={handleToggleCheckIn}
            setActiveTab={setActiveTab}
            plantXP={plantXP}
          />
        );
      case 'habits':
        return (
          <HabitsPage 
            habits={habits}
            checkIns={checkIns}
            onAddHabit={handleAddHabit}
            onUpdateHabit={handleUpdateHabit}
            onDeleteHabit={handleDeleteHabit}
          />
        );
      case 'analytics':
        return (
          <AnalyticsPage 
            habits={habits}
            checkIns={checkIns}
            plantXP={plantXP}
          />
        );
      case 'settings':
        return (
          <SettingsPage 
            username={username}
            setUsername={setUsername}
            onPopulateMockData={handlePopulateMockData}
            onClearAllData={handleClearAllData}
            checkInsCount={checkIns.length}
            habitsCount={habits.length}
            plantXP={plantXP}
            onNurturePlant={handleNurtureMockXP}
          />
        );
      default:
        return <LandingPage onEnter={() => setActiveTab('dashboard')} />;
    }
  };

  // If in landing view, render without dashboard wrapper
  if (activeTab === 'landing') {
    return <LandingPage onEnter={() => setActiveTab('dashboard')} />;
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-brand-bg text-brand-text-primary">
      
      {/* Nurtured Sparkle Floating Notification */}
      {nurtureSparkle && (
        <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full border border-emerald-500/30 bg-emerald-950/90 text-emerald-400 font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.35)] animate-bounce backdrop-blur-md">
          <span>💧</span>
          <span>Nurtured! +10 XP</span>
        </div>
      )}

      {/* Celebration Modal */}
      {celebrate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-md w-full p-8 text-center rounded-3xl border border-brand-border bg-brand-card shadow-2xl scale-in transform transition-all duration-300">
            {/* Sparkle background elements */}
            <div className="absolute top-4 left-4 text-brand-accent animate-pulse"><Sparkles size={24} /></div>
            <div className="absolute bottom-4 right-4 text-brand-accent animate-pulse"><Sparkles size={20} /></div>
            
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-brand-surface text-brand-accent shadow-inner border border-brand-border">
              <Sparkles size={40} className="animate-bounce" />
            </div>
            
            <h3 className="text-2xl font-bold font-heading mb-3 text-brand-text-primary">
              Daily Perfect Score!
            </h3>
            
            <p className="text-brand-text-secondary mb-6 text-lg font-medium">
              {celebrationMessage}
            </p>
            
            <button
              onClick={() => setCelebrate(false)}
              className="w-full py-3.5 px-6 rounded-xl font-semibold shadow-lg transition-all duration-200 cursor-pointer bg-brand-accent hover:bg-brand-accent-hover text-white active:scale-98"
            >
              Let's Keep It Up!
            </button>
          </div>
        </div>
      )}

      {/* Main Responsive App Layout */}
      <div className="flex min-h-screen flex-col md:flex-row">
        
        {/* SIDEBAR - Desktop Only */}
        <aside className="hidden md:flex md:w-64 flex-col border-r shrink-0 border-brand-border bg-brand-surface">
          <div className="p-6 border-b border-brand-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🌱</span>
              <div>
                <h1 className="font-heading text-lg font-bold tracking-tight text-brand-text-primary">
                  Berd Habit
                </h1>
                <p className="text-[9px] text-brand-accent font-extrabold uppercase tracking-wider">Every Habit Plants a Future</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-brand-card text-brand-text-primary border-l-2 border-brand-accent pl-3.5'
                  : 'text-brand-text-secondary hover:bg-brand-card/40 hover:text-brand-text-primary'
              }`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('habits')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                activeTab === 'habits'
                  ? 'bg-brand-card text-brand-text-primary border-l-2 border-brand-accent pl-3.5'
                  : 'text-brand-text-secondary hover:bg-brand-card/40 hover:text-brand-text-primary'
              }`}
            >
              <CheckSquare size={18} />
              Habits Checklist
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-brand-card text-brand-text-primary border-l-2 border-brand-accent pl-3.5'
                  : 'text-brand-text-secondary hover:bg-brand-card/40 hover:text-brand-text-primary'
              }`}
            >
              <BarChart3 size={18} />
              Analytics & Heatmap
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-brand-card text-brand-text-primary border-l-2 border-brand-accent pl-3.5'
                  : 'text-brand-text-secondary hover:bg-brand-card/40 hover:text-brand-text-primary'
              }`}
            >
              <Settings size={18} />
              Settings & Profile
            </button>
          </nav>

          <div className="p-4 border-t border-brand-border">
            <div className="flex items-center justify-between p-3 rounded-xl bg-brand-card border border-brand-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-border flex items-center justify-center text-sm font-bold text-brand-text-primary">
                  {username.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold truncate text-brand-text-primary">{username}</p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-brand-accent">
                    <Flame size={10} className="fill-current" />
                    <span>Streak: {totalStreak}d</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MOBILE HEADER - Mobile Only */}
        <header className="flex md:hidden items-center justify-between px-6 py-4 border-b border-brand-border bg-brand-surface sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <span className="font-heading text-base font-bold text-brand-text-primary">
              Berd Habit
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-border flex items-center justify-center text-xs font-bold text-brand-text-primary border border-brand-border">
              {username.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT WINDOW */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:p-10 pb-24 md:pb-10 max-w-6xl mx-auto w-full">
          {renderContent()}
        </main>

        {/* BOTTOM NAVIGATION - Mobile Only */}
        <nav className="fixed bottom-0 inset-x-0 z-45 md:hidden flex items-center justify-around py-3.5 border-t border-brand-border bg-brand-surface/95 backdrop-blur-md px-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition ${
              activeTab === 'dashboard' ? 'text-brand-accent scale-105' : 'text-brand-text-secondary'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-bold">Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab('habits')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition ${
              activeTab === 'habits' ? 'text-brand-accent scale-105' : 'text-brand-text-secondary'
            }`}
          >
            <CheckSquare size={20} />
            <span className="text-[10px] font-bold">Habits</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition ${
              activeTab === 'analytics' ? 'text-brand-accent scale-105' : 'text-brand-text-secondary'
            }`}
          >
            <BarChart3 size={20} />
            <span className="text-[10px] font-bold">Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition ${
              activeTab === 'settings' ? 'text-brand-accent scale-105' : 'text-brand-text-secondary'
            }`}
          >
            <Settings size={20} />
            <span className="text-[10px] font-bold">Settings</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
