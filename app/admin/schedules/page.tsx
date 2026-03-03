"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Calendar, Clock, X, Save } from "lucide-react";

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    dayOfWeek: "MONDAY",
    startTime: "",
    endTime: "",
    subjectId: "",
    classId: "",
    teacherId: ""
  });

  const API_URL = "http://localhost:3000";

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [resSched, resSub, resClass, resTeach] = await Promise.all([
        axios.get(`${API_URL}/schedules`, { headers }),
        axios.get(`${API_URL}/subjects`, { headers }),
        axios.get(`${API_URL}/classes`, { headers }),
        axios.get(`${API_URL}/teachers`, { headers }),
      ]);

      setSchedules(resSched.data);
      setSubjects(resSub.data);
      setClasses(resClass.data);
      setTeachers(resTeach.data);
      setLoading(false);
    } catch (err) {
      console.error("Gagal load data:", err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${API_URL}/schedules`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Jadwal Berhasil Ditambahkan!");
      setIsModalOpen(false);
      fetchInitialData(); // Refresh data
    } catch (err) {
      alert("Gagal simpan jadwal. Cek koneksi atau data.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus jadwal ini?")) return;
    const token = localStorage.getItem("token");
    await axios.delete(`${API_URL}/schedules/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchInitialData();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Jadwal Pelajaran</h1>
          <p className="text-sm text-gray-500">Atur waktu KBM sekolah</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition"
        >
          <Plus size={18} /> Tambah Jadwal
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
            <tr>
              <th className="p-4">Hari</th>
              <th className="p-4">Jam</th>
              <th className="p-4">Mata Pelajaran</th>
              <th className="p-4">Kelas</th>
              <th className="p-4">Guru</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {schedules.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-4 font-bold">{s.dayOfWeek}</td>
                <td className="p-4 text-gray-600">{s.startTime} - {s.endTime}</td>
                <td className="p-4 font-medium">{s.subject?.name}</td>
                <td className="p-4">{s.class?.name}</td>
                <td className="p-4">{s.teacher?.user?.name}</td>
                <td className="p-4 text-center">
                  <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Input */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">Buat Jadwal Baru</h3>
              <button onClick={() => setIsModalOpen(false)}><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Hari</label>
              
<select 
  className="w-full p-2 border rounded-lg mt-1"
  value={form.dayOfWeek}
  onChange={e => setForm({...form, dayOfWeek: e.target.value})}
>
  <option value="MONDAY">Senin</option>
  <option value="TUESDAY">Selasa</option>
  <option value="WEDNESDAY">Rabu</option>
  <option value="THURSDAY">Kamis</option>
  <option value="FRIDAY">Jumat</option>
</select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Jam Mulai</label>
                <input type="time" className="w-full p-2 border rounded-lg mt-1" required
                  onChange={e => setForm({...form, startTime: e.target.value})} />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Jam Selesai</label>
                <input type="time" className="w-full p-2 border rounded-lg mt-1" required
                  onChange={e => setForm({...form, endTime: e.target.value})} />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Mata Pelajaran</label>
                <select className="w-full p-2 border rounded-lg mt-1" required
                  onChange={e => setForm({...form, subjectId: e.target.value})}>
                  <option value="">Pilih Mapel</option>
                  {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Kelas</label>
                <select className="w-full p-2 border rounded-lg mt-1" required
                  onChange={e => setForm({...form, classId: e.target.value})}>
                  <option value="">Pilih Kelas</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Guru Pengajar</label>
                <select className="w-full p-2 border rounded-lg mt-1" required
                  onChange={e => setForm({...form, teacherId: e.target.value})}>
                  <option value="">Pilih Guru</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.user?.name}</option>)}
                </select>
              </div>

              <button className="col-span-2 bg-indigo-600 text-white py-3 rounded-xl font-bold mt-4 flex justify-center items-center gap-2">
                <Save size={18}/> Simpan Jadwal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}