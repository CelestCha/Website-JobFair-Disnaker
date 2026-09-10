// ==========================================
//     LAYANAN DATABASE & AUTHENTICATION
// ==========================================

// FUNGSI 1: Load Profil User dari Supabase
async function loadProfile(userId) {
  const { data, error } = await sb
    .from('profiles')
    .select('id,email,role')
    .eq('id', userId)
    .single();

  if (error) throw error;
  currentProfile = data;
  return data;
}

async function loginAdmin(email, password) {
  const { data, error } = await sb.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  currentUser = data.user;
  const profile = await loadProfile(currentUser.id);

  if (profile.role !== 'admin') {
    await sb.auth.signOut();
    currentUser = null;
    currentProfile = null;
    throw new Error('Akun ini bukan administrator.');
  }
}

// Update Proteksi Auth (Ngecek status user dan role admin)
function isAuthed() {
  return !!currentUser && currentProfile?.role === 'admin';
}

function requireAuth(){if(!isAuthed()){setRoute('/login');return false}return true}

// Fungsi Logout dari Supabase
// Fungsi Logout dari Supabase (Di-update sesuai Bab 17)
async function logoutAdmin(btnElement = null) {
  await runAction(btnElement, async () => {
    await sb.auth.signOut();
    currentUser = null;
    currentProfile = null;
    DATA = { 
      jobSeekers: [], 
      companies: [], 
      jobs: [], 
      applications: [], 
      events: [], 
      news: [], 
      settings: DATA.settings // Tetap simpan settings agar publik tidak blank
    };
    toast('Berhasil keluar dari akun admin.');
    setRoute('/login');
  });
}

// FUNGSI 2: Load Semua Data dari Supabase
async function loadAllData() {
  const [seekersRes, companiesRes, jobsRes, applicationsRes, eventsRes, newsRes, settingsRes] = await Promise.all([
    sb.from('job_seekers').select('*').order('id', { ascending: false }),
    sb.from('companies').select('*').order('id', { ascending: false }),
    sb.from('jobs').select('*').order('id', { ascending: false }),
    sb.from('applications')
      .select(`
        id,
        status,
        note,
        applied_at,
        jobs ( id, title, company ),
        job_seekers ( id, name, email, phone )
      `)
      .order('applied_at', { ascending: false }),
    sb.from('jobfair_events').select('*').order('id', { ascending: false }),
    sb.from('news').select('*').order('id', { ascending: false }),
    sb.from('settings').select('*').eq('id', 1).maybeSingle() // <-- Nambah tarik settings
  ]);

  const err =
    seekersRes.error ||
    companiesRes.error ||
    jobsRes.error ||
    applicationsRes.error ||
    eventsRes.error ||
    newsRes.error;

  if (err) throw err;

  DATA.jobSeekers = seekersRes.data || [];
  DATA.companies = companiesRes.data || [];
  DATA.jobs = jobsRes.data || [];
  DATA.events = eventsRes.data || [];
  DATA.news = newsRes.data || [];
  
  // Nambah penampung settings agar landing page & admin bisa baca
  DATA.settings = settingsRes.data || {
    app_name: 'JobFair DISNAKER Sumenep',
    contact_email: 'disnaker@sumenepkab.go.id',
    contact_phone: '081234567890',
    office_address: 'Jl. Trunojoyo No. 12, Sumenep',
    footer_text: '© 2026 JobFair DISNAKER Kabupaten Sumenep · Prototype v1.0'
  };

  DATA.applications = (applicationsRes.data || []).map(a => ({
    ...a,
    job_title: a.jobs?.title || '-',
    company_name: a.jobs?.company || '-',
    seeker_name: a.job_seekers?.name || '-',
    seeker_email: a.job_seekers?.email || '-',
    seeker_phone: a.job_seekers?.phone || '-'
  }));
}

// --- js/auth.js ---

async function getCurrentIdentity() {
  const { data: { user }, error: userError } = await sb.auth.getUser();
  if (userError || !user) return null;

  const { data: profile, error } = await sb
    .from('profiles')
    .select('id, email, full_name, role')
    .eq('id', user.id)
    .single();

  if (error) return null;
  return { user, profile };
}

async function requireRole(allowedRoles) {
  const identity = await getCurrentIdentity();
  if (!identity) {
    setRoute('/login');
    return null;
  }

  if (!allowedRoles.includes(identity.profile.role)) {
    alert('Anda tidak memiliki hak akses ke halaman ini.');
    if (identity.profile.role === 'admin') setRoute('/admin');
    else if (identity.profile.role === 'job_seeker') setRoute('/pencaker');
    else if (identity.profile.role === 'company') setRoute('/perusahaan');
    else setRoute('/');
    return null;
  }

  return identity;
}

async function loginUser(email, password) {
  const { data, error } = await sb.auth.signInWithPassword({
    email: email.trim(),
    password: password
  });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('Email atau password salah, atau akun belum terdaftar.');
    }
    if (error.message.includes('Email not confirmed')) {
      throw new Error('Email belum dikonfirmasi. Cek inbox email Anda atau matikan Email Confirmation di Supabase.');
    }
    throw error;
  }

  currentUser = data.user;
  const profile = await loadProfile(currentUser.id);
  return profile;
}

async function registerUser(payload) {
  // 1. Register ke Supabase Auth
  const { data, error } = await sb.auth.signUp({
    email: payload.email,
    password: payload.password
  });

  if (error) {
    if (error.message.includes('Email signups are disabled')) {
      throw new Error('Pendaftaran via Email sedang dinonaktifkan di Supabase. Aktifkan fitur "Allow new users to sign up" pada menu Auth > Providers > Email.');
    }
    if (error.message.includes('security purposes') || error.status === 429) {
      throw new Error('Terlalu cepat klik tombol. Mohon tunggu 5 detik lalu coba lagi.');
    }
    throw error;
  }

  if (!data.user) throw new Error("Gagal membuat akun.");

  const userId = data.user.id;

  // 2. Simpan Identitas ke Tabel Profiles
  const { error: profileErr } = await sb.from('profiles').insert({
    id: userId,
    email: payload.email,
    role: payload.role,
    full_name: payload.fullName
  });

  if (profileErr) throw profileErr;

  // 3. Simpan ke Tabel Khusus sesuai Role
  if (payload.role === 'job_seeker') {
    const { error: seekerErr } = await sb.from('job_seekers').insert({
      user_id: userId,
      name: payload.fullName,
      email: payload.email,
      phone: payload.phone || '',
      education: 'SMA/SMK',
      status: 'Menunggu'
    });
    if (seekerErr) throw seekerErr;
  } else if (payload.role === 'company') {
    const { error: compErr } = await sb.from('companies').insert({
      user_id: userId,
      name: payload.fullName,
      email: payload.email,
      phone: payload.phone || '',
      status: 'Menunggu'
    });
    if (compErr) throw compErr;
  }

  currentUser = data.user;
  await loadProfile(userId);
  return payload.role;
}

async function loadProfile(userId) {
  const { data, error } = await sb
    .from('profiles')
    .select('id, email, role, full_name')
    .eq('id', userId)
    .single();

  if (error) throw error;
  currentProfile = data;
  return data;
}

async function logoutUser(btnElement = null) {
  await runAction(btnElement, async () => {
    await sb.auth.signOut();
    currentUser = null;
    currentProfile = null;
    toast('Berhasil keluar dari akun.');
    setRoute('/login');
  });
}