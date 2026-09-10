const navItems = [
  ['/admin', '⌂', 'Dashboard'],
  ['/admin/pencari-kerja', '♟', 'Pencari Kerja'],
  ['/admin/perusahaan', '▦', 'Perusahaan'],
  ['/admin/lowongan', '▣', 'Lowongan Kerja'],
  ['/admin/lamaran', '✉️', 'Lamaran'],
  ['/admin/jobfair', '★', 'Informasi Job Fair'],
  ['/admin/berita', '📰', 'Berita'],
  ['/admin/laporan', '📊', 'Laporan'],
  ['/admin/pengguna', '👥', 'Pengguna'],
  ['/admin/pengaturan', '⚙️', 'Pengaturan']
];

function adminLayout(content,active){
 return `<div class="admin-shell"><aside class="sidebar" id="sidebar"><button class="close-side" id="closeSide">×</button><div class="brand"><div class="brand-logo">JS</div><div><strong>JobFair</strong><small>DISNAKER SUMENEP</small></div></div><nav class="side-nav">${navItems.map(([route,ico,label])=>`<div class="side-link ${active===route?'active':''}" data-route="${route}">${ico}<span>${label}</span></div>`).join('')}</nav><div class="side-link logout-link" id="logoutBtn">⇥ <span>Keluar</span></div></aside><main class="admin-main"><header class="topbar"><button class="menu-toggle" id="menuToggle">☰</button><div class="topbar-title"><strong>Portal Administrator</strong><span>Dinas Tenaga Kerja Kabupaten Sumenep</span></div><div class="admin-user"><div class="avatar">A</div><div><b>Admin</b><span>Administrator</span></div></div></header><div class="admin-content">${content}</div></main></div>`;
}

function bindAdminNav(){
  document.querySelectorAll('[data-route]').forEach(el=>el.onclick=()=>setRoute(el.dataset.route));
  
  // PERBAIKAN: Pass elemen 'logoutBtn' ke fungsi logoutAdmin
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.onclick = () => logoutAdmin(logoutBtn);
  }

  const side=document.getElementById('sidebar');
  if(document.getElementById('menuToggle')) document.getElementById('menuToggle').onclick=()=>side.classList.add('open');
  if(document.getElementById('closeSide')) document.getElementById('closeSide').onclick=()=>side.classList.remove('open');
}

function pageTitle(kicker,title,desc,action=''){return `<div class="page-title"><div><span class="kicker">${kicker}</span><h1>${title}</h1><p>${desc}</p></div>${action}</div>`}

// Helper untuk menghitung jumlah baris data dari Supabase (Bab 10)
async function countTable(tableName, filter = null) {
  let q = sb.from(tableName).select('*', { count: 'exact', head: true });
  if (filter) q = q.eq(filter.column, filter.value);
  const { count, error } = await q;
  if (error) throw error;
  return count || 0;
}

