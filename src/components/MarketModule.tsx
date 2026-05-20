import React, { useState } from "react";
import { 
  Sparkles, 
  Target, 
  Share2, 
  TrendingUp, 
  Compass, 
  CheckSquare, 
  DollarSign, 
  Lightbulb, 
  RefreshCw, 
  ShieldAlert,
  ArrowRight,
  Info
} from "lucide-react";
import { MarketAnalysisResponse } from "../types";

// Quick test templates for SMEs to seed their product details
const DEMO_PRODUCTS = [
  {
    name: "Sambal Cumi Pedas 'Nampol'",
    category: "Makanan & Minuman",
    price: "25000",
    location: "Jabodetabek & Kota-Kota Besar",
    uniqueKey: "Resep kuno madura dengan cumi segar melimpah tanpa pengawet sintetis. Kemasan botol kaca bersegel rapi, tahan 2 bulan di kulkas.",
    description: "Sambal cumi siap saji kualitas premium dengan rasa gurih pedas khas. Ditargetkan untuk anak muda rantau, keluarga sibuk yang tidak sempat memasak, tetapi ingin lauk instan mewah di atas nasi hangat."
  },
  {
    name: "Sabun Batang Lerak Organik",
    category: "Kerajinan & Kecantikan Kecil",
    price: "18000",
    location: "Bandung, Sleman, & Denpasar (Konsumen Eco-Friendly)",
    uniqueKey: "Bebas sulfat (SLS free), menggunakan minyak kelapa organik lokal beraroma minyak esensial bunga kamboja. Kemasan kertas daur ulang tanpa plastik sama sekali.",
    description: "Sabun mandi ramah lingkungan yang aman untuk kulit sensitif dan eksim. Air bekas cuciannya ramah lingkungan untuk tanaman. Dibuat tangan secara tradisional di ruko rumahtangga."
  },
  {
    name: "Laundry Sepatu Premium Clean",
    category: "Jasa",
    price: "45000",
    location: "Kota Yogyakarta (Area Kampus UGM/UNY)",
    uniqueKey: "Garansi pencucian bersih 100% atau cuci ulang gratis. Menggunakan cairan pembersih khusus impor aman untuk suede/kulit. Antar jemput gratis minimal 2 pasang.",
    description: "Jasa perawatan, cuci bersih mendalam (deep clean), recoat warna, dan penghilang bau apek untuk sepatu sneakers, boots, dan sepatu kantor harian anak muda."
  }
];

