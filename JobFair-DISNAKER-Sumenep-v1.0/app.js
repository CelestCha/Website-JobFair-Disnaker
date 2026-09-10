// Modal Form Tambah / Edit Job Fair (Bab 13)
function showEventForm(existing = null, onSaved = () => {}) {
  const modal = createFormModal(
    existing ? 'Edit Informasi Job Fair' : 'Tambah Informasi Job Fair',
    `
      <input id="fEventTitle" class="input" placeholder="Judul / Nama Agenda" value="${escapeHTML(existing?.title || '')}" required>
      <input id="fEventDate" type="date" class="input" value="${escapeHTML(existing?.event_date || '')}" required>
      <input id="fEventLocation" class="input" placeholder="Lokasi Pelaksanaan" value="${escapeHTML(existing?.location || '')}" required>
      <textarea id="fEventDesc" class="input" placeholder="Deskripsi Agenda" style="height:80px">${escapeHTML(existing?.description || '')}</textarea>
      <select id="fEventStatus" class="filter-select" style="width:100%">
        <option value="Draft" ${existing?.status === 'Draft' ? 'selected' : ''}>Draft</option>
        <option value="Publikasi" ${existing?.status === 'Publikasi' ? 'selected' : ''}>Publikasi</option>
      </select>
    `
  );

  modal.querySelector('form').onsubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: document.getElementById('fEventTitle').value.trim(),
      event_date: document.getElementById('fEventDate').value,
      location: document.getElementById('fEventLocation').value.trim(),
      description: document.getElementById('fEventDesc').value.trim(),
      status: document.getElementById('fEventStatus').value
    };

    try {
      if (existing) {
        await updateRow('jobfair_events', existing.id, payload);
        toast('Informasi Job Fair berhasil diubah!');
      } else {
        await insertRow('jobfair_events', payload);
        toast('Informasi Job Fair berhasil ditambahkan!');
      }
      modal.remove();
      await loadAllData();
      onSaved();
    } catch (err) {
      alert("Gagal menyimpan data event: " + err.message);
    }
  };
}

// Render Tampilan Admin Informasi Job Fair
function renderEvents() {
  if (!requireAuth()) return;

  const rows = DATA.events;
  const content = `${pageTitle('Agenda', 'Informasi Job Fair', 'Kelola jadwal dan kegiatan Job Fair DISNAKER.', '<button class="btn" id="addEventBtn">+ Tambah Event</button>')}
    <section class="panel">
      <div class="panel-head">
        <div><h2>Daftar Event Job Fair</h2><p>${rows.length} agenda terdaftar</p></div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Judul Event</th>
              <th>Tanggal</th>
              <th>Lokasi</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${rows.length ? rows.map((r, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><b>${escapeHTML(r.title)}</b></td>
                <td>${escapeHTML(r.event_date)}</td>
                <td>${escapeHTML(r.location)}</td>
                <td>${statusHTML(r.status)}</td>
                <td>
                  <div class="action-row">
                    <button class="action edit" data-edit-event="${r.id}">Edit</button>
                    <button class="action delete" data-del-event="${r.id}">Hapus</button>
                  </div>
                </td>
              </tr>
            `).join('') : `<tr><td colspan="6" class="empty">Belum ada agenda Job Fair.</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>`;

  app.innerHTML = adminLayout(content, '/admin/jobfair');
  bindAdminNav();

  document.getElementById('addEventBtn').onclick = () => showEventForm(null, renderEvents);

  document.querySelectorAll('[data-edit-event]').forEach(btn => {
    btn.onclick = () => {
      const row = DATA.events.find(x => x.id == btn.dataset.editEvent);
      showEventForm(row, renderEvents);
    };
  });

  document.querySelectorAll('[data-del-event]').forEach(btn => {
    btn.onclick = async () => {
      if (!confirm('Hapus agenda Job Fair ini?')) return;
      try {
        await deleteRow('jobfair_events', btn.dataset.delEvent);
        toast('Agenda berhasil dihapus!');
        await loadAllData();
        renderEvents();
      } catch (err) {
        alert('Gagal menghapus: ' + err.message);
      }
    };
  });
}

// Modal Form Tambah / Edit Berita (Bab 13.1)
function showNewsForm(existing = null, onSaved = () => {}) {
  const modal = createFormModal(
    existing ? 'Edit Berita' : 'Tambah Berita Baru',
    `
      <input id="fNewsTitle" class="input" placeholder="Judul Berita" value="${escapeHTML(existing?.title || '')}" required>
      <textarea id="fNewsContent" class="input" placeholder="Isi Berita / Pengumuman" style="height:120px" required>${escapeHTML(existing?.content || '')}</textarea>
      <select id="fNewsStatus" class="filter-select" style="width:100%">
        <option value="Draft" ${existing?.status === 'Draft' ? 'selected' : ''}>Draft</option>
        <option value="Publikasi" ${existing?.status === 'Publikasi' ? 'selected' : ''}>Publikasi</option>
      </select>
    `
  );

  modal.querySelector('form').onsubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: document.getElementById('fNewsTitle').value.trim(),
      content: document.getElementById('fNewsContent').value.trim(),
      status: document.getElementById('fNewsStatus').value,
      published_at: new Date().toISOString()
    };

    try {
      if (existing) {
        await updateRow('news', existing.id, payload);
        toast('Berita berhasil diperbarui!');
      } else {
        await insertRow('news', payload);
        toast('Berita baru berhasil dipublikasikan!');
      }
      modal.remove();
      await loadAllData();
      onSaved();
    } catch (err) {
      alert("Gagal menyimpan berita: " + err.message);
    }
  };
}

