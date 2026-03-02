"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Search, X, Save, Calendar, Clock, User, BookOpen } from "lucide-react";

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  // State buat Dropdown
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    dayOfWeek: "1", // Default Senin
    startTime: "",
    endTime: "",
    classId: "",
    subjectId: "",
    teacherId: ""
  });

  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    try {
      // ✅ 1. Ambil token dan siapkan config
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // ✅ 2. Selipkan config ke SEMUA request
      const [resSched, resClass, resTeach, resSub] = await Promise.all([
        axios.get("http://localhost:3000/schedules", config),
        axios.get("http://localhost:3000/classes", config),
        axios.get("http://localhost:3000/teachers", config),
        axios.get("http://localhost:3000/subjects", config),
      ]);
      
      setSchedules(resSched.data);
      setClasses(resClass.data);
      setTeachers(resTeach.data);
      setSubjects(resSub.data);
    } catch (err) { 
      console.error(err); 
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // ✅ Selipkan token saat POST
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post("http://localhost:3000/schedules", form, config);
      
      fetchAllData();
      setIsModalOpen(false);
      setForm({ dayOfWeek: "1", startTime: "", endTime: "", classId: "", subjectId: "", teacherId: "" });
      alert("Jadwal berhasil dibuat! 📅");
    } catch (err) { 
      alert("Gagal membuat jadwal."); 
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Hapus jadwal ini?")) return;
    try {
      // ✅ Selipkan token saat DELETE
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`http://localhost:3000/schedules/${id}`, config);
      fetchAllData();
    } catch (err) {
      console.error("Gagal hapus jadwal:", err);
    }
  };

  const filtered = schedules.filter(s => 
    s.class?.name.toLowerCase().includes(search.toLowerCase()) || 
    s.subject?.name.toLowerCase().includes(search.toLowerCase())
  );
  
  const inputStyle = "w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 bg-white";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800">Jadwal Pelajaran</h1><p className="text-gray-500 text-sm">Atur jadwal KBM sekolah</p></div>
        <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-lg shadow-blue-500/30 font-medium"><Plus size={18} /> Buat Jadwal</button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <Search className="text-gray-400" size={20}/>
            <input type="text" placeholder="Cari jadwal (kelas/mapel)..." className="bg-transparent outline-none w-full text-gray-700" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-white text-gray-500 uppercase text-xs font-bold border-b border-gray-100">
                <tr><th className="p-5">Hari & Jam</th><th className="p-5">Kelas</th><th className="p-5">Mata Pelajaran</th><th className="p-5">Guru</th><th className="p-5 text-right">Aksi</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition">
                    <td className="p-5">
                        <div className="font-bold text-blue-600">{days[s.dayOfWeek]}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12}/> {s.startTime} - {s.endTime}</div>
                    </td>
                    <td className="p-5"><span className="bg-gray-100 px-2 py-1 rounded font-bold text-xs">{s.class?.name}</span></td>
                    <td className="p-5 font-bold text-gray-700">{s.subject?.name}</td>
                    <td className="p-5 text-gray-600 flex items-center gap-2"><div className="h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">{s.teacher?.user?.name.charAt(0)}</div>{s.teacher?.user?.name}</td>
                    <td className="p-5 text-right"><button onClick={()=>handleDelete(s.id)} className="p-2 text-gray-400 hover:text-red-500 transition"><Trash2 size={18}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50"><h3 className="font-bold text-gray-800">Buat Jadwal Baru</h3><button onClick={()=>setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Baris 1: Hari & Jam */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Hari</label>
                        <select required className={inputStyle} value={form.dayOfWeek} onChange={e=>setForm({...form, dayOfWeek:e.target.value})}>
                            {days.map((d, i) => <option key={i} value={i}>{d}</option>)}
                        </select>
                    </div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Mulai</label><input required type="time" className={inputStyle} value={form.startTime} onChange={e=>setForm({...form, startTime:e.target.value})}/></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Selesai</label><input required type="time" className={inputStyle} value={form.endTime} onChange={e=>setForm({...form, endTime:e.target.value})}/></div>
                </div>

                {/* Baris 2: Kelas & Mapel */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Kelas</label>
                        <select required className={inputStyle} value={form.classId} onChange={e=>setForm({...form, classId:e.target.value})}>
                            <option value="">-- Pilih --</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Mata Pelajaran</label>
                        <select required className={inputStyle} value={form.subjectId} onChange={e=>setForm({...form, subjectId:e.target.value})}>
                            <option value="">-- Pilih --</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* Baris 3: Guru */}
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Guru Pengajar</label>
                    <select required className={inputStyle} value={form.teacherId} onChange={e=>setForm({...form, teacherId:e.target.value})}>
                        <option value="">-- Pilih Guru --</option>
                        {teachers.map(t => <option key={t.id} value={t.id}>{t.user?.name}</option>)}
                    </select>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex justify-center gap-2"><Save size={18}/> Simpan Jadwal</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}