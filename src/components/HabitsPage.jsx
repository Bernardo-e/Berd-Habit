import { useState } from 'react';
import { 
  Plus, 
  Flame, 
  Trash2, 
  Edit3, 
  X,
  AlertCircle,
  Calendar,
  Sparkles
} from 'lucide-react';
import { getCategoryIcon } from '../utils/iconHelper';
import { calculateStreak, formatDate } from '../utils/dataHelper';

export default function HabitsPage({ habits, checkIns, onAddHabit, onUpdateHabit, onDeleteHabit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Mindfulness (Rooting)');
  const [frequency, setFrequency] = useState('Daily');
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingHabit(null);
    setName('');
    setDescription('');
    setCategory('Mindfulness (Rooting)');
    setFrequency('Daily');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (habit) => {
    setEditingHabit(habit);
    setName(habit.name);
    setDescription(habit.description || '');
    setCategory(habit.category);
    setFrequency(habit.frequency);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please enter a discipline name.');
      return;
    }

    const habitData = {
      id: editingHabit ? editingHabit.id : `habit_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      category,
      frequency,
      createdAt: editingHabit ? editingHabit.createdAt : formatDate(new Date())
    };

    if (editingHabit) {
      onUpdateHabit(habitData);
    } else {
      onAddHabit(habitData);
    }

    setIsModalOpen(false);
  };

  const categories = [
    'Mindfulness (Rooting)', 
    'Learning (Branching)', 
    'Health (Flowering)', 
    'Fitness (Strengthening)', 
    'Other (Seeding)'
  ];

  // Map category to organic forest outline tags
  const getCategoryColor = (cat) => {
    const cleanCat = cat?.split(' ')?.[0]?.toLowerCase() || '';
    switch (cleanCat) {
      case 'mindfulness':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/25';
      case 'learning':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/25';
      case 'health':
        return 'bg-emerald-500/10 text-emerald-450 border-emerald-500/25';
      case 'fitness':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/25';
      default:
        return 'bg-brand-surface text-brand-text-secondary border-brand-border';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-brand-text-primary">
            Habit Garden
          </h2>
          <p className="text-brand-text-secondary font-medium text-sm mt-1">
            Plant, customize, and refine your active disciplines.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="py-2.5 px-4 rounded-xl font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 bg-brand-accent hover:bg-brand-accent-hover text-white shadow-md active:scale-98 text-sm"
        >
          <Plus size={16} />
          Plant Habit
        </button>
      </div>

      {/* Habits List Grid */}
      {habits.length === 0 ? (
        <div className="p-16 text-center rounded-3xl border border-dashed border-brand-border bg-brand-card/30 flex flex-col items-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-brand-surface flex items-center justify-center text-3xl mb-5 shadow-inner border border-brand-border">
            🌱
          </div>
          <h4 className="font-heading text-lg font-bold mb-2 text-brand-text-primary">
            No habits planted
          </h4>
          <p className="text-sm text-brand-text-secondary max-w-xs mb-6 font-medium">
            Plant your first custom discipline to water your plant and track streaks.
          </p>
          <button
            onClick={openAddModal}
            className="py-2.5 px-5 rounded-xl font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 bg-brand-accent hover:bg-brand-accent-hover text-white shadow-md active:scale-98 text-sm"
          >
            <Plus size={16} />
            Plant First Habit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {habits.map((habit) => {
            const streakData = calculateStreak(habit.id, checkIns);

            return (
              <div 
                key={habit.id}
                className="p-6 rounded-3xl border border-brand-border bg-brand-card shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between group gap-6 relative overflow-hidden"
              >
                {/* Visual Category Accent Line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-accent/15 to-transparent"></div>
                
                <div className="space-y-4">
                  {/* Top Bar: Category + Freq + Edit/Delete */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryColor(habit.category)}`}>
                        {habit.category.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-surface text-brand-text-secondary border border-brand-border">
                        {habit.frequency.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition duration-150">
                      <button
                        onClick={() => openEditModal(habit)}
                        className="p-1.5 rounded-lg text-brand-text-secondary hover:text-brand-accent hover:bg-brand-surface transition cursor-pointer"
                        title="Edit Habit"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${habit.name}"? This will clear all historical completions.`)) {
                            onDeleteHabit(habit.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-brand-text-secondary hover:text-rose-500 hover:bg-brand-surface transition cursor-pointer"
                        title="Delete Habit"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="font-heading text-lg font-bold flex items-center gap-2.5 text-brand-text-primary">
                      <span className="inline-block text-brand-accent shrink-0">
                        {getCategoryIcon(habit.category, 18)}
                      </span>
                      <span className="truncate">{habit.name}</span>
                    </h3>
                    {habit.description && (
                      <p className="text-xs text-brand-text-secondary font-medium leading-relaxed">
                        {habit.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Bar: Streaks display */}
                <div className="pt-4 border-t border-brand-border flex items-center gap-4">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    <Flame size={12} className="fill-current" />
                    <div>
                      <span className="text-[10px] font-bold text-brand-text-secondary block leading-none">CURRENT</span>
                      <span className="text-xs font-bold">{streakData.currentStreak} days</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-brand-accent/10 text-brand-accent border border-brand-accent/20">
                    <Sparkles size={12} />
                    <div>
                      <span className="text-[10px] font-bold text-brand-text-secondary block leading-none">LONGEST</span>
                      <span className="text-xs font-bold">{streakData.longestStreak} days</span>
                    </div>
                  </div>

                  <div className="ml-auto text-right">
                    <span className="text-[9px] font-bold text-brand-text-secondary block leading-none">CONSISTENCY</span>
                    <span className="text-xs font-bold text-brand-text-primary">{streakData.consistency}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Habit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="max-w-md w-full bg-brand-card rounded-3xl border border-brand-border shadow-2xl overflow-hidden scale-in transform transition-all duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-brand-border flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold flex items-center gap-2 text-brand-text-primary">
                <span className="text-brand-accent">🌱</span>
                {editingHabit ? 'Modify Habit' : 'Plant New Habit'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="p-3.5 bg-rose-950/20 text-rose-455 text-xs rounded-xl flex items-center gap-2 font-medium border border-rose-500/10">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Habit Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-text-secondary tracking-wider">
                  HABIT NAME
                </label>
                <input
                  type="text"
                  placeholder="e.g., Read 15 Pages"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (formError) setFormError('');
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg placeholder-brand-text-secondary/50 font-semibold focus:outline-none focus:border-brand-accent focus:bg-brand-surface transition duration-150 text-brand-text-primary text-sm"
                  maxLength={50}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-text-secondary tracking-wider">
                  DESCRIPTION (OPTIONAL)
                </label>
                <textarea
                  placeholder="e.g., Morning routine, non-fiction book"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg placeholder-brand-text-secondary/50 font-semibold focus:outline-none focus:border-brand-accent focus:bg-brand-surface transition duration-150 min-h-[80px] text-brand-text-primary text-sm"
                  maxLength={120}
                />
              </div>

              {/* Category Chips */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-brand-text-secondary tracking-wider block">
                  CATEGORY
                </span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const isSelected = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition duration-150 flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-brand-accent/15 border-brand-accent text-brand-accent font-bold'
                            : 'bg-brand-bg border-brand-border text-brand-text-secondary hover:border-brand-text-secondary/30'
                        }`}
                      >
                        {getCategoryIcon(cat, 12)}
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Frequency Pattern */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-brand-text-secondary tracking-wider block">
                  FREQUENCY
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {['Daily', 'Weekly'].map((freq) => {
                    const isSelected = frequency === freq;
                    return (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setFrequency(freq)}
                        className={`py-3 rounded-xl text-xs font-bold cursor-pointer border transition duration-150 flex items-center justify-center gap-2 ${
                          isSelected
                            ? 'bg-brand-accent/15 border-brand-accent text-brand-accent font-bold'
                            : 'bg-brand-bg border-brand-border text-brand-text-secondary hover:border-brand-text-secondary/30'
                        }`}
                      >
                        <Calendar size={14} />
                        {freq} Track
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-brand-border flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 rounded-xl text-xs font-bold border border-brand-border hover:bg-brand-surface text-brand-text-secondary transition duration-150 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl text-xs font-bold bg-brand-accent hover:bg-brand-accent-hover text-white shadow-md active:scale-98 transition duration-150 cursor-pointer"
                >
                  {editingHabit ? 'Save Changes' : 'Plant Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