// Render Tampilan Admin Berita
function renderNews() {
  if (!requireAuth()) return;

  const rows = DATA.news;
  const content = `${pageTitle('Pengumuman', 'Kelola Berita', 'Buat dan atur berita atau artikel JobFair.', '<button class="btn" id="addNewsBtn">+ Tambah Berita</button>')}
    <section class="panel">
      <div class="panel-head">
        <div><h2>Daftar Berita & Informasi</h2><p>${rows.length} berita terdaftar</p></div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Judul Berita</th>
              <th>Status</th>
              <th>Tanggal Dibuat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${rows.length ? rows.map((r, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><b>${escapeHTML(r.title)}</b></td>
                <td>${statusHTML(r.status)}</td>
                <td>${escapeHTML(r.created_at ? r.created_at.split('T')[0] : '-')}</td>
                <td>
                  <div class="action-row">
                    <button class="action edit" data-edit-news="${r.id}">Edit</button>
                    <button class="action delete" data-del-news="${r.id}">Hapus</button>
                  </div>
                </td>
              </tr>
            `).join('') : `<tr><td colspan="5" class="empty">Belum ada berita.</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>`;

  app.innerHTML = adminLayout(content, '/admin/berita');
  bindAdminNav();

  document.getElementById('addNewsBtn').onclick = () => showNewsForm(null, renderNews);

  document.querySelectorAll('[data-edit-news]').forEach(btn => {
    btn.onclick = () => {
      const row = DATA.news.find(x => x.id == btn.dataset.editNews);
      showNewsForm(row, renderNews);
    };
  });

  document.querySelectorAll('[data-del-news]').forEach(btn => {
    btn.onclick = async () => {
      if (!confirm('Apakah kamu yakin ingin menghapus berita ini?')) return;
      try {
        await deleteRow('news', btn.dataset.delNews);
        toast('Berita berhasil dihapus!');
        await loadAllData();
        renderNews();
      } catch (err) {
        alert('Gagal menghapus berita: ' + err.message);
      }
    };
  });
}


// --- BAB 11: FUNGSI CRUD JOB SEEKERS ---

// 1. CREATE (Tambah Pencari Kerja)
async function addJobSeeker(formData) {
  const { error } = await sb.from('job_seekers').insert({
    name: formData.name,
    nik: formData.nik,
    email: formData.email,
    phone: formData.phone,
    education: formData.education,
    district: formData.district,
    status: formData.status || 'Menunggu'
  });

  if (error) throw error;
  await loadAllData();
}

// 2. UPDATE (Edit Status Pencari Kerja)
async function updateJobSeekerStatus(id, newStatus) {
  const { error } = await sb
    .from('job_seekers')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) throw error;
  await loadAllData();
}

// 3. DELETE (Hapus Pencari Kerja)
async function deleteJobSeeker(id) {
  const { error } = await sb
    .from('job_seekers')
    .delete()
    .eq('id', id);

  if (error) throw error;
  await loadAllData();
}

async function getRows(tableName) {
  const { data, error } = await sb
    .from(tableName)
    .select("*")
    .order('id', { ascending: false });

  if (error) throw error;
  return data || [];
}

async function insertRow(tableName, payload) {
  const { data, error } = await sb
    .from(tableName)
    .insert(payload)
    .select();
  if (error) throw error;
  return data?.[0];
}

async function updateRow(tableName, id, payload) {
  const { data, error } = await sb
    .from(tableName)
    .update(payload)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data?.[0];
}

async function deleteRow(tableName, id) {
  const { error } = await sb
    .from(tableName)
    .delete()
    .eq('id', id);
  if (error) throw error;
}



// Bootstrap Session (Menjaga agar saat di-refresh tidak ter-logout)
async function bootstrapAuth() {
  const { data: { session } } = await sb.auth.getSession();

  if (session) {
    currentUser = session.user;
    try {
      await loadProfile(currentUser.id);
    } catch (err) {
      console.error("Gagal load profile:", err);
    }
  }

  // Load data lowongan, jobfair, & berita dari Supabase
  try {
    await loadAllData();
  } catch (err) {
    console.error("Gagal load data awal:", err);
  }

  // Panggil router SETELAH session & profile selesai dimuat!
  router();
}





// --- FUNGSI TAMPIL FORM TAMBAH / EDIT PENCARI KERJA ---
function showSeekerForm(existing = null, onSaved = () => {}) {
  const modal = createFormModal(
    existing ? 'Edit Pencari Kerja' : 'Tambah Pencari Kerja',
    `
      <input id="fName" class="input" placeholder="Nama Lengkap" value="${escapeHTML(existing?.name || '')}" required>
      <input id="fNik" class="input" placeholder="NIK" value="${escapeHTML(existing?.nik || '')}" required>
      <input id="fEmail" type="email" class="input" placeholder="Email" value="${escapeHTML(existing?.email || '')}" required>
      <input id="fPhone" class="input" placeholder="No. HP" value="${escapeHTML(existing?.phone || '')}" required>
      <input id="fEducation" class="input" placeholder="Pendidikan" value="${escapeHTML(existing?.education || '')}" required>
      <input id="fDistrict" class="input" placeholder="Kecamatan" value="${escapeHTML(existing?.district || '')}" required>
    `
  );

  modal.querySelector('form').onsubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: document.getElementById('fName').value.trim(),
      nik: document.getElementById('fNik').value.trim(),
      email: document.getElementById('fEmail').value.trim(),
      phone: document.getElementById('fPhone').value.trim(),
      education: document.getElementById('fEducation').value.trim(),
      district: document.getElementById('fDistrict').value.trim(),
      status: existing?.status || 'Menunggu'
    };

    try {
      if (existing) {
        await updateRow('job_seekers', existing.id, payload);
        toast('Data pencari kerja berhasil diubah!');
      } else {
        await insertRow('job_seekers', payload);
        toast('Pencari kerja baru berhasil ditambahkan!');
      }
      modal.remove();
      await loadAllData(); // Refresh data utama
      onSaved(); // Render ulang tampilan tabel
    } catch (err) {
      alert("Gagal menyimpan data: " + err.message);
    }
  };
}

