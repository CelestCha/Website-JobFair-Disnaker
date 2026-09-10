function renderLanding(){
  const jobs = DATA.jobs.filter(j => j.status === 'Aktif').slice(0,4);
  const set = DATA.settings || {}; // Mengambil data settings dinamis

  app.innerHTML = `
  <div class="public-page">

    <!-- =========================
         HEADER
    ========================== -->
    <header class="public-header">

      <div class="brand" style="display: flex; align-items: center; gap: 12px;">

  <!-- LOGO GAMBAR DENGAN TAMPILAN ELEGAN & MODERN -->
  <img 
    src="logoatas.jpeg" 
    alt="Logo JobFair DISNAKER" 
    style="
      height: 44px;
      width: auto;
      max-width: 150px;
      object-fit: contain;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.08));
      transition: transform 0.2s ease;
    "
    onmouseover="this.style.transform='scale(1.03)'"
    onmouseout="this.style.transform='scale(1)'"
    onerror="this.onerror=null; this.src='logoatas.jpg';"
  />

  <div>
    <strong style="font-size: 16px; color: #0f172a; display: block; line-height: 1.2;">
      ${escapeHTML(set.app_name || 'JobFair DISNAKER')}
    </strong>
    <small style="color: #64748b; font-size: 12px; font-weight: 500;">
      Kabupaten Sumenep
    </small>
  </div>

</div>

      <nav class="public-nav">

        <a href="#lowongan">Lowongan</a>

        <a href="#tentang">Tentang</a>

        <a href="#perusahaan">Perusahaan</a>

        <button class="btn small" id="loginBtn">
          Login
        </button>

      </nav>

    </header>


    <!-- =========================
         HERO UTAMA (JARAK LEBIH RINGKAS & COMPACT)
    ========================== -->
    <section
      class="hero"
      style="
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px 20px 0; /* Padding atas dikurangi dari 50px jadi 20px */
        box-sizing: border-box;
      "
    >

      <!-- =========================
           TEKS HERO (Bagian Atas)
      ========================== -->
      <div
        style="
          max-width: 760px;
          margin-bottom: 16px; /* Margin bawah dikurangi dari 36px jadi 16px */
        "
      >

        <!-- EYEBROW -->
        <span
          class="eyebrow"
          style="
            background: #ffffff;
            color: #334155;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 10px; /* Dikurangi dari 18px */
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 6px rgba(15,23,42,0.05);
          "
        >
          ⚯ &nbsp; Portal resmi ketenagakerjaan
        </span>


        <!-- JUDUL JOBFAIR -->
        <h1
          style="
            font-size: 42px; /* Ukuran font disesuaikan dari 54px */
            line-height: 1;
            font-weight: 800;
            color: #2563eb;
            margin: 0 0 6px 0; /* Margin dikurangi dari 12px */
            letter-spacing: -1.5px;
          "
        >
          JOBFAIR
        </h1>


        <!-- SUB JUDUL -->
        <h2
          style="
            font-size: 24px; /* Ukuran font disesuaikan dari 30px */
            line-height: 1.2;
            font-weight: 700;
            color: #102a43;
            margin: 0 0 12px 0; /* Margin dikurangi dari 22px */
            max-width: 450px;
          "
        >
          Dinas Ketenagakerjaan Kabupaten Sumenep
        </h2>


        <!-- KALIMAT PEMBUKA -->
        <p
          style="
            font-weight: 700;
            color: #102a43;
            font-size: 15px;
            margin: 0 0 4px 0; /* Margin dikurangi dari 8px */
          "
        >
          Mulai langkah kariermu dari Sumenep.
        </p>


        <!-- DESKRIPSI -->
        <p
          style="
            color: #64748b;
            font-size: 14px;
            line-height: 1.5;
            margin: 0 0 16px 0; /* Margin dikurangi dari 28px */
            max-width: 650px;
          "
        >
          Temukan lowongan terverifikasi, agenda job fair, dan informasi
          rekrutmen yang mudah dipahami—dalam satu gerbang resmi.
        </p>


        <!-- =========================
             TOMBOL HERO
        ========================== -->
        <div
          style="
            display: flex;
            gap: 12px;
            align-items: center;
            margin-bottom: 14px; /* Margin dikurangi dari 22px */
            flex-wrap: wrap;
          "
        >

          <a
            class="btn"
            href="#lowongan"
            style="
              background: #2563eb;
              color: white;
              padding: 10px 18px;
              border-radius: 10px;
              text-decoration: none;
              font-weight: 600;
              font-size: 13px;
              box-shadow: 0 4px 12px rgba(37,99,235,0.2);
            "
          >
            Jelajahi lowongan →
          </a>


          <button
            class="btn secondary"
            onclick="toast('Agenda job fair akan segera diumumkan.')"
            style="
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              color: #334155;
              padding: 10px 16px;
              border-radius: 10px;
              font-weight: 600;
              font-size: 13px;
              cursor: pointer;
            "
          >
            📅 &nbsp;Lihat agenda job fair
          </button>

        </div>


        <!-- =========================
             INFORMASI TAMBAHAN
        ========================== -->
        <div
          style="
            display: flex;
            gap: 24px;
            font-size: 12px;
            color: #64748b;
            font-weight: 500;
            flex-wrap: wrap;
          "
        >

          <span>
            ♧ &nbsp;Perusahaan diverifikasi
          </span>

          <span>
            ✓ &nbsp;Informasi tanpa biaya
          </span>

        </div>

      </div>


      <!-- ==================================================
           HERO SLIDER (FOTO COVER FULL & TOPI TIDAK TERPOTONG)
      =================================================== -->
      <div
        style="
          position: relative;
          width: 100%;
          max-width: 850px;
          height: 420px; /* Tinggi dinaikkan agar proporsional dengan rasio foto */
          margin: 10px auto 45px;
          overflow: visible;
        "
      >

        <!-- CONTAINER SLIDER -->
        <div
          class="visual-card"
          style="
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 12px 30px rgba(15,23,42,0.12);
            border: 1px solid rgba(226,232,240,0.8);
            box-sizing: border-box;
          "
        >

          <!-- SLIDE 1: logo.jpg -->
          <div class="hero-slide active" style="
            position: absolute; inset: 0; opacity: 1; z-index: 2; transition: opacity 0.8s ease-in-out;
            background: linear-gradient(180deg, rgba(15,23,42,0.02) 0%, rgba(15,23,42,0.25) 100%), url('logo.jpg') center top / cover no-repeat;
          "></div>

          <!-- SLIDE 2: logo1.jpg -->
          <div class="hero-slide" style="
            position: absolute; inset: 0; opacity: 0; z-index: 1; transition: opacity 0.8s ease-in-out;
            background: linear-gradient(180deg, rgba(15,23,42,0.02) 0%, rgba(15,23,42,0.25) 100%), url('logo1.jpg') center top / cover no-repeat;
          "></div>

          <!-- SLIDE 3: logo2.jpg -->
          <div class="hero-slide" style="
            position: absolute; inset: 0; opacity: 0; z-index: 1; transition: opacity 0.8s ease-in-out;
            background: linear-gradient(180deg, rgba(15,23,42,0.02) 0%, rgba(15,23,42,0.25) 100%), url('logo2.jpg') center top / cover no-repeat;
          "></div>

          <!-- INDIKATOR DOTS DYNAMIS -->
          <div 
            id="heroDotsContainer"
            style="
              position: absolute;
              bottom: 14px;
              right: 18px;
              display: flex;
              gap: 6px;
              z-index: 4;
              background: rgba(15,23,42,0.45);
              backdrop-filter: blur(6px);
              padding: 6px 10px;
              border-radius: 20px;
            "
          ></div>

        </div>


        <!-- ==================================================
             KARTU JOB FAIR (ELEGANT GLASSMORPHISM)
        =================================================== -->
        <div
          style="
            position: absolute;
            left: 12px;
            bottom: -20px;
            width: 250px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px);
            padding: 14px 16px;
            border-radius: 14px;
            box-shadow: 0 10px 25px rgba(15,23,42,0.14);
            border: 1px solid rgba(255, 255, 255, 0.8);
            box-sizing: border-box;
            z-index: 5;
          "
        >

          <!-- LABEL -->
          <small
            style="
              color: #2563eb;
              font-size: 9px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.8px;
            "
          >
            ● JOB FAIR BERIKUTNYA
          </small>


          <!-- NAMA TEMPAT -->
          <h4
            style="
              margin: 4px 0;
              color: #0f172a;
              font-size: 15px;
              font-weight: 700;
            "
          >
            Gedung Korpri
          </h4>


          <!-- TANGGAL -->
          <p
            style="
              margin: 3px 0 1px;
              font-size: 11px;
              color: #475569;
              font-weight: 500;
            "
          >
            ▣ &nbsp;23 September 2026
          </p>


          <!-- JAM -->
          <p
            style="
              margin: 1px 0;
              font-size: 11px;
              color: #475569;
              font-weight: 500;
            "
          >
            ◷ &nbsp;08.00–Selesai WIB
          </p>

        </div>

      </div>


    <!-- ==================================================
         STATISTIK AESTHETIC & MODERN (FLOATING CARD DESIGN)
    =================================================== -->
    <style>
      .stats-wrapper {
        width: 100%;
        max-width: 1100px;
        margin: 45px auto 20px;
        padding: 0 20px;
        box-sizing: border-box;
      }
      .stats-container {
        background: linear-gradient(135deg, #0b192c 0%, #1e293b 100%);
        border-radius: 20px;
        color: white;
        padding: 32px 28px 20px;
        box-shadow: 0 20px 40px rgba(11, 25, 44, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.08);
        position: relative;
        overflow: hidden;
      }
      /* Efek hiasan background estetik */
      .stats-container::before {
        content: '';
        position: absolute;
        top: -50px;
        right: -50px;
        width: 180px;
        height: 180px;
        background: rgba(38, 99, 235, 0.15);
        border-radius: 50%;
        filter: blur(40px);
        pointer-events: none;
      }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        width: 100%;
        box-sizing: border-box;
      }
      .stat-item {
        padding: 16px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 14px;
        transition: transform 0.25s ease, background 0.25s ease;
      }
      .stat-item:hover {
        transform: translateY(-3px);
        background: rgba(255, 255, 255, 0.06);
      }
      @media (max-width: 900px) {
        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
      }
      @media (max-width: 500px) {
        .stats-wrapper {
          padding: 0 12px;
          margin: 30px auto 15px;
        }
        .stats-grid {
          grid-template-columns: 1fr;
        }
        .stats-container {
          padding: 20px 16px 16px;
          border-radius: 16px;
        }
      }
    </style>

    <div class="stats-wrapper">
      <div class="stats-container">
        <div class="stats-grid">

          <!-- STAT 1 -->
          <div class="stat-item">
            <div style="font-size: 20px; margin-bottom: 8px; color: #38bdf8;">▤</div>
            <div style="font-size: 30px; font-weight: 800; margin-bottom: 2px; letter-spacing: -0.5px;">
              124
            </div>
            <div style="font-size: 13px; color: #94a3b8; font-weight: 500;">
              lowongan aktif
            </div>
          </div>

          <!-- STAT 2 -->
          <div class="stat-item">
            <div style="font-size: 20px; margin-bottom: 8px; color: #38bdf8;">▣</div>
            <div style="font-size: 30px; font-weight: 800; margin-bottom: 2px; letter-spacing: -0.5px;">
              36
            </div>
            <div style="font-size: 13px; color: #94a3b8; font-weight: 500;">
              perusahaan siap merekrut
            </div>
          </div>

          <!-- STAT 3 -->
          <div class="stat-item">
            <div style="font-size: 20px; margin-bottom: 8px; color: #38bdf8;">👥</div>
            <div style="font-size: 30px; font-weight: 800; margin-bottom: 2px; letter-spacing: -0.5px;">
              1.208
            </div>
            <div style="font-size: 13px; color: #94a3b8; font-weight: 500;">
              lamaran tersalurkan
            </div>
          </div>

          <!-- STAT 4 -->
          <div class="stat-item">
            <div style="font-size: 20px; margin-bottom: 8px; color: #38bdf8;">✓</div>
            <div style="font-size: 30px; font-weight: 800; margin-bottom: 2px; letter-spacing: -0.5px;">
              71%
            </div>
            <div style="font-size: 13px; color: #94a3b8; font-weight: 500;">
              profil pencari kerja lengkap
            </div>
          </div>

        </div>

        <!-- CATATAN STATISTIK -->
        <div style="text-align: right; margin-top: 18px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.06);">
          <small style="font-size: 9px; color: #64748b; letter-spacing: 0.6px; font-weight: 600;">
            DATA SIMULASI UNTUK RANCANGAN ANTARMUKA
          </small>
        </div>
      </div>
    </div>


    <!-- ==================================================
         BENEFIT GRID
    =================================================== -->
    <section class="benefit-grid">

      <div class="benefit">
        <span class="ico">✓</span>
        <b>Terpercaya</b>
        <span>
          Informasi perusahaan dan lowongan terverifikasi.
        </span>
      </div>


      <div class="benefit">
        <span class="ico">⌕</span>
        <b>Mudah Digunakan</b>
        <span>
          Pencarian lowongan cepat dan sederhana.
        </span>
      </div>


      <div class="benefit">
        <span class="ico">☆</span>
        <b>Gratis</b>
        <span>
          Layanan pendaftaran tanpa biaya.
        </span>
      </div>


      <div class="benefit">
        <span class="ico">↗️</span>
        <b>Banyak Peluang</b>
        <span>
          Berbagai sektor usaha dan posisi kerja.
        </span>
      </div>

    </section>


    <!-- ==================================================
         KEARIFAN LOKAL SUMENEP
    =================================================== -->
    <section
      class="section"
      style="
        background: var(--surface-subtle, #f8fafc);
        padding: 40px 20px;
        border-radius: 12px;
        margin: 30px 0;
      "
    >

      <div
        class="section-title"
        style="
          text-align: center;
          margin-bottom: 24px;
        "
      >

        <span class="eyebrow">
          Kearifan Lokal
        </span>

        <h2>
          Mengenal Lebih Dekat Kabupaten Sumenep
        </h2>

        <p>
          Pusat pertumbuhan ekonomi, budaya, dan peluang kerja di ujung timur Madura.
        </p>

      </div>


      <div
        style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        "
      >

        <!-- MASJID AGUNG -->
        <div
          style="
            background: white;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          "
        >

          <h4
            style="
              margin-bottom: 8px;
              color: var(--primary, #102A43);
            "
          >
            Masjid Agung Sumenep
          </h4>

          <p
            style="
              font-size: 14px;
              color: #666;
            "
          >
            Warisan arsitektur bersejarah yang menjadi ikon kebanggaan masyarakat kota.
          </p>

        </div>


        <!-- TAMAN ADIPURA -->
        <div
          style="
            background: white;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          "
        >

          <h4
            style="
              margin-bottom: 8px;
              color: var(--primary, #102A43);
            "
          >
            Taman Adipura
          </h4>

          <p
            style="
              font-size: 14px;
              color: #666;
            "
          >
            Ruang publik hijau yang asri di jantung kota Sumenep.
          </p>

        </div>


        <!-- TUGU KERIS -->
        <div
          style="
            background: white;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          "
        >

          <h4
            style="
              margin-bottom: 8px;
              color: var(--primary, #102A43);
            "
          >
            Tugu Keris Pragaan
          </h4>

          <p
            style="
              font-size: 14px;
              color: #666;
            "
          >
            Simbol karya seni, budaya, dan keteguhan tradisi lokal.
          </p>

        </div>

      </div>

    </section>


    <!-- ==================================================
         LOWONGAN TERBARU
    =================================================== -->
    <section
      class="section"
      id="lowongan"
    >

      <div class="section-title">

        <span class="eyebrow">
          Lowongan terbaru
        </span>

        <h2>
          Peluang kerja untuk masyarakat Sumenep
        </h2>

        <p>
          Temukan posisi yang sesuai pendidikan, keterampilan, dan minat Anda.
        </p>

      </div>


      <div class="job-grid">

        ${jobs.map(j => `

          <article class="job-card">

            <div class="job-logo">
              ▣
            </div>

            <div>

              <span class="tag">
                ${escapeHTML(j.type)}
              </span>

              <h3>
                ${escapeHTML(j.title)}
              </h3>

              <p>
                ${escapeHTML(j.company)}
              </p>

              <small>
                ${escapeHTML(j.location)}
                · ${j.vacancy} formasi
                · Batas ${escapeHTML(j.deadline)}
              </small>

            </div>

            <button
              class="btn small"
              onclick="showPublicJobDetail('${j.id}')"
            >
              Lihat
            </button>

          </article>

        `).join('')}

      </div>

    </section>


    <!-- ==================================================
         SEKTOR PRIORITAS PERUSAHAAN
    =================================================== -->
    <section
      class="section"
      id="perusahaan"
    >

      <div class="section-title">

        <span class="eyebrow">
          Kurasi Mitra
        </span>

        <h2>
          Sektor Usaha Prioritas di Kabupaten Sumenep
        </h2>

        <p>
          Perusahaan mitra yang berpartisipasi telah melalui verifikasi legalitas,
          kuota, dan posisi kerja.
        </p>

      </div>


      <div
        style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        "
      >

        <!-- MARITIM -->
        <div
          style="
            background: white;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          "
        >

          <h4
            style="
              color: #102A43;
              margin-bottom: 8px;
            "
          >
            Maritim, Garam & Perikanan
          </h4>

          <p
            style="
              font-size: 14px;
              color: #64748b;
            "
          >
            Operator, QC, gudang, logistik, dan penjualan dari sektor kelautan unggulan.
          </p>

        </div>


        <!-- KEUANGAN -->
        <div
          style="
            background: white;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          "
        >

          <h4
            style="
              color: #102A43;
              margin-bottom: 8px;
            "
          >
            Keuangan & BUMD
          </h4>

          <p
            style="
              font-size: 14px;
              color: #666;
            "
          >
            Teller, customer service, pemasaran, dan administrasi perbankan lokal.
          </p>

        </div>


        <!-- HOSPITALITY -->
        <div
          style="
            background: white;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          "
        >

          <h4
            style="
              color: #102A43;
              margin-bottom: 8px;
            "
          >
            Hospitality & Pariwisata
          </h4>

          <p
            style="
              font-size: 14px;
              color: #666;
            "
          >
            Front office, F&B, dan housekeeping hotel serta restoran berizin.
          </p>

        </div>


        <!-- RETAIL -->
        <div
          style="
            background: white;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          "
        >

          <h4
            style="
              color: #102A43;
              margin-bottom: 8px;
            "
          >
            Retail & Agroindustri
          </h4>

          <p
            style="
              font-size: 14px;
              color: #666;
            "
          >
            Kasir, picker, sopir, QC, dan staf pengolahan pangan/perikanan.
          </p>

        </div>

      </div>

    </section>


    <!-- ==================================================
         CTA
    =================================================== -->
    <section
      class="cta"
      id="tentang"
    >

      <div>

        <span>
          DISNAKER Kabupaten Sumenep
        </span>

        <h2>
          Mempertemukan tenaga kerja dan perusahaan dalam satu platform digital.
        </h2>

      </div>

      <button
        class="btn light"
        id="ctaLogin"
      >
        Masuk Dashboard
      </button>

    </section>


    <!-- ==================================================
         FOOTER
    =================================================== -->
    <footer class="footer">

      ${escapeHTML(
        set.footer_text || '© 2026 JobFair DISNAKER Sumenep'
      )}

    </footer>

  </div>
  `;


  // ==================================================
  // TOMBOL LOGIN HEADER
  // ==================================================
  document.getElementById('loginBtn').onclick = () => {
    setRoute('/login');
  };


  // ==================================================
  // TOMBOL LOGIN CTA
  // ==================================================
  document.getElementById('ctaLogin').onclick = () => {
    setRoute('/login');
  };

  // ==================================================
  // LOGIKA SLIDER OTOMATIS & GENERATOR DOTS DYNAMIS
  // ==================================================
  if (window.heroSliderInterval) {
    clearInterval(window.heroSliderInterval);
  }

  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.getElementById('heroDotsContainer');

  if (slides.length > 0 && dotsContainer) {
    // Generate dots secara otomatis berdasarkan jumlah slide
    dotsContainer.innerHTML = Array.from(slides).map((_, i) => `
      <span class="slide-dot" style="
        width: ${i === 0 ? '16px' : '6px'};
        height: 6px;
        background: ${i === 0 ? '#ffffff' : 'rgba(255,255,255,0.4)'};
        border-radius: ${i === 0 ? '10px' : '50%'};
        transition: all 0.3s ease;
      "></span>
    `).join('');

    let currentSlide = 0;
    const dots = dotsContainer.querySelectorAll('.slide-dot');

    window.heroSliderInterval = setInterval(() => {
      // Hide slide & reset dot saat ini
      slides[currentSlide].style.opacity = '0';
      if (dots[currentSlide]) {
        dots[currentSlide].style.width = '6px';
        dots[currentSlide].style.borderRadius = '50%';
        dots[currentSlide].style.background = 'rgba(255,255,255,0.4)';
      }

      // Berpindah ke slide berikutnya
      currentSlide = (currentSlide + 1) % slides.length;

      // Show slide & set active dot baru
      slides[currentSlide].style.opacity = '1';
      if (dots[currentSlide]) {
        dots[currentSlide].style.width = '16px';
        dots[currentSlide].style.borderRadius = '10px';
        dots[currentSlide].style.background = '#ffffff';
      }
    }, 3500); // Durasi per ganti gambar: 3.5 detik
  }

}



