"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, User, LogOut, QrCode } from "lucide-react";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Beranda", href: "/teacher/dashboard", icon: Home },
    { name: "Jadwal", href: "/teacher/schedule", icon: Calendar },
    { name: "Profil", href: "/teacher/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
      
      {/* === DESKTOP SIDEBAR === */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-30">
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
           <span className="font-bold text-blue-600 text-xl flex items-center gap-2">
             <QrCode className="fill-blue-600 text-white" /> Guru<span className="text-gray-800">Panel</span>
           </span>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2">
           {navItems.map((item) => {
             const isActive = pathname === item.href;
             return (
               <Link key={item.href} href={item.href}>
                 <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                 }`}>
                    <item.icon size={20} />
                    <span>{item.name}</span>
                 </div>
               </Link>
             )
           })}
        </div>

        <div className="p-4 border-t border-gray-100">
            <button onClick={() => window.location.href='/'} className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition font-medium">
                <LogOut size={20} /> Logout
            </button>
        </div>
      </aside>

      {/* === MAIN CONTENT WRAPPER === */}
      <main className="flex-1 md:ml-64 relative flex flex-col min-h-screen">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white/80 backdrop-blur-md px-5 py-4 sticky top-0 z-40 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-blue-600">
                <QrCode className="fill-blue-600 text-white" /> GuruApp
            </div>
            <div className="h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">G</div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full">
            {children}
        </div>

      </main>

      {/* === MOBILE BOTTOM NAV === */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="w-full">
              <div className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "-translate-y-1 transition-transform" : ""} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}