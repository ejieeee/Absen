-- ============================================================================
-- DATABASE MYSQL: SISTEM ABSENSI PMR WIRA SMK NEGERI 7 SAMARINDA
-- ============================================================================
-- Impor berkas ini di phpMyAdmin, atau biarkan api.php membuat skema otomatis.
-- Kredensial default XAMPP: user root, tanpa kata sandi.
-- ============================================================================

CREATE DATABASE IF NOT EXISTS uks_pmr CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE uks_pmr;

CREATE TABLE IF NOT EXISTS members (
    id VARCHAR(32) PRIMARY KEY,
    nama VARCHAR(150) NOT NULL,
    kelas VARCHAR(50) NOT NULL,
    tingkat ENUM('X','XI') NOT NULL,
    jurusan ENUM('PPLG','TJKT','DKV','Animasi') NOT NULL,
    divisi VARCHAR(100) NOT NULL,
    status VARCHAR(80) NOT NULL DEFAULT 'Anggota Wira',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_members_nama (nama),
    INDEX idx_members_kelas (kelas)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS attendances (
    id VARCHAR(40) PRIMARY KEY,
    member_id VARCHAR(32) NULL,
    nama VARCHAR(150) NOT NULL,
    kelas VARCHAR(50) NOT NULL,
    tingkat VARCHAR(10) NOT NULL,
    jurusan VARCHAR(50) NOT NULL,
    divisi VARCHAR(100) NOT NULL,
    jenis_kegiatan VARCHAR(100) NOT NULL,
    tanggal DATE NOT NULL,
    waktu VARCHAR(30) NOT NULL,
    timestamp DATETIME NULL,
    tanda_tangan LONGTEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_attendances_tanggal (tanggal),
    INDEX idx_attendances_member_id (member_id),
    CONSTRAINT fk_att_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO members (id, nama, kelas, tingkat, jurusan, divisi, status) VALUES
  ('M-01', 'Dimas Pratama', 'XI PPLG 1', 'XI', 'PPLG', 'Pertolongan Pertama', 'Pengurus (Ketua)'),
  ('M-02', 'Nadia Fitriani', 'XI PPLG 1', 'XI', 'PPLG', 'Perawatan Keluarga', 'Pengurus (Sekretaris)'),
  ('M-03', 'Rafi Alamsyah', 'XI PPLG 2', 'XI', 'PPLG', 'Tandu & Evakuasi', 'Anggota Wira'),
  ('M-04', 'Siti Nurhaliza', 'XI PPLG 2', 'XI', 'PPLG', 'Kepemimpinan & Humas', 'Anggota Wira'),
  ('M-05', 'Ezio Zai''im', 'X PPLG 1', 'X', 'PPLG', 'Pertolongan Pertama', 'Calon Anggota'),
  ('M-06', 'Ahmad Faiz', 'X PPLG 1', 'X', 'PPLG', 'Pasang Bongkar Tenda', 'Calon Anggota'),
  ('M-07', 'Zahra Amelia', 'X PPLG 2', 'X', 'PPLG', 'Perawatan Keluarga', 'Calon Anggota'),
  ('M-08', 'Bagus Setiawan', 'X PPLG 2', 'X', 'PPLG', 'Tandu & Evakuasi', 'Calon Anggota'),
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
  ('M-21', 'Aditya Pratama', 'XI DKV 1', 'XI', 'DKV', 'Kepemimpinan & Humas', 'Pengurus (Humas)'),
  ('M-22', 'Clarissa Maharani', 'XI DKV 1', 'XI', 'DKV', 'Perawatan Keluarga', 'Anggota Wira'),
  ('M-23', 'Daffa Ramadhan', 'XI DKV 2', 'XI', 'DKV', 'Pertolongan Pertama', 'Anggota Wira'),
  ('M-24', 'Elsa Kurnia', 'XI DKV 2', 'XI', 'DKV', 'Donor Darah & Kesja', 'Anggota Wira'),
  ('M-25', 'Farhan Maulana', 'X DKV 1', 'X', 'DKV', 'Tandu & Evakuasi', 'Calon Anggota'),
  ('M-26', 'Gita Larasati', 'X DKV 1', 'X', 'DKV', 'Perawatan Keluarga', 'Calon Anggota'),
  ('M-27', 'Hendra Wijaya', 'X DKV 2', 'X', 'DKV', 'Pertolongan Pertama', 'Calon Anggota'),
  ('M-28', 'Indah Puspita', 'X DKV 2', 'X', 'DKV', 'Pasang Bongkar Tenda', 'Calon Anggota'),
  ('M-29', 'Jovan Nathaniel', 'XI Animasi', 'XI', 'Animasi', 'Pertolongan Pertama', 'Anggota Wira'),
  ('M-30', 'Keisha Aurelia', 'XI Animasi', 'XI', 'Animasi', 'Perawatan Keluarga', 'Anggota Wira'),
  ('M-31', 'Lukman Hakim', 'XI Animasi', 'XI', 'Animasi', 'Tandu & Evakuasi', 'Anggota Wira'),
  ('M-32', 'Maura Cantika', 'X Animasi', 'X', 'Animasi', 'Kepemimpinan & Humas', 'Calon Anggota'),
  ('M-33', 'Naufal Irawan', 'X Animasi', 'X', 'Animasi', 'Donor Darah & Kesja', 'Calon Anggota'),
  ('M-34', 'Octavia Salma', 'X Animasi', 'X', 'Animasi', 'Pertolongan Pertama', 'Calon Anggota')
ON DUPLICATE KEY UPDATE nama = VALUES(nama);
