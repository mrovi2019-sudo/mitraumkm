/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Building2, 
  MapPin, 
  Sparkles, 
  TrendingUp, 
  FileSpreadsheet, 
  Target, 
  Lightbulb, 
  Coins, 
  PlusCircle, 
  Store,
  ChevronRight,
  Info
} from "lucide-react";
import FinanceModule from "./components/FinanceModule";
import MarketModule from "./components/MarketModule";

export default function App() {
  const [activeTab, setActiveTab] = useState<"finance" | "market">("finance");
  const [businessName, setBusinessName] = useState("Batik Sekar Solo");
  const [businessLocation, setBusinessLocation] = useState("Solo, Jawa Tengah");
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [tempName, setTempName] = useState(businessName);
  const [tempLoc, setTempLoc] = useState(businessLocation);

  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    setBusinessName(tempName || "UMKM Juara");
    setBusinessLocation(tempLoc || "Indonesia");
    setIsEditingBusiness(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar: Rich Indigo Sidebar based on Vibrant Palette Theme */}
      <aside className="w-full md:w-72 bg-indigo-700 flex flex-col p-6 text-white shrink-0 shadow-lg">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8 md:mb-10">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-indigo-950 font-black text-xl shadow-md transform hover:rotate-3 transition-transform">
            AI
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none text-white">MITRA UMKM</h1>
            <p className="text-[10px] text-indigo-200 mt-1 uppercase font-semibold tracking-wider">Asisten AI Pertumbuhan</p>
          </div>
        </div>

        {/* Business Brief / Profile Selector in Sidebar */}
        <div className="bg-indigo-800/80 rounded-2xl p-4 mb-6 border border-indigo-600 shadow-sm">
          {isEditingBusiness ? (
            <form onSubmit={handleSaveBusiness} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-indigo-300 uppercase">Nama Usaha</label>
                <input
                  type="text"
                  className="w-full rounded-lg bg-indigo-900 border border-indigo-500 p-2 text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-yellow-400"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-indigo-300 uppercase">Lokasi</label>
                <input
                  type="text"
                  className="w-full rounded-lg bg-indigo-900 border border-indigo-500 p-2 text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-yellow-400"
                  value={tempLoc}
                  onChange={(e) => setTempLoc(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-indigo-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingBusiness(false)}
                  className="px-2 py-1.5 bg-indigo-900 text-indigo-300 rounded-lg text-xs"
                >
                  Batal
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm tracking-tight leading-snug">{businessName}</h4>
                  <p className="text-xs text-indigo-200 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-indigo-300 shrink-0" />
                    {businessLocation}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setTempName(businessName);
                    setTempLoc(businessLocation);
                    setIsEditingBusiness(true);
                  }}
                  className="text-[10px] bg-indigo-600 hover:bg-indigo-550 text-indigo-100 rounded px-1.5 py-0.5 transition-colors cursor-pointer"
                >
                  Ubah
                </button>
              </div>
              <div className="pt-2 border-t border-indigo-600/50 flex justify-between items-center text-[10px] font-semibold text-indigo-200">
                <span>Skala Usaha: Mikro/Kecil</span>
                <span className="bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider">
                  Premium AI Active
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Navigations */}
        <nav className="flex-1 space-y-2.5">
          <button
            onClick={() => setActiveTab("finance")}
            className={`w-full flex items-center justify-between text-left p-3.5 rounded-xl cursor-pointer transition-all ${
              activeTab === "finance"
                ? "bg-indigo-600 text-white font-semibold shadow-sm border-l-4 border-yellow-400 pl-3"
                : "text-indigo-150 hover:bg-indigo-650 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <FileSpreadsheet className={`h-5 w-5 ${activeTab === "finance" ? "text-yellow-400" : "text-indigo-300"}`} />
              <span className="text-sm">Laporan Keuangan AI</span>
            </div>
            <ChevronRight className="h-4 w-4 opacity-55" />
          </button>

          <button
            onClick={() => setActiveTab("market")}
            className={`w-full flex items-center justify-between text-left p-3.5 rounded-xl cursor-pointer transition-all ${
              activeTab === "market"
                ? "bg-indigo-600 text-white font-semibold shadow-sm border-l-4 border-yellow-400 pl-3"
                : "text-indigo-150 hover:bg-indigo-650 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <Target className={`h-5 w-5 ${activeTab === "market" ? "text-yellow-400" : "text-indigo-300"}`} />
              <span className="text-sm">Target Pasar & Segmen</span>
            </div>
            <ChevronRight className="h-4 w-4 opacity-55" />
          </button>
        </nav>

        {/* Dynamic AI Tip of the day, matching the mockup */}
        <div className="mt-8 md:mt-auto bg-indigo-800 p-4 rounded-2xl border border-indigo-600/30">
          <div className="flex items-center gap-1.5 text-yellow-400 mb-1">
            <Lightbulb className="h-4 w-4" />
            <p className="text-xs font-bold uppercase tracking-wider">Saran Praktis Hari Ini</p>
          </div>
          <p className="text-xs italic text-indigo-100 leading-relaxed font-medium">
            "Fokus kembangkan promosi di Status WA dan Tiktok Video pendek bertema pembikinan produk. Pembeli lokal gemar melihat proses pembuatan produk yang bersih dan otentik!"
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        {/* Dynamic Responsive Navigation Header */}
        <header className="h-20 bg-white border-b border-slate-100 px-6 md:px-8 flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
              Halo, {businessName}! 👋
            </h2>
            <span className="hidden sm:inline-flex bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider animate-pulse">
              STATUS: BERTUMBUH
            </span>
          </div>

          {/* User profile tag widget */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden xs:block">
              <p className="text-xs font-bold text-slate-900">{businessName}</p>
              <p className="text-[10px] font-medium text-slate-500">{businessLocation}</p>
            </div>
            <div className="w-10 h-10 bg-orange-400 rounded-full border-2 border-slate-200 shadow-sm flex items-center justify-center text-white font-extrabold text-sm">
              {businessName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Sub-Header KPI Metrics Block (Vibrant Cards) */}
        <div className="px-6 md:px-8 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Estimasi Omzet Rata-Rata Bulan Ini</p>
              <p className="text-xl md:text-2xl font-black text-indigo-600 mt-1">Rp 24,5 jt</p>
              <div className="flex items-center gap-1 mt-1 text-green-600 text-xs font-bold">
                <span>↑ 12.4%</span>
                <span className="text-slate-400 font-normal">vs bulan lalu</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Keefektifan Pengeluaran</p>
              <p className="text-xl md:text-2xl font-black text-rose-500 mt-1">Hemat 20%</p>
              <div className="flex items-center gap-1 mt-1 text-rose-500 text-xs font-bold">
                <span>↓ 5.1%</span>
                <span className="text-slate-400 font-normal">berkat bantuan AI</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Potensi Pasar Baru Terdeteksi</p>
              <p className="text-xl md:text-2xl font-black text-orange-500 mt-1">1.240 Kepala</p>
              <div className="flex items-center gap-1 mt-1 text-green-600 text-xs font-bold">
                <span>↑ 40.2%</span>
                <span className="text-slate-400 font-normal">pembeli ideal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Module Container */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeTab === "finance" ? (
            <div className="animate-fade-in">
              <FinanceModule />
            </div>
          ) : (
            <div className="animate-fade-in">
              <MarketModule />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

