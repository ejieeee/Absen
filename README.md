# Sistem Absensi PMR Wira • SMK Negeri 7 Samarinda

Aplikasi web presensi kegiatan dan piket organisasi Palang Merah Remaja (PMR) Unit 07 SMK Negeri 7 Samarinda. Dirancang secara khusus dengan pendekatan **Minimal Editorial**, mengutamakan kemudahan pengguna nyata (anggota siswa & sekretaris sekolah), ringan, cepat, dan memiliki karakter visual organisasi sekolah yang kuat tanpa mengadopsi gaya template AI dashboard yang generik.

---

## 1. Prinsip & Filosofi Desain

* **Human-Crafted & Deliberate:** Setiap elemen visual dirancang dengan tujuan nyata. Menghindari tren visual yang tidak fungsional (tanpa gradien ungu-biru, tanpa glassmorphism, tanpa neumorphism, tanpa shadow berlebih, tanpa pill badges bertumpuk).
* **Identitas Visual PMR:** Menggunakan latar dasar *off-white* (`#FBFBFA`), teks utama gelap yang kontras (`#18181B`), dan warna merah khas Palang Merah (`#BA1A1A`) sebagai aksen identitas terukur.
* **Fokus Pengguna Nyata:**
  * **Anggota:** Mengisi presensi hanya dalam hitungan detik. Cukup ketik inisial nama, pilih dari dropdown autocomplete, verifikasi kelas otomatis, pilih kegiatan, bubuhkan tanda tangan di layar, dan kirim.
  * **Sekretaris:** Tidak dibebani grafik statistik, diagram lingkaran, atau kartu persentase yang membingungkan. Halaman utama langsung menampilkan tabel log kehadiran lengkap dengan filter multi-kriteria dan fitur ekspor CSV.
* **Perlindungan Privasi Siswa:** Tidak menampilkan Nomor Induk Siswa Nasional (NISN) di seluruh antarmuka.

---

## 2. Struktur Rombongan Belajar (Rombel) SMKN 7 Samarinda

Sesuai struktur akademik sekolah, sistem ini memetakan 16 rombongan belajar (8 rombel kelas X dan 8 rombel kelas XI):

1. **Pengembangan Perangkat Lunak & Gim (PPLG)**
   * Kelas X PPLG 1
   * Kelas X PPLG 2
   * Kelas XI PPLG 1
   * Kelas XI PPLG 2
2. **Teknik Jaringan Komputer & Telekomunikasi (TJKT)**
   * Kelas X TJKT 1
   * Kelas X TJKT 2
   * Kelas X TJKT 3
   * Kelas XI TJKT 1
   * Kelas XI TJKT 2
   * Kelas XI TJKT 3
3. **Desain Komunikasi Visual (DKV)**
   * Kelas X DKV 1
   * Kelas X DKV 2
   * Kelas XI DKV 1
   * Kelas XI DKV 2
4. **Animasi**
   * Kelas X Animasi
   * Kelas XI Animasi

---

## 3. Fitur Utama

### A. Portal Anggota (Formulir Absensi Mandiri)
* **Pencarian Nama Cerdas (Autocomplete):**
  * Mengetik inisial nama (misal: "E" atau "Dimas") langsung memunculkan saran anggota.
  * Menampilkan nama lengkap dan rombongan belajar tepat di bawahnya.
* **Data Anggota Terisi Otomatis (Read-Only):**
  * Menampilkan Kelas & Rombel, Jurusan, dan Divisi PMR tanpa bisa diedit siswa guna mencegah kesalahan input.
  * Disediakan tombol cepat "Ganti Anggota" jika salah memilih.
* **Pilihan Jenis Kegiatan:**
  * Latihan Rutin (Pembinaan mingguan)
  * Piket UKS (Penjagaan ruang Usaha Kesehatan Sekolah)
  * Bantuan Medis Upacara (Siaga upacara bendera hari Senin)
  * Siaga P3K Event (Pelayanan medis kegiatan/lomba sekolah)
  * Rapat Koordinasi (Pertemuan pengurus/divisi)
