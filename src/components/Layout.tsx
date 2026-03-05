import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Search, Settings, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: PlusCircle, label: 'Add Lead', path: '/add' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24 md:pb-0">
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl shadow-slate-200 overflow-hidden relative flex flex-col border-x border-slate-100">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
               <LayoutDashboard size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">LeadTrack</h1>
          </div>
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200">
            <User size={16} />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 md:absolute md:max-w-md md:mx-auto z-30 pb-safe">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full transition-all duration-200",
                    isActive ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <div className={cn(
                    "p-1 rounded-xl transition-all",
                    isActive && "bg-indigo-50"
                  )}>
                    <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-medium mt-1 transition-opacity",
                    isActive ? "opacity-100" : "opacity-70"
                  )}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
