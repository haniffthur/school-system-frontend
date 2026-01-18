"use client";

import { ScanLine, CalendarDays, Bell, Check, MapPin, Clock, ChevronRight, GraduationCap, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [className, setClassName] = useState("");

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      if (!token) { router.push("/"); return; }
      setUser(userData);

      const res = await axios.get("http://localhost:3000/students/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSchedules(res.data.schedules);
      setClassName(res.data.className);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600"/></div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
      
      {/* 1. HEADER */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-5 py-4 flex justify-between items-center">
            <div>
                <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="text-blue-600" size={20} /> Dashboard
                </h1>
                <p className="text-xs text-slate-500 font-medium">Hai, <span className="text-slate-800 font-bold">{user?.name}</span> 👋</p>
                {className && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">{className}</span>}
            </div>
            <button className="p-2.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition relative shadow-sm">
                <Bell size={18}/>
                <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
            </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-6 space-y-8">
        
        {/* 2. SCAN BUTTON */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-blue-300 transition-all duration-300">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider mb-3 border border-blue-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span> Presensi Aktif
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Scan Kehadiran</h2>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto md:mx-0 leading-relaxed">
                      Sudah di kelas? Scan QR Code dari guru.
                  </p>
              </div>
              
              <Link href="/student/scan" className="w-full md:w-auto">
                  <button className="w-full bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/30 active:scale-95 flex items-center justify-center gap-3">
                      <ScanLine size={20}/> Buka Kamera
                  </button>
              </Link>
           </div>
           {/* Dekorasi */}
           <div className="absolute right-0 top-0 w-40 h-40 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-50 transition-colors duration-500"></div>
        </div>

        {/* 3. JADWAL LIST */}
        <div>
          <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <CalendarDays size={18} className="text-blue-600"/> Jadwal Hari Ini
              </h3>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long' })}
              </span>
          </div>

          {schedules.length === 0 ? (
             <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-slate-200">
                 <p className="text-sm text-slate-400">Tidak ada jadwal pelajaran hari ini.</p>
             </div>
          ) : (
            <div className="space-y-0 relative pl-4 border-l-2 border-slate-100 ml-2">
                 {schedules.map((item) => (
                   <div key={item.id} className="relative pl-8 pb-8 last:pb-0 group">
                      <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white shadow-sm z-10 
                          ${item.status === 'present' ? 'bg-emerald-500' : 'bg-slate-300 group-hover:bg-blue-400'}
                      `}></div>

                      <div className={`bg-white p-5 rounded-2xl border transition-all duration-300 shadow-sm
                          ${item.status === 'present' 
                              ? 'border-emerald-100 bg-emerald-50/30' 
                              : 'border-slate-200 hover:border-blue-300 hover:shadow-md'}
                      `}>
                          <div className="flex justify-between items-start mb-2">
                              <h4 className={`font-bold text-base ${item.status === 'present' ? 'text-emerald-900' : 'text-slate-800'}`}>
                                  {item.subject}
                              </h4>
                              {item.status === 'present' ? (
                                  <span className="flex items-center gap-1 text-[10px] font-bold bg-white text-emerald-600 px-2 py-1 rounded-lg border border-emerald-100 shadow-sm">
                                      <Check size={12}/> HADIR
                                  </span>
                              ) : (
                                  <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-2 py-1 rounded-lg">BELUM</span>
                              )}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3 text-xs font-medium text-slate-500">
                              <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded border border-slate-100 w-fit">
                                  <Clock size={14} className="text-blue-500"/> {item.time}
                              </div>
                              <div className="flex items-center gap-1.5">
                                  <MapPin size={14} className="text-red-400"/> {item.room}
                              </div>
                          </div>
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