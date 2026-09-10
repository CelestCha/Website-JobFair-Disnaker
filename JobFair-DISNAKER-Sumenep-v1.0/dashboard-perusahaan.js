// --- js/dashboard-perusahaan.js ---

async function renderPerusahaanDashboard() {
  const auth = await requireRole(['company']);
  if (!auth) return;

  // 1. Load Data Profil Perusahaan
  const { data: company } = await sb
    .from('companies')
    .select('*')
    .eq('user_id', auth.user.id)
    .maybeSingle();

  // 2. Load Status Verifikasi
  const { data: verif } = await sb
    .from('verification_requests')
    .select('*')
    .eq('user_id', auth.user.id)
    .eq('entity_type', 'company')
    .maybeSingle();

  // 3. Load Dokumen NIB
  const { data: docs } = company ? await sb
    .from('company_documents')
    .select('*')
    .eq('company_id', company.id) : { data: [] };

  // 4. Load Lowongan Milik Perusahaan Ini
  const { data: myJobs } = company ? await sb
    .from('jobs')
    .select('*')
    .eq('company', company.name)
    .order('id', { ascending: false }) : { data: [] };

  const isVerified = verif?.status === 'Terverifikasi';

  const content = `
    <div class="page-title">
      <div>
        <span class="kicker">Portal Perusahaan</span>
        <h1>${escapeHTML(company?.name || auth.profile.full_name || 'Mitra Perusahaan')}</h1>
        <p>Kelola legalitas usaha, NIB, dan pembuatan lowongan kerja resmi.</p>
      </div>
      <div>
        ${isVerified ? `
          <button class="btn" id="btnCreateCompanyJob">+ Buat Lowongan Baru</button>
        ` : `
          <button class="btn secondary" disabled title="Akun harus Terverifikasi untuk membuat lowongan">🔒 Lowongan Terkunci</button>
        `}
      </div>
    </div>

    <!-- STATUS VERIFIKASI BANNER -->
    <div class="panel" style="margin-bottom: 20px; border-left: 5px solid ${isVerified ? '#16a34a' : verif?.status === 'Perlu Perbaikan' ? '#d97706' : '#2563eb'};">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div>
          <h3 style="margin:0 0 4px 0;">Status Legalitas: ${statusHTML(verif?.status || 'Belum Diajukan')}</h3>
          <p style="margin:0; font-size:13px; color:#64748b;">
            ${verif?.note ? `<b>Catatan Admin:</b> ${escapeHTML(verif.note)}` : isVerified ? 'Perusahaan Anda telah terverifikasi. Anda dapat mempublikasikan lowongan kerja.' : 'Lengkapi data NIB dan unggah berkas NIB untuk diajukan ke Admin DISNAKER.'}
          </p>
        </div>
        <div>
          ${(!verif || verif.status === 'Perlu Perbaikan') ? `
            <button class="btn" id="btnSubmitVerifCompany">✉️ Ajukan Verifikasi NIB</button>
          ` : ''}
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- FORM EDIT PROFIL PERUSAHAAN -->
      <section class="panel">
        <div class="panel-head">
          <div><h2>Profil Usaha & Legalitas</h2></div>
        </div>
        <form id="formCompanyProfile" style="display:grid; gap:12px; margin-top:10px;">
          <div class="field">
            <label>Nama Perusahaan</label>
            <input id="cName" class="input" value="${escapeHTML(company?.name || auth.profile.full_name || '')}" required>
          </div>
          <div class="field">
            <label>Nomor Induk Berusaha (NIB)</label>
            <input id="cNib" class="input" value="${escapeHTML(company?.nib || '')}" required>
          </div>
          <div class="field">
            <label>Bidang / Sektor Usaha</label>
            <input id="cSector" class="input" value="${escapeHTML(company?.sector || '')}" placeholder="Perbankan / Maritim / Retail..." required>
          </div>
          <div class="field">
            <label>No. Telepon Kantor / WA PIC</label>
            <input id="cPhone" class="input" value="${escapeHTML(company?.phone || '')}" required>
          </div>
          <div class="field">
            <label>Alamat Kantor</label>
            <textarea id="cAddress" class="input" style="height:60px;" required>${escapeHTML(company?.address || '')}</textarea>
          </div>
          <button class="btn" type="submit" id="btnSaveCompanyProfile">💾 Simpan Profil Usaha</button>
        </form>
      </section>

      <!-- UPLOAD DOKUMEN NIB -->
      <section class="panel">
        <div class="panel-head">
          <div><h2>Dokumen NIB (Private Storage)</h2></div>
        </div>
        
        <div style="margin-bottom:20px;">
          <form id="formUploadNIB" style="display:grid; gap:10px;">
            <label style="font-size:13px; font-weight:600;">Upload Dokumen NIB (PDF/JPG/PNG, Max 10MB)</label>
            <input type="file" id="fNIBFile" accept="application/pdf,image/jpeg,image/png" class="input" required>
            <button class="btn secondary" type="submit" id="btnUploadNIB">📤 Upload NIB</button>
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
                    <button class="action view" data-open-comp-doc="${d.storage_path}">Buka Dokumen</button>
                  </td>
                </tr>
              `).join('') : `<tr><td colspan="3" class="empty">Belum ada dokumen NIB.</td></tr>`}
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- TABEL LOWONGAN KERJA PERUSAHAAN -->
    <section class="panel" style="margin-top:20px;">
      <div class="panel-head">
        <div><h2>Daftar Lowongan Pekerjaan Anda</h2></div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Posisi Lowongan</th>
              <th>Tipe</th>
              <th>Formasi</th>
              <th>Batas Waktu</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${myJobs && myJobs.length ? myJobs.map((j, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><b>${escapeHTML(j.title)}</b></td>
                <td>${escapeHTML(j.type)}</td>
                <td>${j.vacancy} orang</td>
                <td>${escapeHTML(j.deadline)}</td>
                <td>${statusHTML(j.status)}</td>
              </tr>
            `).join('') : `<tr><td colspan="6" class="empty">Belum ada lowongan terbit.</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `;

  app.innerHTML = companyLayout(content, '/perusahaan');
  bindCompanyNav();

  // EVENT: SIMPAN PROFIL
  document.getElementById('formCompanyProfile').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSaveCompanyProfile');
    await runAction(btn, async () => {
      const payload = {
        user_id: auth.user.id,
        name: document.getElementById('cName').value.trim(),
        nib: document.getElementById('cNib').value.trim(),
        email: auth.user.email,
        phone: document.getElementById('cPhone').value.trim(),
        sector: document.getElementById('cSector').value.trim(),
        address: document.getElementById('cAddress').value.trim(),
        status: company?.status || 'Menunggu'
      };

      const { error } = await sb.from('companies').upsert(payload, { onConflict: 'user_id' });
      if (error) throw error;
      toast('Profil perusahaan berhasil disimpan!');
      renderPerusahaanDashboard();
    });
  };

  // EVENT: UPLOAD DOKUMEN NIB
  document.getElementById('formUploadNIB').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnUploadNIB');
    const fileInput = document.getElementById('fNIBFile');
    const file = fileInput.files[0];

    if (!company) {
      alert('Simpan Profil Usaha & NIB terlebih dahulu.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file maksimal 10 MB!');
      return;
    }

    await runAction(btn, async () => {
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
      const storagePath = `${auth.user.id}/nib/${Date.now()}_${safeName}`;

      const { error: uploadErr } = await sb.storage
        .from('company-documents')
        .upload(storagePath, file, { upsert: false, contentType: file.type });

      if (uploadErr) throw uploadErr;

      const { error: metaErr } = await sb.from('company_documents').insert({
        user_id: auth.user.id,
        company_id: company.id,
        document_type: 'nib',
        file_name: file.name,
        storage_path: storagePath,
        mime_type: file.type,
        file_size: file.size
      });

      if (metaErr) {
        await sb.storage.from('company-documents').remove([storagePath]);
        throw metaErr;
      }

      toast('Dokumen NIB berhasil diunggah!');
      renderPerusahaanDashboard();
    });
  };

  // EVENT: AJUKAN VERIFIKASI PERUSAHAAN
  const btnVerifComp = document.getElementById('btnSubmitVerifCompany');
  if (btnVerifComp) {
    btnVerifComp.onclick = async () => {
      if (!company || !company.nib) {
        alert('Isi NIB pada profil usaha terlebih dahulu.');
        return;
      }
      const hasNIB = docs && docs.some(d => d.document_type === 'nib');
      if (!hasNIB) {
        alert('Unggah dokumen NIB terlebih dahulu.');
        return;
      }

      await runAction(btnVerifComp, async () => {
        const { error } = await sb.from('verification_requests').upsert({
          user_id: auth.user.id,
          entity_type: 'company',
          entity_id: company.id,
          status: 'Menunggu Verifikasi',
          note: null,
          submitted_at: new Date().toISOString()
        }, { onConflict: 'user_id,entity_type' });

        if (error) throw error;
        toast('Pengajuan verifikasi NIB berhasil dikirim!');
        renderPerusahaanDashboard();
      });
    };
  }

  // EVENT: BUKA DOKUMEN NIB SIGNED URL
  document.querySelectorAll('[data-open-comp-doc]').forEach(btn => {
    btn.onclick = async () => {
      try {
        const path = btn.dataset.openCompDoc;
        const { data, error } = await sb.storage
          .from('company-documents')
          .createSignedUrl(path, 300);

        if (error) throw error;
        window.open(data.signedUrl, '_blank', 'noopener');
      } catch (err) {
        alert('Gagal membuka dokumen NIB: ' + err.message);
      }
    };
  });

  // EVENT: BUAT LOWONGAN KHUSUS PERUSAHAAN TERVERIFIKASI
  const btnCreateJob = document.getElementById('btnCreateCompanyJob');
  if (btnCreateJob) {
    btnCreateJob.onclick = () => {
      showJobForm(null, renderPerusahaanDashboard);
    };
  }
}

function companyLayout(content, active) {
  return `
    <div class="admin-shell">
      <aside class="sidebar" id="sidebar">
        <div class="brand">
          <div class="brand-logo">PR</div>
          <div><strong>Perusahaan</strong><small>Portal Disnaker</small></div>
        </div>
        <nav class="side-nav">
          <div class="side-link ${active==='/perusahaan'?'active':''}" onclick="setRoute('/perusahaan')">⌂ <span>Dashboard</span></div>
        </nav>
        <div class="side-link logout-link" id="companyLogoutBtn">⇥ <span>Keluar</span></div>
      </aside>
      <main class="admin-main">
        <div class="admin-content">${content}</div>
      </main>
    </div>
  `;
}

function bindCompanyNav() {
  const logoutBtn = document.getElementById('companyLogoutBtn');
  if (logoutBtn) logoutBtn.onclick = () => logoutUser(logoutBtn);
}

// EVENT: SIMPAN PROFIL PERUSAHAAN
  document.getElementById('formCompanyProfile').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSaveCompanyProfile');
    await runAction(btn, async () => {
      const payload = {
        user_id: auth.user.id,
        name: document.getElementById('cName').value.trim(),
        nib: document.getElementById('cNib').value.trim(),
        email: auth.user.email,
        phone: document.getElementById('cPhone').value.trim(),
        sector: document.getElementById('cSector').value.trim(),
        address: document.getElementById('cAddress').value.trim()
      };

      if (company && company.id) {
        // Jika data sudah ada, gunakan UPDATE
        const { error } = await sb
          .from('companies')
          .update(payload)
          .eq('id', company.id);
        if (error) throw error;
      } else {
        // Jika data belum ada, INSERT baru
        const { error } = await sb
          .from('companies')
          .insert({ ...payload, status: 'Menunggu' });
        if (error) throw error;
      }

      toast('Profil perusahaan berhasil disimpan!');
      renderPerusahaanDashboard();
    });
  };