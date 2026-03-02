"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, Users, Calendar, Clock, 
  LogOut, QrCode, MapPin, ChevronRight, Loader2 
} from "lucide-react";

export default function TeacherDashboard() {
  const router = useRouter();
  
  // 1. Inisialisasi State dengan Default Value (BIAR GAK ERROR undefined)
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
      
      if (!token) {
        router.push("/");
        return;
      }
      setUser(userData);

      // 👇👇👇 GANTI DENGAN URL NGROK BACKEND (PORT 3000) 👇👇👇
      // Contoh: "https://2769987715bb.ngrok-free.app"
      const BACKEND_URL = "http://localhost:3000"; 

      // Request ke Backend
      // Pastikan endpoint ini ada di Backend NestJS kamu
      // Kalau belum ada endpoint khusus dashboard guru, kode di bawah akan error 404
      // Tapi setidaknya halaman tidak blank putih.
      const res = await axios.get(`${BACKEND_URL}/teachers/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Simpan data ke state dengan aman
      setStats(res.data.stats || { totalClasses: 0, totalStudents: 0, presentToday: 0 });
      setSchedules(res.data.schedules || []);
      setLoading(false);

    } catch (err) {
      console.error("Gagal load dashboard guru:", err);
      // Kalau gagal load, biarkan kosong tapi matikan loading
      setLoading(false); 
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      
      {/* 1. NAVBAR */}
      <nav className="bg-white px-6 py-4 shadow-sm sticky top-0 z-20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg leading-tight">Panel Guru</h1>
            <p className="text-xs text-slate-500">Selamat Datang, {user?.name || "Bapak/Ibu Guru"}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-full transition"
        >
          <LogOut size={20} />
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 mt-8 space-y-8">
        
        {/* 2. STATS CARDS (YANG TADI ERROR) */}
        <div className="grid grid-cols-3 gap-4">
            {/* Card 1: Total Kelas */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Calendar size={20}/>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Total Kelas</span>
                </div>
                {/* 👇 PAKE TANDA TANYA BIAR AMAN 👇 */}
                <p className="text-3xl font-extrabold text-slate-800">{stats?.totalClasses || 0}</p>
            </div>

            {/* Card 2: Total Siswa */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                        <Users size={20}/>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Total Siswa</span>
                </div>
                <p className="text-3xl font-extrabold text-slate-800">{stats?.totalStudents || 0}</p>
            </div>

            {/* Card 3: Hadir Hari Ini */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                        <QrCode size={20}/>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Hadir Hari Ini</span>
                </div>
                <p className="text-3xl font-extrabold text-slate-800">{stats?.presentToday || 0}</p>
            </div>
        </div>

        {/* 3. JADWAL MENGAJAR LIST */}
        <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Clock className="text-blue-600" size={20}/> Jadwal Mengajar Hari Ini
            </h2>

            {schedules.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl text-center border border-dashed border-slate-200">
                    <p className="text-slate-400">Tidak ada jadwal mengajar hari ini.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {schedules.map((item) => (
                        <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-300 transition group relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 rounded-l-2xl"></div>
                            
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition">
                                        {item.subject?.name || item.subject}
                                    </h3>
                                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                        <span className="flex items-center gap-1"><Clock size={14}/> {item.startTime} - {item.endTime}</span>
                                        <span className="flex items-center gap-1"><MapPin size={14}/> {item.class?.name || "Kelas"}</span>
                                    </div>
                                </div>

                                <Link href={`/teacher/session/${item.id}`}>
                                    <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-600 transition shadow-lg shadow-slate-200">
                                        <QrCode size={16}/> Buka Kelas <ChevronRight size={16}/>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}