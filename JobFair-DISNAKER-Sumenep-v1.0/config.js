// ==========================================
// KONFIGURASI SUPABASE & VARIABEL GLOBAL
// ==========================================

// Konfigurasi kredensial untuk menghubungkan web ke Supabase
const SUPABASE_URL = 'https://paanlayhccdchobinjzv.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_180zSpUmLaePHf-zv_dgEw_4kBMDhH7';

// Inisialisasi client Supabase agar bisa dipakai di seluruh file app.js
const sb = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// variabel DATA kosong yang nantinya akan diisi dari database Supabase
let DATA = {
  jobSeekers: [],
  companies: [],
  jobs: [],
  applications: [],
  events: [],
  news: [],
  settings: null // <-- CUMA TAMBAH BARIS INI
};

// 4. Variabel penampung status user dan profil yang sedang login
let currentUser = null;
let currentProfile = null;
const app = document.getElementById('app');