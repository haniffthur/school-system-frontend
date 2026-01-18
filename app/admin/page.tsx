"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Users, UserCheck, Clock, XCircle, 
  TrendingUp, ArrowUpRight, Calendar, Activity, CheckCircle, AlertCircle 
} from "lucide-react";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  
  // State Data
  const [stats, setStats] = useState({ totalStudents: 0, present: 0, late: 0, absent: 0 });
  const [activities, setActivities] = useState<any[]>([]); // <-- State buat log aktivitas

  // Data Grafik (Hardcode dlu gapapa buat visual)
  const chartData = {
    labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
    datasets: [{
      label: 'Kehadiran',
      data: [85, 90, 88, 92, 85, 60],
      borderColor: '#2563EB',
      backgroundColor: (context: any) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, "rgba(37, 99, 235, 0.3)");
        gradient.addColorStop(1, "rgba(37, 99, 235, 0)");
        return gradient;
      },
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#2563EB',
      pointBorderWidth: 2,
      pointRadius: 4,
    }]
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Selamat Pagi");
    else if (hour < 15) setGreeting("Selamat Siang");
    else if (hour < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 1. Ambil Data Siswa (Total)
      const resStudents = await axios.get("http://localhost:3000/students");
      const total = resStudents.data.length;

      // 2. Ambil History Absen (Buat Aktivitas & Statistik)
      const resLogs = await axios.get("http://localhost:3000/attendance/history");
      const logs = resLogs.data;

      // Filter log hari ini
      const today = new Date().toISOString().split('T')[0];
      const todayLogs = logs.filter((l: any) => l.date.startsWith(today));

      // Hitung Statistik Sederhana
      const presentCount = todayLogs.filter((l: any) => l.status === 'PRESENT').length;
      const lateCount = todayLogs.filter((l: any) => l.status === 'LATE').length;
      
      setStats({
          totalStudents: total,
          present: presentCount,
          late: lateCount,
          absent: total - (presentCount + lateCount) // Sisanya dianggap belum hadir/alpha
      });

      // 3. Set Aktivitas Terbaru (Ambil 5 teratas)
      setActivities(logs.slice(0, 5));

      setLoading(false);
    } catch (error) { console.error(error); setLoading(false); }
  };

  // Komponen Kartu Statistik
  const StatCard = ({ title, value, icon: Icon, color, trend, trendUp }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-extrabold text-gray-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
          <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs font-medium z-10 relative">
        <span className={`px-2 py-0.5 rounded-full flex items-center ${trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          <TrendingUp size={12} className={`mr-1 ${!trendUp && "rotate-180"}`}/> {trend}
        </span>
        <span className="text-gray-400">vs kemarin</span>
      </div>
      <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-5 group-hover:scale-125 transition-transform duration-500 ${color}`}></div>
    </div>
  );

  const SkeletonCard = () => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-10 w-10 bg-gray-200 rounded-xl"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{greeting}, Admin! 👋</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
            <Calendar size={16}/> {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
             <button className="flex-1 md:flex-none bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition shadow-sm">Unduh Laporan</button>
             <button className="flex-1 md:flex-none bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">+ Scan Manual</button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? <><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></> : (
          <>
            <StatCard title="Total Siswa" value={stats.totalStudents} icon={Users} color="bg-blue-600" trend="Data Valid" trendUp={true} />
            <StatCard title="Hadir" value={stats.present} icon={UserCheck} color="bg-emerald-500" trend="Hari Ini" trendUp={true} />
            <StatCard title="Terlambat" value={stats.late} icon={Clock} color="bg-amber-500" trend="Perlu Perhatian" trendUp={false} />
            <StatCard title="Belum Hadir" value={stats.absent} icon={XCircle} color="bg-rose-500" trend="Monitor" trendUp={false} />
          </>
        )}
      </div>

      {/* CHART & ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CHART SECTION */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
            <div><h3 className="font-bold text-lg text-gray-800">Analisis Kehadiran</h3><p className="text-xs text-gray-400">Tren kehadiran minggu ini</p></div>
            <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">Lihat Detail <ArrowUpRight size={14}/></button>
          </div>
          <div className="h-[250px] sm:h-[300px] w-full">
            {loading ? <div className="h-full w-full bg-gray-100 rounded-xl animate-pulse flex items-center justify-center text-gray-400">Memuat Grafik...</div> : 
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#F3F4F6' }, beginAtZero: true }, x: { grid: { display: false } } } }} />}
          </div>
        </div>

        {/* ACTIVITY FEED (REALTIME DATA) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
            <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                <Activity size={18} className="text-blue-600"/> Absensi Terbaru
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[300px] custom-scrollbar">
                {activities.length === 0 ? (
                    <div className="text-center text-gray-400 py-8 text-sm">Belum ada aktivitas absensi hari ini.</div>
                ) : (
                    activities.map((log, idx) => (
                        <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0">
                            {/* Avatar / Icon Status */}
                            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-white
                                ${log.status === 'PRESENT' ? 'bg-emerald-500' : log.status === 'LATE' ? 'bg-amber-500' : 'bg-red-500'}
                            `}>
                                {log.status === 'PRESENT' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
                            </div>
                            
                            {/* Detail Siswa */}
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-gray-800 truncate">
                                    {log.student?.user?.name || "Unknown Student"}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <span className="font-medium text-blue-600 bg-blue-50 px-1.5 rounded">{log.student?.class?.name || "-"}</span>
                                    <span>• {log.status === 'PRESENT' ? 'Hadir Tepat Waktu' : 'Terlambat'}</span>
                                </p>
                            </div>

                            {/* Waktu */}
                            <span className="ml-auto text-[10px] font-mono text-gray-400 flex-shrink-0 bg-gray-50 px-2 py-1 rounded-lg">
                                {new Date(log.checkInTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))
                )}
            </div>
            
            <button onClick={() => window.location.href='/admin/history'} className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-blue-600 font-medium border-t border-gray-100 pt-3 transition">
                Lihat Semua Riwayat
            </button>
        </div>

      </div>
    </div>
  );
}