// Diass SMM API - Aman di Vercel 🚀
import express from "express";
import cors from "cors";
import { nanoid } from "nanoid";

const app = express();

// ✅ Izinkan domain frontend kamu
app.use(cors({
  origin: [
    "https://diass-smm-front.vercel.app"
  ]
}));
app.use(express.json());

// 🧠 Data sementara (in-memory)
let user = { username: "demo", balance: 30000 };
let orders = [];
let services = [
  { id: 1, name: "YouTube Subscribers", rate: 15000, unit: 1000, min: 100, max: 50000 },
  { id: 2, name: "YouTube Views", rate: 8000, unit: 1000, min: 100, max: 500000 },
  { id: 3, name: "Instagram Followers", rate: 18000, unit: 1000, min: 10, max: 500000 }
];

// 🟢 Tes koneksi API
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Diass SMM API aktif 🚀" });
});

// 👤 Info User
app.get("/api/user", (req, res) => {
  res.json(user);
});

// 📋 Daftar Layanan
app.get("/api/services", (req, res) => {
  res.json(services);
});

// 🛒 Order Baru
app.post("/api/order", (req, res) => {
  try {
    const { serviceId, qty, target } = req.body;
    const service = services.find(s => s.id == serviceId);

    if (!service) return res.json({ error: "Layanan tidak ditemukan" });
    if (qty < service.min || qty > service.max)
      return res.json({ error: `Jumlah harus antara ${service.min} dan ${service.max}` });

    const total = (qty / service.unit) * service.rate;
    if (user.balance < total)
      return res.json({ error: "Saldo tidak cukup" });

    user.balance -= total;
    const order = {
      id: nanoid(8),
      serviceId,
      target,
      qty,
      total,
      status: "Pending",
      date: new Date().toISOString()
    };
    orders.push(order);

    res.json({ success: true, order });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

// ⚡ Penting: Jangan pakai app.listen() di Vercel
export default app;