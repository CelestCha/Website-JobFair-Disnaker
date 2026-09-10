// --- dashboard-pencaker.js ---

async function renderPencakerDashboard() {
  const auth = await requireRole(['job_seeker']);
  if (!auth) return;

  // 1. Load Data Profil
  const { data: seeker } = await sb
    .from('job_seekers')
    .select('*')
    .eq('user_id', auth.user.id)
    .maybeSingle();

  // 2. Load Status Verifikasi
  const { data: verif } = await sb
    .from('verification_requests')
    .select('*')
    .eq('user_id', auth.user.id)
    .eq('entity_type', 'job_seeker')
    .maybeSingle();

  // 3. Load Dokumen Dokumen
  const { data: docs } = seeker ? await sb
    .from('job_seeker_documents')
    .select('*')
    .eq('job_seeker_id', seeker.id) : { data: [] };

  // 4. Load Lamaran Saya
  const { data: myApps } = seeker ? await sb
    .from('applications')
    .select('id, status, applied_at, jobs(title, company, location)')
    .eq('job_seeker_id', seeker.id)
    .order('applied_at', { ascending: false }) : { data: [] };

  const content = `
    <div class="page-title">
      <div>
        <span class="kicker">Portal Pencari Kerja</span>
        <h1>Selamat Datang, ${escapeHTML(seeker?.name || auth.profile.full_name || 'Pelamar')}</h1>
        <p>Lengkapi data profil dan CV Anda untuk mendaftar lowongan kerja.</p>
      </div>
    </div>

    <!-- STATUS VERIFIKASI BANNER -->
    <div class="panel" style="margin-bottom: 20px; border-left: 5px solid ${verif?.status === 'Terverifikasi' ? '#16a34a' : verif?.status === 'Perlu Perbaikan' ? '#d97706' : '#2563eb'};">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div>
          <h3 style="margin:0 0 4px 0;">Status Akun: ${statusHTML(verif?.status || 'Belum Diajukan')}</h3>
          <p style="margin:0; font-size:13px; color:#64748b;">
            ${verif?.note ? `<b>Catatan Admin:</b> ${escapeHTML(verif.note)}` : 'Pastikan profil dan CV PDF sudah diunggah sebelum mengajukan verifikasi.'}
          </p>
        </div>
        <div>
          ${(!verif || verif.status === 'Perlu Perbaikan') ? `
            <button class="btn" id="btnSubmitVerifSeeker">✉️ Ajukan Verifikasi Akun</button>
          ` : ''}
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- FORM EDIT PROFIL -->
      <section class="panel">
        <div class="panel-head">
          <div><h2>Data diri & Profil</h2></div>
        </div>
        <form id="formSeekerProfile" style="display:grid; gap:12px; margin-top:10px;">
          <div class="field">
            <label>Nama Lengkap (KTP)</label>
            <input id="pName" class="input" value="${escapeHTML(seeker?.name || auth.profile.full_name || '')}" required>
          </div>
          <div class="field">
            <label>NIK</label>
            <input id="pNik" class="input" value="${escapeHTML(seeker?.nik || '')}" required>
          </div>
          <div class="field">
            <label>No. HP / WA</label>
            <input id="pPhone" class="input" value="${escapeHTML(seeker?.phone || '')}" required>
          </div>
          <div class="field">
            <label>Pendidikan Terakhir</label>
            <input id="pEdu" class="input" value="${escapeHTML(seeker?.education || '')}" placeholder="SMA / D3 / S1..." required>
          </div>
          <div class="field">
            <label>Kecamatan Domisili</label>
            <input id="pDistrict" class="input" value="${escapeHTML(seeker?.district || '')}" required>
          </div>
          <div class="field">
            <label>Keahlian / Skill</label>
            <textarea id="pSkills" class="input" style="height:60px;" required>${escapeHTML(seeker?.skills || '')}</textarea>
          </div>
          <button class="btn" type="submit" id="btnSaveSeekerProfile">💾 Simpan Profil</button>
        </form>
      </section>

      <!-- UPLOAD CV & DOKUMEN -->
      <section class="panel">
        <div class="panel-head">
          <div><h2>Berkas CV (Private Storage)</h2></div>
        </div>
        
        <div style="margin-bottom:20px;">
          <form id="formUploadCV" style="display:grid; gap:10px;">
            <label style="font-size:13px; font-weight:600;">Upload CV Terbaru (PDF, Max 5MB)</label>
            <input type="file" id="fCVFile" accept="application/pdf" class="input" required>
            <button class="btn secondary" type="submit" id="btnUploadCV">📤 Upload CV</button>
          </form>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Jenis Dokumen</th>
                <th>Nama File</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${docs && docs.length ? docs.map(d => `
                <tr>
                  <td><b>${escapeHTML(d.document_type.toUpperCase())}</b></td>
                  <td>${escapeHTML(d.file_name)}</td>
                  <td>
                    <button class="action view" data-open-doc="${d.storage_path}">Buka Dokumen</button>
                  </td>
                </tr>
              `).join('') : `<tr><td colspan="3" class="empty">Belum ada CV terunggah.</td></tr>`}
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- TABEL RIWAYAT LAMARAN -->
    <section class="panel" style="margin-top:20px;">
      <div class="panel-head">
        <div><h2>Riwayat Lamaran Pekerjaan</h2></div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Posisi Lowongan</th>
              <th>Perusahaan</th>
              <th>Tanggal Melamar</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${myApps && myApps.length ? myApps.map((a, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><b>${escapeHTML(a.jobs?.title || '-')}</b></td>
                <td>${escapeHTML(a.jobs?.company || '-')}</td>
                <td>${escapeHTML(a.applied_at ? a.applied_at.split('T')[0] : '-')}</td>
                <td>${statusHTML(a.status)}</td>
              </tr>
            `).join('') : `<tr><td colspan="5" class="empty">Belum ada lamaran yang dikirim.</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `;

  app.innerHTML = pencakerLayout(content, '/pencaker');
  bindPencakerNav();

  // EVENT SIMPAN PROFIL
  document.getElementById('formSeekerProfile').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSaveSeekerProfile');
    await runAction(btn, async () => {
      const payload = {
        user_id: auth.user.id,
        name: document.getElementById('pName').value.trim(),
        nik: document.getElementById('pNik').value.trim(),
        email: auth.user.email,
        phone: document.getElementById('pPhone').value.trim(),
        education: document.getElementById('pEdu').value.trim(),
        district: document.getElementById('pDistrict').value.trim(),
        skills: document.getElementById('pSkills').value.trim()
      };

      if (seeker && seeker.id) {
        const { error } = await sb
          .from('job_seekers')
          .update(payload)
          .eq('id', seeker.id);
        if (error) throw error;
      } else {
        const { error } = await sb
          .from('job_seekers')
          .insert({ ...payload, status: 'Menunggu' });
        if (error) throw error;
      }

      toast('Profil berhasil disimpan!');
      renderPencakerDashboard();
    });
  };

  // EVENT UPLOAD CV PDF
  document.getElementById('formUploadCV').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnUploadCV');
    const fileInput = document.getElementById('fCVFile');
    const file = fileInput.files[0];

    if (!seeker) {
      alert('Silakan simpan Data Diri / Profil terlebih dahulu sebelum mengunggah CV.');
      return;
    }
    if (file.type !== 'application/pdf') {
      alert('File CV wajib berformat PDF!');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5 MB!');
      return;
    }

    await runAction(btn, async () => {
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
      const storagePath = `${auth.user.id}/cv/${Date.now()}_${safeName}`;

      const { error: uploadErr } = await sb.storage
        .from('jobseeker-documents')
        .upload(storagePath, file, { upsert: false, contentType: file.type });

      if (uploadErr) throw uploadErr;

      const { error: metaErr } = await sb.from('job_seeker_documents').insert({
        user_id: auth.user.id,
        job_seeker_id: seeker.id,
        document_type: 'cv',
        file_name: file.name,
        storage_path: storagePath,
        mime_type: file.type,
        file_size: file.size
      });

      if (metaErr) {
        await sb.storage.from('jobseeker-documents').remove([storagePath]);
        throw metaErr;
      }

      toast('CV PDF berhasil diunggah!');
      renderPencakerDashboard();
    });
  };

  // EVENT AJUKAN VERIFIKASI
  const btnVerif = document.getElementById('btnSubmitVerifSeeker');
  if (btnVerif) {
    btnVerif.onclick = async () => {
      if (!seeker) {
        alert('Isi dan simpan profil Anda terlebih dahulu.');
        return;
      }
      const hasCV = docs && docs.some(d => d.document_type === 'cv');
      if (!hasCV) {
        alert('Unggah file CV (PDF) terlebih dahulu sebelum mengajukan verifikasi.');
        return;
      }

      await runAction(btnVerif, async () => {
        if (verif && verif.id) {
          const { error } = await sb
            .from('verification_requests')
            .update({
              status: 'Menunggu Verifikasi',
              note: null,
              submitted_at: new Date().toISOString()
            })
            .eq('id', verif.id);
          if (error) throw error;
        } else {
          const { error } = await sb
            .from('verification_requests')
            .insert({
              user_id: auth.user.id,
              entity_type: 'job_seeker',
              entity_id: seeker.id,
              status: 'Menunggu Verifikasi'
            });
          if (error) throw error;
        }

        toast('Pengajuan verifikasi berhasil dikirim!');
        renderPencakerDashboard();
      });
    };
  }

  // EVENT BUKA DOKUMEN SIGNED URL
  document.querySelectorAll('[data-open-doc]').forEach(btn => {
    btn.onclick = async () => {
      try {
        const path = btn.dataset.openDoc;
        const { data, error } = await sb.storage
          .from('jobseeker-documents')
          .createSignedUrl(path, 300);

        if (error) throw error;
        window.open(data.signedUrl, '_blank', 'noopener');
      } catch (err) {
        alert('Gagal membuka dokumen: ' + err.message);
      }
    };
  });
}

