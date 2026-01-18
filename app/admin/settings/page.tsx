"use client";

import { useState } from "react";
import { Shield, Trash2, Smartphone } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [tolerance, setTolerance] = useState("15");

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); alert("Disimpan!"); }, 1000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-800">Pengaturan Sistem</h1><p className="text-gray-500 text-sm">Konfigurasi aplikasi</p></div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
        <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Smartphone className="text-blue-600"/> Konfigurasi Absen</h3>
            {/* Grid 1 di HP, 2 di MD */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Toleransi Telat (Menit)</label><input type="number" value={tolerance} onChange={e=>setTolerance(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"/></div>
                <div><label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Radius GPS (Meter)</label><input disabled value="50" className="w-full p-3 border border-gray-100 bg-gray-50 rounded-xl text-gray-400 cursor-not-allowed"/></div>
            </div>
        </div>
        <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button onClick={handleSave} disabled={loading} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-500/30">{loading ? "Menyimpan..." : "Simpan Perubahan"}</button>
        </div>
      </div>

      <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
         <h3 className="font-bold text-red-700 mb-2 flex items-center gap-2"><Shield size={18}/> Danger Zone</h3>
         <p className="text-sm text-red-600/80 mb-4">Hati-hati, tindakan ini tidak dapat dibatalkan.</p>
         <button onClick={()=>alert("Demo Only")} className="w-full md:w-auto bg-white border border-red-200 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white transition flex justify-center items-center gap-2"><Trash2 size={16}/> Hapus Semua Data</button>
      </div>
    </div>
  );
}