// --- FUNGSI TAMPIL FORM TAMBAH / EDIT PERUSAHAAN (BAB 8) ---
function showCompanyForm(existing = null, onSaved = () => {}) {
  const modal = createFormModal(
    existing ? 'Edit Perusahaan' : 'Tambah Perusahaan',
    `
      <input id="fCompanyName" class="input" placeholder="Nama Perusahaan" value="${escapeHTML(existing?.name || '')}" required>
      <input id="fCompanyEmail" type="email" class="input" placeholder="Email Perusahaan" value="${escapeHTML(existing?.email || '')}" required>
      <input id="fCompanyPhone" class="input" placeholder="No. Telepon / WA" value="${escapeHTML(existing?.phone || '')}" required>
      <input id="fSector" class="input" placeholder="Bidang Usaha / Sektor" value="${escapeHTML(existing?.sector || '')}" required>
      <select id="fStatus" class="filter-select" style="width:100%">
        <option value="Menunggu" ${existing?.status === 'Menunggu' ? 'selected' : ''}>Menunggu</option>
        <option value="Terverifikasi" ${existing?.status === 'Terverifikasi' ? 'selected' : ''}>Terverifikasi</option>
        <option value="Ditolak" ${existing?.status === 'Ditolak' ? 'selected' : ''}>Ditolak</option>
      </select>
    `
  );

  modal.querySelector('form').onsubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: document.getElementById('fCompanyName').value.trim(),
      email: document.getElementById('fCompanyEmail').value.trim(),
      phone: document.getElementById('fCompanyPhone').value.trim(),
      sector: document.getElementById('fSector').value.trim(),
      status: document.getElementById('fStatus').value
    };

    try {
      if (existing) {
        await updateRow('companies', existing.id, payload);
        toast('Data perusahaan berhasil diubah!');
      } else {
        await insertRow('companies', payload);
        toast('Perusahaan baru berhasil ditambahkan!');
      }
      modal.remove();
      await loadAllData(); // Refresh data utama
      onSaved(); // Render ulang tabel
    } catch (err) {
      alert("Gagal menyimpan data perusahaan: " + err.message);
    }
  };
}

// FUNGSI 8.1: Ubah Status Verifikasi Perusahaan (Setujui / Tolak)
async function changeCompanyStatus(id, newStatus, onSaved = () => {}) {
  try {
    await updateRow('companies', id, { status: newStatus });
    toast(`Status perusahaan berhasil diubah menjadi ${newStatus}!`);
    await loadAllData();
    onSaved();
  } catch (err) {
    alert('Gagal mengubah status perusahaan: ' + err.message);
  }
}

// --- FUNGSI TAMPIL FORM TAMBAH / EDIT LOWONGAN (BAB 9 MODUL 4) ---
function showJobForm(existing = null, onSaved = () => {}) {
  const modal = createFormModal(
    existing ? 'Edit Lowongan Kerja' : 'Tambah Lowongan Kerja',
    `
      <input id="fTitle" class="input" placeholder="Judul / Posisi Pekerjaan" value="${escapeHTML(existing?.title || '')}" required>
      <input id="fCompany" class="input" placeholder="Nama Perusahaan" value="${escapeHTML(existing?.company || '')}" required>
      <input id="fLocation" class="input" placeholder="Lokasi (misal: Sumenep)" value="${escapeHTML(existing?.location || '')}" required>
      <select id="fType" class="filter-select" style="width:100%">
        <option value="Full-time" ${existing?.type === 'Full-time' ? 'selected' : ''}>Full-time</option>
        <option value="Part-time" ${existing?.type === 'Part-time' ? 'selected' : ''}>Part-time</option>
        <option value="Kontrak" ${existing?.type === 'Kontrak' ? 'selected' : ''}>Kontrak</option>
        <option value="Magang" ${existing?.type === 'Magang' ? 'selected' : ''}>Magang</option>
      </select>
      <input id="fVacancy" type="number" min="1" class="input" placeholder="Jumlah Formasi" value="${existing?.vacancy || 1}" required>
      <input id="fDeadline" type="date" class="input" value="${existing?.deadline || ''}" required>
      <select id="fJobStatus" class="filter-select" style="width:100%">
        <option value="Draft" ${existing?.status === 'Draft' ? 'selected' : ''}>Draft</option>
        <option value="Aktif" ${existing?.status === 'Aktif' ? 'selected' : ''}>Aktif</option>
        <option value="Ditutup" ${existing?.status === 'Ditutup' ? 'selected' : ''}>Ditutup</option>
      </select>
    `
  );

  modal.querySelector('form').onsubmit = async (e) => {
    e.preventDefault();
    
    // Payload disesuaikan dengan Bab 9 Modul 4
    const payload = {
      title: document.getElementById('fTitle').value.trim(),
      company: document.getElementById('fCompany').value.trim(),
      location: document.getElementById('fLocation').value.trim(),
      type: document.getElementById('fType').value,
      vacancy: Number(document.getElementById('fVacancy').value || 1),
      deadline: document.getElementById('fDeadline').value || null,
      status: document.getElementById('fJobStatus').value
    };

    try {
      if (existing) {
        await updateRow('jobs', existing.id, payload);
        toast('Data lowongan berhasil diubah!');
      } else {
        await insertRow('jobs', payload);
        toast('Lowongan baru berhasil ditambahkan!');
      }
      modal.remove();
      await loadAllData(); // Refresh data utama Supabase
      onSaved(); // Render ulang tabel lowongan
    } catch (err) {
      alert("Gagal menyimpan data lowongan: " + err.message);
    }
  };
}

