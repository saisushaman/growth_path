export type MicroTaskDomain =
  | 'learning'
  | 'public_speaking'
  | 'fitness'
  | 'career'
  | 'habit'
  | 'productivity';

export interface MicroTaskDoc {
  id: string;
  title: string;
  goalExample: string;
  domain: MicroTaskDomain;
  microTasks: string[];
}

// Small curated knowledge base of example goals and their micro-tasks.
// These are used as context in the RAG pipeline to guide the model.
export const MICRO_TASK_KB: MicroTaskDoc[] = [
  {
    id: 'learn_programming_language',
    title: 'Learn a new programming language',
    goalExample: 'Learn Java from scratch',
    domain: 'learning',
    microTasks: [
      '1. Install the language runtime and an IDE or editor - 20 min - Day 1 - easy',
      '2. Complete a basic “Hello World” tutorial and run it - 15 min - Day 1 - easy',
      '3. Learn variables, types, and conditionals with 3–5 tiny code examples - 25 min - Day 2 - medium',
      '4. Practice loops by solving 3 short problems (e.g., sum numbers, print patterns) - 30 min - Day 3 - medium',
      '5. Build one tiny project (e.g., console app) that uses what you learned - 40 min - Day 4 - medium',
    ],
  },
  {
    id: 'public_speaking_confidence',
    title: 'Improve public speaking confidence',
    goalExample: 'Improve public speaking',
    domain: 'public_speaking',
    microTasks: [
      '1. Choose one short topic or story you feel comfortable talking about - 10 min - Day 1 - easy',
      '2. Write a 2–3 minute outline for that topic (intro, 3 points, close) - 20 min - Day 1 - medium',
      '3. Practice delivering the outline out loud twice, recording the second attempt - 20 min - Day 2 - medium',
      '4. Watch the recording and note 3 strengths and 1 improvement area - 15 min - Day 2 - easy',
      '5. Schedule one low-stakes practice (friend, mirror, small group, online meeting) - 15 min - Day 3 - medium',
    ],
  },
  {
    id: 'fitness_routine',
    title: 'Start a simple fitness routine',
    goalExample: 'Get fit and exercise regularly',
    domain: 'fitness',
    microTasks: [
      '1. Decide your main activity (walk, run, home workout) and preferred time of day - 10 min - Day 1 - easy',
      '2. Prepare your gear (clothes, shoes, water, app or playlist) and place it ready - 15 min - Day 1 - medium',
      '3. Do a short 10–15 minute low‑intensity session to test your routine - 15 min - Day 2 - medium',
      '4. Stretch for 5–10 minutes after your session and note how your body feels - 10 min - Day 2 - easy',
      '5. Plan the next 3 sessions (days and times) in your calendar - 15 min - Day 3 - medium',
    ],
  },
  {
    id: 'career_project',
    title: 'Move a career project forward',
    goalExample: 'Make progress on an important work or portfolio project',
    domain: 'career',
    microTasks: [
      '1. Write a one-sentence definition of success for this project - 10 min - Day 1 - easy',
      '2. Break the project into 3–5 chunks (research, planning, execution, review) - 20 min - Day 1 - medium',
      '3. Do a 25-minute focused work block on just the first chunk (no multitasking) - 25 min - Day 2 - medium',
      '4. Capture 3 insights or open questions that appeared while working - 10 min - Day 2 - easy',
      '5. Block the next 2 focused sessions in your calendar with clear sub-tasks - 15 min - Day 3 - medium',
    ],
  },
  {
    id: 'habit_building',
    title: 'Build a consistent habit',
    goalExample: 'Build a daily habit (reading, journaling, meditation, etc.)',
    domain: 'habit',
    microTasks: [
      '1. Choose a tiny version of the habit that takes 2–5 minutes - 10 min - Day 1 - easy',
      '2. Decide on a trigger (after coffee, after dinner, before bed) and write it down - 10 min - Day 1 - easy',
      '3. Set up the environment so the habit is obvious and easy to start - 15 min - Day 1 - medium',
      '4. Do the habit once today and log it somewhere simple (note, app, checklist) - 10 min - Day 1 - easy',
      '5. Review after 3 days and adjust the habit or trigger if it feels too big - 15 min - Day 3 - medium',
    ],
  },
  {
    id: 'productivity_focus',
    title: 'Reduce procrastination and increase focus',
    goalExample: 'Stop procrastinating and actually start important tasks',
    domain: 'productivity',
    microTasks: [
      '1. List the top 3 tasks you are avoiding and circle the most important one - 10 min - Day 1 - easy',
      '2. Break that task into the smallest possible starting step you can finish in 10–15 minutes - 10 min - Day 1 - easy',
      '3. Remove 2 obvious distractions (phone away, tabs closed) and start that tiny step - 15 min - Day 1 - medium',
      '4. After finishing, write down how long it actually took and how you felt - 10 min - Day 1 - easy',
      '5. Plan a second tiny step for tomorrow and add it to your calendar - 10 min - Day 2 - easy',
    ],
  },
];