// FUNGSI TAMPILAN HALAMAN CARI LOWONGAN
async function renderPencakerJobs() {
  const auth = await requireRole(['job_seeker']);
  if (!auth) return;

  // Load lowongan aktif
  const { data: jobs } = await sb
    .from('jobs')
    .select('*')
    .eq('status', 'Aktif')
    .order('id', { ascending: false });

  const content = `
    <div class="page-title">
      <div>
        <span class="kicker">Eksplorasi Karir</span>
        <h1>Cari Lowongan Kerja</h1>
        <p>Temukan dan lamar pekerjaan yang sesuai dengan kualifikasi Anda.</p>
      </div>
    </div>

    <div class="job-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:16px;">
      ${jobs && jobs.length ? jobs.map(j => `
        <article class="job-card" style="background:white; padding:20px; border-radius:12px; border:1px solid #e2e8f0; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <span class="tag" style="background:#eff6ff; color:#2563eb; padding:4px 8px; border-radius:6px; font-size:11px; font-weight:600;">${escapeHTML(j.type)}</span>
            <h3 style="margin:12px 0 4px 0; font-size:16px;">${escapeHTML(j.title)}</h3>
            <p style="margin:0 0 12px 0; font-size:13px; color:#64748b;">${escapeHTML(j.company)}</p>
            <div style="font-size:12px; color:#94a3b8; display:grid; gap:4px; margin-bottom:16px;">
              <span>📍 ${escapeHTML(j.location || 'Sumenep')}</span>
              <span>👥 ${j.vacancy || 1} Formasi</span>
              <span>⏳ Batas: ${escapeHTML(j.deadline || '-')}</span>
            </div>
          </div>
          <button class="btn" onclick="showPublicJobDetail('${j.id}')" style="width:100%;">Lihat & Lamar</button>
        </article>
      `).join('') : `<div class="empty" style="grid-column: span 3; text-align:center; padding:40px;">Belum ada lowongan aktif saat ini.</div>`}
    </div>
  `;

  app.innerHTML = pencakerLayout(content, '/pencaker/lowongan');
  bindPencakerNav();
}

function pencakerLayout(content, active) {
  return `
    <div class="admin-shell">
      <aside class="sidebar" id="sidebar">
        <div class="brand">
          <div class="brand-logo">PK</div>
          <div><strong>Pencari Kerja</strong><small>Portal Disnaker</small></div>
        </div>
        <nav class="side-nav">
          <div class="side-link ${active==='/pencaker'?'active':''}" onclick="setRoute('/pencaker')">⌂ <span>Dashboard</span></div>
          <div class="side-link ${active==='/pencaker/lowongan'?'active':''}" onclick="setRoute('/pencaker/lowongan')">▣ <span>Cari Lowongan</span></div>
        </nav>
        <div class="side-link logout-link" id="pencakerLogoutBtn">⇥ <span>Keluar</span></div>
      </aside>
      <main class="admin-main">
        <div class="admin-content">${content}</div>
      </main>
    </div>
  `;
}

function bindPencakerNav() {
  const logoutBtn = document.getElementById('pencakerLogoutBtn');
  if (logoutBtn) logoutBtn.onclick = () => logoutUser(logoutBtn);
}