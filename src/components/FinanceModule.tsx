import React, { useState } from "react";
import { 
  FileText, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PlusCircle, 
  Trash2, 
  FileSpreadsheet, 
  CheckCircle, 
  Lightbulb, 
  RefreshCw, 
  AlertTriangle,
  Info
} from "lucide-react";
import { FinancialReport, Transaction } from "../types";

// Helpful mock templates to quickly fill the textarea so the user can test easily
const TEMPLATES = [
  {
    name: "Warung Nasi Goreng",
    text: `pemasukan dari jualan nasi goreng semalam laku 42 porsi dapet sekitar 630rb
beli beras premium 10 kg harganya 150 ribu rupiah
bumbu dapur sama kecap manis abis 45ribu
jual es teh manis manis dapet 120rb
bayar gas lpg 3kg dapet harga subsidi eceran 22rb untuk cadangan
gaji pembantu harian 80rb`
  },
  {
    name: "Laundry Kiloan",
    text: `terima setoran laundry kiloan komplit dapet 320 ribu rupiah hari ini
beli sabun cuci cair matic sama pewangi detergen habis 75.000
bayar tagihan listrik ruko bulanan 210ribu kemari
pelanggan bayar laundry sepatu luxury dapet 90rb
perbaikan tuas setrika uap yang patah bayar tukang las kena 40k`
  },
  {
    name: "Toko Hijab Online",
    text: `laku grosir 12 pcs hijab pasmina instan dapet transferan 480k
kirim paket ninja express ongkir bayar ditempat kurir 32rb
iklan tiktok ads budget harian bayar pake saldo debit 100k
laku eceran 3 hijab sutra premium untung kotor dapet 180rb
bayar langganan aplikasi editing foto canva pro bulanan 75ribu`
  }
];

