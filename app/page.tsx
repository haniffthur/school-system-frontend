"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { GraduationCap, Lock, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Tembak API Login Backend
      const res = await axios.post("http://localhost:3000/auth/login", form);
      
      const { access_token, user } = res.data;

      // 2. Simpan Token & Data User ke LocalStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      // 3. Cek Role & Redirect (Logika Penjaga Pintu - SUDAH DIPERBAIKI)
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else if (user.role === "TEACHER") {
        router.push("/teacher/dashboard");
      } else if (user.role === "STUDENT") {
        router.push("/student/dashboard"); // <--- INI PERUBAHANNYA (Langsung masuk)
      } else {
        setError("Role tidak dikenali. Hubungi admin.");
      }

    } catch (err: any) {
      console.error("Login Error:", err);
      // Handle Error Spesifik
      if (err.response?.status === 401) {
        setError("Email atau Password salah!");
      } else if (err.code === "ERR_NETWORK") {
        setError("Gagal koneksi ke server. Pastikan backend nyala!");
      } else {
        setError("Terjadi kesalahan sistem.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 flex items-center justify-center p-4">
      
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
        
        {/* KIRI: Ilustrasi / Branding */}
        <div className="w-full md:w-1/2 bg-blue-50 p-10 flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
          <div className="relative z-10">
            <div className="h-20 w-20 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
              <GraduationCap size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">School System</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Platform absensi digital terintegrasi untuk Guru, Siswa, dan Administrator sekolah.
            </p>
          </div>
        </div>

        {/* KANAN: Form Login */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Selamat Datang 👋</h1>
            <p className="text-gray-500 text-sm mt-1">Silakan masuk untuk melanjutkan.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 flex items-center gap-2 animate-pulse">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">Email Sekolah</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input 
                  type="email" 
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 transition placeholder-gray-300"
                  placeholder="admin@sekolah.sch.id"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input 
                  type="password" 
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 transition placeholder-gray-300"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Masuk Sistem <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-xs text-gray-400">
              Lupa password? Hubungi <span className="text-blue-600 font-bold cursor-pointer hover:underline">Admin Tata Usaha</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}