// --- BAB 12.2: Ubah Status Lamaran ---
// BAB 12.2: Ubah Status Lamaran oleh Admin
async function changeApplicationStatus(id, newStatus, onSaved = () => {}) {
  try {
    await updateRow('applications', id, { status: newStatus });
    toast(`Status lamaran berhasil diubah menjadi ${newStatus}!`);
    await loadAllData();
    onSaved();
  } catch (err) {
    alert('Gagal mengubah status lamaran: ' + err.message);
  }
}


function showDetail(title,row,fields){const backdrop=document.createElement('div');backdrop.className='modal-backdrop';backdrop.innerHTML=`<div class="modal"><div class="modal-head"><h3>${escapeHTML(title)}</h3><button class="icon-btn" id="modalClose">×</button></div><div class="modal-grid">${fields.map(([key,label])=>`<div class="modal-field"><span>${escapeHTML(label)}</span><b>${escapeHTML(row[key])}</b></div>`).join('')}</div></div>`;document.body.appendChild(backdrop);backdrop.querySelector('#modalClose').onclick=()=>backdrop.remove();backdrop.onclick=e=>{if(e.target===backdrop)backdrop.remove()}}

// --- BAB 11 & 12.1: DETAIL LOWONGAN & TOMBOL LAMAR ---
// BAB 11 & 12.1: DETAIL LOWONGAN & TOMBOL LAMAR (UTUH)
async function showPublicJobDetail(jobId) {
  try {
    const { data: job, error } = await sb
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) throw error;

    if (!job) {
      toast('Data lowongan tidak ditemukan.');
      return;
    }

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal">
        <div class="modal-head">
          <h3>${escapeHTML(job.title)}</h3>
          <button class="icon-btn" id="modalClose">×</button>
        </div>
        <div class="modal-grid">
          <div class="modal-field"><span>Perusahaan</span><b>${escapeHTML(job.company)}</b></div>
          <div class="modal-field"><span>Lokasi</span><b>${escapeHTML(job.location)}</b></div>
          <div class="modal-field"><span>Tipe</span><b>${escapeHTML(job.type)}</b></div>
          <div class="modal-field"><span>Formasi</span><b>${escapeHTML(job.vacancy)}</b></div>
          <div class="modal-field"><span>Batas Lamaran</span><b>${escapeHTML(job.deadline)}</b></div>
          <div class="modal-field"><span>Status</span><b>${escapeHTML(job.status)}</b></div>
        </div>
        <button class="btn" id="btnApplyNow" style="margin-top:15px; width:100%;">✉️ Lamar Pekerjaan Ini</button>
      </div>
    `;

    document.body.appendChild(backdrop);

    backdrop.querySelector('#modalClose').onclick = () => backdrop.remove();
    backdrop.onclick = (e) => { if (e.target === backdrop) backdrop.remove(); };

    // BAB 12.1: Prosedur Klik Tombol Lamar
    backdrop.querySelector('#btnApplyNow').onclick = async () => {
      if (!currentUser) {
        toast('Silakan login terlebih dahulu untuk melamar.');
        setRoute('/login');
        backdrop.remove();
        return;
      }

      try {
        const userEmail = (currentUser.email || '').trim().toLowerCase();

        // 1. Cari pencari kerja langsung di memori lokal DATA.jobSeekers (Bypassing RLS DB)
        let seeker = DATA.jobSeekers.find(s => (s.email || '').trim().toLowerCase() === userEmail);

        // 2. Jika tidak ada di lokal, coba query darurat ke Supabase (case-insensitive)
        if (!seeker) {
          const { data: seekerDb } = await sb
            .from('job_seekers')
            .select('id, email')
            .ilike('email', userEmail)
            .maybeSingle();

          seeker = seekerDb;
        }

        // 3. Jika tetap tidak ketemu, tampilkan pesan error yang mendetail
        if (!seeker) {
          const registeredEmails = DATA.jobSeekers.map(s => s.email).join(', ') || 'Belum ada data di tabel';
          alert(`Gagal Melamar!\n\nEmail login kamu: "${userEmail}"\n\nDaftar email yang ada di tabel Pencari Kerja saat ini:\n[ ${registeredEmails} ]\n\nPastikan email di menu Pencari Kerja ditulis persis sama tanpa spasi ya bestie!`);
          return;
        }

        // 4. Insert lamaran baru ke Supabase
        const { error: errApply } = await sb.from('applications').insert({
          job_id: jobId,
          job_seeker_id: seeker.id,
          status: 'Dikirim'
        });

        if (errApply) throw errApply;

        toast('Lamaran berhasil dikirim!');
        backdrop.remove();
        await loadAllData();

      } catch (err) {
        console.error(err);
        const errMsg = err.message || '';
        if (errMsg.includes('unique') || errMsg.includes('duplicate')) {
          alert('Gagal melamar: Kamu sudah pernah melamar lowongan ini!');
        } else {
          alert('Gagal melamar: ' + errMsg);
        }
      }
    };

  } catch (err) {
    console.error(err);
    toast('Gagal mengambil detail lowongan: ' + err.message);
  }
}



function renderDatabase(type){
  if(!requireAuth()) return;
  
  let cfg;

  if(type==='seekers') cfg={
    route:'/admin/pencari-kerja',
    kicker:'Database',
    title:'Pencari Kerja',
    desc:'Kelola database pencari kerja yang terdaftar.',
    rows:DATA.jobSeekers,
    columns:[
      ['name','Nama'],
      ['nik','NIK'],
      ['email','Email'],
      ['phone','No. HP'],
      ['education','Pendidikan'],
      ['district','Domisili'],
      ['status','Status']
    ],
    filename:'database-pencari-kerja.csv'
  };

  else if(type==='companies') cfg={
    route:'/admin/perusahaan',
    kicker:'Database',
    title:'Perusahaan',
    desc:'Kelola perusahaan yang berpartisipasi dalam JobFair.',
    rows:DATA.companies,
    columns:[
      ['name','Nama Perusahaan'],
      ['email','Email'],
      ['phone','Telepon'],
      ['sector','Bidang Usaha'],
      ['status','Status']
    ],
    filename:'database-perusahaan.csv'
  };

  else if(type==='jobs') cfg={
    route:'/admin/lowongan',
    kicker:'Rekrutmen',
    title:'Lowongan Kerja',
    desc:'Kelola informasi lowongan kerja yang tersedia.',
    rows:DATA.jobs,
    columns:[
      ['title','Posisi'],
      ['company','Perusahaan'],
      ['location','Lokasi'],
      ['type','Tipe'],
      ['vacancy','Formasi'],
      ['deadline','Batas Lamaran'],
      ['status','Status']
    ],
    filename:'database-lowongan.csv'
  };

  else if(type==='applications') cfg={
    route:'/admin/lamaran',
    kicker:'Database',
    title:'Lamaran',
    desc:'Kelola lamaran pekerjaan.',
    rows:DATA.applications,
    columns:[
      ['id','ID'],
      ['job_title','Lowongan'],
      ['company_name','Perusahaan'],
      ['seeker_name','Pencari Kerja'],
      ['seeker_email','Email'],
      ['status','Status']
    ],
    filename:'database-lamaran.csv'
  };

  const actionLabel = type==='seekers' ? '+ Tambah Pencari Kerja' : type==='companies' ? '+ Tambah Perusahaan' : type==='jobs' ? '+ Tambah Lowongan' : 'Daftar Lamaran';
  const showAddBtn = type !== 'applications'; // Lamaran tidak perlu tombol tambah manual

  const content = `${pageTitle(cfg.kicker, cfg.title, cfg.desc, showAddBtn ? `<button class="btn" id="addBtn">${actionLabel}</button>` : '')}<section class="panel"><div class="panel-head"><div><h2>Daftar ${cfg.title}</h2><p id="rowCount">${cfg.rows.length} data ditampilkan</p></div><button class="btn secondary small" id="exportBtn">⇩ Ekspor CSV</button></div><div class="table-tools"><div class="searchbox">⌕<input id="searchInput" placeholder="Cari nama, email, wilayah, bidang..."></div><select class="filter-select" id="statusFilter"><option value="">Semua status</option><option>Terverifikasi</option><option>Menunggu</option><option>Aktif</option><option>Draft</option><option>Ditolak</option><option>Dikirim</option><option>Wawancara</option><option>Diterima</option></select></div><div class="table-wrap"><table><thead><tr><th>No</th>${cfg.columns.map(c => `<th>${c[1]}</th>`).join('')}<th>Aksi</th></tr></thead><tbody id="dataBody"></tbody></table></div></section>`;
  
  app.innerHTML = adminLayout(content, cfg.route);
  bindAdminNav();

  let filtered = [...cfg.rows];
  const body = document.getElementById('dataBody');

  function draw(){
    body.innerHTML = filtered.length ? filtered.map((r, i) => `
      <tr>
        <td>${i + 1}</td>
        ${cfg.columns.map(([key]) => `<td>${key === 'status' ? statusHTML(r[key]) : escapeHTML(r[key])}</td>`).join('')}
        <td>
          <div class="action-row">
            <button class="action view" data-view="${r.id}">Detail</button>
            
            ${type === 'seekers' ? `
              <button class="action edit" data-edit="${r.id}">Edit</button>
              <button class="action verify" data-verify="${r.id}">Verifikasi</button>
            ` : ''}

            ${type === 'companies' ? `
              <button class="action edit" data-edit="${r.id}">Edit</button>
              <button class="action verify" data-approve="${r.id}">Setujui</button>
              <button class="action delete" data-reject="${r.id}">Tolak</button>
            ` : ''}

            ${type === 'jobs' ? `
              <button class="action edit" data-edit="${r.id}">Edit</button>
            ` : ''}

            ${type === 'applications' ? `
              <button class="action edit" data-status-app="${r.id}" data-val="Wawancara">Wawancara</button>
              <button class="action verify" data-status-app="${r.id}" data-val="Diterima">Terima</button>
              <button class="action delete" data-status-app="${r.id}" data-val="Tidak Lolos">Tolak</button>
            ` : ''}

            <button class="action delete" data-del="${r.id}">Hapus</button>
          </div>
        </td>
      </tr>
    `).join('') : `<tr><td colspan="${cfg.columns.length + 2}" class="empty">Tidak ada data sesuai pencarian.</td></tr>`;

    document.getElementById('rowCount').textContent = `${filtered.length} data ditampilkan`;

    // Bind Detail
    document.querySelectorAll('[data-view]').forEach(btn => btn.onclick = () => {
      const row = cfg.rows.find(x => x.id == btn.dataset.view);
      showDetail(`Detail ${cfg.title}`, row, cfg.columns);
    });

    // Bind Edit
    document.querySelectorAll('[data-edit]').forEach(btn => btn.onclick = () => {
      const row = cfg.rows.find(x => x.id == btn.dataset.edit);
      if (type === 'seekers') showSeekerForm(row, () => renderDatabase('seekers'));
      else if (type === 'companies') showCompanyForm(row, () => renderDatabase('companies'));
      else if (type === 'jobs') showJobForm(row, () => renderDatabase('jobs'));
    });

    // Bind Verifikasi Seeker
    document.querySelectorAll('[data-verify]').forEach(btn => btn.onclick = async () => {
      try {
        await updateRow('job_seekers', btn.dataset.verify, { status: 'Terverifikasi' });
        toast('Status berhasil diubah!');
        await loadAllData();
        renderDatabase('seekers');
      } catch (err) { alert(err.message); }
    });

    // Bind Company Approve/Reject
    document.querySelectorAll('[data-approve]').forEach(btn => btn.onclick = () => {
      changeCompanyStatus(btn.dataset.approve, 'Terverifikasi', () => renderDatabase('companies'));
    });
    document.querySelectorAll('[data-reject]').forEach(btn => btn.onclick = () => {
      changeCompanyStatus(btn.dataset.reject, 'Ditolak', () => renderDatabase('companies'));
    });

    // PERBAIKAN: Gunakan dataset.statusApp (CamelCase)
document.querySelectorAll('[data-status-app]').forEach(btn => btn.onclick = () => {
  changeApplicationStatus(btn.dataset.statusApp, btn.dataset.val, () => renderDatabase('applications'));
});

    // Bind Hapus Data
    const tableName = type === 'seekers' ? 'job_seekers' : type === 'companies' ? 'companies' : type === 'jobs' ? 'jobs' : 'applications';
    document.querySelectorAll('[data-del]').forEach(btn => btn.onclick = async () => {
      if (!confirm('Apakah kamu yakin ingin menghapus data ini?')) return;
      try {
        await deleteRow(tableName, btn.dataset.del);
        toast('Data berhasil dihapus');
        await loadAllData();
        renderDatabase(type);
      } catch (err) { alert('Gagal menghapus: ' + err.message); }
    });
  }

  function apply(){
    const q = document.getElementById('searchInput').value.toLowerCase();
    const st = document.getElementById('statusFilter').value;
    filtered = cfg.rows.filter(r => Object.values(r).join(' ').toLowerCase().includes(q) && (!st || r.status === st));
    draw();
  }

  document.getElementById('searchInput').oninput = apply;
  document.getElementById('statusFilter').onchange = apply;
  document.getElementById('exportBtn').onclick = () => exportCSV(filtered, cfg.columns, cfg.filename);
  
  if (showAddBtn) {
    document.getElementById('addBtn').onclick = () => {
      if (type === 'seekers') showSeekerForm(null, () => renderDatabase('seekers'));
      else if (type === 'companies') showCompanyForm(null, () => renderDatabase('companies'));
      else if (type === 'jobs') showJobForm(null, () => renderDatabase('jobs'));
    };
  }

  draw();
}

// --- BAB 14: MENU LAPORAN ---
async function renderReports() {
  if (!requireAuth()) return;

  try {
    // 1. Tarik data ringkasan rekapitulasi langsung dari database Supabase
    const [seekersRes, companiesRes, jobsRes, appsRes] = await Promise.all([
      sb.from('job_seekers').select('district, education, status'),
      sb.from('companies').select('sector, status'),
      sb.from('jobs').select('status, vacancy'),
      sb.from('applications').select('status')
    ]);

    if (seekersRes.error || companiesRes.error || jobsRes.error || appsRes.error) {
      throw new Error("Gagal mengambil data laporan dari Supabase.");
    }

    const seekers = seekersRes.data || [];
    const companies = companiesRes.data || [];
    const jobs = jobsRes.data || [];
    const apps = appsRes.data || [];

    // 2. Olah data Rekap per Kecamatan (sesuai contoh 14.1 Modul 4)
    const byDistrict = {};
    seekers.forEach(r => {
      const key = r.district || 'Tidak diketahui';
      byDistrict[key] = (byDistrict[key] || 0) + 1;
    });

    // 3. Olah data Rekap per Pendidikan
    const byEducation = {};
    seekers.forEach(r => {
      const key = r.education || 'Lainnya';
      byEducation[key] = (byEducation[key] || 0) + 1;
    });

    // 4. Olah data Rekap per Sektor Usaha Perusahaan
    const bySector = {};
    companies.forEach(r => {
      const key = r.sector || 'Lainnya';
      bySector[key] = (bySector[key] || 0) + 1;
    });

    // Hitung statistik ringkas
    const verifiedSeekers = seekers.filter(s => s.status === 'Terverifikasi').length;
    const verifiedCompanies = companies.filter(c => c.status === 'Terverifikasi').length;
    const totalVacancy = jobs.reduce((sum, j) => sum + Number(j.vacancy || 0), 0);

    const content = `
      ${pageTitle('Analisis & Statistic', 'Laporan Rekapitulasi', 'Ringkasan data rekap statistik Bursa Kerja DISNAKER Sumenep.', '<button class="btn" id="btnPrintReport">🖨️ Cetak Laporan (PDF)</button>')}
      
      <div class="stat-grid" style="margin-bottom:20px">
        <div class="stat-card">
          <div class="stat-ico">♟</div>
          <div class="stat-copy">
            <span>Pencari Kerja</span>
            <b>${seekers.length}</b>
            <small>${verifiedSeekers} Terverifikasi</small>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-ico">▦</div>
          <div class="stat-copy">
            <span>Perusahaan</span>
            <b>${companies.length}</b>
            <small>${verifiedCompanies} Terverifikasi</small>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-ico">▣</div>
          <div class="stat-copy">
            <span>Total Formasi Lowongan</span>
            <b>${totalVacancy}</b>
            <small>dari ${jobs.length} lowongan</small>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-ico">✉️</div>
          <div class="stat-copy">
            <span>Total Lamaran</span>
            <b>${apps.length}</b>
            <small>Masuk ke sistem</small>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- Rekap Per Kecamatan -->
        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>Pencari Kerja per Kecamatan</h2>
              <p>Sebaran domisili pendaftar</p>
            </div>
            <button class="btn secondary small" id="exportDistrictBtn">⇩ CSV</button>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>No</th><th>Kecamatan</th><th>Jumlah</th></tr></thead>
              <tbody>
                ${Object.keys(byDistrict).length ? Object.entries(byDistrict).map(([dist, count], i) => `
                  <tr><td>${i + 1}</td><td><b>${escapeHTML(dist)}</b></td><td>${count} Orang</td></tr>
                `).join('') : `<tr><td colspan="3" class="empty">Belum ada data.</td></tr>`}
              </tbody>
            </table>
          </div>
        </section>

        <!-- Rekap Per Tingkat Pendidikan -->
        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>Pencari Kerja per Pendidikan</h2>
              <p>Kualifikasi tingkat pendidikan</p>
            </div>
            <button class="btn secondary small" id="exportEduBtn">⇩ CSV</button>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>No</th><th>Pendidikan</th><th>Jumlah</th></tr></thead>
              <tbody>
                ${Object.keys(byEducation).length ? Object.entries(byEducation).map(([edu, count], i) => `
                  <tr><td>${i + 1}</td><td><b>${escapeHTML(edu)}</b></td><td>${count} Orang</td></tr>
                `).join('') : `<tr><td colspan="3" class="empty">Belum ada data.</td></tr>`}
              </tbody>
            </table>
          </div>
        </section>

        <!-- Rekap Per Sektor Perusahaan -->
        <section class="panel" style="grid-column: span 2;">
          <div class="panel-head">
            <div>
              <h2>Perusahaan per Sektor Usaha</h2>
              <p>Sebaran bidang usaha mitra</p>
            </div>
            <button class="btn secondary small" id="exportSectorBtn">⇩ CSV</button>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>No</th><th>Bidang Sektor</th><th>Jumlah Perusahaan</th></tr></thead>
              <tbody>
                ${Object.keys(bySector).length ? Object.entries(bySector).map(([sec, count], i) => `
                  <tr><td>${i + 1}</td><td><b>${escapeHTML(sec)}</b></td><td>${count} Perusahaan</td></tr>
                `).join('') : `<tr><td colspan="3" class="empty">Belum ada data.</td></tr>`}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    `;

    app.innerHTML = adminLayout(content, '/admin/laporan');
    bindAdminNav();

    // Event 14.2: Cetak / Save PDF Laporan
    document.getElementById('btnPrintReport').onclick = () => window.print();

    // Event 14.2: Ekspor CSV tiap tabel rekap menggunakan helper exportCSV()
    document.getElementById('exportDistrictBtn').onclick = () => {
      const rows = Object.entries(byDistrict).map(([district, total]) => ({ district, total }));
      exportCSV(rows, [['district', 'Kecamatan'], ['total', 'Jumlah']], 'laporan-pencari-kerja-per-kecamatan.csv');
    };

    document.getElementById('exportEduBtn').onclick = () => {
      const rows = Object.entries(byEducation).map(([education, total]) => ({ education, total }));
      exportCSV(rows, [['education', 'Tingkat Pendidikan'], ['total', 'Jumlah']], 'laporan-pencari-kerja-per-pendidikan.csv');
    };

    document.getElementById('exportSectorBtn').onclick = () => {
      const rows = Object.entries(bySector).map(([sector, total]) => ({ sector, total }));
      exportCSV(rows, [['sector', 'Sektor Usaha'], ['total', 'Jumlah']], 'laporan-perusahaan-per-sektor.csv');
    };

  } catch (err) {
    console.error(err);
    alert('Gagal membuat laporan: ' + err.message);
  }
}

// --- BAB 15: MENU PENGGUNA (AMAN) ---
async function renderUsers() {
  const app = document.getElementById('app');
  if (!app) return;

  const content = `
    <div class="card">
      <div class="card-head">
        <h3>Daftar Pengguna Sistem</h3>
      </div>
      <p style="margin-bottom: 16px; color: var(--muted, #666); font-size: 14px;">
        *Perubahan role hanya dilakukan langsung via Supabase Dashboard/SQL Editor untuk alasan keamanan (tanpa secret key di browser).
      </p>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Dibuat Pada</th>
            </tr>
          </thead>
          <tbody id="usersTableBody">
            <tr><td colspan="4">Memuat data pengguna...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  app.innerHTML = adminLayout(content, '/admin/pengguna');
  bindAdminNav();

  try {
    const { data: profiles, error } = await sb
      .from('profiles')
      .select('id, email, role, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const tbody = document.getElementById('usersTableBody');
    if (!profiles || profiles.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4">Belum ada data pengguna.</td></tr>';
      return;
    }

    tbody.innerHTML = profiles.map(user => `
      <tr>
        <td style="font-family: monospace; font-size: 12px;">${user.id}</td>
        <td>${user.email || '-'}</td>
        <td><span class="badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}">${user.role}</span></td>
        <td>${user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : '-'}</td>
      </tr>
    `).join('');

  } catch (err) {
    console.error('Error fetching users:', err);
    const tbody = document.getElementById('usersTableBody');
    if (tbody) {
      // Perhatikan tanda petik backtick (`) di bawah ini!
      tbody.innerHTML = `<tr><td colspan="4" style="color:red;">Gagal memuat data: ${err.message}</td></tr>`;
    }
  }
}

// --- BAB 16: FUNGSI BARU UNTUK PENGATURAN ---
// --- BAB 16: FUNGSI PENGATURAN ---
async function renderSettings() {
  if (!requireAuth()) return;

  const set = DATA.settings || {};

  const content = `
    ${pageTitle('Sistem', 'Pengaturan Aplikasi', 'Kelola konfigurasi nama aplikasi, kontak, alamat, dan footer.')}
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>Konfigurasi Situs</h2>
          <p>Perubahan akan langsung berdampak pada halaman utama / publik.</p>
        </div>
      </div>
      <form id="settingsForm" style="display:grid; gap:16px; margin-top:16px; max-width:600px;">
        <div class="field">
          <label style="font-weight:600; font-size:14px;">Nama Aplikasi / Portal</label>
          <input id="fAppName" class="input" value="${escapeHTML(set.app_name || '')}" required>
        </div>
        <div class="field">
          <label style="font-weight:600; font-size:14px;">Email Kontak / Layanan</label>
          <input id="fContactEmail" type="email" class="input" value="${escapeHTML(set.contact_email || '')}" required>
        </div>
        <div class="field">
          <label style="font-weight:600; font-size:14px;">No. Telepon / WhatsApp CS</label>
          <input id="fContactPhone" class="input" value="${escapeHTML(set.contact_phone || '')}" required>
        </div>
        <div class="field">
          <label style="font-weight:600; font-size:14px;">Alamat Kantor</label>
          <textarea id="fAddress" class="input" style="height:70px" required>${escapeHTML(set.office_address || '')}</textarea>
        </div>
        <div class="field">
          <label style="font-weight:600; font-size:14px;">Teks Footer Halaman Publik</label>
          <input id="fFooter" class="input" value="${escapeHTML(set.footer_text || '')}" required>
        </div>
        <div>
          <button class="btn" type="submit" id="btnSaveSettings">💾 Simpan Perubahan Pengaturan</button>
        </div>
        
      </form>
    </section>
    
  `;

  app.innerHTML = adminLayout(content, '/admin/pengaturan');
  bindAdminNav();

  document.getElementById('settingsForm').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSaveSettings');

    await runAction(btn, async () => {
      const payload = {
        app_name: document.getElementById('fAppName').value.trim(),
        contact_email: document.getElementById('fContactEmail').value.trim(),
        contact_phone: document.getElementById('fContactPhone').value.trim(),
        office_address: document.getElementById('fAddress').value.trim(),
        footer_text: document.getElementById('fFooter').value.trim(),
        updated_at: new Date().toISOString()
      };

      await updateRow('settings', 1, payload);
      toast('Pengaturan berhasil diperbarui!');
      await loadAllData();
      renderSettings();
    });
  };

  
}


