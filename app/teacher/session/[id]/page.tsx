"use client"; // <--- INI PENTING BIAR GAK ERROR (Fix Error Ecmascript)

import { useState, useEffect } from "react";
import QRCode from "react-qr-code"; 
import { ArrowLeft, Users, X } from "lucide-react";
import Link from "next/link";

export default function ClassSession({ params }: { params: { id: string } }) {
  // Simulasi data siswa
  const [attendees, setAttendees] = useState<any[]>([]);
  
  // Simulasi siswa masuk
  useEffect(() => {
    const interval = setInterval(() => {
        const names = ["Ahmad Dhani", "Budi Doremi", "Chika Jessica"];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const newStudent = { 
            name: randomName, 
            time: new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}),
            status: 'Hadir'
        };
        setAttendees(prev => [newStudent, ...prev]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Top Navbar */}
      <div className="bg-white p-4 flex items-center gap-3 shadow-sm sticky top-0 z-10 border-b border-gray-200">
        <Link href="/teacher/dashboard" className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} className="text-gray-600"/>
        </Link>
        <div>
            <h1 className="font-bold text-gray-800 text-sm">Pemrograman Web</h1>
            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Sesi Aktif • ID: {params.id}
            </p>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-6 max-w-lg mx-auto w-full">
        
        {/* QR Code Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
            <div className="bg-white p-3 border border-gray-200 rounded-xl mb-6 shadow-inner">
              <QRCode 
    value={params.id} // <--- CUKUP ID JADWAL SAJA (UUID)
    size={220}
    viewBox={`0 0 256 256`}
    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
/>
            </div>
            <p className="text-lg font-bold text-gray-900">Scan untuk Presensi</p>
            <p className="text-sm text-gray-500 mt-1 max-w-[200px]">Arahkan kamera siswa ke QR Code di atas.</p>
        </div>

        {/* Live List */}
        <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    <Users size={16} className="text-blue-600"/> Kehadiran ({attendees.length})
                </h3>
            </div>

            <div className="space-y-2">
                {attendees.map((s, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100">
                                {s.name.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{s.name}</span>
                        </div>
                        <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">{s.time}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Tutup Sesi */}
        <button className="w-full bg-white border border-red-200 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-50 transition">
            <X size={18} /> Tutup Kelas
        </button>

      </div>
    </div>
  );
}