// --- Render Halaman Login & Register (Versi Aesthetic & Modern) ---

function renderLogin() {
  app.innerHTML = `
    <style>
      .auth-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0284c7 100%);
        padding: 24px 16px;
        box-sizing: border-box;
        font-family: system-ui, -apple-system, sans-serif;
      }
      .auth-card {
        background: #ffffff;
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.22);
        width: 100%;
        max-width: 440px;
        padding: 36px 32px;
        box-sizing: border-box;
      }
      .auth-brand {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;
      }
      .auth-brand .logo {
        width: 42px;
        height: 42px;
        background: #2563eb;
        color: white;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 18px;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
      }
      .auth-brand .title {
        font-size: 16px;
        font-weight: 700;
        color: #0f172a;
        line-height: 1.2;
      }
      .auth-brand .subtitle {
        font-size: 12px;
        color: #64748b;
      }
      .auth-tabs {
        display: flex;
        background: #f1f5f9;
        padding: 4px;
        border-radius: 12px;
        margin-bottom: 28px;
      }
      .auth-tab-btn {
        flex: 1;
        padding: 10px 16px;
        border: none;
        background: transparent;
        color: #64748b;
        font-weight: 600;
        font-size: 14px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .auth-tab-btn.active {
        background: #ffffff;
        color: #0f172a;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }
      .auth-field {
        margin-bottom: 18px;
      }
      .auth-label {
        display: block;
        font-size: 13px;
        font-weight: 600;
        color: #334155;
        margin-bottom: 6px;
      }
      .auth-input {
        width: 100%;
        padding: 12px 14px;
        border: 1,5px solid #e2e8f0;
        border-radius: 10px;
        font-size: 14px;
        color: #0f172a;
        outline: none;
        box-sizing: border-box;
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      .auth-input:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
      }
      .auth-btn-primary {
        width: 100%;
        padding: 13px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        transition: transform 0.1s, background-color 0.2s;
      }
      .auth-btn-primary:hover {
        background: #1d4ed8;
      }
      .auth-btn-primary:active {
        transform: scale(0.99);
      }
      .auth-btn-secondary {
        width: 100%;
        padding: 12px;
        background: transparent;
        color: #64748b;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 12px;
        transition: background-color 0.2s;
      }
      .auth-btn-secondary:hover {
        background: #f8fafc;
        color: #334155;
      }
      .role-selector {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-bottom: 18px;
      }
      .role-card {
        border: 1,5px solid #e2e8f0;
        border-radius: 10px;
        padding: 10px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;
      }
      .role-card.active {
        border-color: #2563eb;
        background: #eff6ff;
      }
      .role-card input {
        display: none;
      }
      .role-card span {
        display: block;
        font-size: 12px;
        font-weight: 600;
        color: #334155;
      }
    </style>

    <div class="auth-container">
      <div class="auth-card">
        
        <!-- HEADER BRANDING -->
        <div class="auth-brand">
          <div class="logo">JS</div>
          <div>
            <div class="title">JobFair DISNAKER</div>
            <div class="subtitle">Kabupaten Sumenep</div>
          </div>
        </div>

        <!-- TABS NAVIGASI -->
        <div class="auth-tabs">
          <button id="tabLoginBtn" class="auth-tab-btn active">Masuk</button>
          <button id="tabRegBtn" class="auth-tab-btn">Daftar Akun</button>
        </div>

        <!-- FORM LOGIN -->
        <form id="loginForm">
          <div class="auth-field">
            <label class="auth-label">Email</label>
            <input id="loginEmail" type="email" class="auth-input" placeholder="nama@email.com" required>
          </div>
          
          <div class="auth-field" style="margin-bottom: 24px;">
            <label class="auth-label">Password</label>
            <input id="loginPassword" type="password" class="auth-input" placeholder="••••••••" required>
          </div>

          <button class="auth-btn-primary" type="submit" id="btnSubmitLogin">Masuk Ke Dashboard →</button>
          <button class="auth-btn-secondary" type="button" onclick="setRoute('/')">← Kembali ke Beranda</button>
        </form>

        <!-- FORM REGISTRASI -->
        <form id="registerForm" style="display:none;">
          
          <!-- PILIHAN ROLE BERGAYA CARD -->
          <label class="auth-label">Tipe Pendaftaran</label>
          <div class="role-selector">
            <label class="role-card active" id="roleCardSeeker">
              <input type="radio" name="roleChoice" value="job_seeker" checked>
              <span>♟ Pencari Kerja</span>
            </label>
            <label class="role-card" id="roleCardCompany">
              <input type="radio" name="roleChoice" value="company">
              <span>▦ Perusahaan</span>
            </label>
          </div>

          <div class="auth-field">
            <label class="auth-label" id="lblFullName">Nama Lengkap (Sesuai KTP)</label>
            <input id="regFullName" type="text" class="auth-input" placeholder="Masukkan nama..." required>
          </div>

          <div class="auth-field">
            <label class="auth-label">Email Aktif</label>
            <input id="regEmail" type="email" class="auth-input" placeholder="email@aktif.com" required>
          </div>

          <div class="auth-field">
            <label class="auth-label">No. HP / WhatsApp</label>
            <input id="regPhone" type="text" class="auth-input" placeholder="081234567890">
          </div>

          <div class="auth-field" style="margin-bottom: 24px;">
            <label class="auth-label">Buat Password</label>
            <input id="regPassword" type="password" class="auth-input" placeholder="Minimal 6 karakter" required minlength="6">
          </div>

          <button class="auth-btn-primary" type="submit" id="btnSubmitReg" style="background: #059669;">Buat Akun Sekarang →</button>
        </form>

      </div>
    </div>
  `;

  // --- LOGIC SWITCH TAB & ROLE SELECTOR ---
  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabRegBtn = document.getElementById('tabRegBtn');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const cardSeeker = document.getElementById('roleCardSeeker');
  const cardCompany = document.getElementById('roleCardCompany');
  const lblFullName = document.getElementById('lblFullName');

  tabLoginBtn.onclick = () => {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    tabLoginBtn.classList.add('active');
    tabRegBtn.classList.remove('active');
  };

  tabRegBtn.onclick = () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    tabRegBtn.classList.add('active');
    tabLoginBtn.classList.remove('active');
  };

  cardSeeker.onclick = () => {
    cardSeeker.classList.add('active');
    cardCompany.classList.remove('active');
    cardSeeker.querySelector('input').checked = true;
    lblFullName.textContent = 'Nama Lengkap (Sesuai KTP)';
  };

  cardCompany.onclick = () => {
    cardCompany.classList.add('active');
    cardSeeker.classList.remove('active');
    cardCompany.querySelector('input').checked = true;
    lblFullName.textContent = 'Nama Perusahaan';
  };

  // --- SUBMIT HANDLER LOGIN ---
  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSubmitLogin');

    await runAction(btn, async () => {
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;

      const profile = await loginUser(email, password);
      toast('Login berhasil!');

      if (profile.role === 'admin') setRoute('/admin');
      else if (profile.role === 'job_seeker') setRoute('/pencaker');
      else if (profile.role === 'company') setRoute('/perusahaan');
      else setRoute('/');
    });
  };

  // --- SUBMIT HANDLER REGISTER ---
  registerForm.onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSubmitReg');
    const selectedRole = document.querySelector('input[name="roleChoice"]:checked').value;

    await runAction(btn, async () => {
      const payload = {
        role: selectedRole,
        fullName: document.getElementById('regFullName').value.trim(),
        email: document.getElementById('regEmail').value.trim(),
        phone: document.getElementById('regPhone').value.trim(),
        password: document.getElementById('regPassword').value
      };

      const role = await registerUser(payload);
      toast('Pendaftaran berhasil!');

      if (role === 'job_seeker') setRoute('/pencaker');
      else if (role === 'company') setRoute('/perusahaan');
      else setRoute('/');
    });
  };
}

