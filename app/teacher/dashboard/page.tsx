"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, Users, Calendar, Clock, 
  LogOut, QrCode, MapPin, ChevronRight, Loader2,
  Bell, Search, Sparkles
} from "lucide-react";

export default function TeacherDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ totalClasses: 0, totalStudents: 0, presentToday: 0 });
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      if (!token) { router.push("/"); return; }
      setUser(userData);

      const BACKEND_URL = "http://localhost:3000"; 
      const res = await axios.get(`${BACKEND_URL}/teachers/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats(res.data.stats || { totalClasses: 0, totalStudents: 0, presentToday: 0 });
      setSchedules(res.data.schedules || []);
      setLoading(false);
    } catch (err) {
      console.error("Gagal load dashboard guru:", err);
      setLoading(false); 
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
            <p className="text-slate-500 font-medium animate-pulse">Menyiapkan Ruang Guru...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 pb-20 selection:bg-indigo-100">
      
      {/* --- TOPBAR --- */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Sparkles size={22} fill="currentColor" />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                TeacherSpace
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 mr-2">
                <Search size={16} className="text-slate-400 mr-2" />
                <input type="text" placeholder="Cari jadwal..." className="bg-transparent border-none outline-none text-sm w-40" />
            </div>
            <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <button 
                onClick={handleLogout}
                className="flex items-center gap-2 pl-2 pr-4 py-2 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-full transition-all font-semibold text-sm"
            >
                <div className="h-8 w-8 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                    <img src={`https://ui-avatars.com/api/?name=${user?.name || 'G'}&background=random`} alt="avatar" />
                </div>
                <span className="hidden sm:inline">Keluar</span>
            </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-10">
        
        {/* --- WELCOME HEADER --- */}
        <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                Halo, {user?.name?.split(' ')[0] || "Guru"}! 👋
            </h2>
            <p className="text-slate-500 mt-1 font-medium">Siap untuk memberikan ilmu hari ini?</p>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
                { label: "Total Kelas", val: stats.totalClasses, icon: Calendar, color: "from-blue-500 to-indigo-500", shadow: "shadow-blue-200" },
                { label: "Total Siswa", val: stats.totalStudents, icon: Users, color: "from-violet-500 to-purple-500", shadow: "shadow-purple-200" },
                { label: "Hadir Hari Ini", val: stats.presentToday, icon: QrCode, color: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-200" }
            ].map((stat, i) => (
                <div key={i} className={`bg-white p-6 rounded-[2rem] border border-white shadow-xl ${stat.shadow} relative overflow-hidden group`}>
                    <div className="relative z-10 flex flex-col gap-4">
                        <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-4xl font-black text-slate-800 tracking-tighter">{stat.val || 0}</h3>
                        </div>
                    </div>
                    {/* Decorative element */}
                    <div className={`absolute -right-4 -bottom-4 h-24 w-24 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
                </div>
            ))}
        </div>

        {/* --- SCHEDULE SECTION --- */}
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                        <Clock size={20} />
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Agenda Mengajar</h2>
                </div>
                <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 shadow-sm">
                    HARI INI
                </span>
            </div>

            {schedules.length === 0 ? (
                <div className="bg-white/50 backdrop-blur-sm p-16 rounded-[2.5rem] text-center border-2 border-dashed border-slate-300">
                    <div className="bg-slate-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <Calendar size={32} />
                    </div>
                    <h3 className="text-slate-800 font-bold text-lg">Santai Sejenak!</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mt-1">Tidak ada jadwal mengajar yang tercatat untuk hari ini.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                   {schedules.map((item) => (
  <div key={item.id} className="group bg-white p-2 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-100 border border-transparent hover:border-indigo-100 transition-all duration-300">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
      <div className="flex items-center gap-5">
        {/* BLOCK WAKTU MULAI */}
        <div className="h-16 w-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
          <span className="text-[10px] font-bold uppercase opacity-60">Mulai</span>
          <span className="text-sm font-black">
            {/* Ambil jam saja, misal 07:00 jadi 07 */}
            {item.startTime ? item.startTime : "--:--"}
          </span>
        </div>
        
        <div>
          {/* NAMA MATA PELAJARAN */}
          <h4 className="font-black text-xl text-slate-800 tracking-tight mb-1 group-hover:text-indigo-600 transition-colors">
            {item.subject?.name || "Mata Pelajaran"}
          </h4>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-slate-400">
            {/* RANGE WAKTU LENGKAP */}
            <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-md">
              <Clock size={14} className="text-slate-500" /> 
              {item.startTime || "00:00"} - {item.endTime || "00:00"}
            </span>
            
            {/* NAMA KELAS - Pastikan ini item.class.name */}
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-indigo-500" /> 
              {item.class?.name || "Kelas Tidak Terdaftar"}
            </span>
          </div>
        </div>
      </div>

      <Link href={`/teacher/session/${item.id}`} className="md:w-auto w-full">
        <button className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200 hover:shadow-indigo-200">
          <QrCode size={18} /> MULAI ABSENSI <ChevronRight size={18} />
        </button>
      </Link>
    </div>
  </div>
))}
                </div>
            )}
        </section>

      </main>
    </div>
  );
}