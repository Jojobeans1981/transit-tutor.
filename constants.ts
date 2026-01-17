
export const COLORS = {
  primary: '#0039A6', // MTA Blue (A,C,E)
  secondary: '#FF6319', // MTA Orange (B,D,F,M)
  success: '#00853E', // MTA Green (4,5,6)
  warning: '#FCCC0A', // MTA Yellow (N,Q,R,W)
  danger: '#EE352E', // MTA Red (1,2,3)
  purple: '#B933AD', // MTA Purple (7)
  grey: '#A7A9AC', // MTA Grey (L)
  background: '#000000', 
  surface: '#121212',
  card: '#1A1A1A'
};

export const MOCK_TOPICS = [
  "Radio Communication & 10-Codes",
  "Surface Incident Response Protocol",
  "Fleet Maintenance & E-Shop Logs",
  "Traffic Regulation & Operations",
  "Dispatcher Reporting Procedures",
  "Snow Emergency & Level 1 Response"
];

export const INITIAL_USER_TEMPLATE: any = {
  level: 1,
  xp: 0,
  xpToNextLevel: 1000,
  rank: 100,
  totalQuizzesTaken: 0,
  averageScore: 0,
  role: 'candidate',
  weeklyGoals: [
    { id: '1', title: 'Operational Drills', current: 0, target: 5, unit: 'sims' },
    { id: '2', title: 'Knowledge Base Study', current: 0, target: 60, unit: 'mins' },
    { id: '3', title: 'Service Streak', current: 1, target: 5, unit: 'days' }
  ],
  history: [],
  metrics: {
    radioProficiency: 0,
    protocolCompliance: 0,
    incidentResponseSpeed: 'N/A',
    fleetManagementScore: 0,
    safetyCompliance: 0,
    accuracyRate: 0
  }
};

export const MOCK_LEADERBOARD: any[] = [
  { id: '1', name: 'Sgt. J. Miller', level: 24, xp: 12400, avatar: 'M' },
  { id: '2', name: 'Dispatcher A. Chen', level: 21, xp: 10800, avatar: 'C' },
  { id: '3', name: 'Officer D. Banks', level: 19, xp: 9200, avatar: 'B' },
  { id: '4', name: 'Candidate (You)', level: 1, xp: 0, avatar: 'U' },
  { id: '5', name: 'Dispatcher L. Kelly', level: 11, xp: 3900, avatar: 'K' },
  { id: '6', name: 'Officer P. Smith', level: 10, xp: 3200, avatar: 'S' }
];
