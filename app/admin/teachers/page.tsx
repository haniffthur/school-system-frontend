"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Copy, Check, Search, UserPlus, X, Save, Trash2, Briefcase } from "lucide-react";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Form Data (Ada NIP)
  const [form, setForm] = useState({ name: "", nip: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { fetchTeachers(); }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/teachers");
      setTeachers(res.data);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:3000/teachers", form);
      alert("Guru berhasil ditambahkan! 👨‍🏫");
      setIsModalOpen(false);
      setForm({ name: "", nip: "", email: "", password: "" });
      fetchTeachers();
    } catch (err) { alert("Gagal. Email atau NIP mungkin duplikat."); }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Hapus data guru ini?")) return;
    await axios.delete(`http://localhost:3000/teachers/${id}`);
    fetchTeachers();
  };

  const handleCopy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedId(txt);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTeachers = teachers.filter(t => t.user?.name.toLowerCase().includes(search.toLowerCase()));
  const inputStyle = "w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 bg-white placeholder-gray-400";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Manajemen Guru</h1>
           <p className="text-gray-500 text-sm">Daftar pengajar aktif</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-lg shadow-blue-500/30 font-medium">
           <UserPlus size={18} /> Tambah Guru
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
             <Search className="text-gray-400" size={20} />
             <input type="text" placeholder="Cari nama guru..." className="bg-transparent outline-none w-full text-gray-700" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-white text-gray-500 uppercase text-xs font-bold border-b border-gray-100">
                <tr>
                    <th className="p-5">Nama Guru</th>
                    <th className="p-5">NIP / Kode</th>
                    <th className="p-5">Email</th>
                    <th className="p-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredTeachers.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition group">
                        <td className="p-5 font-bold text-gray-800 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                {t.user?.name.charAt(0)}
                            </div>
                            {t.user?.name}
                        </td>
                        <td className="p-5 font-mono text-gray-600">{t.user?.code || "-"}</td>
                        <td className="p-5 text-gray-500">{t.user?.email}</td>
                        <td className="p-5 text-right flex justify-end gap-2">
                             <button onClick={()=>handleCopy(t.user?.password)} title="Copy Password (Hash)" className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-lg">
                                {copiedId===t.user?.password ? <Check size={16} className="text-green-500"/> : <Copy size={16}/>}
                             </button>
                             <button onClick={()=>handleDelete(t.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                <Trash2 size={16}/>
                             </button>
                        </td>
                    </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2"><Briefcase size={18} className="text-blue-600"/> Guru Baru</h3>
                <button onClick={()=>setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nama Lengkap</label>
                  <input required className={inputStyle} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Contoh: Budi Santoso, S.Kom"/>
              </div>
              <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">NIP / Kode Guru</label>
                  <input required className={inputStyle} onChange={e=>setForm({...form, nip:e.target.value})} placeholder="19823xxxxxx"/>
              </div>
              <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Email Login</label>
                  <input required type="email" className={inputStyle} onChange={e=>setForm({...form, email:e.target.value})} placeholder="guru@sekolah.sch.id"/>
              </div>
              <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Password</label>
                  <input required type="password" className={inputStyle} onChange={e=>setForm({...form, password:e.target.value})} placeholder="******"/>
              </div>
              <button disabled={isSubmitting} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
                  {isSubmitting ? "Menyimpan..." : "Simpan Data Guru"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}