async function renderDashboard() {
  if (!requireAuth()) return;

  try {
    // BAB 10: Menghitung jumlah data langsung dari database Supabase
    const [totalSeekers, totalCompanies, activeJobs, totalApplications] =
      await Promise.all([
        countTable('job_seekers'),
        countTable('companies'),
        countTable('jobs', {
          column: 'status',
          value: 'Aktif'
        }),
        countTable('applications')
      ]);

    const values = [34,47,41,60,82,55,64,72,91,85,70,62];
    const months = [
      'Jan','Feb','Mar','Apr','Mei','Jun',
      'Jul','Agu','Sep','Okt','Nov','Des'
    ];

    const content = `
      ${pageTitle(
        'Ringkasan',
        'Dashboard',
        'Pantau aktivitas utama JobFair DISNAKER Sumenep.',
        '<button class="btn secondary small">31 Agustus 2026</button>'
      )}

      <div class="stat-grid">

        <div class="stat-card">
          <div class="stat-ico">♟</div>
          <div class="stat-copy">
            <span>Pencari Kerja</span>
            <b>${totalSeekers}</b>
            <small>Total terdaftar</small>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-ico">▦</div>
          <div class="stat-copy">
            <span>Perusahaan</span>
            <b>${totalCompanies}</b>
            <small>Total perusahaan</small>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-ico">▣</div>
          <div class="stat-copy">
            <span>Lowongan Aktif</span>
            <b>${activeJobs}</b>
            <small>Total lowongan aktif</small>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-ico">✉️</div>
          <div class="stat-copy">
            <span>Lamaran Masuk</span>
            <b>${totalApplications}</b>
            <small>Total lamaran</small>
          </div>
        </div>

      </div>

      <div class="dashboard-grid">

        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>Pendaftaran Pencari Kerja</h2>
              <p>Perkembangan bulanan tahun 2026</p>
            </div>
          </div>

          <div class="chart">
            ${values.map((v,i) => `
              <div class="chart-bar">
                <i style="height:${v}%"></i>
                <span>${months[i]}</span>
              </div>
            `).join('')}
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>Pendaftar Terbaru</h2>
              <p>Data terbaru masuk</p>
            </div>
          </div>

          ${DATA.jobSeekers.slice(0,5).map(x => `
            <div class="list-item">
              <div class="list-avatar">
                ${escapeHTML(x.name?.[0] || '?')}
              </div>

              <div class="list-copy">
                <b>${escapeHTML(x.name)}</b>
                <span>${escapeHTML(x.education)}</span>
              </div>

              <small>${escapeHTML(x.registered || '')}</small>
            </div>
          `).join('')}

        </section>

        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>Lowongan Terbaru</h2>
              <p>Lowongan aktif perusahaan</p>
            </div>
          </div>

          ${DATA.jobs.slice(0,4).map(x => `
            <div class="list-item">
              <div class="list-avatar">▣</div>

              <div class="list-copy">
                <b>${escapeHTML(x.title)}</b>
                <span>${escapeHTML(x.company)}</span>
              </div>

              <small>${escapeHTML(x.deadline || '')}</small>
            </div>
          `).join('')}

        </section>

        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>Perusahaan Terbaru</h2>
              <p>Mitra rekrutmen</p>
            </div>
          </div>

          ${DATA.companies.slice(0,4).map(x => `
            <div class="list-item">
              <div class="list-avatar">▦</div>

              <div class="list-copy">
                <b>${escapeHTML(x.name)}</b>
                <span>${escapeHTML(x.sector)}</span>
              </div>

              <small>${escapeHTML(x.registered || '')}</small>
            </div>
          `).join('')}

        </section>

      </div>
    `;

    app.innerHTML = adminLayout(content, '/admin');
    bindAdminNav();

  } catch (err) {
    console.error(err);
    alert('Gagal mengambil jumlah data dari database: ' + err.message);
  }
}

// --- Fungsi Peninjauan Verifikasi oleh Admin ---

async function reviewApplicantVerification(requestId, entityType, entityId, newStatus) {
  const note = prompt(`Masukkan catatan verifikasi untuk status (${newStatus}):`) || '';

  try {
    const { data: { user } } = await sb.auth.getUser();

    // 1. Update Tabel Verification Requests
    const { error: reqErr } = await sb
      .from('verification_requests')
      .update({
        status: newStatus,
        note: note,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id
      })
      .eq('id', requestId);

    if (reqErr) throw reqErr;

    // 2. Sinkronkan ke Status Utama di Tabel job_seekers / companies
    const targetTable = entityType === 'job_seeker' ? 'job_seekers' : 'companies';
    const finalStatus = newStatus === 'Terverifikasi' ? 'Terverifikasi' : 'Menunggu';

    const { error: mainErr } = await sb
      .from(targetTable)
      .update({ status: finalStatus })
      .eq('id', entityId);

    if (mainErr) throw mainErr;

    toast(`Status berhasil diubah menjadi: ${newStatus}`);
    await loadAllData();
  } catch (err) {
    alert('Gagal memproses verifikasi: ' + err.message);
  }
}