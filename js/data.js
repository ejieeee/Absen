/**
 * data.js - Dataset Struktur Organisasi & Presensi PMR SMKN 7 Samarinda
 * Catatan: Data dummy terstruktur untuk simulasi demonstrasi.
 * Tanpa NISN untuk privasi siswa.
 */

const JURUSAN_LIST = [
  { id: 'PPLG', nama: 'Pengembangan Perangkat Lunak & Gim' },
  { id: 'TJKT', nama: 'Teknik Jaringan Komputer & Telekomunikasi' },
  { id: 'DKV', nama: 'Desain Komunikasi Visual' },
  { id: 'Animasi', nama: 'Animasi' }
];

const ROMBEL_LIST = [
  // PPLG (4 Rombel)
  { id: 'X PPLG 1', tingkat: 'X', jurusan: 'PPLG', label: 'X PPLG 1' },
  { id: 'X PPLG 2', tingkat: 'X', jurusan: 'PPLG', label: 'X PPLG 2' },
  { id: 'XI PPLG 1', tingkat: 'XI', jurusan: 'PPLG', label: 'XI PPLG 1' },
  { id: 'XI PPLG 2', tingkat: 'XI', jurusan: 'PPLG', label: 'XI PPLG 2' },

  // TJKT (6 Rombel)
  { id: 'X TJKT 1', tingkat: 'X', jurusan: 'TJKT', label: 'X TJKT 1' },
  { id: 'X TJKT 2', tingkat: 'X', jurusan: 'TJKT', label: 'X TJKT 2' },
  { id: 'X TJKT 3', tingkat: 'X', jurusan: 'TJKT', label: 'X TJKT 3' },
  { id: 'XI TJKT 1', tingkat: 'XI', jurusan: 'TJKT', label: 'XI TJKT 1' },
  { id: 'XI TJKT 2', tingkat: 'XI', jurusan: 'TJKT', label: 'XI TJKT 2' },
  { id: 'XI TJKT 3', tingkat: 'XI', jurusan: 'TJKT', label: 'XI TJKT 3' },

  // DKV (4 Rombel)
  { id: 'X DKV 1', tingkat: 'X', jurusan: 'DKV', label: 'X DKV 1' },
  { id: 'X DKV 2', tingkat: 'X', jurusan: 'DKV', label: 'X DKV 2' },
  { id: 'XI DKV 1', tingkat: 'XI', jurusan: 'DKV', label: 'XI DKV 1' },
  { id: 'XI DKV 2', tingkat: 'XI', jurusan: 'DKV', label: 'XI DKV 2' },

  // Animasi (2 Rombel)
  { id: 'X Animasi', tingkat: 'X', jurusan: 'Animasi', label: 'X Animasi' },
  { id: 'XI Animasi', tingkat: 'XI', jurusan: 'Animasi', label: 'XI Animasi' }
];

const DIVISI_LIST = [
  'Pertolongan Pertama',
  'Perawatan Keluarga',
  'Tandu & Evakuasi',
  'Pasang Bongkar Tenda',
  'Kepemimpinan & Humas',
  'Donor Darah & Kesja'
];

const JENIS_KEGIATAN_LIST = [
  { id: 'Latihan Rutin', label: 'Latihan Rutin', deskripsi: 'Pembinaan materi teknis dan fisik mingguan' },
  { id: 'Piket UKS', label: 'Piket UKS', deskripsi: 'Penjagaan dan pelayanan ruang Usaha Kesehatan Sekolah' },
  { id: 'Bantuan Medis Upacara', label: 'Bantuan Medis Upacara', deskripsi: 'Siaga medis pada upacara bendera hari Senin' },
  { id: 'Siaga P3K Event', label: 'Siaga P3K Event', deskripsi: 'Pelayanan medis pada kegiatan/lomba sekolah' },
  { id: 'Rapat Koordinasi', label: 'Rapat Koordinasi', deskripsi: 'Pertemuan pengurus dan evaluasi divisi' }
];

