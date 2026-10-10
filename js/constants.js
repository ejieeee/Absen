/**
 * constants.js - Referensi PMR SMKN 7 Samarinda (Divisi & Jurusan)
 */
const DIVISI_LIST = ['Litbang Jaya', 'Kebersihan', 'PDD'];

const JURUSAN_LIST = [
  'PPLG 1',
  'PPLG 2',
  'TJKT 1',
  'TJKT 2',
  'TJKT 3',
  'DKV 1',
  'DKV 2',
  'Animasi'
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