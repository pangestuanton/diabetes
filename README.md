# 🏥 DiaPredict - Cek Risiko Diabetes Instan

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)

**DiaPredict** adalah aplikasi web modern yang memberdayakan masyarakat Indonesia untuk mendeteksi dini risiko diabetes menggunakan teknologi *Machine Learning*. Dengan antarmuka yang bersih dan alur yang sederhana, siapa pun dapat melakukan pemeriksaan kesehatan mandiri dalam hitungan detik.

---

## ✨ Fitur Utama

- 🚀 **Prediksi Akurat**: Menggunakan algoritma *Random Forest* yang dilatih pada dataset klinis (Pima Indians Diabetes).
- 🔐 **Google Authentication**: Masuk dengan satu klik tanpa perlu repot mengetik email/password.
- 📋 **Riwayat Pemeriksaan**: Pantau perubahan metrik kesehatan Anda dari waktu ke waktu secara tersinkronisasi di awan.
- 📊 **Dashboard Admin**: Ringkasan data kesehatan komunitas untuk wawasan yang lebih luas.
- 📱 **Responsif & Ringan**: Akses lancar baik dari smartphone maupun desktop.
- 🇮🇩 **Full Bahasa Indonesia**: Didesain khusus untuk kemudahan pemahaman masyarakat lokal.

---

## 🛠️ Teknologi yang Digunakan

| Sektor | Teknologi |
|---|---|
| **Frontend** | Next.js (App Router), TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | Firebase Firestore (Real-time DB) |
| **Autentikasi** | Firebase Google Auth |
| **Machine Learning** | Logistic Regression Weights (Medically Weighted) |

---

## 🚀 Cara Menjalankan di Lokal

### 1. Prasyarat
- Pastikan **Node.js** sudah terinstal di komputer Anda.

### 2. Kloning Repositori
```bash
git clone https://github.com/pangestuanton/diabetes.git
cd diabetes
```

### 3. Konfigurasi Environment
Buat file `.env.local` di dalam folder `frontend` dengan kredensial Firebase Anda:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=geoverse-44.firebaseapp.com
...
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 4. Jalankan Backend (Node.js)
```bash
cd backend_node
npm install
node index.js
```

### 5. Jalankan Frontend (Next.js)
Buka terminal baru:
```bash
cd frontend
npm install
npm run dev
```
Akses di: `http://localhost:3000`

---

## ⚖️ Disclaimer Medis

> **Penting**: Aplikasi ini hanya memberikan estimasi risiko berdasarkan data statistik dan model matematika. Hasil dari aplikasi ini **BUKAN** merupakan diagnosis medis resmi. Selalu konsultasikan kondisi kesehatan Anda dengan dokter atau tenaga medis profesional.

---

**Menolak Diabetes, Jaga Indonesia Sehat!** 🇮🇩
