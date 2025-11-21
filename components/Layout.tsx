
import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  LayoutDashboard, 
  Target, 
  FileText, 
  Settings, 
  LogOut,
  Sun,
  Menu
} from 'lucide-react';
import { Role } from '../types';
import { GeminiChat } from './Chat/GeminiChat';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { currentUser, users, setCurrentUser } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => {
        onTabChange(id);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        activeTab === id 
          ? 'bg-brand-50 text-brand-700 font-medium' 
          : 'text-slate-600 hover:bg-gray-50'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-100 flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">
              <Sun size={18} />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">GRX10 <span className="text-brand-600">OS</span></span>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem id="goals" icon={Target} label="Goals System" />
            <NavItem id="memos" icon={FileText} label="Memo System" />
            <div className="pt-4 mt-4 border-t border-gray-100">
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Debug: Switch User</div>
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => setCurrentUser(u)}
                  className={`block w-full text-left px-4 py-1 text-sm ${currentUser.id === u.id ? 'text-brand-600 font-bold' : 'text-gray-500'}`}
                >
                  {u.name} ({u.role})
                </button>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
                <p className="text-xs text-gray-500 truncate">{currentUser.team}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 p-4">
           <span className="font-bold text-lg">GRX10</span>
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
             <Menu />
           </button>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
          <GeminiChat />
        </main>
      </div>
    </div>
  );
};
