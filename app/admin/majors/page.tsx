"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Search, X, Save } from "lucide-react";

export default function MajorsPage() {
  const [majors, setMajors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", code: "" });
  const [search, setSearch] = useState("");

  useEffect(() => { fetchMajors(); }, []);

  const fetchMajors = async () => {
    try {
      const res = await axios.get("http://localhost:3000/majors");
      setMajors(res.data);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/majors", form);
      fetchMajors();
      setForm({ name: "", code: "" });
      setIsModalOpen(false);
      alert("Jurusan berhasil dibuat!");
    } catch (err) { alert("Gagal. Kode mungkin duplikat."); }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Hapus jurusan ini?")) return;
    await axios.delete(`http://localhost:3000/majors/${id}`);
    fetchMajors();
  };

  const filteredMajors = majors.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800">Manajemen Jurusan</h1><p className="text-gray-500 text-sm">Daftar kompetensi keahlian</p></div>
        <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex justify-center items-center gap-2 transition shadow-lg shadow-blue-500/30 font-medium"><Plus size={18} /> Tambah Jurusan</button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <Search className="text-gray-400" size={20}/>
            <input type="text" placeholder="Cari jurusan..." className="bg-transparent outline-none text-sm w-full text-gray-700" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        
        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-white text-gray-500 uppercase text-xs font-bold border-b border-gray-100">
                <tr><th className="p-5">Kode</th><th className="p-5">Nama Jurusan</th><th className="p-5 text-right">Aksi</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredMajors.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50 transition group">
                    <td className="p-5 font-bold text-blue-600">{m.code}</td>
                    <td className="p-5 font-medium text-gray-700">{m.name}</td>
                    <td className="p-5 text-right">
                      <button onClick={()=>handleDelete(m.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={18}/></button>
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
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50"><h3 className="font-bold text-gray-800">Tambah Jurusan</h3><button onClick={()=>setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Kode</label><input required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase font-bold text-gray-700" placeholder="RPL" value={form.code} onChange={e=>setForm({...form, code:e.target.value})}/></div>
                <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nama Jurusan</label><input required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700" placeholder="Rekayasa Perangkat Lunak" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/></div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex justify-center gap-2"><Save size={18}/> Simpan</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}