-- ============================================================================
-- SKEMA DATABASE SUPABASE: SISTEM ABSENSI PMR WIRA SMK NEGERI 7 SAMARINDA
-- ============================================================================
-- Jalankan skrip ini di SQL Editor dashboard Supabase Anda (https://supabase.com/dashboard)
-- Skrip ini akan membuat tabel 'members', 'attendances', mengaktifkan RLS,
-- dan memasukkan data awal anggota di 16 rombongan belajar SMKN 7 Samarinda.
-- ============================================================================

-- 1. Buat Tabel Data Anggota PMR
CREATE TABLE IF NOT EXISTS public.members (
    id TEXT PRIMARY KEY,
    nama TEXT NOT NULL,
    kelas TEXT NOT NULL,
    tingkat TEXT NOT NULL CHECK (tingkat IN ('X', 'XI')),
    jurusan TEXT NOT NULL CHECK (jurusan IN ('PPLG', 'TJKT', 'DKV', 'Animasi')),
    divisi TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Anggota Wira',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Buat Tabel Catatan Presensi PMR
CREATE TABLE IF NOT EXISTS public.attendances (
    id TEXT PRIMARY KEY,
    member_id TEXT REFERENCES public.members(id) ON DELETE SET NULL,
    nama TEXT NOT NULL,
    kelas TEXT NOT NULL,
    tingkat TEXT NOT NULL,
    jurusan TEXT NOT NULL,
    divisi TEXT NOT NULL,
    jenis_kegiatan TEXT NOT NULL,
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    waktu TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    tanda_tangan TEXT, -- Data URL gambar tanda tangan digital
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeks untuk pencarian dan filter cepat
CREATE INDEX IF NOT EXISTS idx_members_nama ON public.members (nama);
CREATE INDEX IF NOT EXISTS idx_members_kelas ON public.members (kelas);
CREATE INDEX IF NOT EXISTS idx_attendances_tanggal ON public.attendances (tanggal);
CREATE INDEX IF NOT EXISTS idx_attendances_member_id ON public.attendances (member_id);

-- 3. Konfigurasi Row Level Security (RLS) & Hak Akses Publik (Anon)
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses: Membaca data anggota (Publik/Anon)
CREATE POLICY "Izinkan baca anggota publik"
ON public.members FOR SELECT
TO anon, authenticated
USING (true);

-- Kebijakan Akses: Menambahkan anggota baru (Publik/Anon)
CREATE POLICY "Izinkan tambah anggota publik"
ON public.members FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Kebijakan Akses: Membaca log presensi (Publik/Anon)
CREATE POLICY "Izinkan baca presensi publik"
ON public.attendances FOR SELECT
TO anon, authenticated
USING (true);

-- Kebijakan Akses: Menambahkan absensi baru (Publik/Anon)
CREATE POLICY "Izinkan kirim absensi publik"
ON public.attendances FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 4. Aktifkan Fitur Realtime untuk Sinkronisasi Otomatis Antar Perangkat
ALTER PUBLICATION supabase_realtime ADD TABLE public.members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendances;

-- ============================================================================
-- 5. Data Awal (Seed Data) 34 Anggota di 16 Rombel SMKN 7 Samarinda
-- ============================================================================
INSERT INTO public.members (id, nama, kelas, tingkat, jurusan, divisi, status) VALUES
  -- PPLG
  ('M-01', 'Dimas Pratama', 'XI PPLG 1', 'XI', 'PPLG', 'Pertolongan Pertama', 'Pengurus (Ketua)'),
  ('M-02', 'Nadia Fitriani', 'XI PPLG 1', 'XI', 'PPLG', 'Perawatan Keluarga', 'Pengurus (Sekretaris)'),
  ('M-03', 'Rafi Alamsyah', 'XI PPLG 2', 'XI', 'PPLG', 'Tandu & Evakuasi', 'Anggota Wira'),
  ('M-04', 'Siti Nurhaliza', 'XI PPLG 2', 'XI', 'PPLG', 'Kepemimpinan & Humas', 'Anggota Wira'),
  ('M-05', 'Ezio Zai''im', 'X PPLG 1', 'X', 'PPLG', 'Pertolongan Pertama', 'Calon Anggota'),
  ('M-06', 'Ahmad Faiz', 'X PPLG 1', 'X', 'PPLG', 'Pasang Bongkar Tenda', 'Calon Anggota'),
  ('M-07', 'Zahra Amelia', 'X PPLG 2', 'X', 'PPLG', 'Perawatan Keluarga', 'Calon Anggota'),
  ('M-08', 'Bagus Setiawan', 'X PPLG 2', 'X', 'PPLG', 'Tandu & Evakuasi', 'Calon Anggota'),

  -- TJKT
  ('M-09', 'Rendy Saputra', 'XI TJKT 1', 'XI', 'TJKT', 'Tandu & Evakuasi', 'Pengurus (Koord. Divisi)'),
  ('M-10', 'Dewi Safitri', 'XI TJKT 1', 'XI', 'TJKT', 'Donor Darah & Kesja', 'Anggota Wira'),
  ('M-11', 'Kevin Arya', 'XI TJKT 2', 'XI', 'TJKT', 'Pertolongan Pertama', 'Anggota Wira'),
  ('M-12', 'Aulia Rahma', 'XI TJKT 2', 'XI', 'TJKT', 'Perawatan Keluarga', 'Anggota Wira'),
  ('M-13', 'Bayu Wardhana', 'XI TJKT 3', 'XI', 'TJKT', 'Pasang Bongkar Tenda', 'Anggota Wira'),
  ('M-14', 'Tiara Maharani', 'XI TJKT 3', 'XI', 'TJKT', 'Kepemimpinan & Humas', 'Anggota Wira'),
  ('M-15', 'Muhammad Rizky', 'X TJKT 1', 'X', 'TJKT', 'Pertolongan Pertama', 'Calon Anggota'),
  ('M-16', 'Intan Permata', 'X TJKT 1', 'X', 'TJKT', 'Perawatan Keluarga', 'Calon Anggota'),
  ('M-17', 'Fajar Nugraha', 'X TJKT 2', 'X', 'TJKT', 'Tandu & Evakuasi', 'Calon Anggota'),
  ('M-18', 'Putri Rahayu', 'X TJKT 2', 'X', 'TJKT', 'Donor Darah & Kesja', 'Calon Anggota'),
  ('M-19', 'Galih Perkasa', 'X TJKT 3', 'X', 'TJKT', 'Pasang Bongkar Tenda', 'Calon Anggota'),
  ('M-20', 'Anisa Zahra', 'X TJKT 3', 'X', 'TJKT', 'Pertolongan Pertama', 'Calon Anggota'),

  -- DKV
  ('M-21', 'Aditya Pratama', 'XI DKV 1', 'XI', 'DKV', 'Kepemimpinan & Humas', 'Pengurus (Humas)'),
  ('M-22', 'Clarissa Maharani', 'XI DKV 1', 'XI', 'DKV', 'Perawatan Keluarga', 'Anggota Wira'),
  ('M-23', 'Daffa Ramadhan', 'XI DKV 2', 'XI', 'DKV', 'Pertolongan Pertama', 'Anggota Wira'),
  ('M-24', 'Elsa Kurnia', 'XI DKV 2', 'XI', 'DKV', 'Donor Darah & Kesja', 'Anggota Wira'),
  ('M-25', 'Farhan Maulana', 'X DKV 1', 'X', 'DKV', 'Tandu & Evakuasi', 'Calon Anggota'),
  ('M-26', 'Gita Larasati', 'X DKV 1', 'X', 'DKV', 'Perawatan Keluarga', 'Calon Anggota'),
  ('M-27', 'Hendra Wijaya', 'X DKV 2', 'X', 'DKV', 'Pertolongan Pertama', 'Calon Anggota'),
  ('M-28', 'Indah Puspita', 'X DKV 2', 'X', 'DKV', 'Pasang Bongkar Tenda', 'Calon Anggota'),

  -- Animasi
  ('M-29', 'Jovan Nathaniel', 'XI Animasi', 'XI', 'Animasi', 'Pertolongan Pertama', 'Anggota Wira'),
  ('M-30', 'Keisha Aurelia', 'XI Animasi', 'XI', 'Animasi', 'Perawatan Keluarga', 'Anggota Wira'),
  ('M-31', 'Lukman Hakim', 'XI Animasi', 'XI', 'Animasi', 'Tandu & Evakuasi', 'Anggota Wira'),
  ('M-32', 'Maura Cantika', 'X Animasi', 'X', 'Animasi', 'Kepemimpinan & Humas', 'Calon Anggota'),
  ('M-33', 'Naufal Irawan', 'X Animasi', 'X', 'Animasi', 'Donor Darah & Kesja', 'Calon Anggota'),
  ('M-34', 'Octavia Salma', 'X Animasi', 'X', 'Animasi', 'Pertolongan Pertama', 'Calon Anggota')
ON CONFLICT (id) DO NOTHING;
