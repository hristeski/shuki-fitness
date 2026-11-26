export type ExerciseItem = {
  id: string;
  name: string;
  sets: string;
  reps: string;
  rest: string;
  restSeconds: number;
  videoUrl: string;
  muscleGroup: string;
};

export type WorkoutSession = {
  id: string;
  title: string;
  focus: string;
  duration: string;
  exercises: ExerciseItem[];
};

export type WeeklyFreq = "2x" | "3x" | "4x" | "5x";

export const WEEK_DAYS = [
  { index: 0, short: "Mon", full: "Monday" },
  { index: 1, short: "Tue", full: "Tuesday" },
  { index: 2, short: "Wed", full: "Wednesday" },
  { index: 3, short: "Thu", full: "Thursday" },
  { index: 4, short: "Fri", full: "Friday" },
  { index: 5, short: "Sat", full: "Saturday" },
  { index: 6, short: "Sun", full: "Sunday" },
] as const;

export const WORKOUT_LIBRARY: Record<string, WorkoutSession> = {
  upperPush: {
    id: "upper-push",
    title: "Upper Body Push",
    focus: "Chest • Shoulders • Triceps",
    duration: "55 min",
    exercises: [
      {
        id: "push-1",
        name: "Incline Dumbbell Press",
        sets: "4",
        reps: "8–10",
        rest: "90s",
        restSeconds: 90,
        muscleGroup: "Chest",
        videoUrl: "https://www.muscleandstrength.com/exercises/incline-dumbbell-bench-press.html",
      },
      {
        id: "push-2",
        name: "Flat Barbell Bench Press",
        sets: "3",
        reps: "8–12",
        rest: "90s",
        restSeconds: 90,
        muscleGroup: "Chest",
        videoUrl: "https://www.muscleandstrength.com/exercises/barbell-bench-press.html",
      },
      {
        id: "push-3",
        name: "Dumbbell Lateral Raises",
        sets: "4",
        reps: "12–15",
        rest: "60s",
        restSeconds: 60,
        muscleGroup: "Shoulders",
        videoUrl: "https://www.muscleandstrength.com/exercises/dumbbell-lateral-raise.html",
      },
      {
        id: "push-4",
        name: "Cable Tricep Pushdowns",
        sets: "3",
        reps: "12–15",
        rest: "60s",
        restSeconds: 60,
        muscleGroup: "Triceps",
        videoUrl: "https://www.muscleandstrength.com/exercises/tricep-rope-pushdown.html",
      },
    ],
  },

  lowerPower: {
    id: "lower-power",
    title: "Lower Body Power",
    focus: "Quads • Glutes • Hamstrings",
    duration: "60 min",
    exercises: [
      {
        id: "lower-1",
        name: "Barbell Back Squat",
        sets: "4",
        reps: "6–8",
        rest: "120s",
        restSeconds: 120,
        muscleGroup: "Quads",
        videoUrl: "https://www.muscleandstrength.com/exercises/squat.html",
      },
      {
        id: "lower-2",
        name: "Romanian Deadlift (RDL)",
        sets: "4",
        reps: "10–12",
        rest: "90s",
        restSeconds: 90,
        muscleGroup: "Hamstrings",
        videoUrl: "https://www.muscleandstrength.com/exercises/romanian-deadlift.html",
      },
      {
        id: "lower-3",
        name: "Bulgarian Split Squats",
        sets: "3",
        reps: "10 / leg",
        rest: "75s",
        restSeconds: 75,
        muscleGroup: "Glutes",
        videoUrl: "https://www.muscleandstrength.com/exercises/dumbbell-split-squat.html",
      },
      {
        id: "lower-4",
        name: "Standing Calf Raises",
        sets: "4",
        reps: "15–20",
        rest: "45s",
        restSeconds: 45,
        muscleGroup: "Calves",
        videoUrl: "https://www.muscleandstrength.com/exercises/standing-calf-raise.html",
      },
    ],
  },

  upperPull: {
    id: "upper-pull",
    title: "Upper Body Pull",
    focus: "Back • Rear Delts • Biceps",
    duration: "55 min",
    exercises: [
      {
        id: "pull-1",
        name: "Lat Pulldown (Wide Grip)",
        sets: "4",
        reps: "10–12",
        rest: "90s",
        restSeconds: 90,
        muscleGroup: "Back",
        videoUrl: "https://www.muscleandstrength.com/exercises/lat-pull-down.html",
      },
      {
        id: "pull-2",
        name: "Seated Cable Row",
        sets: "4",
        reps: "10–12",
        rest: "90s",
        restSeconds: 90,
        muscleGroup: "Back",
        videoUrl: "https://www.muscleandstrength.com/exercises/seated-row.html",
      },
      {
        id: "pull-3",
        name: "Face Pulls",
        sets: "3",
        reps: "15",
        rest: "60s",
        restSeconds: 60,
        muscleGroup: "Rear Delts",
        videoUrl: "https://www.muscleandstrength.com/exercises/face-pull.html",
      },
      {
        id: "pull-4",
        name: "EZ-Bar Bicep Curls",
        sets: "3",
        reps: "10–12",
        rest: "60s",
        restSeconds: 60,
        muscleGroup: "Biceps",
        videoUrl: "https://www.muscleandstrength.com/exercises/ez-bar-curl.html",
      },
    ],
  },

  fullBody: {
    id: "full-body",
    title: "Full Body & Core",
    focus: "Conditioning • Abs • Weak Points",
    duration: "50 min",
    exercises: [
      {
        id: "full-1",
        name: "Dumbbell Shoulder Press",
        sets: "3",
        reps: "10–12",
        rest: "75s",
        restSeconds: 75,
        muscleGroup: "Shoulders",
        videoUrl: "https://www.muscleandstrength.com/exercises/seated-dumbbell-press.html",
      },
      {
        id: "full-2",
        name: "Walking Dumbbell Lunges",
        sets: "3",
        reps: "12 / leg",
        rest: "75s",
        restSeconds: 75,
        muscleGroup: "Legs",
        videoUrl: "https://www.muscleandstrength.com/exercises/dumbbell-lunge.html",
      },
      {
        id: "full-3",
        name: "Dumbbell Row (Single Arm)",
        sets: "3",
        reps: "10 / side",
        rest: "60s",
        restSeconds: 60,
        muscleGroup: "Back",
        videoUrl: "https://www.muscleandstrength.com/exercises/one-arm-dumbbell-row.html",
      },
      {
        id: "full-4",
        name: "Hanging Leg Raises",
        sets: "4",
        reps: "12–15",
        rest: "60s",
        restSeconds: 60,
        muscleGroup: "Core",
        videoUrl: "https://www.muscleandstrength.com/exercises/hanging-leg-raise.html",
      },
    ],
  },

  shouldersArms: {
    id: "shoulders-arms",
    title: "Shoulders, Arms & Core",
    focus: "Delts • Biceps • Triceps • Abs",
    duration: "50 min",
    exercises: [
      {
        id: "arms-1",
        name: "Seated Dumbbell Shoulder Press",
        sets: "4",
        reps: "8–10",
        rest: "90s",
        restSeconds: 90,
        muscleGroup: "Shoulders",
        videoUrl: "https://www.muscleandstrength.com/exercises/seated-dumbbell-press.html",
      },
      {
        id: "arms-2",
        name: "Hammer Curls",
        sets: "3",
        reps: "12",
        rest: "60s",
        restSeconds: 60,
        muscleGroup: "Biceps",
        videoUrl: "https://www.muscleandstrength.com/exercises/hammer-curl.html",
      },
      {
        id: "arms-3",
        name: "Overhead Cable Tricep Extension",
        sets: "3",
        reps: "12–15",
        rest: "60s",
        restSeconds: 60,
        muscleGroup: "Triceps",
        videoUrl: "https://www.muscleandstrength.com/exercises/overhead-rope-tricep-extension.html",
      },
      {
        id: "arms-4",
        name: "Plank Hold",
        sets: "3",
        reps: "60 sec",
        rest: "45s",
        restSeconds: 45,
        muscleGroup: "Core",
        videoUrl: "https://www.muscleandstrength.com/exercises/hover.html",
      },
    ],
  },
};