export default function MarketModule() {
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("Makanan & Minuman");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [targetLocation, setTargetLocation] = useState("");
  const [uniqueKey, setUniqueKey] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<MarketAnalysisResponse | null>(null);

  const applyDemoProduct = (demo: typeof DEMO_PRODUCTS[0]) => {
    setProductName(demo.name);
    setProductCategory(demo.category);
    setProductPrice(demo.price);
    setTargetLocation(demo.location);
    setUniqueKey(demo.uniqueKey);
    setProductDescription(demo.description);
    setError(null);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !productDescription.trim()) {
      setError("Mohon isi Nama Produk dan Deskripsi Singkat Produk terlebih dahulu!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/market-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          productCategory,
          productPrice,
          productDescription,
          targetLocation,
          uniqueKey
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Gagal menghubungi mesin analisis pasar.");
      }

      const data: MarketAnalysisResponse = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message || "Terdapat gangguan AI dalam memetakan segmen. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: string) => {
    const parsed = parseFloat(val);
    if (isNaN(parsed)) return "Belum diatur";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(parsed);
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                <Target className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-800">Pencari Pasar & Segmen Pelanggan AI</h2>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
              Bingung bagaimana cara memasarkan produk Anda agar laku keras? Masukkan data produk UMKM Anda, dan AI akan memetakan segmen pembeli terbaik, melakukan analisis SWOT, merumuskan taktik pemasaran lokal, dan membuat rencana aksi praktis.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Form Panel - size 5/12 */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs space-y-5 lg:col-span-5 h-fit">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Compass className="h-4 w-4 text-teal-500" />
              Detail Produk UMKM Anda
            </h3>
            <span className="text-[10px] font-mono rounded bg-slate-50 px-2 py-1 text-slate-400">
              IDE & POSITIONING
            </span>
          </div>

          {/* Quick-fill template picker */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500">Pilih Template Produk Contoh Cepat:</p>
            <div className="flex flex-wrap gap-1.5">
              {DEMO_PRODUCTS.map((demo, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => applyDemoProduct(demo)}
                  className="rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 text-[11px] text-slate-600 transition-colors font-medium cursor-pointer"
                >
                  🚀 {demo.name.split(" ")[0]} ({demo.category})
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="space-y-3">
              {/* Product Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Nama Produk / Jasa *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sambal Cumi Nampol"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-700 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-hidden transition-all"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Category Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Kategori</label>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-700 focus:border-teal-500 focus:bg-white focus:outline-hidden transition-all"
                    value={productCategory}
                    onChange={e => setProductCategory(e.target.value)}
                  >
                    <option value="Makanan & Minuman">Makanan & Minuman</option>
                    <option value="Pakaian & Busana">Pakaian & Busana</option>
                    <option value="Kerajinan & Kado">Kerajinan & Kado</option>
                    <option value="Jasa & Konsultasi">Jasa & Pelayanan</option>
                    <option value="Kecantikan & Kesehatan">Kosmetik & Herbal</option>
                    <option value="Lain-lain">Lainnya</option>
                  </select>
                </div>

                {/* Price Estimate */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Kisaran Harga (IDR)</label>
                  <input
                    type="number"
                    placeholder="Contoh: 25000"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-700 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-hidden transition-all"
                    value={productPrice}
                    onChange={e => setProductPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* Target Location */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Target Wilayah Jangkauan</label>
                <input
                  type="text"
                  placeholder="Contoh: Kota Malang & sekitarnya, atau Nasional"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-700 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-hidden transition-all"
                  value={targetLocation}
                  onChange={e => setTargetLocation(e.target.value)}
                />
              </div>

              {/* Uniqueness USP */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Keunggulan Utama / Uniqueness (USP)</label>
                <input
                  type="text"
                  placeholder="Contoh: Rendah gula, resep keluarga asli, gratis ongkir rukun tetangga"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-700 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-hidden transition-all"
                  value={uniqueKey}
                  onChange={e => setUniqueKey(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Deskripsi Ringkas Produk & Visi Bisnis *</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Jelaskan produk Anda, terbuat dari apa, bahan, citarasa, atau model layanannya..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-700 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-hidden transition-all resize-none min-h-[100px]"
                  value={productDescription}
                  onChange={e => setProductDescription(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3 flex items-start gap-2.5">
                <ShieldAlert className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-600 leading-normal">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm py-3 px-4 flex items-center justify-center gap-2 transition-colors duration-150 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shadow-xs cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Mencari Segmentasi Lewat AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Petakan Target Pasar & Segmen
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Dashboard Panel - size 7/12 */}
        <div className="lg:col-span-7 space-y-6">
          {!analysis && !loading && (
            <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[480px]">
              <div className="rounded-full bg-slate-50 p-5 text-slate-400">
                <Target className="h-14 w-14 stroke-[1.25]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-700">Rencana Pemasaran Belum Dibahas</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Isikan formulir spesifikasi produk di sebelah kiri, lalu tekan petakan pasar untuk meluncurkan analisis bento-grid pemasaran AI terlengkap.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[480px]">
              <div className="relative">
                <div className="h-14 w-14 rounded-full border-4 border-slate-50 border-t-teal-600 animate-spin"></div>
                <Sparkles className="h-5 w-5 text-teal-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-700 animate-pulse">Menghitung Data Konsumen Indonesia...</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Mesin AI sedang memindai tren media sosial lokal, memisahkan segmentasi kependudukan (demografi), memetakan matriks SWOT bento, dan menyusun taktik periklanan berbiaya rendah rukun warga.
                </p>
              </div>
            </div>
          )}

          {analysis && !loading && (
            <div className="space-y-6">
              {/* Target Segments Block */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-50 text-teal-600">
                    <Target className="h-4 w-4" />
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm">Rekomendasi Segmen Pembeli Terbaik (Ideal Buyer Personas)</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.targetSegments.map((seg, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-2 flex flex-col justify-between hover:border-slate-200 transition-colors">
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Cohort {idx + 1}
                        </span>
                        <h5 className="font-bold text-slate-800 text-xs sm:text-sm leading-tight">{seg.segmentName}</h5>
                        <p className="text-xs text-slate-500 leading-normal">{seg.characteristics}</p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100/60 space-y-1 bg-white/60 -mx-4 -mb-4 p-4 rounded-b-xl">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase leading-none">Mengapa Membeli?</p>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">{seg.relevance}</p>
                        <p className="text-[10px] text-teal-600 font-semibold leading-relaxed mt-2">
                          📢 Rekomendasi Media: <strong className="text-slate-700">{seg.acquisitionChannel}</strong>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SWOT Quadrant Bento Grid */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-50 text-amber-600">
                    <TrendingUp className="h-4 w-4" />
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm">Analisis SWOT Produk (Pemetaan Posisi Pasar)</h4>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Strengths */}
                  <div className="rounded-xl border border-emerald-50 bg-emerald-50/20 p-3 space-y-1.5">
                    <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest">💪 Kekuatan (Strengths)</span>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1 pl-1">
                      {analysis.swot.strengths.map((s, i) => <li key={i} className="leading-tight">{s}</li>)}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="rounded-xl border border-rose-50 bg-rose-50/20 p-3 space-y-1.5">
                    <span className="text-[9px] font-bold text-rose-700 uppercase tracking-widest">⚠️ Kelemahan (Weaknesses)</span>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1 pl-1">
                      {analysis.swot.weaknesses.map((w, i) => <li key={i} className="leading-tight">{w}</li>)}
                    </ul>
                  </div>

                  {/* Opportunities */}
                  <div className="rounded-xl border border-indigo-50 bg-indigo-50/20 p-3 space-y-1.5">
                    <span className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest">📈 Peluang (Opportunities)</span>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1 pl-1">
                      {analysis.swot.opportunities.map((o, i) => <li key={i} className="leading-tight">{o}</li>)}
                    </ul>
                  </div>

                  {/* Threats */}
                  <div className="rounded-xl border border-amber-50 bg-amber-50/20 p-3 space-y-1.5">
                    <span className="text-[9px] font-bold text-amber-700 uppercase tracking-widest">🛡️ Tantangan (Threats)</span>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1 pl-1">
                      {analysis.swot.threats.map((t, i) => <li key={i} className="leading-tight">{t}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Marketing Channels & Tactic Table */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                    <Share2 className="h-4 w-4" />
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm">Saluran Promosi Pilihan & Taktik Kreatif</h4>
                </div>

                <div className="space-y-3">
                  {analysis.marketingChannels.map((chan, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-100/80 p-4 space-y-2 flex flex-col md:flex-row md:items-start md:justify-between hover:bg-slate-50/30 transition-colors">
                      <div className="space-y-1 flex-1 md:pr-4">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-slate-800 text-xs sm:text-sm">{chan.channelName}</h5>
                        </div>
                        <p className="text-xs text-slate-500 leading-normal">{chan.tacticDescription}</p>
                      </div>

                      <div className="flex gap-2 shrink-0 md:flex-col md:items-end mt-2 md:mt-0">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 font-semibold">
                          Biaya: {chan.costLevel}
                        </span>
                        <span className="rounded bg-teal-50 border border-teal-100 px-2 py-0.5 text-[10px] text-teal-700 font-semibold">
                          Skill: {chan.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practical Growth Roadmap / Steps */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-50 text-purple-600">
                    <CheckSquare className="h-4 w-4" />
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm">Rencana Aksi Bertahap (Actionable Roadmap)</h4>
                </div>

                <div className="relative border-l border-slate-100 pl-4 ml-2.5 space-y-6">
                  {analysis.tactics.map((step, idx) => (
                    <div key={idx} className="relative space-y-1.5">
                      {/* step marker badge */}
                      <span className="absolute -left-[27px] top-0 h-5 w-5 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center border-4 border-white shadow-xs">
                        {step.stepNumber}
                      </span>
                      <h5 className="font-semibold text-slate-800 text-xs sm:text-sm leading-none pl-1.5">{step.title}</h5>
                      <p className="text-xs text-slate-500 leading-normal pl-1.5">{step.actionPlan}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Encouraging Advice Block */}
              <div className="rounded-2xl border border-teal-100 bg-teal-50/10 p-5 space-y-2.5">
                <div className="flex items-center gap-1.5 text-teal-800">
                  <Lightbulb className="h-5 w-5 text-teal-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Pesan Inspirasi & Strategi Kunci AI</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-line italic">
                  "{analysis.aiStrategicAdvice}"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-amber-50/30 p-5 border border-amber-100 flex items-start gap-3">
        <Info className="h-5 w-5 shrink-0 mt-0.5 text-amber-600" />
        <div className="space-y-1">
          <p className="text-xs text-slate-700 font-semibold">TIPS AI: Kunci Laris UMKM Digital</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Dua kunci utama laku di media sosial lokal adalah <strong>cerita personal di balik produk (storytelling)</strong> dan <strong>nilai kegunaan instan</strong>. Hindari promosi kaku; pakailah video ulasan singkat berdurasi 15-30 detik bertema bincang hangat atau proses pembuatan (Behind-the-Scenes) yang membangkitkan rasa lapar/penasaran penonton.
          </p>
        </div>
      </div>
    </div>
  );
}
