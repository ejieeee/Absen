/**
 * supabase-config.js - Manajemen Koneksi Database Cloud Supabase
 * Mendukung konfigurasi via berkas maupun langsung melalui antarmuka web (LocalStorage).
 */

const DEFAULT_SUPABASE_CONFIG = {
  url: '',      // Contoh: 'https://xyzabcdefghijklmno.supabase.co'
  anonKey: ''   // Contoh: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};

const STORAGE_KEY_SUPABASE_URL = 'pmr_supabase_project_url';
const STORAGE_KEY_SUPABASE_KEY = 'pmr_supabase_anon_key';

let supabaseClient = null;

function getActiveSupabaseCredentials() {
  const customUrl = localStorage.getItem(STORAGE_KEY_SUPABASE_URL);
  const customKey = localStorage.getItem(STORAGE_KEY_SUPABASE_KEY);

  const url = (customUrl && customUrl.trim()) || DEFAULT_SUPABASE_CONFIG.url.trim();
  const anonKey = (customKey && customKey.trim()) || DEFAULT_SUPABASE_CONFIG.anonKey.trim();

  return { url, anonKey };
}

function isSupabaseConfigured() {
  const { url, anonKey } = getActiveSupabaseCredentials();
  return Boolean(
    url &&
    anonKey &&
    url.startsWith('https://') &&
    url.includes('.supabase.co') &&
    anonKey.length > 20
  );
}

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  if (typeof window.supabase !== 'undefined' && isSupabaseConfigured()) {
    const { url, anonKey } = getActiveSupabaseCredentials();
    try {
      supabaseClient = window.supabase.createClient(url, anonKey);
      return supabaseClient;
    } catch (err) {
      console.warn('Gagal menginisialisasi client Supabase:', err);
    }
  }
  return null;
}

function saveSupabaseCredentials(url, key) {
  if (url && key) {
    localStorage.setItem(STORAGE_KEY_SUPABASE_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_SUPABASE_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_SUPABASE_URL);
    localStorage.removeItem(STORAGE_KEY_SUPABASE_KEY);
  }
  supabaseClient = null; // Reset client
}