// Мапирање од Monday (0) до Sunday (6) според тоа колку пати неделно сака да вежба
export const WEEKLY_SCHEDULES: Record<WeeklyFreq, Record<number, WorkoutSession | null>> = {
  "2x": {
    0: WORKOUT_LIBRARY.upperPush, // Monday
    1: null,                      // Tuesday (Rest)
    2: null,                      // Wednesday (Rest)
    3: WORKOUT_LIBRARY.lowerPower,// Thursday
    4: null,                      // Friday (Rest)
    5: null,                      // Saturday (Rest)
    6: null,                      // Sunday (Rest)
  },
  "3x": {
    0: WORKOUT_LIBRARY.upperPush, // Monday
    1: null,                      // Tuesday
    2: WORKOUT_LIBRARY.lowerPower,// Wednesday
    3: null,                      // Thursday
    4: WORKOUT_LIBRARY.upperPull, // Friday
    5: null,                      // Saturday
    6: null,                      // Sunday
  },
  "4x": {
    0: WORKOUT_LIBRARY.upperPush, // Monday
    1: WORKOUT_LIBRARY.lowerPower,// Tuesday
    2: null,                      // Wednesday
    3: WORKOUT_LIBRARY.upperPull, // Thursday
    4: WORKOUT_LIBRARY.fullBody,  // Friday
    5: null,                      // Saturday
    6: null,                      // Sunday
  },
  "5x": {
    0: WORKOUT_LIBRARY.upperPush,     // Monday
    1: WORKOUT_LIBRARY.lowerPower,    // Tuesday
    2: WORKOUT_LIBRARY.upperPull,     // Wednesday
    3: null,                          // Thursday
    4: WORKOUT_LIBRARY.shouldersArms, // Friday
    5: WORKOUT_LIBRARY.fullBody,      // Saturday
    6: null,                          // Sunday
  },
};

