
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import QuizView from './components/QuizView';
import StudyMaterial from './components/StudyMaterial';
import ChatBot from './components/ChatBot';
import Auth from './components/Auth';
import Leaderboard from './components/Leaderboard';
import AdminView from './components/AdminView';
import { INITIAL_USER_TEMPLATE } from './constants';
import { StudyMaterialItem, UserProfile } from './types';

const INITIAL_MATERIALS: StudyMaterialItem[] = [
  { id: '1', title: "Standard Dispatch Radio Codes", type: "PDF", size: "2.4 MB", date: "Oct 2023", cat: "comm", bullet: "A", color: "bg-[#0039A6]" },
  { id: '2', title: "Emergency Incident Hierarchy", type: "Manual", size: "5.1 MB", date: "Sep 2023", cat: "protocols", bullet: "S", color: "bg-[#FF6319]" },
  { id: '3', title: "Vehicle Shop Safety Standards", type: "Regulation", size: "1.2 MB", date: "Aug 2023", cat: "safety", bullet: "4", color: "bg-[#00853E]" },
  { id: '4', title: "Snow Emergency Staffing Plan", type: "Policy", size: "840 KB", date: "Oct 2023", cat: "protocols", bullet: "S", color: "bg-[#FF6319]" },
  { id: '5', title: "E-Shop Inventory Procedures", type: "Workflow", size: "1.5 MB", date: "Jul 2023", cat: "logistics", bullet: "L", color: "bg-[#A7A9AC]" },
  { id: '6', title: "Dispatcher Ethics & Conduct", type: "Manual", size: "1.1 MB", date: "Nov 2023", cat: "general", bullet: "1", color: "bg-[#EE352E]" },
];

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState<StudyMaterialItem[]>(INITIAL_MATERIALS);

  useEffect(() => {
    const activeUsername = localStorage.getItem('soda_active_user');
    if (activeUsername) {
      const usersData = JSON.parse(localStorage.getItem('soda_academy_users') || '{}');
      if (usersData[activeUsername]) {
        setUser(usersData[activeUsername]);
      }
    }

    const savedMaterials = localStorage.getItem('soda_academy_materials');
    if (savedMaterials) {
      setMaterials(JSON.parse(savedMaterials));
    }

    setLoading(false);
  }, []);

  const handleAddMaterials = (newMaterials: StudyMaterialItem[]) => {
    const updated = [...newMaterials, ...materials];
    setMaterials(updated);
    localStorage.setItem('soda_academy_materials', JSON.stringify(updated));
  };

  const handleLogin = (username: string, password: string, name: string, isSignUp: boolean) => {
    const usersData = JSON.parse(localStorage.getItem('soda_academy_users') || '{}');

    if (isSignUp) {
      if (usersData[username]) {
        return "Username already exists in Academy files.";
      }
      // Simple logic: if username contains 'admin', make them admin for testing
      const role = username.toLowerCase().includes('admin') ? 'admin' : 'candidate';
      const newUser: UserProfile = {
        ...INITIAL_USER_TEMPLATE,
        id: `soda-${Date.now()}`,
        username,
        password,
        name: name || username,
        role,
        employeeId: `NY-${Math.floor(1000 + Math.random() * 9000)}-SODA`
      };
      usersData[username] = newUser;
      localStorage.setItem('soda_academy_users', JSON.stringify(usersData));
      localStorage.setItem('soda_active_user', username);
      setUser(newUser);
      return null;
    } else {
      const existingUser = usersData[username];
      if (!existingUser || existingUser.password !== password) {
        return "Access Denied: Invalid Username or Password.";
      }
      localStorage.setItem('soda_active_user', username);
      setUser(existingUser);
      return null;
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('soda_active_user');
    setActiveTab('dashboard');
  };

  const handleQuizComplete = (score: number, earnedXp: number) => {
    if (!user) return;
    
    const newXp = user.xp + earnedXp;
    let newLevel = user.level;
    let nextXpGoal = user.xpToNextLevel;

    if (newXp >= nextXpGoal) {
      newLevel += 1;
      nextXpGoal = Math.round(nextXpGoal * 1.6);
    }

    const percentage = Math.round((score / 5) * 100);
    
    const updatedMetrics = {
      ...user.metrics,
      accuracyRate: Math.round((user.metrics.accuracyRate + percentage) / (user.totalQuizzesTaken > 0 ? 2 : 1)),
      radioProficiency: Math.min(100, user.metrics.radioProficiency + (percentage > 80 ? 5 : 0)),
      protocolCompliance: Math.min(100, user.metrics.protocolCompliance + (percentage > 60 ? 3 : -1)),
      incidentResponseSpeed: user.metrics.incidentResponseSpeed === 'N/A' ? '4.2s' : `${(Math.random() * 2 + 3).toFixed(1)}s`
    };

    const updatedUser = {
      ...user,
      xp: newXp,
      level: newLevel,
      xpToNextLevel: nextXpGoal,
      totalQuizzesTaken: user.totalQuizzesTaken + 1,
      history: [...user.history, { date: new Date().toLocaleDateString(), score: percentage }],
      metrics: updatedMetrics
    };

    const usersData = JSON.parse(localStorage.getItem('soda_academy_users') || '{}');
    usersData[updatedUser.username] = updatedUser;
    localStorage.setItem('soda_academy_users', JSON.stringify(usersData));
    setUser(updatedUser);
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-6">
      <div className="w-16 h-16 border-4 border-[#0039A6] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-white font-black uppercase tracking-[0.5em] text-xs">Syncing Command Systems</p>
    </div>
  );

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'quiz':
        return <QuizView onComplete={handleQuizComplete} />;
      case 'study':
        return <StudyMaterial materials={materials} />;
      case 'chat':
        return <ChatBot />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'admin':
        return user.role === 'admin' ? <AdminView onUpload={handleAddMaterials} materials={materials} /> : <Dashboard user={user} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      user={user} 
      onLogout={handleLogout}
    >
      <div className="animate-in fade-in slide-in-from-right-2 duration-700 h-full">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
