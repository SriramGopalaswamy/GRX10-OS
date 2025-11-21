
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Goal, Memo, Role, Team, GoalType, GoalStatus, MemoStatus } from '../types';

// Mock Data
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Sriram (Founder)', email: 'sriram@grx10.com', role: Role.ADMIN, team: Team.LEADERSHIP, avatarUrl: 'https://picsum.photos/id/1/200/200' },
  { id: 'u2', name: 'Prem (Founder)', email: 'prem@grx10.com', role: Role.ADMIN, team: Team.LEADERSHIP, avatarUrl: 'https://picsum.photos/id/2/200/200' },
  { id: 'u3', name: 'Arjun (RevOps)', email: 'arjun@grx10.com', role: Role.MANAGER, team: Team.REVOPS, avatarUrl: 'https://picsum.photos/id/3/200/200' },
  { id: 'u4', name: 'Sarah (Solar)', email: 'sarah@grx10.com', role: Role.EMPLOYEE, team: Team.SOLAR_OPS, avatarUrl: 'https://picsum.photos/id/4/200/200' },
];

const MOCK_GOALS: Goal[] = [
  {
    id: 'g1',
    ownerId: 'u4',
    title: 'Increase Residential Solar Installs',
    type: GoalType.QUARTERLY,
    metric: 'Installations/Month',
    baseline: 12,
    target: 20,
    current: 15,
    timeline: '2024-06-30',
    status: GoalStatus.ON_TRACK,
    comments: [
      { id: 'c1', authorId: 'u3', text: 'Great progress! Are we still waiting on the panel shipments?', timestamp: 'May 12, 10:30 AM' },
      { id: 'c2', authorId: 'u4', text: 'Yes, arriving next Tuesday. We should hit 18 by month end.', timestamp: 'May 12, 11:15 AM' }
    ]
  },
  {
    id: 'g2',
    ownerId: 'u3',
    title: 'Reduce CAC via LinkedIn Ads',
    type: GoalType.QUARTERLY,
    metric: 'CAC ($)',
    baseline: 150,
    target: 90,
    current: 110,
    timeline: '2024-06-30',
    status: GoalStatus.AT_RISK,
    comments: []
  }
];

const MOCK_MEMOS: Memo[] = [
  {
    id: 'm1',
    fromId: 'u3',
    toId: 'u1',
    date: '2024-05-10',
    subject: 'Proposed Switch to HubSpot',
    status: MemoStatus.APPROVED,
    summary: 'Problem: Current Salesforce setup costs $4k/mo with low adoption.\n\nSolution: Migrate to HubSpot Pro to save $32k/annually and improve rep adoption to 80%.\n\nAsk: Approve $10k budget for migration consultant.',
    attachments: [
      { id: 'a1', name: 'HubSpot_Pricing_Comparison.pdf', size: '2.4 MB', type: 'application/pdf' },
      { id: 'a2', name: 'Migration_Timeline.xlsx', size: '1.1 MB', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    ],
    comments: []
  }
];

interface StoreContextType {
  currentUser: User;
  users: User[];
  goals: Goal[];
  memos: Memo[];
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  addMemo: (memo: Memo) => void;
  updateMemo: (memo: Memo) => void;
  setCurrentUser: (user: User) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[2]); // Default to Arjun (Manager)
  const [users] = useState<User[]>(MOCK_USERS);
  const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS);
  const [memos, setMemos] = useState<Memo[]>(MOCK_MEMOS);

  const addGoal = (goal: Goal) => setGoals(prev => [...prev, goal]);
  
  const updateGoal = (updatedGoal: Goal) => {
    setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
  };

  const addMemo = (memo: Memo) => setMemos(prev => [...prev, memo]);

  const updateMemo = (updatedMemo: Memo) => {
    setMemos(prev => prev.map(m => m.id === updatedMemo.id ? updatedMemo : m));
  };

  return (
    <StoreContext.Provider value={{ currentUser, users, goals, memos, addGoal, updateGoal, addMemo, updateMemo, setCurrentUser }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
