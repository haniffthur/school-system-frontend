"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History, User, LogOut, GraduationCap } from "lucide-react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const navItems = [
    { name: "Beranda", href: "/student/dashboard", icon: Home },
    { name: "Riwayat", href: "/student/history", icon: History },
    { name: "Profil", href: "/student/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">

      {/* === DESKTOP SIDEBAR === */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-200 fixed h-full z-30">
        <div className="h-24 flex items-center px-8">
           <span className="font-bold text-blue-600 text-2xl flex items-center gap-2">
             <GraduationCap className="fill-blue-600 text-white" size={32} /> Siswa<span className="text-gray-900">App</span>
           </span>
        </div>
        
        <div className="flex-1 px-6 space-y-2">
           {navItems.map((item) => {
             const isActive = pathname === item.href;
             return (
               <Link key={item.href} href={item.href}>
                 <div className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold text-sm ${
                    isActive ? "bg-blue-600 text-white shadow-xl shadow-blue-500/30" : "text-gray-400 hover:bg-gray-50 hover:text-blue-600"
                 }`}>
                    <item.icon size={22} />
                    <span>{item.name}</span>
                 </div>
               </Link>
             )
           })}
        </div>
        
        <div className="p-8">
            <button onClick={() => window.location.href='/'} className="flex items-center gap-3 w-full text-red-400 hover:text-red-600 font-bold text-sm transition">
                <LogOut size={20} /> Keluar Aplikasi
            </button>
        </div>
      </aside>

      {/* === MAIN CONTENT WRAPPER === */}
      <main className="flex-1 lg:ml-72 relative min-h-screen flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white px-5 py-4 sticky top-0 z-40 border-b border-gray-100 flex justify-between items-center shadow-sm">
             <div className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <GraduationCap className="text-blue-600" /> Halo, Siswa
             </div>
             <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">S</div>
        </div>

        <div className="flex-1 p-4 md:p-8 lg:p-10 pb-24 lg:pb-10 max-w-5xl mx-auto w-full">
            {children}
        </div>
      </main>

      {/* === MOBILE BOTTOM NAV === */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg border-t border-gray-200 flex justify-around py-3 z-50 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="w-full">
              <div className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-blue-600 scale-105' : 'text-gray-400'}`}>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}