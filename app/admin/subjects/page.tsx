"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Search, X, Save, Book } from "lucide-react";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", code: "" });
  const [search, setSearch] = useState("");

  useEffect(() => { fetchSubjects(); }, []);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:3000/subjects");
      setSubjects(res.data);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/subjects", form);
      fetchSubjects();
      setForm({ name: "", code: "" });
      setIsModalOpen(false);
      alert("Mapel berhasil dibuat!");
    } catch (err) { alert("Gagal. Kode mungkin duplikat."); }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Hapus mapel ini?")) return;
    await axios.delete(`http://localhost:3000/subjects/${id}`);
    fetchSubjects();
  };

  const filtered = subjects.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800">Mata Pelajaran</h1><p className="text-gray-500 text-sm">Data master pelajaran</p></div>
        <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-lg shadow-blue-500/30 font-medium"><Plus size={18} /> Tambah Mapel</button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <Search className="text-gray-400" size={20}/>
            <input type="text" placeholder="Cari pelajaran..." className="bg-transparent outline-none w-full text-gray-700" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-white text-gray-500 uppercase text-xs font-bold border-b border-gray-100">
                <tr><th className="p-5">Kode</th><th className="p-5">Nama Pelajaran</th><th className="p-5 text-right">Aksi</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition">
                    <td className="p-5 font-bold text-blue-600">{s.code}</td>
                    <td className="p-5 font-medium text-gray-800 flex items-center gap-2"><Book size={16} className="text-gray-400"/> {s.name}</td>
                    <td className="p-5 text-right"><button onClick={()=>handleDelete(s.id)} className="p-2 text-gray-400 hover:text-red-500 transition"><Trash2 size={18}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50"><h3 className="font-bold text-gray-800">Tambah Mapel</h3><button onClick={()=>setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Kode</label><input required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase font-bold" placeholder="MTK" value={form.code} onChange={e=>setForm({...form, code:e.target.value})}/></div>
                <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nama Pelajaran</label><input required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Matematika Wajib" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/></div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">Simpan</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}