// Anggota PMR Dummy (Tersebar di 16 Rombongan Belajar)
const DUMMY_MEMBERS = [
  // PPLG Kelas X & XI
  { id: 'M-01', nama: 'Dimas Pratama', kelas: 'XI PPLG 1', tingkat: 'XI', jurusan: 'PPLG', divisi: 'Pertolongan Pertama', status: 'Pengurus (Ketua)' },
  { id: 'M-02', nama: 'Nadia Fitriani', kelas: 'XI PPLG 1', tingkat: 'XI', jurusan: 'PPLG', divisi: 'Perawatan Keluarga', status: 'Pengurus (Sekretaris)' },
  { id: 'M-03', nama: 'Rafi Alamsyah', kelas: 'XI PPLG 2', tingkat: 'XI', jurusan: 'PPLG', divisi: 'Tandu & Evakuasi', status: 'Anggota Wira' },
  { id: 'M-04', nama: 'Siti Nurhaliza', kelas: 'XI PPLG 2', tingkat: 'XI', jurusan: 'PPLG', divisi: 'Kepemimpinan & Humas', status: 'Anggota Wira' },
  { id: 'M-05', nama: 'Ezio Zai\'im', kelas: 'X PPLG 1', tingkat: 'X', jurusan: 'PPLG', divisi: 'Pertolongan Pertama', status: 'Calon Anggota' },
  { id: 'M-06', nama: 'Ahmad Faiz', kelas: 'X PPLG 1', tingkat: 'X', jurusan: 'PPLG', divisi: 'Pasang Bongkar Tenda', status: 'Calon Anggota' },
  { id: 'M-07', nama: 'Zahra Amelia', kelas: 'X PPLG 2', tingkat: 'X', jurusan: 'PPLG', divisi: 'Perawatan Keluarga', status: 'Calon Anggota' },
  { id: 'M-08', nama: 'Bagus Setiawan', kelas: 'X PPLG 2', tingkat: 'X', jurusan: 'PPLG', divisi: 'Tandu & Evakuasi', status: 'Calon Anggota' },

  // TJKT Kelas X & XI
  { id: 'M-09', nama: 'Rendy Saputra', kelas: 'XI TJKT 1', tingkat: 'XI', jurusan: 'TJKT', divisi: 'Tandu & Evakuasi', status: 'Pengurus (Koord. Divisi)' },
  { id: 'M-10', nama: 'Dewi Safitri', kelas: 'XI TJKT 1', tingkat: 'XI', jurusan: 'TJKT', divisi: 'Donor Darah & Kesja', status: 'Anggota Wira' },
  { id: 'M-11', nama: 'Kevin Arya', kelas: 'XI TJKT 2', tingkat: 'XI', jurusan: 'TJKT', divisi: 'Pertolongan Pertama', status: 'Anggota Wira' },
  { id: 'M-12', nama: 'Aulia Rahma', kelas: 'XI TJKT 2', tingkat: 'XI', jurusan: 'TJKT', divisi: 'Perawatan Keluarga', status: 'Anggota Wira' },
  { id: 'M-13', nama: 'Bayu Wardhana', kelas: 'XI TJKT 3', tingkat: 'XI', jurusan: 'TJKT', divisi: 'Pasang Bongkar Tenda', status: 'Anggota Wira' },
  { id: 'M-14', nama: 'Tiara Maharani', kelas: 'XI TJKT 3', tingkat: 'XI', jurusan: 'TJKT', divisi: 'Kepemimpinan & Humas', status: 'Anggota Wira' },
  { id: 'M-15', nama: 'Muhammad Rizky', kelas: 'X TJKT 1', tingkat: 'X', jurusan: 'TJKT', divisi: 'Pertolongan Pertama', status: 'Calon Anggota' },
  { id: 'M-16', nama: 'Intan Permata', kelas: 'X TJKT 1', tingkat: 'X', jurusan: 'TJKT', divisi: 'Perawatan Keluarga', status: 'Calon Anggota' },
  { id: 'M-17', nama: 'Fajar Nugraha', kelas: 'X TJKT 2', tingkat: 'X', jurusan: 'TJKT', divisi: 'Tandu & Evakuasi', status: 'Calon Anggota' },
  { id: 'M-18', nama: 'Putri Rahayu', kelas: 'X TJKT 2', tingkat: 'X', jurusan: 'TJKT', divisi: 'Donor Darah & Kesja', status: 'Calon Anggota' },
  { id: 'M-19', nama: 'Galih Perkasa', kelas: 'X TJKT 3', tingkat: 'X', jurusan: 'TJKT', divisi: 'Pasang Bongkar Tenda', status: 'Calon Anggota' },
  { id: 'M-20', nama: 'Anisa Zahra', kelas: 'X TJKT 3', tingkat: 'X', jurusan: 'TJKT', divisi: 'Pertolongan Pertama', status: 'Calon Anggota' },

  // DKV Kelas X & XI
  { id: 'M-21', nama: 'Aditya Pratama', kelas: 'XI DKV 1', tingkat: 'XI', jurusan: 'DKV', divisi: 'Kepemimpinan & Humas', status: 'Pengurus (Humas)' },
  { id: 'M-22', nama: 'Clarissa Maharani', kelas: 'XI DKV 1', tingkat: 'XI', jurusan: 'DKV', divisi: 'Perawatan Keluarga', status: 'Anggota Wira' },
  { id: 'M-23', nama: 'Daffa Ramadhan', kelas: 'XI DKV 2', tingkat: 'XI', jurusan: 'DKV', divisi: 'Pertolongan Pertama', status: 'Anggota Wira' },
  { id: 'M-24', nama: 'Elsa Kurnia', kelas: 'XI DKV 2', tingkat: 'XI', jurusan: 'DKV', divisi: 'Donor Darah & Kesja', status: 'Anggota Wira' },
  { id: 'M-25', nama: 'Farhan Maulana', kelas: 'X DKV 1', tingkat: 'X', jurusan: 'DKV', divisi: 'Tandu & Evakuasi', status: 'Calon Anggota' },
  { id: 'M-26', nama: 'Gita Larasati', kelas: 'X DKV 1', tingkat: 'X', jurusan: 'DKV', divisi: 'Perawatan Keluarga', status: 'Calon Anggota' },
  { id: 'M-27', nama: 'Hendra Wijaya', kelas: 'X DKV 2', tingkat: 'X', jurusan: 'DKV', divisi: 'Pertolongan Pertama', status: 'Calon Anggota' },
  { id: 'M-28', nama: 'Indah Puspita', kelas: 'X DKV 2', tingkat: 'X', jurusan: 'DKV', divisi: 'Pasang Bongkar Tenda', status: 'Calon Anggota' },

  // Animasi Kelas X & XI
  { id: 'M-29', nama: 'Jovan Nathaniel', kelas: 'XI Animasi', tingkat: 'XI', jurusan: 'Animasi', divisi: 'Pertolongan Pertama', status: 'Anggota Wira' },
  { id: 'M-30', nama: 'Keisha Aurelia', kelas: 'XI Animasi', tingkat: 'XI', jurusan: 'Animasi', divisi: 'Perawatan Keluarga', status: 'Anggota Wira' },
  { id: 'M-31', nama: 'Lukman Hakim', kelas: 'XI Animasi', tingkat: 'XI', jurusan: 'Animasi', divisi: 'Tandu & Evakuasi', status: 'Anggota Wira' },
  { id: 'M-32', nama: 'Maura Cantika', kelas: 'X Animasi', tingkat: 'X', jurusan: 'Animasi', divisi: 'Kepemimpinan & Humas', status: 'Calon Anggota' },
  { id: 'M-33', nama: 'Naufal Irawan', kelas: 'X Animasi', tingkat: 'X', jurusan: 'Animasi', divisi: 'Donor Darah & Kesja', status: 'Calon Anggota' },
  { id: 'M-34', nama: 'Octavia Salma', kelas: 'X Animasi', tingkat: 'X', jurusan: 'Animasi', divisi: 'Pertolongan Pertama', status: 'Calon Anggota' }
];

