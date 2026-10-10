/**
 * constants.js - Referensi PMR SMKN 7 Samarinda (Divisi & Rombel Gabungan)
 */
const DIVISI_LIST = ['Litbang Jaya', 'Kebersihan', 'PDD'];

const ROMBEL_JURUSAN_LIST = [
  { id: 'PPLG - X PPLG 1', label: 'X PPLG 1 (PPLG)', kelas: 'X', jurusan: 'PPLG' },
  { id: 'PPLG - X PPLG 2', label: 'X PPLG 2 (PPLG)', kelas: 'X', jurusan: 'PPLG' },
  { id: 'PPLG - XI PPLG 1', label: 'XI PPLG 1 (PPLG)', kelas: 'XI', jurusan: 'PPLG' },
  { id: 'PPLG - XI PPLG 2', label: 'XI PPLG 2 (PPLG)', kelas: 'XI', jurusan: 'PPLG' },
  { id: 'TJKT - X TJKT 1', label: 'X TJKT 1 (TJKT)', kelas: 'X', jurusan: 'TJKT' },
  { id: 'TJKT - X TJKT 2', label: 'X TJKT 2 (TJKT)', kelas: 'X', jurusan: 'TJKT' },
  { id: 'TJKT - XI TJKT 1', label: 'XI TJKT 1 (TJKT)', kelas: 'XI', jurusan: 'TJKT' },
  { id: 'TJKT - XI TJKT 2', label: 'XI TJKT 2 (TJKT)', kelas: 'XI', jurusan: 'TJKT' },
  { id: 'DKV - X DKV 1', label: 'X DKV 1 (DKV)', kelas: 'X', jurusan: 'DKV' },
  { id: 'DKV - X DKV 2', label: 'X DKV 2 (DKV)', kelas: 'X', jurusan: 'DKV' },
  { id: 'DKV - XI DKV 1', label: 'XI DKV 1 (DKV)', kelas: 'XI', jurusan: 'DKV' },
  { id: 'DKV - XI DKV 2', label: 'XI DKV 2 (DKV)', kelas: 'XI', jurusan: 'DKV' },
  { id: 'Animasi - X Animasi', label: 'X Animasi (Animasi)', kelas: 'X', jurusan: 'Animasi' },
  { id: 'Animasi - XI Animasi', label: 'XI Animasi (Animasi)', kelas: 'XI', jurusan: 'Animasi' }
];

function formatTanggalIndo(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const bulanNames = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return `${parseInt(parts[2], 10)} ${bulanNames[parseInt(parts[1], 10)]} ${parts[0]}`;
}

function formatTanggalPendek(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const blnShort = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${parseInt(parts[2], 10)} ${blnShort[parseInt(parts[1], 10)]} ${parts[0]}`;
}