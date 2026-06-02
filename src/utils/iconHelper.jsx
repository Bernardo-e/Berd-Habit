import { 
  Brain,
  BookOpen,
  Droplet,
  Dumbbell,
  Compass
} from 'lucide-react';

// Helper to get category icons dynamically
export const getCategoryIcon = (category, size = 18, className = "") => {
  const baseCategory = category?.split(' ')?.[0]?.toLowerCase() || '';
  switch (baseCategory) {
    case 'mindfulness':
      return <Brain size={size} className={className} />;
    case 'learning':
      return <BookOpen size={size} className={className} />;
    case 'health':
      return <Droplet size={size} className={className} />;
    case 'fitness':
      return <Dumbbell size={size} className={className} />;
    default:
      return <Compass size={size} className={className} />;
  }
};
