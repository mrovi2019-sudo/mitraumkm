// File: api/financial-parse.js

export default async function handler(req, res) {
  // Pastikan hanya menerima method POST (jika diperlukan)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const data = req.body;
    
    // Taruh logika pemanggilan Google AI Studio (Gemini) di sini
    // const response = await callGeminiAPI(data);

    // Kembalikan respons dalam bentuk JSON
    res.status(200).json({ 
      success: true, 
      result: "Ini hasil dari AI" // Ganti dengan hasil response Gemini
    });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
}
