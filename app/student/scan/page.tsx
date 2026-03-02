"use client";

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ScanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Arahkan kamera ke QR Code Guru");

  const handleScan = async (detectedCodes: any[]) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const qrData = detectedCodes[0].rawValue;
      
      if (loading) return; 

      console.log("QR Terbaca:", qrData);
      setLoading(true);
      setMessage("Memproses Absensi...");

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token hilang, login ulang dulu.");

        // 👇 PASTIKAN INI URL NGROK BACKEND KAMU 👇
        const BACKEND_URL = "http://localhost:3000"; 

        await axios.post(`${BACKEND_URL}/attendance`, {
          scheduleId: qrData,
        }, {
           headers: { Authorization: `Bearer ${token}` }
        });

        setMessage("✅ Absensi Berhasil!");
        setTimeout(() => router.push("/student/dashboard"), 2000);

      } catch (err: any) {
        setLoading(false);
        const errMsg = err.response?.data?.message || "QR Code tidak valid";
        setMessage(`❌ Gagal: ${errMsg}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative">
      
      {/* HEADER: Back Button */}
      <div className="absolute top-0 left-0 w-full z-20 p-6 flex justify-between items-center">
        <Link href="/student/dashboard">
            <div className="bg-black/40 p-3 rounded-full backdrop-blur-md border border-white/10">
                <ArrowLeft className="text-white" />
            </div>
        </Link>
      </div>

      {/* SCANNER AREA */}
      <div className="flex-1 relative flex flex-col justify-center bg-black">
         <Scanner
            onScan={handleScan}
            onError={(error: any) => console.log(error?.message || error)}
            // 👇 HANYA INI YANG KITA PAKAI (BIAR GAK ERROR TS)
            constraints={{ 
                facingMode: 'environment'
            }}
            styles={{
                container: { height: '100%', width: '100%' },
                video: { objectFit: 'cover' }
            }}
         />

         {/* Overlay Kotak Fokus */}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 border-2 border-blue-500/50 rounded-3xl relative">
                <div className="w-full h-0.5 bg-blue-400 shadow-[0_0_15px_#60a5fa] absolute top-1/2 animate-pulse"></div>
            </div>
         </div>
      </div>

      {/* FOOTER: Status Message */}
      <div className="absolute bottom-10 left-0 w-full px-6 flex justify-center z-20">
        <div className="bg-black/60 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/10 shadow-xl max-w-sm">
            <p className={`font-bold text-center ${loading ? 'text-yellow-400' : 'text-white'}`}>
                {loading ? "⏳ Memproses..." : message}
            </p>
        </div>
      </div>
    </div>
  );
}