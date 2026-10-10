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
const STORAGE_KEY_MEMBERS = 'pmr_smkn7_members_v1';

function getStoredMembers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MEMBERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('LocalStorage not available, fallback to dummy members', e);
  }
  return [...DUMMY_MEMBERS];
}

function saveMemberRecord(member) {
  const current = getStoredMembers();
  if (!member.id) {
    const nextNum = current.length + 1;
    member.id = `M-${String(nextNum).padStart(2, '0')}`;
  }
  const idx = current.findIndex(m => m.id === member.id);
  const updated = idx >= 0
    ? current.map((m, i) => (i === idx ? member : m))
    : [member, ...current];
  try {
    localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage member save failed', e);
  }
  return updated;
}

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
  const idx = current.findIndex(item => item.id === record.id);
  const updated = idx >= 0
    ? current.map((item, i) => (i === idx ? record : item))
    : [record, ...current];
  try {
    localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }
  return updated;
}

// ============================================================================
// MYSQL (PHP API) + SUPABASE — ONLINE-FIRST DENGAN FALLBACK LOKAL
// ============================================================================

const PHP_API_ENDPOINT = 'api.php';

let phpApiStatus = {
  checked: false,
  available: false,
  message: 'Belum diperiksa',
  database: '',
  host: ''
};

function cacheList(storageKey, list) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(list));
  } catch (e) {}
}

async function checkPhpApi() {
  try {
    const res = await fetch(`${PHP_API_ENDPOINT}?resource=health`, { cache: 'no-store' });
    const json = await res.json();
    phpApiStatus = {
      checked: true,
      available: Boolean(res.ok && json.ok),
      message: json.ok ? `Terhubung ke MySQL (${json.data.database})` : (json.error || 'Koneksi ditolak'),
      database: json.data && json.data.database ? json.data.database : '',
      host: json.data && json.data.host ? json.data.host : ''
    };
  } catch (err) {
    phpApiStatus = {
      checked: true,
      available: false,
      message: 'API PHP tidak tersedia. Buka aplikasi lewat XAMPP (http://localhost/UKS/), bukan berkas file://.',
      database: '',
      host: ''
    };
  }
  return phpApiStatus;
}

function getDatabaseMode() {
  if (phpApiStatus.available) return 'mysql';
  if (typeof isSupabaseConfigured === 'function' && isSupabaseConfigured()) return 'supabase';
  return 'local';
}

function getDatabaseStatusLabel() {
  const mode = getDatabaseMode();
  if (mode === 'mysql') return 'MySQL Terhubung';
  if (mode === 'supabase') return 'Supabase Terhubung';
  return 'Database Lokal';
}

async function fetchMembersOnline() {
  const php = phpApiStatus.checked ? phpApiStatus : await checkPhpApi();
  if (php.available) {
    try {
      const res = await fetch(`${PHP_API_ENDPOINT}?resource=members`, { cache: 'no-store' });
      const json = await res.json();
      if (json.ok && Array.isArray(json.data) && json.data.length > 0) {
        cacheList(STORAGE_KEY_MEMBERS, json.data);
        return json.data;
      }
    } catch (err) {
      console.warn('Gagal fetch anggota dari MySQL, fallback ke lokal:', err);
    }
  }

  const client = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
  if (client) {
    try {
      const { data, error } = await client
        .from('members')
        .select('*')
        .order('nama', { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        cacheList(STORAGE_KEY_MEMBERS, data);
        return data;
      }
    } catch (err) {
      console.warn('Gagal fetch data anggota dari Supabase, fallback ke lokal:', err);
    }
  }
  return getStoredMembers();
}

async function fetchAttendanceOnline() {
  const php = phpApiStatus.checked ? phpApiStatus : await checkPhpApi();
  if (php.available) {
    try {
      const res = await fetch(`${PHP_API_ENDPOINT}?resource=attendances`, { cache: 'no-store' });
      const json = await res.json();
      if (json.ok && Array.isArray(json.data)) {
        cacheList(STORAGE_KEY_ATTENDANCE, json.data);
        return json.data;
      }
    } catch (err) {
      console.warn('Gagal fetch presensi dari MySQL, fallback ke lokal:', err);
    }
  }

  const client = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
  if (client) {
    try {
      const { data, error } = await client
        .from('attendances')
        .select('*')
        .order('timestamp', { ascending: false });

      if (!error && Array.isArray(data)) {
        const mapped = data.map(d => ({
          id: d.id,
          memberId: d.member_id,
          nama: d.nama,
          kelas: d.kelas,
          tingkat: d.tingkat,
          jurusan: d.jurusan,
          divisi: d.divisi,
          jenisKegiatan: d.jenis_kegiatan,
          tanggal: d.tanggal,
          waktu: d.waktu,
          timestamp: d.timestamp,
          tandaTangan: d.tanda_tangan
        }));
        cacheList(STORAGE_KEY_ATTENDANCE, mapped);
        return mapped;
      }
    } catch (err) {
      console.warn('Gagal fetch presensi dari Supabase, fallback ke lokal:', err);
    }
  }
  return getStoredAttendance();
}

async function insertMemberOnline(member) {
  const php = phpApiStatus.checked ? phpApiStatus : await checkPhpApi();
  if (php.available) {
    try {
      const res = await fetch(`${PHP_API_ENDPOINT}?resource=members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      });
      const json = await res.json();
      if (json.ok && json.data) {
        saveMemberRecord(json.data);
        return getStoredMembers();
      }
      console.warn('MySQL insert member error:', json.error);
    } catch (err) {
      console.warn('MySQL insert member failed:', err);
    }
  }

  saveMemberRecord(member);

  const client = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
  if (client) {
    try {
      const payload = {
        id: member.id,
        nama: member.nama,
        kelas: member.kelas,
        tingkat: member.tingkat,
        jurusan: member.jurusan,
        divisi: member.divisi,
        status: member.status
      };
      const { error } = await client.from('members').insert([payload]);
      if (error) {
        console.warn('Supabase insert member error:', error);
      }
    } catch (err) {
      console.warn('Supabase insert member failed:', err);
    }
  }
  return getStoredMembers();
}

async function insertAttendanceOnline(record) {
  const php = phpApiStatus.checked ? phpApiStatus : await checkPhpApi();
  if (php.available) {
    try {
      const res = await fetch(`${PHP_API_ENDPOINT}?resource=attendances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      const json = await res.json();
      if (json.ok && json.data) {
        saveAttendanceRecord(json.data);
        return getStoredAttendance();
      }
      console.warn('MySQL insert attendance error:', json.error);
    } catch (err) {
      console.warn('MySQL insert attendance failed:', err);
    }
  }

  saveAttendanceRecord(record);

  const client = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
  if (client) {
    try {
      const payload = {
        id: record.id,
        member_id: record.memberId,
        nama: record.nama,
        kelas: record.kelas,
        tingkat: record.tingkat,
        jurusan: record.jurusan,
        divisi: record.divisi,
        jenis_kegiatan: record.jenisKegiatan,
        tanggal: record.tanggal,
        waktu: record.waktu,
        timestamp: record.timestamp,
        tanda_tangan: record.tandaTangan
      };
      const { error } = await client.from('attendances').insert([payload]);
      if (error) {
        console.warn('Supabase insert attendance error:', error);
      }
    } catch (err) {
      console.warn('Supabase insert attendance failed:', err);
    }
  }
  return getStoredAttendance();
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
