/**
 * Timezone-invariant Date Utilities
 */

// Format date as YYYY-MM-DD using local time
export const formatDate = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Get today's date in YYYY-MM-DD
export const getTodayStr = () => formatDate(new Date());

// Get yesterday's date in YYYY-MM-DD
export const getYesterdayStr = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return formatDate(date);
};

// Get past N dates in YYYY-MM-DD format (inclusive of today)
export const getPastDates = (daysCount) => {
  const dates = [];
  for (let i = 0; i < daysCount; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(formatDate(d));
  }
  return dates;
};

// Get day of week name (Mon, Tue...)
export const getDayOfWeek = (dateStr) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return days[date.getDay()];
};

// Parse date string securely
export const parseDateStr = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Streak Calculation Engine
 */
export const calculateStreak = (habitId, allCheckIns) => {
  if (!Array.isArray(allCheckIns)) {
    return { currentStreak: 0, longestStreak: 0, consistency: 0 };
  }
  // Filter completions for this specific habit
  const habitCompletions = allCheckIns
    .filter(ci => ci && ci.habitId === habitId)
    .map(ci => ci.date)
    .filter(Boolean);
  
  if (habitCompletions.length === 0) {
    return { currentStreak: 0, longestStreak: 0, consistency: 0 };
  }

  // Ensure unique sorted dates (ascending)
  const uniqueDates = [...new Set(habitCompletions)].sort();
  
  // Calculate longest streak
  let longest = 0;
  let currentRunning = 0;
  let prevTime = null;

  for (const dateStr of uniqueDates) {
    const currTime = parseDateStr(dateStr).getTime();
    if (prevTime === null) {
      currentRunning = 1;
    } else {
      const diffDays = Math.round((currTime - prevTime) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        currentRunning += 1;
      } else if (diffDays > 1) {
        longest = Math.max(longest, currentRunning);
        currentRunning = 1;
      }
    }
    prevTime = currTime;
  }
  longest = Math.max(longest, currentRunning);

  // Calculate current streak
  let current = 0;
  const todayStr = getTodayStr();
  const yesterdayStr = getYesterdayStr();
  
  const hasToday = uniqueDates.includes(todayStr);
  const hasYesterday = uniqueDates.includes(yesterdayStr);

  if (hasToday || hasYesterday) {
    let checkDate = hasToday ? new Date() : new Date();
    if (!hasToday && hasYesterday) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dateString = formatDate(checkDate);
      if (uniqueDates.includes(dateString)) {
        current++;
        checkDate.setDate(checkDate.getDate() - 1); // step back one day
      } else {
        break;
      }
    }
  }

  // Calculate consistency over last 30 days (or since creation if shorter)
  // Let's check consistency based on the last 30 days
  const last30Days = getPastDates(30);
  const completedInLast30 = last30Days.filter(d => uniqueDates.includes(d)).length;
  const consistency = Math.round((completedInLast30 / 30) * 100);

  return {
    currentStreak: current,
    longestStreak: longest,
    consistency: consistency
  };
};

/**
 * Curated Motivational Quotes Library
 */
export const MOTIVATIONAL_QUOTES = [
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "It is easier to prevent bad habits than to break them.", author: "Benjamin Franklin" },
  { text: "Consistency is the shorthand of execution.", author: "Unknown" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
  { text: "Habits are the compound interest of self-improvement.", author: "James Clear" },
  { text: "Continuous improvement is better than delayed perfection.", author: "Mark Twain" },
  { text: "It's not what we do once in a while that shapes our lives, but what we do consistently.", author: "Tony Robbins" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "Don't break the chain. Every check-off is a vote for the person you want to become.", author: "Jerry Seinfeld" }
];

export const getRandomQuote = () => {
  const index = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[index];
};

/**
 * 90-Day Mock Data Generator
 */
