"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Copy, Check, Search, User, X, Save, RefreshCw } from "lucide-react";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [classList, setClassList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", classId: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      // 1. Ambil token dari localStorage
      const token = localStorage.getItem("token");
      if (!token) return; // Kalau tidak ada token, batalkan request

      // 2. Buat config headers
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // 3. Sisipkan config ke dalam axios
      const [resS, resC] = await Promise.all([
         axios.get("http://localhost:3000/students", config),
         axios.get("http://localhost:3000/classes", config)
      ]);
      
      setStudents(resS.data);
      setClassList(resC.data);
      setLoading(false);
    } catch (error) { 
      console.error("Gagal ambil data:", error); 
      setLoading(false); 
    }
  };

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

 const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      
      // 4. Sisipkan token saat POST data siswa baru
      await axios.post("http://localhost:3000/students", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Berhasil!");
      setIsModalOpen(false);
      setFormData({ name: "", email: "", password: "", classId: "" });
      fetchData(); // Refresh data setelah berhasil
    } catch (e) { 
      console.error("Gagal simpan:", e);
      alert("Gagal. Cek koneksi atau pastikan email belum terdaftar."); 
    }
    setIsSubmitting(false);
  };

  const filteredStudents = students.filter(s => s.user?.name.toLowerCase().includes(search.toLowerCase()));
  const inputStyle = "w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 bg-white placeholder-gray-400";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800">Data Siswa</h1><p className="text-gray-500 text-sm">Total {students.length} siswa</p></div>
        <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-lg shadow-blue-500/30 font-medium"><User size={18} /> Tambah Siswa</button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center gap-3">
             <div className="flex items-center gap-3 w-full bg-white p-2 rounded-lg border border-gray-200">
                <Search className="text-gray-400" size={20} />
                <input type="text" placeholder="Cari siswa..." className="bg-transparent outline-none w-full text-gray-700" value={search} onChange={e=>setSearch(e.target.value)}/>
             </div>
             <button onClick={fetchData} className="text-gray-400 hover:text-blue-600 hidden sm:block"><RefreshCw size={18}/></button>
        </div>
        
        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-white text-gray-500 uppercase text-xs font-bold border-b border-gray-100">
                <tr><th className="p-5">Nama Siswa</th><th className="p-5">Kelas</th><th className="p-5">Email</th><th className="p-5 text-center">ID</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition">
                        <td className="p-5 font-bold text-gray-800">{s.user?.name}</td>
                        <td className="p-5">
                            {s.class ? <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100 whitespace-nowrap">{s.class.name}</span> : <span className="text-red-400 italic text-xs">No Class</span>}
                        </td>
                        <td className="p-5 text-gray-500">{s.user?.email}</td>
                        <td className="p-5 text-center">
                            <button onClick={()=>handleCopy(s.id)} className="p-2 text-gray-400 hover:text-blue-600 transition bg-gray-50 rounded-lg">{copiedId===s.id ? <Check size={16} className="text-green-500"/> : <Copy size={16}/>}</button>
                        </td>
                    </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50"><h3 className="font-bold text-gray-800">Siswa Baru</h3><button onClick={()=>setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={20}/></button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nama</label><input required className={inputStyle} onChange={e=>setFormData({...formData, name:e.target.value})} placeholder="Nama Lengkap"/></div>
              <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Kelas</label><select required className={inputStyle} onChange={e=>setFormData({...formData, classId:e.target.value})}><option value="">-- Pilih --</option>{classList.map(c => <option key={c.id} value={c.id}>{c.name} {c.major?`(${c.major.code})`:""}</option>)}</select></div>
              <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Email</label><input required type="email" className={inputStyle} onChange={e=>setFormData({...formData, email:e.target.value})} placeholder="email@sekolah.sch.id"/></div>
              <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Password</label><input required type="password" className={inputStyle} onChange={e=>setFormData({...formData, password:e.target.value})} placeholder="******"/></div>
              <button disabled={isSubmitting} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">{isSubmitting ? "Menyimpan..." : "Simpan Data"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}