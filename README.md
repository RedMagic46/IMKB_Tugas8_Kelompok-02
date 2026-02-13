# 📚 Anggota Kelompok

1. Sabiikha Marsya Ananda - 202410370110440
2. Dinar Syahgita Sherani - 202410370110432
3. Santun - 202410370110429
4. Naufal Muammar - 202410370110027

# 📅 Aplikasi Penjadwalan Kuliah - InfoKHS

Aplikasi web untuk mengelola jadwal kuliah dengan fitur deteksi bentrok otomatis dan auto-generate schedule.

🌐 **Website Live**: [jadwalkuliahkhs.online](https://jadwalkuliahkhs.online)

---

## 🌐 Akses Aplikasi

**Website Production**: [jadwalkuliahkhs.online](https://jadwalkuliahkhs.online)

Aplikasi sudah di-deploy dan dapat diakses secara langsung melalui website di atas. Tidak perlu install atau setup apapun, langsung buka dan gunakan!

---

## 🔐 Login Demo

Aplikasi menggunakan mock authentication untuk demo. Login dapat dilakukan dengan NIM dan PIC bebas.

---

## 🎯 Fitur Utama

### 1. Dashboard
- 📊 Statistik jadwal, mata kuliah, dan ruangan
- ⚠️ Notifikasi jadwal bentrok
- 🎯 Quick actions untuk navigasi cepat

### 2. Manajemen Jadwal
- ✅ **Create**: Tambah jadwal baru
- ✅ **Read**: Lihat jadwal dalam format kalender atau tabel
- ✅ **Update**: Edit waktu, hari, atau ruangan
- ✅ **Delete**: Hapus jadwal yang tidak diperlukan
- 🔍 **Deteksi Bentrok**: Scan otomatis untuk jadwal yang bertabrakan
- 🔄 **Auto-Generate**: Generate jadwal tabel otomatis
- 📥 **Export PDF**: Download jadwal dalam format PDF

### 3. Authentication & Authorization
- 🔐 Role-based access (Admin/Dosen/Mahasiswa)
- 👤 User management
- 🔒 Protected routes

---

## 🚀 Quick Start (Development)

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

---

## 💾 Penyimpanan Data

Aplikasi menggunakan **localStorage** untuk menyimpan semua data:

- ✅ **Tidak perlu setup backend** - Aplikasi berjalan 100% di frontend
- ✅ **Data persisten** - Data tersimpan di browser localStorage
- ✅ **Sinkronisasi antar tab** - Perubahan di satu tab terlihat di tab lain
- ✅ **Inisialisasi otomatis** - Menggunakan mock data saat pertama kali digunakan
- ✅ **CRUD lengkap** - Create, Read, Update, Delete untuk semua data (ruangan, mata kuliah, jadwal)

### Data yang Disimpan:
- 📁 **Ruangan** - Data ruangan kuliah (kode, nama, kapasitas, gedung)
- 📚 **Mata Kuliah** - Data mata kuliah (kode, nama, SKS, dosen)
- 📅 **Jadwal Kuliah** - Data jadwal perkuliahan lengkap

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **Storage**: Browser localStorage
- **Build Tool**: Vite 6
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Notifications**: Sonner
- **PDF Export**: jsPDF + jsPDF-AutoTable

---

## 📁 Struktur Project

```
src/
├── app/
│   ├── components/        # Komponen UI
│   │   ├── Layout.tsx     # Layout dengan sidebar
│   │   ├── ScheduleCalendar.tsx
│   │   ├── ScheduleEditModal.tsx
│   │   └── ui/            # Shadcn UI components
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── SchedulePage.tsx
│   ├── types/
│   │   └── schedule.ts
│   └── utils/
│       ├── scheduleAlgorithm.ts
│       └── exportPDF.ts
├── lib/                   # Data services (localStorage)
│   ├── auth.ts
│   ├── scheduleService.ts # Service untuk jadwal (localStorage)
│   ├── courseService.ts   # Service untuk mata kuliah (localStorage)
│   └── roomService.ts     # Service untuk ruangan (localStorage)
└── hooks/
    └── useRealtimeSchedules.ts
```

---

## 📦 Build untuk Production

```bash
npm run build
```

File production akan ada di folder `dist/`

---

## 🚀 Deployment

Aplikasi sudah di-deploy di **jadwalkuliahkhs.online**

### Untuk Deploy Ulang:

1. **Build aplikasi**:
   ```bash
   npm run build
   ```

2. **Deploy folder `dist/`** ke hosting provider:
   - **Vercel**: Drag & drop folder `dist/` atau connect dengan GitHub
   - **Netlify**: Drag & drop folder `dist/` atau connect dengan GitHub
   - **Cloudflare Pages**: Connect dengan GitHub repository

> **Tidak perlu setup environment variables** - Aplikasi menggunakan localStorage dan tidak memerlukan konfigurasi backend.

---

## 🐛 Troubleshooting

### Aplikasi tidak bisa diakses
- Pastikan server development sudah running (`npm run dev`)
- Cek apakah port 5173 sudah digunakan
- Cek browser console untuk error

### Data tidak muncul
- Pastikan tidak ada error di browser console
- Cek apakah localStorage browser tidak di-disable
- Coba clear cache dan refresh halaman
- Data akan diinisialisasi dengan mock data saat pertama kali digunakan

---

## 📄 License

MIT License - Bebas digunakan untuk pembelajaran dan produksi.

---

## 👨‍💻 Development

### Prerequisites
- Node.js >= 18
- npm atau pnpm

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production

---

## 🔗 Links

- 🌐 **Website**: [jadwalkuliahkhs.online](https://jadwalkuliahkhs.online)

---
