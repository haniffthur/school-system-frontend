"use client";

import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader"; // Library Scanner
import { ArrowLeft, Loader2, MapPin, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function ScanPage() {
  const router = useRouter();
  
  // State
  const [data, setData] = useState("No result");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  // 1. Ambil Lokasi GPS saat halaman dibuka (Opsional tapi keren)
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }, []);

  // 2. Fungsi saat QR Code Terbaca
 const handleScan = async (result: any, error: any) => {
    if (!!result && status === "IDLE") {
      setStatus("SUCCESS");
      setLoading(true);
      
      const qrData = result?.text; // Isi QR: ID Jadwal (UUID)
      console.log("QR Code Terbaca:", qrData);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token tidak ditemukan");

        // --- LOGIC KIRIM KE BACKEND (SUDAH AKTIF) ---
        await axios.post("http://localhost:3000/attendance", {
          scheduleId: qrData, // Kirim ID Jadwal hasil scan
          lat: location?.lat,
          lng: location?.lng
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // Sukses
        setMessage("Absensi Berhasil Dicatat!");
        setLoading(false);
        setTimeout(() => router.push("/student/dashboard"), 2000);

      } catch (err: any) {
        console.error(err);
        setStatus("ERROR");
        // Tampilkan pesan error dari backend kalau ada
        const serverMsg = err.response?.data?.message;
        setMessage(serverMsg || "QR Code tidak valid atau jadwal salah.");
        setLoading(false);
      }
    }
    if (!!error) {
      // console.info(error); // Error scanning biasa (karena kamera goyang dll), abaikan aja
    }
    // ... error handling ...
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      
      {/* 1. Header Transparan */}
      <div className="absolute top-0 left-0 w-full z-20 p-5 flex justify-between items-center text-white bg-gradient-to-b from-black/60 to-transparent">
        <Link href="/student/dashboard" className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition">
            <ArrowLeft size={24}/>
        </Link>
        <div className="text-center">
            <h1 className="font-bold text-lg">Scan QR Code</h1>
            <p className="text-xs text-gray-300 opacity-80">Arahkan kamera ke layar guru</p>
        </div>
        <div className="w-10"></div> {/* Spacer biar tengah */}
      </div>

      {/* 2. AREA KAMERA (Full Screen) */}
      <div className="flex-1 relative flex items-center justify-center bg-gray-900">
        {status !== "SUCCESS" && status !== "ERROR" ? (
             <QrReader
                onResult={handleScan}
                constraints={{ facingMode: 'user' }} // Pakai kamera belakang HP
                className="w-full h-full object-cover"
                videoContainerStyle={{ height: '100%', paddingTop: 0 }}
                videoStyle={{ objectFit: 'cover', height: '100%' }}
             />
        ) : (
            // Layar Blank saat Loading/Result (biar gak berat render kamera terus)
            <div className="bg-gray-900 w-full h-full"></div>
        )}

        {/* Overlay Kotak Fokus */}
        {status === "IDLE" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative">
                    {/* Pojok-pojok biar keren */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 -mt-1 -ml-1 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 -mt-1 -mr-1 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 -mb-1 -ml-1 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 -mb-1 -mr-1 rounded-br-lg"></div>
                    
                    {/* Garis Scan Animasi */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,1)] animate-scan"></div>
                </div>
            </div>
        )}
      </div>

      {/* 3. Footer Info Lokasi */}
      <div className="absolute bottom-10 left-0 w-full z-20 px-6 text-center">
         <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-medium border border-white/10">
            {location ? (
                <><MapPin size={14} className="text-green-400"/> Lokasi Terdeteksi</>
            ) : (
                <><Loader2 size={14} className="animate-spin text-yellow-400"/> Mencari Lokasi...</>
            )}
         </div>
      </div>

      {/* 4. MODAL STATUS (Success/Error/Loading) */}
      {(loading || status === "SUCCESS" || status === "ERROR") && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl">
                
                {loading ? (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 size={48} className="text-blue-600 animate-spin"/>
                        <h3 className="text-xl font-bold text-slate-800">Memproses...</h3>
                        <p className="text-slate-500 text-sm">Sedang memverifikasi token absensi.</p>
                    </div>
                ) : status === "SUCCESS" ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle2 size={40} className="text-green-600"/>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">Berhasil!</h3>
                        <p className="text-slate-500 text-sm">{message}</p>
                        <p className="text-xs text-slate-400 mt-4">Mengalihkan ke dashboard...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-2">
                            <XCircle size={40} className="text-red-600"/>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">Gagal!</h3>
                        <p className="text-slate-500 text-sm">{message}</p>
                        <button onClick={() => setStatus("IDLE")} className="mt-4 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm w-full hover:bg-slate-800">
                            Coba Lagi
                        </button>
                    </div>
                )}

            </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
}