export default function FinanceModule() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<FinancialReport | null>(null);
  
  // State for manual input options
  const [showManualForm, setShowManualForm] = useState(false);
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<"INCOME" | "EXPENSE">("INCOME");
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState("Lain-lain");
  
  // Search and filter for the transaction ledger
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");

  const handleApplyTemplate = (text: string) => {
    setInputText(text);
    setError(null);
  };

  const handleParseText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setError("Silakan masukkan teks catatan atau pilih salah satu pola contoh di bawah!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/financial-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: inputText })
      });

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const bodyText = await response.text();
        console.error("Non-JSON API response content:", bodyText);
        throw new Error(
          "Server API (/api/financial-parse) merespons dalam format non-JSON (HTML/Teks). Hal ini biasanya terjadi jika aplikasi di-deploy sebagai Static SPA di Vercel tanpa fungsi backend Node.js (Express) yang aktif. Silakan jalankan backend Express terintegrasi kami di port 3000 agar AI berfungsi normal."
        );
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Gagal menghubungkan ke server AI.");
      }

      setReport(data);
    } catch (err: any) {
      setError(err.message || "Terdapat kendala transmisi sandi AI. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  };

  // Add manul transaction directly to ledger
  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim() || !newAmount) return;

    const amt = parseFloat(newAmount);
    if (isNaN(amt) || amt <= 0) return;

    const newTx: Transaction = {
      id: `TX-${Math.floor(100 + Math.random() * 900)}`,
      date: "Hari ini",
      description: newDesc,
      type: newType,
      amount: amt,
      category: newCategory
    };

    if (report) {
      const updatedTxs = [newTx, ...report.transactions];
      const addedIncome = newType === "INCOME" ? amt : 0;
      const addedExpense = newType === "EXPENSE" ? amt : 0;
      
      const newIncome = report.totalIncome + addedIncome;
      const newExpense = report.totalExpense + addedExpense;
      const newProfit = newIncome - newExpense;

      // Recalculate basic health score based on profit margin
      let rawScore = 5;
      if (newIncome > 0) {
        const margin = newProfit / newIncome;
        if (margin > 0.4) rawScore = 9;
        else if (margin > 0.2) rawScore = 8;
        else if (margin > 0) rawScore = 6;
        else if (margin > -0.2) rawScore = 4;
        else rawScore = 2;
      }

      setReport({
        transactions: updatedTxs,
        totalIncome: newIncome,
        totalExpense: newExpense,
        netProfit: newProfit,
        healthScore: Math.min(10, Math.max(1, rawScore)),
        aiAdvice: report.aiAdvice // keep previous strategic advice
      });
    } else {
      // Create first report manually if none exist
      setReport({
        transactions: [newTx],
        totalIncome: newType === "INCOME" ? amt : 0,
        totalExpense: newType === "EXPENSE" ? amt : 0,
        netProfit: newType === "INCOME" ? amt : -amt,
        healthScore: newType === "INCOME" ? 7 : 3,
        aiAdvice: "Ketikkan lebih banyak catatan harian usaha Anda di kotak teks di atas agar AI dapat menganalisis arus kas usaha Anda secara menyeluruh!"
      });
    }

    // Reset Form
    setNewDesc("");
    setNewAmount("");
    setNewCategory("Lain-lain");
    setShowManualForm(false);
  };

  // Delete transaction from ledger
  const handleDeleteTx = (id: string) => {
    if (!report) return;
    const itemToDelete = report.transactions.find(t => t.id === id);
    if (!itemToDelete) return;

    const updatedTxs = report.transactions.filter(t => t.id !== id);
    const subIncome = itemToDelete.type === "INCOME" ? itemToDelete.amount : 0;
    const subExpense = itemToDelete.type === "EXPENSE" ? itemToDelete.amount : 0;

    const newIncome = Math.max(0, report.totalIncome - subIncome);
    const newExpense = Math.max(0, report.totalExpense - subExpense);
    const newProfit = newIncome - newExpense;

    setReport({
      ...report,
      transactions: updatedTxs,
      totalIncome: newIncome,
      totalExpense: newExpense,
      netProfit: newProfit
    });
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(value);
  };

  // Extract unique categories and calculate amounts for simple visualization
  const getCategoryStats = () => {
    if (!report) return [];
    const stats: { [key: string]: { income: number; expense: number } } = {};
    
    report.transactions.forEach(t => {
      if (!stats[t.category]) {
        stats[t.category] = { income: 0, expense: 0 };
      }
      if (t.type === "INCOME") {
        stats[t.category].income += t.amount;
      } else {
        stats[t.category].expense += t.amount;
      }
    });

    return Object.keys(stats).map(cat => ({
      category: cat,
      income: stats[cat].income,
      expense: stats[cat].expense,
      total: stats[cat].income + stats[cat].expense
    })).sort((a, b) => b.total - a.total);
  };

  const categoryStats = getCategoryStats();
  const maxCategoryTotal = Math.max(...categoryStats.map(c => c.total), 1);

  // Filter transactions
  const filteredTransactions = report ? report.transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "ALL" || t.type === typeFilter;
    return matchesSearch && matchesType;
  }) : [];

  // Determine healthy color tags
  const getHealthColor = (score: number) => {
    if (score >= 8) return { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", text: "Sangat Sehat", alert: "emerald" };
    if (score >= 5) return { bg: "bg-amber-50 text-amber-700 border-amber-200", text: "Perlu Perhatian", alert: "amber" };
    return { bg: "bg-rose-50 text-rose-700 border-rose-200", text: "Risiko Tinggi", alert: "rose" };
  };

  const healthObj = report ? getHealthColor(report.healthScore) : { bg: "", text: "", alert: "" };

  return (
    <div className="space-y-8">
      {/* Introduction Header */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <FileSpreadsheet className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-800">Perapi Catatan Keuangan UMKM</h2>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
              Tulis atau paste catatan transaksi usaha harian Anda sesuka hati. AI kami akan mengekstrak nominal, merinci pengeluaran & pemasukan, merapikannya ke tabel standar akuntansi, serta memberikan analisis kesehatannya.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Hand Card: Raw Note Input Form */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs flex flex-col space-y-5">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              Input Catatan Transaksi Usaha
            </h3>
            <span className="text-[10px] font-mono rounded bg-slate-50 px-2 py-1 text-slate-400">
              MENDUKUNG INDONESIAN SLANG
            </span>
          </div>

          {/* Quick-select templates */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500">Gunakan pola usaha contoh cepat berikut:</p>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyTemplate(tmpl.text)}
                  className="rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-xs text-slate-600 transition-colors font-medium cursor-pointer"
                >
                  🎯 {tmpl.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleParseText} className="space-y-4 flex-1 flex flex-col">
            <div className="space-y-2 flex-1 flex flex-col">
              <label htmlFor="rawNotes" className="text-xs font-semibold text-slate-600">
                Ketik / Paste Catatan Keuangan Disini:
              </label>
              <textarea
                id="rawNotes"
                rows={10}
                className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-700 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-hidden transition-all resize-none min-h-[220px]"
                placeholder="Contoh: semalam dapet hasil grosir 750rb. tapi beli kantong plastik abis 34rb, bayar sate kambing malem buat lembur staff 120rb..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3.5 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-600 leading-normal">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm py-3 px-4 flex items-center justify-center gap-2 transition-colors duration-150 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-sm cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Mengekstrak Catatan lewat AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Proses & Rapikan lewat AI
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Hand Side: AI Analysis Report output */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs space-y-6">
          {!report && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4 space-y-4">
              <div className="rounded-full bg-slate-50 p-4 text-slate-400">
                <FileText className="h-12 w-12 stroke-[1.25]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-700">Laporan Akuntansi Kosong</h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  Tuliskan pembukuan usaha apa pun di sisi kiri untuk melihat laporan instan yang rapi dan terukur di sini.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center text-center py-24 space-y-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-4 border-slate-100 border-t-emerald-600 animate-spin"></div>
                <Sparkles className="h-5 w-5 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-700 animate-pulse">Menghitung Arus Kas Anda...</h4>
                <p className="text-xs text-slate-400 max-w-xs">
                  AI sedang mengekstrak entri, mengonversi nominal bahasa sehari-hari, dan menyusun laporan keuangan terbaik.
                </p>
              </div>
            </div>
          )}

          {report && !loading && (
            <div className="space-y-6">
              {/* Key Metrics Dashboard */}
              <div className="grid grid-cols-3 gap-3">
                {/* Income */}
                <div className="rounded-xl border border-emerald-50 bg-emerald-50/30 p-3 text-center space-y-1">
                  <span className="inline-flex rounded-full bg-emerald-100 p-1 text-emerald-700">
                    <TrendingUp className="h-4 w-4" />
                  </span>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Pendapatan</p>
                  <p className="text-xs md:text-sm font-bold text-emerald-600 truncate">{formatRupiah(report.totalIncome || 0)}</p>
                </div>

                {/* Expense */}
                <div className="rounded-xl border border-rose-50 bg-rose-50/30 p-3 text-center space-y-1">
                  <span className="inline-flex rounded-full bg-rose-100 p-1 text-rose-700">
                    <TrendingDown className="h-4 w-4" />
                  </span>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Pengeluaran</p>
                  <p className="text-xs md:text-sm font-bold text-rose-600 truncate">{formatRupiah(report.totalExpense || 0)}</p>
                </div>

                {/* Profit */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-center space-y-1">
                  <span className="inline-flex rounded-full bg-blue-100 p-1 text-blue-700">
                    <DollarSign className="h-4 w-4" />
                  </span>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Laba Bersih</p>
                  <p className={`text-xs md:text-sm font-bold truncate ${report.netProfit >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
                    {formatRupiah(report.netProfit || 0)}
                  </p>
                </div>
              </div>

              {/* Financial Health & Score Alert */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${healthObj.bg}`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-current"></span>
                    <p className="text-xs font-semibold uppercase tracking-wider">Kesehatan Finansial</p>
                  </div>
                  <p className="text-xs font-normal opacity-90">Kategori: <strong>{healthObj.text}</strong></p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-2xl font-black">{report.healthScore}<span className="text-xs font-normal opacity-70"> /10</span></p>
                  </div>
                </div>
              </div>

              {/* AI Strategic Advisory Card */}
              <div className="rounded-xl border border-slate-100 bg-amber-50/20 p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-amber-700">
                  <Lightbulb className="h-4 w-4 text-amber-600 leading-none shrink-0" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Nasihat Penyehatan Kas AI</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                  {report.aiAdvice}
                </p>
              </div>

              {/* Visual Category Spends - zero dependency CSS bar widget */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Penyebaran Berdasarkan Kategori</h4>
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {categoryStats.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Belum ada rincian kategori yang diparsing.</p>
                  ) : (
                    categoryStats.map((cat, idx) => {
                      const percentage = (cat.total / maxCategoryTotal) * 100;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span className="font-semibold text-slate-700">{cat.category}</span>
                            <span className="font-mono text-slate-500">
                              {cat.income > 0 && <span className="text-emerald-600 mr-2">Masuk: +{formatRupiah(cat.income)}</span>}
                              {cat.expense > 0 && <span className="text-rose-500">Keluar: -{formatRupiah(cat.expense)}</span>}
                            </span>
                          </div>
                          {/* visual progress meter */}
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${cat.income > cat.expense ? "bg-emerald-500" : "bg-rose-400"}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {report && !loading && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
          {/* Section Toolbar for search and manual Form toggle */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-50 pb-4">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-base">Buku Kas Transaksi Terstruktur</h3>
              <p className="text-xs text-slate-400">Total entri terdaftar: {filteredTransactions.length} dari total {report.transactions.length}</p>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {/* Search input field */}
              <input
                type="text"
                placeholder="Cari deskripsi atau kategori..."
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-emerald-500 focus:outline-hidden"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />

              {/* Filter type */}
              <select
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 focus:border-emerald-500 focus:outline-hidden"
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value as any)}
              >
                <option value="ALL">Semua Tipe</option>
                <option value="INCOME">Hanya Pemasukan</option>
                <option value="EXPENSE">Hanya Pengeluaran</option>
              </select>

              {/* Manual Trigger */}
              <button
                onClick={() => setShowManualForm(!showManualForm)}
                className="rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5 text-slate-600" />
                Tambah Manual
              </button>
            </div>
          </div>

          {/* Form manual insert when toggled */}
          {showManualForm && (
            <form onSubmit={handleAddManual} className="rounded-xl border border-emerald-100 bg-emerald-50/10 p-4 grid grid-cols-1 gap-4 sm:grid-cols-4 items-end">
              <div className="space-y-1 col-span-1 sm:col-span-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Deskripsi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Beli minyak sayur"
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Jenis</label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-600 focus:border-emerald-500 focus:outline-hidden"
                >
                  <option value="INCOME">📈 Pemasukan</option>
                  <option value="EXPENSE">📉 Pengeluaran</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Nominal Rupiah (IDR)</label>
                <input
                  type="number"
                  required
                  placeholder="35000"
                  value={newAmount}
                  onChange={e => setNewAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1 flex gap-2">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-600 focus:border-emerald-500 focus:outline-hidden"
                  >
                    <option value="Bahan Baku">Bahan Baku</option>
                    <option value="Penjualan">Penjualan</option>
                    <option value="Operasional">Operasional</option>
                    <option value="Gaji">Gaji</option>
                    <option value="Sewa">Sewa</option>
                    <option value="Listrik & Air">Listrik & Air</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-3 text-xs self-end h-9 flex items-center justify-center cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          )}

          {/* Clean Accountant Ledger Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-slate-50/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Keterangan Transaksi</th>
                  <th className="p-4 text-center">Jenis</th>
                  <th className="p-4 text-right">Nominal</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                      Tidak ada catatan transaksi yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-normal text-slate-500 whitespace-nowrap">{tx.date}</td>
                      <td className="p-4">
                        <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-medium text-slate-600">
                          {tx.category}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-700 leading-normal">{tx.description}</td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex rounded-md border text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                          tx.type === "INCOME" 
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                            : "bg-rose-50 border-rose-100 text-rose-700"
                        }`}>
                          {tx.type === "INCOME" ? "Pemasukan" : "Pengeluaran"}
                        </span>
                      </td>
                      <td className={`p-4 font-mono font-bold text-right ${tx.type === "INCOME" ? "text-emerald-600" : "text-rose-600"}`}>
                        {tx.type === "INCOME" ? "+" : "-"}{formatRupiah(tx.amount)}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDeleteTx(tx.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Hapus baris"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 flex items-start gap-2 text-slate-500">
            <Info className="h-4 w-4 shrink-0 mt-0.5 text-slate-400" />
            <p className="text-[11px] leading-relaxed">
              <strong>Tips Pelaporan:</strong> Anda dapat menambahkan produk/beban baru sewaktu-waktu secara manual tanpa memicu ulang AI, sehingga fleksibel melengkapi tagihan gas, biaya parkir bulanan, hingga diskon mendadak ruko Anda.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
