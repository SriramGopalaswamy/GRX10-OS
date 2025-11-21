import React, { useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { GoalStatus } from '../types';

const COLORS = ['#22c55e', '#eab308', '#ef4444', '#3b82f6'];

export const Dashboard: React.FC = () => {
  const { goals, memos } = useStore();

  const stats = useMemo(() => {
    const totalGoals = goals.length;
    const completed = goals.filter(g => g.status === GoalStatus.COMPLETED).length;
    const onTrack = goals.filter(g => g.status === GoalStatus.ON_TRACK).length;
    const atRisk = goals.filter(g => g.status === GoalStatus.AT_RISK).length;
    const offTrack = goals.filter(g => g.status === GoalStatus.OFF_TRACK).length;

    return { totalGoals, completed, onTrack, atRisk, offTrack };
  }, [goals]);

  const completionRate = stats.totalGoals ? Math.round(((stats.completed + stats.onTrack) / stats.totalGoals) * 100) : 0;

  const dataStatus = [
    { name: 'On Track', value: stats.onTrack },
    { name: 'At Risk', value: stats.atRisk },
    { name: 'Off Track', value: stats.offTrack },
    { name: 'Completed', value: stats.completed },
  ];

  // Mock Trend Data
  const dataTrend = [
    { name: 'Q1', revenue: 4000, target: 4200 },
    { name: 'Q2', revenue: 5100, target: 4800 },
    { name: 'Q3', revenue: 6200, target: 6500 },
    { name: 'Q4', revenue: 5800, target: 7000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Executive Dashboard</h1>
          <p className="text-slate-500 mt-1">Real-time performance snapshot for GRX10.</p>
        </div>
        <div className="text-right">
            <p className="text-sm text-gray-500">Current Quarter</p>
            <p className="text-2xl font-bold text-brand-600">Q3 2024</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Goal Completion</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{completionRate}%</p>
          <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
            <div className="bg-brand-500 h-2 rounded-full" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Active Memos</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{memos.length}</p>
          <p className="text-xs text-green-600 mt-1">+2 this week</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Solar Installs (Act)</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">1,240</p>
          <p className="text-xs text-red-500 mt-1">92% of Target</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Avg Team Score</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">B+</p>
          <p className="text-xs text-gray-400 mt-1">Last Review Cycle</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Goal Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-sm text-gray-600">
             {dataStatus.map((d, i) => (
                <div key={i} className="flex items-center gap-1">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                   {d.name}: {d.value}
                </div>
             ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Revenue: Actual vs Target (k$)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} name="Actual" />
                <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};