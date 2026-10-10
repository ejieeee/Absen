/**
 * supabase-config.js - Konfigurasi Database Cloud Supabase
 */
const SUPABASE_URL = 'Mhttps://ibqtuaghajogdtxiuigo.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlicXR1YWdoYWpvZ2R0eGl1aWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2MzczMzQsImV4cCI6MjEwNzIxMzMzNH0.E6jQW_ZvTO_i6RlJqJPnjFIR7Z4aq1x3c5Bepp__YIY';

let supabaseClient = null;

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  if (typeof window.supabase !== 'undefined' && SUPABASE_URL.startsWith('https://')) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      return supabaseClient;
    } catch (err) {
      console.warn('Gagal menginisialisasi Supabase:', err);
    }
  }
  return null;
}