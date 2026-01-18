"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Search, X, Save, Shield, Edit, Check } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  // State Form (untuk Create & Edit)
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");
  const [form, setForm] = useState({ 
    name: "", email: "", password: "", role: "STUDENT", code: "" 
  });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      setUsers(res.data);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const handleCreate = () => {
    setForm({ name: "", email: "", password: "", role: "STUDENT", code: "" });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (user: any) => {
    setForm({ 
        name: user.name, 
        email: user.email, 
        password: "", // Kosongkan password saat edit (biar gak keganti kalau user gak mau ganti)
        role: user.role, 
        code: user.code || "" 
    });
    setEditId(user.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Mode Edit
        await axios.patch(`http://localhost:3000/users/${editId}`, form);
        alert("User berhasil diupdate! 🔄");
      } else {
        // Mode Create
        if(!form.password) return alert("Password wajib diisi untuk user baru!");
        await axios.post("http://localhost:3000/users", form);
        alert("User berhasil dibuat! ✅");
      }
      fetchUsers();
      setIsModalOpen(false);
    } catch (err) { alert("Gagal menyimpan data."); }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Hapus user ini? Hati-hati, data terkait (profil/absen) bisa hilang!")) return;
    await axios.delete(`http://localhost:3000/users/${id}`);
    fetchUsers();
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = "w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 bg-white placeholder-gray-400";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Users</h1>
            <p className="text-gray-500 text-sm">Kelola semua akun (Admin, Guru, Siswa)</p>
        </div>
        <button onClick={handleCreate} className="w-full md:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-lg shadow-blue-500/30 font-medium">
            <Plus size={18} /> Tambah User
        </button>
      </div>

      {/* TABEL */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <Search className="text-gray-400" size={20}/>
            <input type="text" placeholder="Cari user (nama/email)..." className="bg-transparent outline-none w-full text-gray-700" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-white text-gray-500 uppercase text-xs font-bold border-b border-gray-100">
                <tr><th className="p-5">Nama User</th><th className="p-5">Role</th><th className="p-5">Email / Login</th><th className="p-5 text-right">Aksi</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="p-5 font-bold text-gray-800 flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs text-white
                            ${u.role === 'ADMIN' ? 'bg-red-500' : u.role === 'TEACHER' ? 'bg-blue-500' : 'bg-green-500'}
                        `}>
                            {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div>{u.name}</div>
                            {u.code && <div className="text-xs text-gray-400 font-mono">{u.code}</div>}
                        </div>
                    </td>
                    <td className="p-5">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold border
                            ${u.role === 'ADMIN' ? 'bg-red-50 text-red-600 border-red-100' : 
                              u.role === 'TEACHER' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                              'bg-green-50 text-green-600 border-green-100'}
                        `}>
                            {u.role}
                        </span>
                    </td>
                    <td className="p-5 text-gray-500">{u.email}</td>
                    <td className="p-5 text-right flex justify-end gap-2">
                        <button onClick={()=>handleEdit(u)} className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-lg transition"><Edit size={16}/></button>
                        <button onClick={()=>handleDelete(u.id)} className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 rounded-lg transition"><Trash2 size={16}/></button>
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
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Shield size={18} className="text-blue-600"/> {isEditing ? "Edit User" : "User Baru"}
                </h3>
                <button onClick={()=>setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nama Lengkap</label>
                  <input required className={inputStyle} value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Nama User"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Role</label>
                      <select className={inputStyle} value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
                          <option value="STUDENT">SISWA</option>
                          <option value="TEACHER">GURU</option>
                          <option value="ADMIN">ADMIN</option>
                      </select>
                  </div>
                  <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Kode (NIP/NISN)</label>
                      <input className={inputStyle} value={form.code} onChange={e=>setForm({...form, code:e.target.value})} placeholder="Opsional"/>
                  </div>
              </div>
              <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Email</label>
                  <input required type="email" className={inputStyle} value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="email@sekolah.sch.id"/>
              </div>
              <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                    Password {isEditing && <span className="text-gray-400 font-normal lowercase">(kosongkan jika tidak ubah)</span>}
                  </label>
                  <input type="password" className={inputStyle} value={form.password} onChange={e=>setForm({...form, password:e.target.value})} placeholder="******" required={!isEditing}/>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex justify-center gap-2">
                  <Save size={18}/> {isEditing ? "Update Data" : "Simpan User"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}