export const REST_DAY_HABITS = [
  { id: "rest-steps", label: "8,000 – 10,000 Daily Steps (Light Walk)" },
  { id: "rest-water", label: "Drink 3L+ Water & Electrolytes" },
  { id: "rest-stretch", label: "10 min Mobility & Stretching" },
  { id: "rest-sleep", label: "7–8 Hours Quality Sleep for Muscle Growth" },
];

export type MealOption = {
  name: string;
  ingredients: string;
  kcal: number;
  protein: number;
  carbs: number;
  fats: number;
};

export type MealSlot = {
  id: string;
  slotName: string;
  time: string;
  options: MealOption[];
};

export const NUTRITION_PLANS_DATA: Record<"cutting" | "bulking" | "vegan", MealSlot[]> = {
  cutting: [
    {
      id: "c-m1",
      slotName: "Meal 1 • Breakfast",
      time: "08:30",
      options: [
        {
          name: "Egg White & Whole Egg Veggie Omelette",
          ingredients: "2 whole eggs, 150ml egg whites, spinach, 1 slice wholegrain toast",
          kcal: 380,
          protein: 34,
          carbs: 28,
          fats: 13,
        },
        {
          name: "Greek Yogurt & Whey Berry Bowl",
          ingredients: "250g 0% Greek yogurt, 25g whey protein, 80g mixed berries, cinnamon",
          kcal: 350,
          protein: 42,
          carbs: 30,
          fats: 4,
        },
        {
          name: "High-Protein Cottage Cheese Toast",
          ingredients: "200g low-fat cottage cheese, 2 rye toasts, cherry tomatoes, cucumber",
          kcal: 370,
          protein: 32,
          carbs: 36,
          fats: 9,
        },
      ],
    },
    {
      id: "c-m2",
      slotName: "Meal 2 • Lunch",
      time: "13:30",
      options: [
        {
          name: "Grilled Chicken & Roasted Sweet Potato",
          ingredients: "180g chicken breast, 180g sweet potato, steamed broccoli, 1 tsp olive oil",
          kcal: 490,
          protein: 48,
          carbs: 44,
          fats: 11,
        },
        {
          name: "Turkey Breast & Jasmine Rice Bowl",
          ingredients: "180g lean turkey breast, 150g cooked rice, mixed green salad, lemon",
          kcal: 475,
          protein: 46,
          carbs: 48,
          fats: 9,
        },
        {
          name: "Tuna & Quinoa Mediterranean Salad",
          ingredients: "160g tuna in water, 140g cooked quinoa, peppers, olives, light dressing",
          kcal: 460,
          protein: 44,
          carbs: 40,
          fats: 12,
        },
      ],
    },
    {
      id: "c-m3",
      slotName: "Meal 3 • Dinner",
      time: "19:00",
      options: [
        {
          name: "Baked White Fish & Asparagus",
          ingredients: "200g cod or sea bass, 150g boiled potatoes, grilled asparagus & garlic",
          kcal: 420,
          protein: 44,
          carbs: 34,
          fats: 10,
        },
        {
          name: "Lean Beef Stir-Fry & Zucchini",
          ingredients: "160g 5% lean beef strips, bell peppers, zucchini, soy sauce, 100g rice",
          kcal: 450,
          protein: 42,
          carbs: 36,
          fats: 13,
        },
        {
          name: "Crispy Air-Fryer Chicken Salad",
          ingredients: "180g spiced chicken breast, arugula, avocado (40g), balsamic glaze",
          kcal: 430,
          protein: 46,
          carbs: 18,
          fats: 18,
        },
      ],
    },
    {
      id: "c-m4",
      slotName: "Meal 4 • Post-Workout / Snack",
      time: "16:30",
      options: [
        {
          name: "Whey Shake & Green Apple",
          ingredients: "1 scoop whey isolate + water + 1 medium green apple",
          kcal: 215,
          protein: 27,
          carbs: 24,
          fats: 1,
        },
        {
          name: "Skyr Yogurt & Rice Cakes",
          ingredients: "170g plain Skyr, 2 plain rice cakes, pinch of stevia",
          kcal: 220,
          protein: 22,
          carbs: 28,
          fats: 2,
        },
      ],
    },
  ],

  bulking: [
    {
      id: "b-m1",
      slotName: "Meal 1 • Breakfast",
      time: "08:30",
      options: [
        {
          name: "Anabolic Peanut Butter & Banana Oats",
          ingredients: "100g rolled oats, 1 scoop whey, 1 banana, 20g peanut butter, milk",
          kcal: 740,
          protein: 46,
          carbs: 92,
          fats: 20,
        },
        {
          name: "3-Egg Avocado Toast & Cheese Omelette",
          ingredients: "3 whole eggs, 2 egg whites, 50g feta, 2 slices sourdough, 1/2 avocado",
          kcal: 710,
          protein: 44,
          carbs: 54,
          fats: 32,
        },
      ],
    },
    {
      id: "b-m2",
      slotName: "Meal 2 • Lunch",
      time: "13:30",
      options: [
        {
          name: "Lean Beef & Jasmine Rice Power Skillet",
          ingredients: "200g lean ground beef, 250g cooked jasmine rice, peppers, olive oil",
          kcal: 780,
          protein: 52,
          carbs: 86,
          fats: 22,
        },
        {
          name: "Creamy Chicken Pesto Pasta",
          ingredients: "200g chicken breast, 120g dry pasta, 1 tbsp pesto, parmesan, spinach",
          kcal: 790,
          protein: 56,
          carbs: 90,
          fats: 21,
        },
      ],
    },
    {
      id: "b-m3",
      slotName: "Meal 3 • Dinner",
      time: "19:30",
      options: [
        {
          name: "Grilled Salmon & Sweet Potato Mash",
          ingredients: "200g Atlantic salmon, 280g sweet potato, green beans, butter",
          kcal: 720,
          protein: 46,
          carbs: 64,
          fats: 28,
        },
        {
          name: "Chicken Thighs & Potato Wedges",
          ingredients: "220g skinless chicken thighs, 300g baked potatoes, Greek salad",
          kcal: 730,
          protein: 50,
          carbs: 72,
          fats: 24,
        },
      ],
    },
    {
      id: "b-m4",
      slotName: "Meal 4 • Mass Shake / Snack",
      time: "16:30",
      options: [
        {
          name: "Evolution Mass Smoothie",
          ingredients: "1 scoop whey, 50g oats, 1 banana, 250ml milk, 15g honey",
          kcal: 540,
          protein: 38,
          carbs: 76,
          fats: 9,
        },
        {
          name: "Greek Yogurt, Granola & Almonds",
          ingredients: "250g full-fat Greek yogurt, 60g granola, 20g roasted almonds",
          kcal: 560,
          protein: 32,
          carbs: 54,
          fats: 24,
        },
      ],
    },
  ],

  vegan: [
    {
      id: "v-m1",
      slotName: "Meal 1 • Breakfast",
      time: "08:30",
      options: [
        {
          name: "Tofu Scramble & Avocado Sourdough",
          ingredients: "200g firm tofu, turmeric, spinach, 2 slices sourdough, 1/2 avocado",
          kcal: 510,
          protein: 30,
          carbs: 48,
          fats: 21,
        },
        {
          name: "Pea Protein Berry Overnight Oats",
          ingredients: "80g oats, 1 scoop vegan protein, soy milk, chia seeds, berries",
          kcal: 495,
          protein: 34,
          carbs: 62,
          fats: 12,
        },
      ],
    },
    {
      id: "v-m2",
      slotName: "Meal 2 • Lunch",
      time: "13:30",
      options: [
        {
          name: "Crispy Tempeh & Quinoa Buddha Bowl",
          ingredients: "160g marinated tempeh, 180g cooked quinoa, edamame, tahini drizzle",
          kcal: 620,
          protein: 38,
          carbs: 62,
          fats: 22,
        },
        {
          name: "Red Lentil Bolognese & Wholewheat Pasta",
          ingredients: "100g dry red lentils, 100g wholewheat pasta, tomato sauce, nutritional yeast",
          kcal: 610,
          protein: 35,
          carbs: 96,
          fats: 8,
        },
      ],
    },
    {
      id: "v-m3",
      slotName: "Meal 3 • Dinner",
      time: "19:00",
      options: [
        {
          name: "Seitan & Roasted Sweet Potato Stir-Fry",
          ingredients: "150g seitan strips, 200g sweet potato, broccoli, sesame oil",
          kcal: 540,
          protein: 42,
          carbs: 58,
          fats: 14,
        },
        {
          name: "Chickpea Coconut Curry & Basmati Rice",
          ingredients: "200g cooked chickpeas, light coconut milk, spinach, 180g cooked rice",
          kcal: 560,
          protein: 24,
          carbs: 78,
          fats: 16,
        },
      ],
    },
  ],
};