export const DEFAULT_HABITS = [
  {
    id: "h1",
    name: "Morning Meditation",
    description: "10 minutes of silent breath observation to focus the mind.",
    category: "Mindfulness (Rooting)",
    icon: "Brain",
    frequency: "Daily",
    createdAt: formatDate((() => {
      const d = new Date();
      d.setDate(d.getDate() - 95);
      return d;
    })())
  },
  {
    id: "h2",
    name: "Read 15 Pages",
    description: "Read a non-fiction or growth-oriented book.",
    category: "Learning (Branching)",
    icon: "BookOpen",
    frequency: "Daily",
    createdAt: formatDate((() => {
      const d = new Date();
      d.setDate(d.getDate() - 95);
      return d;
    })())
  },
  {
    id: "h3",
    name: "Drink 3L Water",
    description: "Hydrate throughout the day using a marked bottle.",
    category: "Health (Flowering)",
    icon: "Droplet",
    frequency: "Daily",
    createdAt: formatDate((() => {
      const d = new Date();
      d.setDate(d.getDate() - 95);
      return d;
    })())
  },
  {
    id: "h4",
    name: "Gym Workout",
    description: "Resistance training or cardio active session.",
    category: "Fitness (Strengthening)",
    icon: "Dumbbell",
    frequency: "Daily",
    createdAt: formatDate((() => {
      const d = new Date();
      d.setDate(d.getDate() - 95);
      return d;
    })())
  }
];

export const generateMockCheckIns = () => {
  const checkIns = [];
  const past90Days = getPastDates(90);
  
  // Custom probabilities of completion for each habit to make the data look organic
  const habitProbabilities = {
    h1: 0.78, // Meditation (78% completion rate)
    h2: 0.62, // Reading (62% completion rate)
    h3: 0.88, // Water (88% completion rate - highly consistent!)
    h4: 0.55  // Gym (55% completion rate - e.g. 4 times a week)
  };

  // Generate completions. We'll introduce deliberate streaks to make the data visually stunning.
  past90Days.forEach(dateStr => {
    // Determine if user completed each habit on this date
    Object.keys(habitProbabilities).forEach(habitId => {
      let probability = habitProbabilities[habitId];
      
      // Let's create intentional streak clusters by checking adjacent completions!
      // If we completed the day before, let's increase probability to sustain streaks
      const dayBeforeCompleted = checkIns.some(ci => ci.habitId === habitId && ci.date === formatDate(new Date(parseDateStr(dateStr).getTime() + 86400000)));
      if (dayBeforeCompleted) {
        probability += 0.12; // reinforce streaks
      }
      
      if (Math.random() < probability) {
        checkIns.push({
          id: `ci_${habitId}_${dateStr}`,
          habitId: habitId,
          date: dateStr
        });
      }
    });
  });

  return checkIns;
};

// Centralized plant stage calculator
export const getPlantGrowthInfo = (streak) => {
  if (streak < 3) {
    return {
      level: 1,
      stage: 'Seed',
      nextStage: 'Sprout',
      minXP: 0,
      maxXP: 3,
      desc: 'A tiny seed dormant in rich dark soil. Water it with consistent daily habits!',
      ratio: Math.min(1, Math.max(0, streak / 3))
    };
  } else if (streak < 7) {
    return {
      level: 2,
      stage: 'Sprout',
      nextStage: 'Small Plant',
      minXP: 3,
      maxXP: 7,
      desc: 'A fragile green sprout pushing through the earth. Sustained care is required.',
      ratio: Math.min(1, Math.max(0, (streak - 3) / 4))
    };
  } else if (streak < 15) {
    return {
      level: 3,
      stage: 'Small Plant',
      nextStage: 'Blooming Plant',
      minXP: 7,
      maxXP: 15,
      desc: 'A healthy sapling unfurling leaves. Momentum is building.',
      ratio: Math.min(1, Math.max(0, (streak - 7) / 8))
    };
  } else if (streak < 30) {
    return {
      level: 4,
      stage: 'Blooming Plant',
      nextStage: 'Young Tree',
      minXP: 15,
      maxXP: 30,
      desc: 'A vibrant plant decorated by beautiful blossoms. Your consistency is starting to show colors!',
      ratio: Math.min(1, Math.max(0, (streak - 15) / 15))
    };
  } else if (streak < 60) {
    return {
      level: 5,
      stage: 'Young Tree',
      nextStage: 'Flourishing Tree',
      minXP: 30,
      maxXP: 60,
      desc: 'A slender wooden trunk branching out. Growth is visible and sturdy.',
      ratio: Math.min(1, Math.max(0, (streak - 30) / 30))
    };
  } else {
    return {
      level: 6,
      stage: 'Flourishing Tree',
      nextStage: '',
      minXP: 60,
      maxXP: 60,
      desc: 'A majestic, flourishing tree shimmering with starlight. Absolute discipline realized.',
      ratio: 1.0
    };
  }
};