* **Pencatatan Waktu Otomatis (WITA):**
  * Format tanggal dan jam resmi Indonesia sesuai zona waktu Samarinda (UTC+8).
* **Kanvas Tanda Tangan Digital:**
  * Responsif dan anti-blur (High-DPI retina display support).
  * Nyaman digambar menggunakan jari/stylus di layar ponsel serta kursor mouse di komputer.
  * Tombol bersihkan ("Hapus Tanda Tangan").
* **Validasi & Konfirmasi:**
  * Dialog ringkasan sebelum pengiriman untuk memastikan data sudah benar.
  * State sukses dengan kode referensi resmi presensi dan opsi untuk mencatat absensi anggota lain.

### B. Portal Sekretaris (Manajemen & Rekap Data)
* **Akses Masuk Minimal:**
  * Autentikasi simulasi yang bersih dan to-the-point.
  * Akun Demo: Username `sekretaris`, Password `pmr123`.
* **Tabel Absensi:**
  * Menampilkan log kehadiran real-time.
  * Filter gabungan: Pencarian nama, rentang tanggal, tingkat kelas (X / XI), jurusan, rombel spesifik, divisi PMR, dan jenis kegiatan.
  * Modal detail presensi yang menampilkan data lengkap beserta pratinjau tanda tangan digital anggota.
* **Data Anggota:**
  * Direktori seluruh anggota aktif dan pengurus yang terdistribusi di 16 rombel sekolah.
* **Rekap Kehadiran:**
  * Ringkasan agregat frekuensi kehadiran per anggota (Latihan, Piket, Tugas Lain, Total, Status Keaktifan).
  * Bebas dari visualisasi grafik yang tidak diperlukan.
* **Ekspor CSV (Kompatibel Excel):**
  * Mendukung unduhan data log absensi, data anggota, dan tabel rekapitulasi ke format CSV dengan encoding UTF-8 BOM agar nama dan tanda baca terbuka sempurna di Microsoft Excel.

---

## 4. Struktur Berkas Proyek

```
c:\Users\lenov\OneDrive\Documents\UKS\
├── index.html              # Antarmuka tunggal modular
├── test-suite.html         # Unit & integration testing otomatis
├── README.md               # Dokumentasi lengkap proyek
├── css\
│   └── style.css           # Desain sistem minimal editorial
├── js\
│   ├── data.js             # Struktur dataset 16 rombel & penyimpanan
│   ├── signature.js        # Modul kanvas tanda tangan digital
│   └── app.js              # Logika aplikasi, autocomplete, dan tabel
└── assets\
    ├── logo-pmr.svg        # Lambang resmi vektor PMR SMKN 7
    └── *.png               # Tangkapan layar uji responsif & tampilan
```

---

## 5. Cara Menjalankan Aplikasi

Aplikasi ini dibangun menggunakan standar web murni (HTML5, CSS modern, Vanilla ES6 JavaScript) tanpa ketergantungan *build tool* atau paket runtime eksternal.

1. Buka berkas [index.html](file:///c:/Users/lenov/OneDrive/Documents/UKS/index.html) langsung di peramban web (Microsoft Edge, Google Chrome, Firefox, dll).
2. Untuk melihat uji integrasi otomatis, buka [test-suite.html](file:///c:/Users/lenov/OneDrive/Documents/UKS/test-suite.html).
3. Pintasan URL demo:
   * `#secretary`: Membuka halaman login sekretaris
   * `#admin-absensi`: Membuka langsung tabel log presensi
   * `#admin-anggota`: Membuka langsung daftar data anggota
   * `#admin-rekap`: Membuka langsung tabel rekapitulasi kehadiran
   * `?search=E`: Simulasi pencarian autocomplete huruf "E"
   * `?member=M-05`: Simulasi pengisian otomatis anggota Ezio Zai'im (X PPLG 1)
