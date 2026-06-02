import { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Shield, 
  TrendingUp, 
  ArrowRight
} from 'lucide-react';

export default function LandingPage({ onEnter }) {
  const [demoWateredCount, setDemoWateredCount] = useState(0);
  
  // Custom organic sprout evolution states for demo
  const getDemoSproutPath = () => {
    switch (demoWateredCount) {
      case 0:
        return (
          <g>
            {/* Seed dormant */}
            <circle cx="100" cy="150" r="10" fill="rgba(16, 185, 129, 0.12)" className="animate-pulse" />
            <ellipse cx="100" cy="150" rx="5" ry="3.5" fill="#10B981" />
          </g>
        );
      case 1:
        return (
          <g>
            {/* Seed cracking stem */}
            <path d="M100 150 Q96 142 101 132" fill="none" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" />
            <ellipse cx="100" cy="150" rx="5" ry="3.5" fill="#047857" />
          </g>
        );
      case 2:
        return (
          <g>
            {/* Fully emerged Sprout */}
            <path d="M100 152 Q95 130 102 112" fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
            {/* Left Leaf sways */}
            <g transform="translate(102, 112) rotate(-25)" className="animate-leaf-sway" style={{ transformOrigin: '0px 0px' }}>
              <path d="M0 0 Q-10 -12 0 -20 Q10 -12 0 0" fill="#34D399" stroke="#059669" strokeWidth="1" />
            </g>
            {/* Right Leaf */}
            <g transform="translate(102, 112) rotate(35)" className="animate-leaf-sway" style={{ transformOrigin: '0px 0px' }}>
              <path d="M0 0 Q-8 -10 0 -16 Q8 -10 0 0" fill="#059669" stroke="#047857" strokeWidth="1" />
            </g>
          </g>
        );
      default:
        return (
          <g>
            {/* Bloomed sapling with tiny flower */}
            <path d="M100 152 Q95 125 100 95" fill="none" stroke="#10B981" strokeWidth="5.5" strokeLinecap="round" />
            
            {/* Side branch left */}
            <path d="M99 122 Q84 112 78 105" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
            <g transform="translate(78, 105) rotate(-55)" className="animate-leaf-sway" style={{ transformOrigin: '0px 0px' }}>
              <path d="M0 0 Q-10 -12 0 -20 Q10 -12 0 0" fill="#34D399" stroke="#059669" strokeWidth="1" />
            </g>

            {/* Top Leaf canopy */}
            <g transform="translate(100, 95)" className="animate-leaf-sway" style={{ transformOrigin: '0px 0px' }}>
              <path d="M0 0 Q-14 -16 0 -26 Q14 -16 0 0" fill="#6EE7B7" stroke="#10B981" strokeWidth="1" />
            </g>

            {/* Glowing flower blossom */}
            <circle cx="100" cy="80" r="3.5" fill="#3B82F6" className="animate-bloom" />
            <circle cx="-3" cy="0" r="2" fill="#93C5FD" transform="translate(100, 80)" />
            <circle cx="3" cy="0" r="2" fill="#93C5FD" transform="translate(100, 80)" />
            <circle cx="0" cy="-3" r="2" fill="#93C5FD" transform="translate(100, 80)" />
            <circle cx="0" cy="3" r="2" fill="#93C5FD" transform="translate(100, 80)" />
          </g>
        );
    }
  };

  const handleDemoWater = () => {
    setDemoWateredCount(prev => (prev + 1) % 4);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary font-sans transition-colors duration-300">
      {/* Top Navbar */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🌱</span>
          <span className="font-heading text-xl font-bold tracking-tight text-brand-text-primary">
            Berd Habit
          </span>
        </div>
        <button
          onClick={onEnter}
          className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border border-brand-border hover:border-brand-accent/50 hover:bg-brand-accent/5 text-brand-text-secondary hover:text-brand-text-primary"
        >
          Open Garden
        </button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent/10 text-brand-accent border border-brand-accent/15">
            <Sparkles size={12} className="animate-pulse" />
            <span>Interactive Botanical Discipline</span>
          </div>
          
          <h1 className="font-heading text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08] text-brand-text-primary">
            Every Habit<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-emerald-300">
              Plants a Future.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-brand-text-secondary font-medium max-w-xl">
            A premium dark-first productivity experience where discipline creates visible life. completed habits water your virtual plant, building streaks and blooming flowers over time.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={onEnter}
              className="px-8 py-4 rounded-2xl font-bold shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accent-hover text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-98"
            >
              Enter Garden Workspace
              <ArrowRight size={18} />
            </button>
            <a
              href="#features"
              className="px-8 py-4 rounded-2xl font-bold transition-all duration-200 text-center border border-brand-border hover:border-brand-text-secondary/40 hover:bg-brand-surface text-brand-text-secondary hover:text-brand-text-primary"
            >
              Explore Philosophies
            </a>
          </div>
        </div>

        {/* Live Interactive Sprout Demo Widget */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-sm p-6 rounded-3xl border border-brand-border bg-brand-card shadow-xl relative overflow-hidden flex flex-col items-center">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-brand-text-secondary tracking-wider">CULTIVATE NOW</span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-brand-accent/10 text-brand-accent border border-brand-accent/20">
                <span>💧 {demoWateredCount} Waterings</span>
              </div>
            </div>

            {/* Mini SVG Plant Canvas */}
            <div className="w-32 h-32 aspect-square flex items-center justify-center rounded-2xl border border-brand-border/40 bg-brand-surface/40 p-2 mb-4">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <ellipse cx="100" cy="165" rx="55" ry="8" fill="rgba(0, 0, 0, 0.4)" />
                <path d="M20 160 Q100 138 180 160 Z" fill="#1C1917" stroke="#2E2B28" strokeWidth="1.5" />
                {getDemoSproutPath()}
              </svg>
            </div>

            <h3 className="font-heading text-lg font-bold mb-1 text-brand-text-primary">Water the Sprout</h3>
            <p className="text-xs text-brand-text-secondary mb-5 font-medium text-center">Click the button below to water and crack the seed casing.</p>

            {/* Interactive check water trigger */}
            <button 
              onClick={handleDemoWater}
              className="w-full py-3 rounded-xl border border-brand-accent/30 bg-brand-accent/5 hover:bg-brand-accent/15 text-brand-accent font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <span>💧</span>
              <span>{demoWateredCount === 3 ? 'Reset Seed Lifecycle' : 'Water Sprout (+10 XP)'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Core Philosophies & Value Propositions */}
      <section id="features" className="bg-brand-surface border-t border-b border-brand-border py-24 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mx-auto text-center mb-16 space-y-4">
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-brand-text-primary">
              Organic Habit Building
            </h2>
            <p className="text-brand-text-secondary font-medium">
              We shifted away from infantile gamified points to focus on deep emotional attachment and visual, organic self-cultivation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-brand-card border border-brand-border space-y-4 text-left shadow-sm hover:shadow-[0_4px_20px_rgba(16,185,129,0.02)] transition">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/25 flex items-center justify-center font-bold">
                🌱
              </div>
              <h3 className="font-heading font-bold text-lg text-brand-text-primary">Obsidian Pedestal</h3>
              <p className="text-sm text-brand-text-secondary font-medium leading-relaxed">
                Nurture your plant inside our high-contrast, distraction-free Obsidian Dark interface built on modern sans typography.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-brand-card border border-brand-border space-y-4 text-left shadow-sm hover:shadow-[0_4px_20px_rgba(16,185,129,0.02)] transition">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/25 flex items-center justify-center">
                <Flame size={20} className="fill-current" />
              </div>
              <h3 className="font-heading font-bold text-lg text-brand-text-primary">Streak Boosts</h3>
              <p className="text-sm text-brand-text-secondary font-medium leading-relaxed">
                Consistency acts as dynamic sunlight. Sustaining streaks injects multiplier growth pulses directly into your plant.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-brand-card border border-brand-border space-y-4 text-left shadow-sm hover:shadow-[0_4px_20px_rgba(16,185,129,0.02)] transition">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/25 flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
              <h3 className="font-heading font-bold text-lg text-brand-text-primary">Growth Timelines</h3>
              <p className="text-sm text-brand-text-secondary font-medium leading-relaxed">
                Visualize consistency commit charts and track your plant canopy estimated height (cm) over historical checks.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl bg-brand-card border border-brand-border space-y-4 text-left shadow-sm hover:shadow-[0_4px_20px_rgba(16,185,129,0.02)] transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center">
                <Shield size={20} />
              </div>
              <h3 className="font-heading font-bold text-lg text-brand-text-primary">Sovereign Privacy</h3>
              <p className="text-sm text-brand-text-secondary font-medium leading-relaxed">
                Your botanical database exists 100% locally in your browser cache. No account sign-ups, tracking, or cloud sharing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center space-y-8">
        <h2 className="font-heading text-4xl font-extrabold tracking-tight text-brand-text-primary">
          Ready to plant a future?
        </h2>
        <p className="text-lg text-brand-text-secondary max-w-md mx-auto font-medium">
          Start recording today. Watering your habits yields organic, visible life.
        </p>
        <button
          onClick={onEnter}
          className="px-10 py-5 rounded-2xl font-bold shadow-lg transition-all duration-200 cursor-pointer bg-brand-accent hover:bg-brand-accent-hover text-white hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] active:scale-98 text-lg"
        >
          Enter Botanical Workspace
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-border py-8 bg-brand-bg transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-brand-text-secondary font-medium">
            © {new Date().getFullYear()} Berd Habit. Designed for premium botanical productivity.
          </p>
          <div className="flex gap-6 text-xs font-semibold text-brand-text-secondary">
            <span className="hover:text-brand-accent transition cursor-pointer" onClick={onEnter}>Dashboard</span>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-brand-accent transition">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
