// src/app/admin/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, Users, History, Settings, 
  School, Bookmark, LogOut, GraduationCap, Menu, X ,Briefcase,CalendarDays, Book,Shield
} from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Tutup sidebar mobile otomatis saat pindah halaman
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Manajemen Users", href: "/admin/users", icon: Shield },
    { name: "Manajemen Kelas", href: "/admin/classes", icon: School },
    { name: "Manajemen Jurusan", href: "/admin/majors", icon: Bookmark },
    { name: "Data Siswa", href: "/admin/students", icon: Users },
    { name: "Riwayat Absen", href: "/admin/history", icon: History },
    { name: "Pengaturan", href: "/admin/settings", icon: Settings },
    { name: "Manajemen Guru", href: "/admin/teachers", icon: Briefcase },
    { name: "Mata Pelajaran", href: "/admin/subjects", icon: Book },
{ name: "Jadwal Pelajaran", href: "/admin/schedules", icon: CalendarDays },
  ];

  // Komponen Sidebar Content (Biar bisa dipake di Desktop & Mobile)
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3 text-blue-600">
          <div className="p-2 bg-blue-50 rounded-xl">
            <GraduationCap size={24} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-gray-900">
            School<span className="text-blue-600">App</span>
          </span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menu Utama</p>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 translate-x-1" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
              }`}>
                <item.icon size={20} className={`transition-colors flex-shrink-0 ${isActive ? "text-white" : "group-hover:text-blue-600"}`} />
                <span className="font-medium text-sm whitespace-nowrap">{item.name}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-gray-100 flex-shrink-0">
        <button 
          onClick={() => { localStorage.clear(); window.location.href="/"; }}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-medium"
        >
          <LogOut size={20} />
          <span>Logout Sesi</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex font-sans text-gray-800">
      
      {/* --- SIDEBAR DESKTOP (Hidden on Mobile) --- */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-gray-200 fixed h-full z-20">
        <SidebarContent />
      </aside>

      {/* --- SIDEBAR MOBILE (Overlay) --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop Gelap (Klik buat tutup) */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer Putih */}
          <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="absolute top-4 right-4">
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-red-500">
                 <X size={24} />
               </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 md:ml-72 min-h-screen flex flex-col w-full">
        
        {/* Header Mobile & Desktop */}
        <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200/50 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
             {/* Tombol Hamburger (Cuma muncul di Mobile) */}
             <button 
                className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg active:scale-95 transition" 
                onClick={() => setIsMobileMenuOpen(true)}
             >
                <Menu size={24} />
             </button>
             
             {/* Tulisan Header */}
             <div className="md:hidden flex items-center gap-2 text-blue-600">
                <GraduationCap size={20} />
                <span className="font-bold text-gray-900">SchoolApp</span>
             </div>
             
             <h2 className="text-gray-500 text-sm hidden md:block">
               Selamat Datang, <span className="font-bold text-gray-800">Admin Sekolah</span> 👋
             </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md ring-4 ring-white cursor-pointer hover:ring-blue-100 transition">
              A
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 md:p-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-x-hidden">
          {children}
        </div>

      </main>
    </div>
  );
}