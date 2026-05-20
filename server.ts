import express from "express";
import path from "path";
import dns from "dns";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import "dotenv/config";

// Force local DNS or skip ipv6 lookup issues if any
dns.setDefaultResultOrder("ipv4first");

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Endpoint helper to verify API Key behaves correctly
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Endpoint 1: Parse financial notes into a tidy, structured list
app.post("/api/financial-parse", async (req, res) => {
  const { notes } = req.body;

  if (!notes || typeof notes !== "string" || !notes.trim()) {
    return res.status(400).json({ error: "Catatan keuangan tidak boleh kosong." });
  }

  try {
    const prompt = `Rapikan catatan transaksi kasar UMKM berikut ke dalam bentuk laporan keuangan yang terstruktur dan rapi.
Konversikan semua penyebutan nominal (seperti '50rb', '100k', '2 juta', dll.) menjadi angka Rupiah penuh (misalnya 50000, 100000, 2000000).
Jika tanggal transaksi tidak tersurat secara detail, tentukan tanggal yang sesuai (seperti 'Kemarin', 'Hari ini', dll. berdasarkan konteks dalam cerita).
Tentukan jenis transaksi: 'INCOME' untuk pemasukan/penjualan/pendapatan, berkontribusi positif, dan 'EXPENSE' untuk pengeluaran/biaya/pembelian, berkontribusi negatif.
Kategorikan setiap transaksi ke dalam kategori umum UMKM seperti 'Bahan Baku', 'Penjualan', 'Operasional', 'Sewa', 'Gaji', 'Listrik & Air', atau 'Lain-lain'.

Catatan Transaksi:
${notes}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Anda adalah asisten manajer keuangan berpengalaman khusus untuk sektor Usaha Mikro, Kecil, dan Menengah (UMKM) di Indonesia. Tugas Anda adalah mengekstrak catatan keuangan acak secara konsisten dan memberikan analisis penyehatan arus kas dalam Bahasa Indonesia yang sederhana, bersahabat, dan praktis.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            transactions: {
              type: Type.ARRAY,
              description: "Daftar transaksi hasil ekstraksi catatan pengguna secara lengkap dan rapi",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "ID unik transaksi, misalnya TX-001, TX-002" },
                  date: { type: Type.STRING, description: "Tanggal transaksi sesuai catatan, atau penanda relatif seperti 'Hari ini', 'Kemarin', '3 hari lalu'" },
                  description: { type: Type.STRING, description: "Deskripsi singkat transaksi yang dibersihkan dalam Bahasa Indonesia (contoh: 'Membeli bumbu masakan')" },
                  type: { type: Type.STRING, description: "Jenis transaksi, HARUS salah satu dari 'INCOME' atau 'EXPENSE'" },
                  amount: { type: Type.NUMBER, description: "Nominal transaksi dalam angka bulat Rupiah (IDR)" },
                  category: { type: Type.STRING, description: "Kategori transaksi, misalnya 'Bahan Baku', 'Penjualan', 'Operasional', 'Listrik & Air', 'Gaji', 'Sewa', 'Lain-lain'" }
                },
                required: ["id", "date", "description", "type", "amount", "category"]
              }
            },
            totalIncome: { type: Type.NUMBER, description: "Jumlah total dari semua transaksi INCOME" },
            totalExpense: { type: Type.NUMBER, description: "Jumlah total dari semua transaksi EXPENSE" },
            netProfit: { type: Type.NUMBER, description: "Keuntungan bersih (totalIncome - totalExpense)" },
            healthScore: { type: Type.INTEGER, description: "Skor kesehatan keuangan UMKM ini (rentang 1 sampai 10) berdasarkan rasio keuntungan terhadap pengeluaran" },
            aiAdvice: { type: Type.STRING, description: "Nasihat taktis, tip menghemat pengeluaran, atau strategi pengelolaan keuangan spesifik berdasarkan pola transaksi di atas, bernada mendukung dan dalam Bahasa Indonesia." }
          },
          required: ["transactions", "totalIncome", "totalExpense", "netProfit", "healthScore", "aiAdvice"]
        }
      }
    });

    const resultText = response.text || "{}";
    const parsedData = JSON.parse(resultText);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error at financial-parse:", error);
    res.status(500).json({ error: error.message || "Gagal memproses catatan keuangan menggunakan AI." });
  }
});

// Endpoint 2: Market segment explorer and product target analysis
app.post("/api/market-analysis", async (req, res) => {
  const {
    productName,
    productCategory,
    productPrice,
    productDescription,
    targetLocation,
    uniqueKey,
  } = req.body;

  if (!productName || !productDescription) {
    return res.status(400).json({ error: "Nama produk dan Deskripsi produk wajib diisi." });
  }

  try {
    const prompt = `Analisis pasar dan temukan segmen pelanggan yang paling tepat untuk produk UMKM berikut:
Nama Produk: ${productName}
Kategori: ${productCategory || "Umum"}
Kisaran Harga: Rp ${productPrice || "Belum ditentukan"}
Deskripsi Produk: ${productDescription}
Lokasi Target Pasar: ${targetLocation || "Seluruh Indonesia"}
Keunikan/Nilai Plus Produk: ${uniqueKey || "Tidak disebutkan"}

Berikan keluaran yang lengkap dengan segmentasi pelanggan rinci, analisis SWOT singkat, rekomendasi saluran pemasaran/pemasaran yang cocok, serta rencana aksi praktis (roadmap langkah demi langkah). Kembangkan saran ini agar relevan bagi pasar lokal di Indonesia.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Anda adalah pakar strategi pemasaran digital dan pertumbuhan bisnis yang fokus memajukan UMKM di Indonesia agar produk mereka laku keras dan memiliki brand positioning yang kuat. Anda berbicara menggunakan bahasa Indonesia yang santun, energetik, solutif, mudah dicerna, tanpa istilah pemasaran yang terlampau rumit.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetSegments: {
              type: Type.ARRAY,
              description: "Daftar segmen pelanggan spesifik/pembeli ideal yang berpotensi menyukai produk ini",
              items: {
                type: Type.OBJECT,
                properties: {
                  segmentName: { type: Type.STRING, description: "Nama panggilan kelompok pasar, contoh: 'Ibu-ibu Kompleks Gaul', 'Mahasiswa Pemburu Praktis'" },
                  characteristics: { type: Type.STRING, description: "Ciri perilaku, kebiasaan belanja, rentang usia, atau kebutuhan utama mereka" },
                  relevance: { type: Type.STRING, description: "Alasan mengapa produk ini sangat menarik di mata mereka" },
                  acquisitionChannel: { type: Type.STRING, description: "Media atau tempat terbaik untuk berpromosi kepada mereka (contoh: Tiktok Reels, Status WA, Bazar RW)" }
                },
                required: ["segmentName", "characteristics", "relevance", "acquisitionChannel"]
              }
            },
            swot: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Kelebihan produk yang menjadi senjata utama penjualan" },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Kelemahan operasional atau produk yang perlu diawasi/dibenahi" },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Peluang pasar luar, tren terkini, atau momen musiman yang bisa dimaanfaatkan" },
                threats: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tantangan eksternal seperti persaingan, bahan baku naik, atau perubahan tren" }
              },
              required: ["strengths", "weaknesses", "opportunities", "threats"]
            },
            marketingChannels: {
              type: Type.ARRAY,
              description: "Saluran promosi yang direkomendasikan beserta taktik kreatifnya",
              items: {
                type: Type.OBJECT,
                properties: {
                  channelName: { type: Type.STRING, description: "Nama saluran pemasaran, contoh: 'TikTok Shop', 'Kemitraan Reseller', 'WhatsApp Business'" },
                  tacticDescription: { type: Type.STRING, description: "Taktik praktis yang direkomendasikan khusus untuk produk ini" },
                  costLevel: { type: Type.STRING, description: "Tingkat Biaya: 'Gratis', 'Murah', 'Sedang', atau 'Mahal'" },
                  difficulty: { type: Type.STRING, description: "Tingkat Kesulitan: 'Mudah', 'Sedang', atau 'Sulit'" }
                },
                required: ["channelName", "tacticDescription", "costLevel", "difficulty"]
              }
            },
            tactics: {
              type: Type.ARRAY,
              description: "Rencana aksi/tahapan nyata langkah-demi-langkah mendongkrak penjualan",
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER, description: "Urutan langkah" },
                  title: { type: Type.STRING, description: "Nama aksi utama" },
                  actionPlan: { type: Type.STRING, description: "Penjelasan detail apa saja yang harus dilakukan pada langkah tersebut" }
                },
                required: ["stepNumber", "title", "actionPlan"]
              }
            },
            aiStrategicAdvice: { type: Type.STRING, description: "Nasihat strategis penutup berupa kata-kata penyemangat, filosofi berjualan produk tersebut agar tahan lama." }
          },
          required: ["targetSegments", "swot", "marketingChannels", "tactics", "aiStrategicAdvice"]
        }
      }
    });

    const resultText = response.text || "{}";
    const parsedData = JSON.parse(resultText);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error at market-analysis:", error);
    res.status(500).json({ error: error.message || "Gagal melakukan analisis pasar otomatis." });
  }
});

// Configure Vite or Static Production Serve
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to bootstrap server:", err);
});
