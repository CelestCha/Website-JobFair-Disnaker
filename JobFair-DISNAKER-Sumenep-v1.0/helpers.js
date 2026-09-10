// ==========================================
//      FUNGSI UTILITY & HELPER UI
// ==========================================

function escapeHTML(value='') {
  return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}
function toast(msg){const el=document.createElement('div');el.className='toast';el.textContent=msg;document.body.appendChild(el);setTimeout(()=>el.remove(),2200)}

// --- BAB 17: HELPER TOMBOL LOADING & HANDLER ERROR ---
async function runAction(button, action) {
  if (!button) {
    await action();
    return;
  }

  const old = button.textContent;
  button.disabled = true;
  button.textContent = 'Memproses...';

  try {
    await action();
  } catch (err) {
    console.error(err);
    toast(err.message || 'Terjadi kesalahan.');
  } finally {
    button.disabled = false;
    button.textContent = old;
  }
}

function setRoute(route){location.hash=route}
function currentRoute(){return (location.hash||'#/').replace(/^#/,'')}
function icon(t){return `<span aria-hidden="true">${t}</span>`}

function statusHTML(s){const cls=s==='Terverifikasi'||s==='Aktif'?'ok':s==='Menunggu'?'wait':'draft';return `<span class="status ${cls}">${escapeHTML(s)}</span>`}
function exportCSV(rows,columns,filename){const header=columns.map(c=>c[1]);const vals=rows.map(r=>columns.map(c=>`"${String(r[c[0]]??'').replaceAll('"','""')}"`));const csv=[header,...vals].map(r=>r.join(',')).join('\n');const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);toast('CSV berhasil dibuat.')}

// --- HELPER FORM MODAL (Sesuai Bab 7 Modul 4) ---
function createFormModal(title, fieldsHTML) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal">
      <div class="modal-head">
        <h3>${escapeHTML(title)}</h3>
        <button type="button" class="icon-btn" data-close>×</button>
      </div>
      <form style="display:grid;gap:10px;margin-top:16px">
        ${fieldsHTML}
        <button class="btn" type="submit">Simpan</button>
      </form>
    </div>
  `;
  document.body.appendChild(backdrop);
  backdrop.querySelector('[data-close]').onclick = () => backdrop.remove();
  backdrop.onclick = (e) => { if (e.target === backdrop) backdrop.remove(); };
  return backdrop;
}