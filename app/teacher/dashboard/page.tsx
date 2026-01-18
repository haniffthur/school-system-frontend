"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, MapPin, ChevronRight, CalendarDays, Users, GraduationCap, Activity, LayoutGrid, Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function TeacherDashboard() {
  const router = useRouter();
  
  // State untuk Data Asli
  const [stats, setStats] = useState({ totalClasses: 0, totalStudents: 0, hours: 0 });
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      
      if (!token) {
        router.push("/"); // Tendang kalau gak ada token
        return;
      }
      setUser(userData);

      // Tembak API Backend
      const res = await axios.get("http://localhost:3000/teachers/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats(res.data.stats);
      setSchedules(res.data.schedules);
      setLoading(false);

    } catch (err) {
      console.error("Gagal ambil data dashboard:", err);
      // alert("Sesi habis, silakan login ulang.");
      // router.push("/");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      
      {/* 1. HEADER */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 bg-opacity-80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <LayoutGrid className="text-blue-600" /> Dashboard Guru
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Selamat datang, <span className="font-semibold text-blue-600">{user?.name}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-slate-100 rounded-full border border-slate-200 flex items-center gap-2 text-xs font-semibold text-slate-600 shadow-sm">
                        <CalendarDays size={14} className="text-blue-600"/>
                        {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* 2. STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Kelas</p>
                    <p className="text-4xl font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors">{stats.totalClasses}</p>
                </div>
                <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                    <GraduationCap size={24} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Jam Mengajar</p>
                    <p className="text-4xl font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors">{stats.hours} <span className="text-sm text-slate-400 font-normal">Jam</span></p>
                </div>
                <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                    <Clock size={24} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status Akun</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <span className="text-lg font-bold text-emerald-600">Aktif</span>
                    </div>
                </div>
                <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                    <Activity size={24} />
                </div>
            </div>
        </div>

        {/* 3. JADWAL LIST */}
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    Jadwal Mengajar Hari Ini
                </h2>
            </div>

            {schedules.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300">
                    <p className="text-slate-500">Tidak ada jadwal mengajar hari ini.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {schedules.map((item) => (
                        <Link key={item.id} href={`/teacher/session/${item.id}`} className="block group">
                            <div className="bg-white rounded-2xl p-1 border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                                <div className="flex flex-col md:flex-row items-stretch">
                                    
                                    {/* Kiri */}
                                    <div className="bg-slate-50 rounded-xl p-5 md:w-48 flex flex-col justify-center items-center text-center border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                                        <div className="bg-white px-3 py-1 rounded-full border border-slate-200 text-xs font-bold text-slate-500 mb-2 shadow-sm group-hover:text-blue-600 group-hover:border-blue-200">
                                            {item.time.split(' - ')[0]}
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium">Waktu Mulai</p>
                                    </div>

                                    {/* Tengah */}
                                    <div className="p-5 flex-1 flex flex-col justify-center">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                                {item.subject}
                                            </h3>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                KELAS AKTIF
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                <Users size={14} className="text-blue-500"/> 
                                                <span className="font-medium">{item.class} ({item.studentsCount} Siswa)</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={14} className="text-red-400"/> {item.room}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Kanan */}
                                    <div className="p-5 flex items-center justify-end border-t md:border-t-0 md:border-l border-slate-50">
                                        <div className="h-10 w-10 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}