// Presensi Dummy Awal
const SAMPLE_SIGNATURE_SVG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='60' viewBox='0 0 160 60'><path d='M20 42 Q 35 15, 55 35 T 90 25 T 125 38 T 145 20' fill='none' stroke='%2318181B' stroke-width='2' stroke-linecap='round'/></svg>";

const DUMMY_ATTENDANCE = [
  {
    id: 'PMR-20261010-001',
    memberId: 'M-01',
    nama: 'Dimas Pratama',
    kelas: 'XI PPLG 1',
    tingkat: 'XI',
    jurusan: 'PPLG',
    divisi: 'Pertolongan Pertama',
    jenisKegiatan: 'Latihan Rutin',
    tanggal: '2026-10-10',
    waktu: '16:05 WITA',
    timestamp: '2026-10-10T16:05:00',
    tandaTangan: SAMPLE_SIGNATURE_SVG
  },
  {
    id: 'PMR-20261010-002',
    memberId: 'M-02',
    nama: 'Nadia Fitriani',
    kelas: 'XI PPLG 1',
    tingkat: 'XI',
    jurusan: 'PPLG',
    divisi: 'Perawatan Keluarga',
    jenisKegiatan: 'Latihan Rutin',
    tanggal: '2026-10-10',
    waktu: '16:08 WITA',
    timestamp: '2026-10-10T16:08:00',
    tandaTangan: SAMPLE_SIGNATURE_SVG
  },
  {
    id: 'PMR-20261010-003',
    memberId: 'M-09',
    nama: 'Rendy Saputra',
    kelas: 'XI TJKT 1',
    tingkat: 'XI',
    jurusan: 'TJKT',
    divisi: 'Tandu & Evakuasi',
    jenisKegiatan: 'Latihan Rutin',
    tanggal: '2026-10-10',
    waktu: '16:12 WITA',
    timestamp: '2026-10-10T16:12:00',
    tandaTangan: SAMPLE_SIGNATURE_SVG
  },
  {
    id: 'PMR-20261010-004',
    memberId: 'M-11',
    nama: 'Kevin Arya',
    kelas: 'XI TJKT 2',
    tingkat: 'XI',
    jurusan: 'TJKT',
    divisi: 'Pertolongan Pertama',
    jenisKegiatan: 'Latihan Rutin',
    tanggal: '2026-10-10',
    waktu: '16:15 WITA',
    timestamp: '2026-10-10T16:15:00',
    tandaTangan: SAMPLE_SIGNATURE_SVG
  },
  {
    id: 'PMR-20261010-005',
    memberId: 'M-21',
    nama: 'Aditya Pratama',
    kelas: 'XI DKV 1',
    tingkat: 'XI',
    jurusan: 'DKV',
    divisi: 'Kepemimpinan & Humas',
    jenisKegiatan: 'Latihan Rutin',
    tanggal: '2026-10-10',
    waktu: '16:18 WITA',
    timestamp: '2026-10-10T16:18:00',
    tandaTangan: SAMPLE_SIGNATURE_SVG
  },
  {
    id: 'PMR-20261009-001',
    memberId: 'M-05',
    nama: 'Ezio Zai\'im',
    kelas: 'X PPLG 1',
    tingkat: 'X',
    jurusan: 'PPLG',
    divisi: 'Pertolongan Pertama',
    jenisKegiatan: 'Piket UKS',
    tanggal: '2026-10-09',
    waktu: '09:30 WITA',
    timestamp: '2026-10-09T09:30:00',
    tandaTangan: SAMPLE_SIGNATURE_SVG
  },
  {
    id: 'PMR-20261009-002',
    memberId: 'M-12',
    nama: 'Aulia Rahma',
    kelas: 'XI TJKT 2',
    tingkat: 'XI',
    jurusan: 'TJKT',
    divisi: 'Perawatan Keluarga',
    jenisKegiatan: 'Piket UKS',
    tanggal: '2026-10-09',
    waktu: '13:15 WITA',
    timestamp: '2026-10-09T13:15:00',
    tandaTangan: SAMPLE_SIGNATURE_SVG
  },
  {
    id: 'PMR-20261006-001',
    memberId: 'M-01',
    nama: 'Dimas Pratama',
    kelas: 'XI PPLG 1',
    tingkat: 'XI',
    jurusan: 'PPLG',
    divisi: 'Pertolongan Pertama',
    jenisKegiatan: 'Bantuan Medis Upacara',
    tanggal: '2026-10-06',
    waktu: '06:50 WITA',
    timestamp: '2026-10-06T06:50:00',
    tandaTangan: SAMPLE_SIGNATURE_SVG
  },
  {
    id: 'PMR-20261006-002',
    memberId: 'M-15',
    nama: 'Muhammad Rizky',
    kelas: 'X TJKT 1',
    tingkat: 'X',
    jurusan: 'TJKT',
    divisi: 'Pertolongan Pertama',
    jenisKegiatan: 'Bantuan Medis Upacara',
    tanggal: '2026-10-06',
    waktu: '06:55 WITA',
    timestamp: '2026-10-06T06:55:00',
    tandaTangan: SAMPLE_SIGNATURE_SVG
  },
  {
    id: 'PMR-20261003-001',
    memberId: 'M-03',
    nama: 'Rafi Alamsyah',
    kelas: 'XI PPLG 2',
    tingkat: 'XI',
    jurusan: 'PPLG',
    divisi: 'Tandu & Evakuasi',
    jenisKegiatan: 'Latihan Rutin',
    tanggal: '2026-10-03',
    waktu: '16:00 WITA',
    timestamp: '2026-10-03T16:00:00',
    tandaTangan: SAMPLE_SIGNATURE_SVG
  },
  {
    id: 'PMR-20261003-002',
    memberId: 'M-29',
    nama: 'Jovan Nathaniel',
    kelas: 'XI Animasi',
    tingkat: 'XI',
    jurusan: 'Animasi',
    divisi: 'Pertolongan Pertama',
    jenisKegiatan: 'Latihan Rutin',
    tanggal: '2026-10-03',
    waktu: '16:04 WITA',
    timestamp: '2026-10-03T16:04:00',
    tandaTangan: SAMPLE_SIGNATURE_SVG
  },
  {
    id: 'PMR-20261003-003',
    memberId: 'M-32',
    nama: 'Maura Cantika',
    kelas: 'X Animasi',
    tingkat: 'X',
    jurusan: 'Animasi',
    divisi: 'Kepemimpinan & Humas',
    jenisKegiatan: 'Latihan Rutin',
    tanggal: '2026-10-03',
    waktu: '16:10 WITA',
    timestamp: '2026-10-03T16:10:00',
    tandaTangan: SAMPLE_SIGNATURE_SVG
  }
];

// In-memory / LocalStorage Store
const STORAGE_KEY_ATTENDANCE = 'pmr_smkn7_attendance_records_v1';

function getStoredAttendance() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ATTENDANCE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('LocalStorage not available, fallback to memory', e);
  }
  return [...DUMMY_ATTENDANCE];
}

function saveAttendanceRecord(record) {
  const current = getStoredAttendance();
  const updated = [record, ...current];
  try {
    localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }
  return updated;
}

// Format Tanggal Indonesia
function formatTanggalIndo(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  const hariNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const bulanNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const hari = hariNames[d.getDay()];
  const tgl = d.getDate();
  const bln = bulanNames[d.getMonth()];
  const thn = d.getFullYear();
  return `${hari}, ${tgl} ${bln} ${thn}`;
}

// Format Tanggal Pendek (mis. 10 Okt 2026)
function formatTanggalPendek(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const bulanShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${Number(parts[2])} ${bulanShort[Number(parts[1]) - 1]} ${parts[0]}`;
}
