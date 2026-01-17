
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'Radio Codes' | 'Protocols' | 'Safety' | 'Logistics' | 'General Knowledge';
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  timestamp: number;
}

export interface WeeklyGoal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
}

export interface StudyMaterialItem {
  id: string;
  title: string;
  type: string;
  size: string;
  date: string;
  cat: string;
  bullet: string;
  color: string;
  content?: string; // Content field from the PDF parser script
}

export interface UserPerformanceMetrics {
  radioProficiency: number;
  protocolCompliance: number;
  incidentResponseSpeed: string;
  fleetManagementScore: number;
  safetyCompliance: number;
  accuracyRate: number;
}

export interface UserProfile {
  id: string;
  username: string;
  password?: string;
  name: string;
  employeeId: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  rank: number;
  totalQuizzesTaken: number;
  averageScore: number;
  weeklyGoals: WeeklyGoal[];
  history: { date: string; score: number }[];
  metrics: UserPerformanceMetrics;
  role: 'admin' | 'candidate';
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  level: number;
  xp: number;
  avatar: string;
}
