"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Download, Search, Trash2 } from "lucide-react";

export default function HistoryPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:3000/attendance/history");
      setLogs(res.data);
      setLoading(false);
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Hapus data ini?")) return;
    await axios.delete(`http://localhost:3000/attendance/${id}`);
    fetchHistory();
  };

  const filteredLogs = logs.filter(l => l.student?.user?.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">Riwayat Absensi <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full animate-pulse border border-red-200">● Live</span></h1><p className="text-gray-500 text-sm">Monitoring kehadiran</p></div>
        <button className="w-full md:w-auto bg-green-600 text-white px-5 py-2.5 rounded-xl flex justify-center items-center gap-2 shadow-lg shadow-green-500/30 font-medium hover:bg-green-700 transition"><Download size={18}/> Export CSV</button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
             <Search className="text-gray-400" size={20} />
             <input type="text" placeholder="Cari log absensi..." className="bg-transparent outline-none w-full text-gray-700" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        
        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
               <thead className="bg-white text-gray-500 uppercase text-xs font-bold border-b border-gray-100">
                 <tr><th className="p-5">Waktu</th><th className="p-5">Siswa</th><th className="p-5">Status</th><th className="p-5 text-right">Aksi</th></tr>
               </thead>
               <tbody className="divide-y divide-gray-100 text-sm">
                 {filteredLogs.map(log => (
                   <tr key={log.id} className="hover:bg-gray-50 transition">
                     <td className="p-5 font-mono text-gray-600 whitespace-nowrap">{new Date(log.checkInTime).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}</td>
                     <td className="p-5"><div className="font-bold text-gray-800">{log.student?.user?.name}</div><div className="text-xs text-gray-500">{log.schedule?.subject || "-"}</div></td>
                     <td className="p-5"><span className={`px-3 py-1 rounded-full text-xs font-bold border ${log.status==='PRESENT'?'bg-green-100 text-green-700 border-green-200':log.status==='LATE'?'bg-yellow-100 text-yellow-700 border-yellow-200':'bg-red-100 text-red-700'}`}>{log.status}</span></td>
                     <td className="p-5 text-right"><button onClick={()=>handleDelete(log.id)} className="text-gray-400 hover:text-red-500 transition"><Trash2 size={18}/></button></td>
                   </tr>
                 ))}
               </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}