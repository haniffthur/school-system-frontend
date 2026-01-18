"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Search, X, Save } from "lucide-react";

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [majors, setMajors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", grade: "", majorId: "" });
  const [search, setSearch] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [resC, resM] = await Promise.all([
        axios.get("http://localhost:3000/classes"),
        axios.get("http://localhost:3000/majors")
      ]);
      setClasses(resC.data);
      setMajors(resM.data);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/classes", form);
      fetchData();
      setIsModalOpen(false);
      setForm({ name: "", grade: "", majorId: "" });
      alert("Kelas berhasil dibuat!");
    } catch (err) { alert("Gagal membuat kelas."); }
  };

  const filteredClasses = classes.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const inputStyle = "w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 bg-white";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800">Manajemen Kelas</h1><p className="text-gray-500 text-sm">Daftar kelas aktif</p></div>
        <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex justify-center items-center gap-2 transition shadow-lg shadow-blue-500/30 font-medium"><Plus size={18} /> Tambah Kelas</button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <Search className="text-gray-400" size={20}/>
            <input type="text" placeholder="Cari kelas..." className="bg-transparent outline-none text-sm w-full text-gray-700" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        
        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-white text-gray-500 uppercase text-xs font-bold border-b border-gray-100">
                <tr><th className="p-5">Nama Kelas</th><th className="p-5">Tingkat</th><th className="p-5">Jurusan</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredClasses.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition">
                    <td className="p-5 font-bold text-gray-800">{c.name}</td>
                    <td className="p-5"><span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold">{c.grade}</span></td>
                    <td className="p-5">
                       {c.major ? (
                         <div className="flex items-center gap-2">
                           <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-bold border border-blue-100">{c.major.code}</span>
                           <span className="text-gray-500 text-xs truncate max-w-[150px]">{c.major.name}</span>
                         </div>
                       ) : <span className="text-red-400 text-xs italic">Unknown</span>}
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
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50"><h3 className="font-bold text-gray-800">Buat Kelas Baru</h3><button onClick={()=>setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nama Kelas</label><input required className={inputStyle} placeholder="Contoh: XII RPL 1" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tingkat</label><input required type="number" className={inputStyle} placeholder="12" value={form.grade} onChange={e=>setForm({...form, grade:e.target.value})}/></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Jurusan</label><select required className={inputStyle} value={form.majorId} onChange={e=>setForm({...form, majorId:e.target.value})}><option value="">-- Pilih --</option>{majors.map(m => <option key={m.id} value={m.id}>{m.code}</option>)}</select></div>
                </div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex justify-center gap-2"><Save size={18}/> Simpan</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}