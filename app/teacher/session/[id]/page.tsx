"use client"; // <--- WAJIB

import { useState, useEffect, useCallback } from "react";
import QRCode from "react-qr-code"; 
import { ArrowLeft, Users, X, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function ClassSession({ params }: { params: { id: string } }) {
  const [attendees, setAttendees] = useState<any[]>([]);
  const [subjectName, setSubjectName] = useState("Memuat...");
  const [loading, setLoading] = useState(true);

  // Function untuk ambil data (Jadwal + List Hadir)
  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if(!token) return;

      // 👇👇 GANTI DENGAN URL NGROK BACKEND JIKA PERLU 👇👇
      const BACKEND_URL = "http://localhost:3000"; 

      // 1. Ambil Detail Jadwal (Untuk Judul Mapel)
      // Kita pakai endpoint 'schedules/:id'
      const scheduleRes = await axios.get(`${BACKEND_URL}/schedules/${params.id}`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      setSubjectName(scheduleRes.data.subject.name);

      // 2. Ambil History Absensi (Untuk List Siswa)
      // Note: Idealnya backend punya filter by ScheduleID, tapi sementara kita filter di frontend
      const historyRes = await axios.get(`${BACKEND_URL}/attendance/history`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      
      // Filter hanya absensi untuk sesi ini (params.id)
      const currentSessionAttendees = historyRes.data.filter((item: any) => item.scheduleId === params.id);
      
      setAttendees(currentSessionAttendees);
      setLoading(false);

    } catch (err) {
      console.error("Gagal refresh data:", err);
    }
  }, [params.id]);

  // AUTO REFRESH (Polling setiap 3 detik)
  useEffect(() => {
    fetchData(); // Panggil sekali pas pertama buka

    const interval = setInterval(() => {
        fetchData(); // Panggil terus setiap 3 detik
    }, 3000); 

    return () => clearInterval(interval); // Bersihkan interval pas keluar halaman
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <div className="bg-white p-4 flex items-center gap-3 shadow-sm sticky top-0 z-10 border-b border-gray-200">
        <Link href="/teacher/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={20} className="text-gray-600"/>
        </Link>
        <div>
            <h1 className="font-bold text-gray-800 text-sm">{subjectName}</h1>
            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Sesi Aktif • ID: {params.id.substring(0,8)}...
            </p>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-6 max-w-lg mx-auto w-full">
        
        {/* QR Code Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
            <div className="bg-white p-3 border border-gray-200 rounded-xl mb-6 shadow-inner">
                {/* QR Code Murni berisi ID Jadwal */}
                <QRCode 
                    value={params.id} 
                    size={220}
                    viewBox={`0 0 256 256`}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
            </div>
            <p className="text-lg font-bold text-gray-900">Scan untuk Presensi</p>
            <p className="text-sm text-gray-500 mt-1 max-w-[200px]">
                Siswa dapat melakukan scan melalui aplikasi mereka.
            </p>
        </div>

        {/* Live List */}
        <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    <Users size={18} className="text-blue-600"/> 
                    Kehadiran ({attendees.length})
                    {loading && <Loader2 size={14} className="animate-spin text-gray-400"/>}
                </h3>
            </div>

            {attendees.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                    <p className="text-gray-400 text-sm">Belum ada siswa yang scan.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {attendees.map((item, i) => (
                        <div key={i} className="bg-white p-4 rounded-2xl border border-gray-200 flex justify-between items-center shadow-sm animate-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100">
                                    {item.student?.user?.name?.charAt(0) || "?"}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">{item.student?.user?.name}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">{item.student?.class?.name}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded mb-1">
                                    {new Date(item.scannedAt).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                                </span>
                                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                    HADIR
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Tutup Sesi */}
        <Link href="/teacher/dashboard">
            <button className="w-full bg-white border border-red-200 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-300 transition-all shadow-sm">
                <X size={18} /> Tutup Kelas
            </button>
        </Link>

      </div>
    </div>
  );
}