// --- SYSTEM ROUTER ---
function router() {
  const route = currentRoute();

  if (route === '/') renderLanding();
  else if (route === '/login') renderLogin();
  
  // ROUTE DASHBOARD ADMIN
  else if (route === '/admin') renderDashboard();
  else if (route === '/admin/pencari-kerja') renderDatabase('seekers');
  else if (route === '/admin/perusahaan') renderDatabase('companies');
  else if (route === '/admin/lowongan') renderDatabase('jobs');
  else if (route === '/admin/lamaran') renderDatabase('applications');
  else if (route === '/admin/jobfair') renderEvents();
  else if (route === '/admin/berita') renderNews();
  else if (route === '/admin/laporan') renderReports();
  else if (route === '/admin/pengguna') renderUsers();
  else if (route === '/admin/pengaturan') renderSettings();

  // ROUTE PORTAL PENCAKER & PERUSAHAAN
  else if (route === '/pencaker' || route === '/portal/job-seeker') {
    renderPencakerDashboard();
  }
  else if (route === '/pencaker/lowongan') {
    renderPencakerJobs(); // <-- Panggil halaman Cari Lowongan ini
  }
  else if (route === '/perusahaan' || route === '/portal/company') {
    renderPerusahaanDashboard();
  }
  
  else {
    if (currentUser && currentProfile) {
      if (currentProfile.role === 'admin') setRoute('/admin');
      else if (currentProfile.role === 'job_seeker') setRoute('/pencaker');
      else if (currentProfile.role === 'company') setRoute('/perusahaan');
      else setRoute('/');
    } else {
      setRoute('/');
    }
  }
}

// listener
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', bootstrapAuth);