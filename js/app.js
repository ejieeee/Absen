/**
 * app.js - Logika Interaktif Aplikasi Absensi PMR SMK Negeri 7 Samarinda
 * Dirancang dengan interaksi halus, validasi ramah pengguna, dan tanpa elemen dekoratif berlebih.
 */

// VARIABEL GLOBAL DATABASE MYSQL
let dbAnggotaCache = [];
let dbAbsensiCache = [];
let phpApiStatus = { status: 'loading', message: 'Menghubungkan ke server...' };

async function checkPhpApi() {
  try {
    let res = await fetch('api.php?action=test_connection');
    let data = await res.json();
    phpApiStatus = { status: 'success', message: data.message, host: '127.0.0.1', database: 'uks_pmr' };
  } catch (err) {
    phpApiStatus = { status: 'error', message: 'Gagal terhubung ke api.php (Pastikan XAMPP/Apache menyala)' };
  }
}

async function fetchMembersOnline() {
  try {
    let res = await fetch('api.php?action=get_anggota');
    let data = await res.json();
    if (data.status === 'success') {
      dbAnggotaCache = data.data.map(m => ({
        id: String(m.id),
        nama: m.nama,
        tingkat: m.tingkat,
        jurusan: m.jurusan,
        kelas: m.rombel,
        divisi: m.divisi,
        status: m.status_keanggotaan
      }));
    }
  } catch (err) {
    console.error("Gagal memuat anggota:", err);
  }
}

async function fetchAttendanceOnline() {
  try {
    let res = await fetch('api.php?action=get_absensi');
    let data = await res.json();
    if (data.status === 'success') {
      dbAbsensiCache = data.data.map(a => {
        let dateTimeParts = a.waktu_presensi ? a.waktu_presensi.split(' ') : ['', ''];
        let tgl = dateTimeParts[0];
        let jamWaktu = dateTimeParts[1] ? dateTimeParts[1].substring(0, 5) + ' WITA' : '';
        return {
          id: `PMR-${a.id}`,
          memberId: String(a.member_id),
          nama: a.nama,
          kelas: a.rombel,
          tingkat: a.tingkat,
          jurusan: a.jurusan,
          divisi: a.divisi,
          tanggal: tgl,
          waktu: jamWaktu,
          timestamp: a.waktu_presensi,
          tandaTangan: a.signature_data
        };
      });
    }
  } catch (err) {
    console.error("Gagal memuat absensi:", err);
  }
}

function getStoredMembers() {
  return dbAnggotaCache;
}

function getStoredAttendance() {
  return dbAbsensiCache;
}

function getDatabaseMode() {
  return 'mysql';
}

function getDatabaseStatusLabel() {
  return phpApiStatus.status === 'success' ? 'MySQL Terhubung' : 'MySQL Terputus';
}

document.addEventListener('DOMContentLoaded', () => {
  const state = {
    selectedMember: null,
    signaturePad: null,
    isSecretaryLoggedIn: false,
    activeSubView: 'absensi',
    highlightedAutocompleteIndex: -1,
    filteredAutocompleteList: []
  };

  // Inisialisasi Canvas Tanda Tangan
  const canvasEl = document.getElementById('signatureCanvas');
  if (canvasEl) {
    state.signaturePad = new SignaturePad(canvasEl, {
      strokeColor: '#18181B',
      lineWidth: 2.2,
      onStrokeEnd: () => {
        const errorEl = document.getElementById('signatureError');
        if (errorEl) errorEl.style.display = 'none';
      }
    });
  }

  const clearSigBtn = document.getElementById('clearSignatureBtn');
  if (clearSigBtn && state.signaturePad) {
    clearSigBtn.addEventListener('click', () => {
      state.signaturePad.clear();
    });
  }

  // Waktu Live (WITA)
  function updateLiveClock() {
    const clockEl = document.getElementById('liveDateTimeText');
    if (!clockEl) return;

    const now = new Date();
    const hariNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const bulanNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const hari = hariNames[now.getDay()];
    const tgl = now.getDate();
    const bln = bulanNames[now.getMonth()];
    const thn = now.getFullYear();

    const jam = String(now.getHours()).padStart(2, '0');
    const menit = String(now.getMinutes()).padStart(2, '0');
    const detik = String(now.getSeconds()).padStart(2, '0');

    clockEl.textContent = `${hari}, ${tgl} ${bln} ${thn} • ${jam}:${menit}:${detik} WITA`;
  }
  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  // Pencarian & Autocomplete Nama Anggota
  const searchInput = document.getElementById('memberSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const dropdown = document.getElementById('autocompleteDropdown');
  const selectedMemberCard = document.getElementById('selectedMemberCard');
  const selectedMemberIdInput = document.getElementById('selectedMemberId');
  const changeMemberBtn = document.getElementById('changeMemberBtn');

  function renderAutocomplete(query) {
    const cleanQuery = query.trim().toLowerCase();
    dropdown.innerHTML = '';
    state.highlightedAutocompleteIndex = -1;

    if (!cleanQuery) {
      dropdown.classList.remove('show');
      state.filteredAutocompleteList = [];
      return;
    }

    const allMembers = getStoredMembers();
    state.filteredAutocompleteList = allMembers.filter(m => {
      return m.nama.toLowerCase().includes(cleanQuery) ||
             m.kelas.toLowerCase().includes(cleanQuery) ||
             m.jurusan.toLowerCase().includes(cleanQuery);
    });

    if (state.filteredAutocompleteList.length === 0) {
      const emptyItem = document.createElement('div');
      emptyItem.className = 'autocomplete-empty';
      emptyItem.innerHTML = `
        <div>Nama anggota tidak ditemukan dalam daftar PMR.</div>
        <div style="margin-top: 6px; font-size: 0.78rem; color: var(--text-muted);">Belum terdaftar?</div>
        <button type="button" class="btn-secondary" id="autocompleteAddMemberBtn" style="margin-top: 6px; font-size: 0.8rem; padding: 4px 10px; width: 100%;">
          + Tambah Anggota Secara Manual
        </button>
      `;
      const autoAddBtn = emptyItem.querySelector('#autocompleteAddMemberBtn');
      if (autoAddBtn) {
        autoAddBtn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          dropdown.classList.remove('show');
          openAddMemberModal();
          if (newMemberNama) {
            newMemberNama.value = query.trim();
          }
        });
      }
      dropdown.appendChild(emptyItem);
      dropdown.classList.add('show');
      return;
    }

    state.filteredAutocompleteList.forEach((member, index) => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.setAttribute('role', 'option');
      item.setAttribute('data-index', index);

      const nameEl = document.createElement('div');
      nameEl.className = 'autocomplete-item-name';
      nameEl.textContent = member.nama;

      const metaEl = document.createElement('div');
      metaEl.className = 'autocomplete-item-meta';
      const jurObj = JURUSAN_LIST.find(j => j.id === member.jurusan);
      const jurNama = jurObj ? jurObj.nama : member.jurusan;
      metaEl.textContent = `Kelas ${member.kelas} • ${jurNama}`;

      item.appendChild(nameEl);
      item.appendChild(metaEl);

      item.addEventListener('click', () => {
        selectMember(member);
      });

      dropdown.appendChild(item);
    });

    dropdown.classList.add('show');
  }

  function selectMember(member) {
    state.selectedMember = member;
    selectedMemberIdInput.value = member.id;
    searchInput.value = member.nama;
    dropdown.classList.remove('show');

    document.getElementById('selectedMemberName').textContent = member.nama;
    document.getElementById('selectedMemberClass').textContent = member.kelas;
    
    const jurObj = JURUSAN_LIST.find(j => j.id === member.jurusan);
    document.getElementById('selectedMemberMajor').textContent = jurObj ? jurObj.nama : member.jurusan;
    document.getElementById('selectedMemberDivision').textContent = member.divisi;

    selectedMemberCard.classList.add('visible');
    clearSearchBtn.style.display = 'block';
  }

  function resetMemberSelection() {
    state.selectedMember = null;
    selectedMemberIdInput.value = '';
    searchInput.value = '';
    selectedMemberCard.classList.remove('visible');
    dropdown.classList.remove('show');
    clearSearchBtn.style.display = 'none';
    searchInput.focus();
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      clearSearchBtn.style.display = val ? 'block' : 'none';
      renderAutocomplete(val);
    });

    searchInput.addEventListener('focus', () => {
      if (searchInput.value) {
        renderAutocomplete(searchInput.value);
      }
    });
  }

  if (clearSearchBtn) clearSearchBtn.addEventListener('click', resetMemberSelection);
  if (changeMemberBtn) changeMemberBtn.addEventListener('click', resetMemberSelection);

  document.addEventListener('click', (e) => {
    if (searchInput && dropdown && !searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });

  // Submit Formulir Absensi
  const attendanceForm = document.getElementById('attendanceForm');
  const successCard = document.getElementById('successCard');
  const resetFormBtn = document.getElementById('resetFormBtn');
  const signatureError = document.getElementById('signatureError');

  if (attendanceForm) {
    attendanceForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!state.selectedMember) {
        searchInput.focus();
        alert('Silakan cari dan pilih nama anggota terlebih dahulu.');
        return;
      }

      if (state.signaturePad.isEmpty()) {
        signatureError.style.display = 'block';
        canvasEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      } else {
        signatureError.style.display = 'none';
      }

      const submitBtn = document.getElementById('submitAttendanceBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Mengirim...';
      }

      try {
        let res = await fetch('api.php?action=add_absensi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            member_id: parseInt(state.selectedMember.id, 10),
            signature_data: state.signaturePad.toDataURL()
          })
        });

        let data = await res.json();
        if (data.status === 'success') {
          await fetchAttendanceOnline();
          renderAbsensiTable();
          renderRekapTable();

          attendanceForm.style.display = 'none';
          const now = new Date();
          const dateStr = now.toISOString().split('T')[0];
          const jam = String(now.getHours()).padStart(2, '0');
          const menit = String(now.getMinutes()).padStart(2, '0');
          const timeFormatted = `${jam}:${menit} WITA`;

          const jurObj = JURUSAN_LIST.find(j => j.id === state.selectedMember.jurusan);
          const jurNama = jurObj ? jurObj.nama : state.selectedMember.jurusan;

          document.getElementById('successSummaryBox').innerHTML = `
            <div class="summary-row">
              <span class="summary-label">Nama Anggota</span>
              <span class="summary-val">${state.selectedMember.nama}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Kelas & Rombel</span>
              <span class="summary-val">${state.selectedMember.kelas} (${jurNama})</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Divisi</span>
              <span class="summary-val">${state.selectedMember.divisi}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Waktu Tercatat</span>
              <span class="summary-val">${formatTanggalIndo(dateStr)} • ${timeFormatted}</span>
            </div>
          `;

          successCard.classList.add('visible');
        } else {
          alert("Gagal: " + data.message);
        }
      } catch (err) {
        console.error("Kesalahan jaringan:", err);
        alert("Gagal terhubung ke server api.php.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Kirim Absensi';
        }
      }
    });
  }

  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      successCard.classList.remove('visible');
      attendanceForm.style.display = 'block';
      resetMemberSelection();
      state.signaturePad.clear();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Switcher Tab Utama (Formulir Anggota vs Portal Sekretaris)
  const tabBtnMember = document.getElementById('tabBtnMember');
  const tabBtnSecretary = document.getElementById('tabBtnSecretary');
  const viewMember = document.getElementById('viewMember');
  const viewSecretary = document.getElementById('viewSecretary');
  const brandHomeLink = document.getElementById('brandHomeLink');

  function switchMainTab(target) {
    if (target === 'member') {
      tabBtnMember.classList.add('active');
      tabBtnMember.setAttribute('aria-selected', 'true');
      tabBtnSecretary.classList.remove('active');
      tabBtnSecretary.setAttribute('aria-selected', 'false');

      viewMember.style.display = 'block';
      viewSecretary.style.display = 'none';

      if (state.signaturePad) {
        state.signaturePad.resizeCanvas();
      }
    } else {
      tabBtnSecretary.classList.add('active');
      tabBtnSecretary.setAttribute('aria-selected', 'true');
      tabBtnMember.classList.remove('active');
      tabBtnMember.setAttribute('aria-selected', 'false');

      viewMember.style.display = 'none';
      viewSecretary.style.display = 'block';

      if (state.isSecretaryLoggedIn) {
        document.getElementById('secretaryLoginView').style.display = 'none';
        document.getElementById('secretaryMainView').style.display = 'block';
        renderActiveSecretaryView();
      } else {
        document.getElementById('secretaryLoginView').style.display = 'block';
        document.getElementById('secretaryMainView').style.display = 'none';
      }
    }
  }

  if (tabBtnMember) tabBtnMember.addEventListener('click', () => switchMainTab('member'));
  if (tabBtnSecretary) tabBtnSecretary.addEventListener('click', () => switchMainTab('secretary'));
  if (brandHomeLink) brandHomeLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchMainTab('member');
  });

  // Login & Logout Sekretaris
  const secretaryLoginForm = document.getElementById('secretaryLoginForm');
  const secUsernameInput = document.getElementById('secUsername');
  const secPasswordInput = document.getElementById('secPassword');
  const loginErrorMsg = document.getElementById('loginErrorMsg');
  const secLogoutBtn = document.getElementById('secLogoutBtn');

  if (secretaryLoginForm) {
    secretaryLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const u = secUsernameInput.value.trim();
      const p = secPasswordInput.value.trim();

      try {
        let res = await fetch('api.php?action=login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: u, password: p })
        });
        let data = await res.json();
        if (data.status === 'success') {
          state.isSecretaryLoggedIn = true;
          loginErrorMsg.style.display = 'none';
          document.getElementById('secretaryLoginView').style.display = 'none';
          document.getElementById('secretaryMainView').style.display = 'block';
          populateAdminFilterDropdowns();
          renderActiveSecretaryView();
        } else {
          loginErrorMsg.style.display = 'block';
          loginErrorMsg.textContent = data.message;
        }
      } catch (err) {
        console.error("Login error:", err);
        loginErrorMsg.style.display = 'block';
        loginErrorMsg.textContent = 'Gagal terhubung ke server.';
      }
    });
  }

  if (secLogoutBtn) {
    secLogoutBtn.addEventListener('click', () => {
      state.isSecretaryLoggedIn = false;
      document.getElementById('secretaryLoginView').style.display = 'block';
      document.getElementById('secretaryMainView').style.display = 'none';
      secPasswordInput.value = '';
    });
  }

  // Populasi Filter Dropdowns Sekretaris
  function populateAdminFilterDropdowns() {
    const rombelSelects = [
      document.getElementById('filterAbsensiRombel'),
      document.getElementById('filterAnggotaRombel')
    ];

    rombelSelects.forEach(sel => {
      if (!sel) return;
      sel.innerHTML = '<option value="all">Semua Rombel</option>';
      ROMBEL_LIST.forEach(r => {
        const opt = document.createElement('option');
        opt.value = r.id;
        opt.textContent = r.label;
        sel.appendChild(opt);
      });
    });

    const divisiSelects = [
      document.getElementById('filterAbsensiDivisi'),
      document.getElementById('filterAnggotaDivisi'),
      document.getElementById('filterRekapDivisi')
    ];

    divisiSelects.forEach(sel => {
      if (!sel) return;
      sel.innerHTML = '<option value="all">Semua Divisi</option>';
      DIVISI_LIST.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = d;
        sel.appendChild(opt);
      });
    });
  }

  // Sub-nav Sekretaris
  const subnavLinks = document.querySelectorAll('.subnav-link');
  subnavLinks.forEach(link => {
    link.addEventListener('click', () => {
      subnavLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      state.activeSubView = link.getAttribute('data-subview');
      renderActiveSecretaryView();
    });
  });

  function renderActiveSecretaryView() {
    const subviewAbsensi = document.getElementById('subviewAbsensi');
    const subviewAnggota = document.getElementById('subviewAnggota');
    const subviewRekap = document.getElementById('subviewRekap');

    const titleEl = document.getElementById('secretarySectionTitle');
    const subEl = document.getElementById('secretarySectionSubtitle');
    const exportBtn = document.getElementById('exportCsvBtn');

    if (subviewAbsensi) subviewAbsensi.style.display = 'none';
    if (subviewAnggota) subviewAnggota.style.display = 'none';
    if (subviewRekap) subviewRekap.style.display = 'none';

    if (state.activeSubView === 'absensi') {
      if (subviewAbsensi) subviewAbsensi.style.display = 'block';
      if (titleEl) titleEl.textContent = 'Absensi Anggota';
      if (subEl) subEl.textContent = 'Daftar catatan kehadiran latihan rutin dan kegiatan PMR';
      if (exportBtn) {
        exportBtn.style.display = 'inline-flex';
        exportBtn.textContent = 'Ekspor Absensi (CSV)';
      }
      renderAbsensiTable();
    } else if (state.activeSubView === 'anggota') {
      if (subviewAnggota) subviewAnggota.style.display = 'block';
      if (titleEl) titleEl.textContent = 'Data Anggota PMR';
      if (subEl) subEl.textContent = 'Struktur anggota resmi PMR Wira SMK Negeri 7 Samarinda';
      if (exportBtn) {
        exportBtn.style.display = 'inline-flex';
        exportBtn.textContent = 'Ekspor Anggota (CSV)';
      }
      renderAnggotaTable();
    } else if (state.activeSubView === 'rekap') {
      if (subviewRekap) subviewRekap.style.display = 'block';
      if (titleEl) titleEl.textContent = 'Rekap Kehadiran';
      if (subEl) subEl.textContent = 'Rekapitulasi total keikutsertaan kegiatan per anggota';
      if (exportBtn) exportBtn.style.display = 'none';
      renderRekapTable();
    }
  }

  // Render Tabel Absensi
  function renderAbsensiTable() {
    const tbody = document.getElementById('absensiTableBody');
    const countEl = document.getElementById('absensiCountText');
    if (!tbody) return;

    const list = getStoredAttendance();
    tbody.innerHTML = '';
    if (countEl) countEl.textContent = `Menampilkan ${list.length} catatan kehadiran`;

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-table-state">Tidak ada catatan absensi.</td></tr>`;
      return;
    }

    list.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="white-space: nowrap;">
          <div style="font-weight: 600; font-size: 0.86rem;">${item.waktu}</div>
          <div style="font-size: 0.76rem; color: var(--text-muted);">${formatTanggalPendek(item.tanggal)}</div>
        </td>
        <td><strong>${item.nama}</strong></td>
        <td>${item.kelas}</td>
        <td>${item.divisi}</td>
        <td>${item.tandaTangan ? `<img src="${item.tandaTangan}" alt="TTD" class="table-signature-thumb">` : '-'}</td>
        <td style="text-align: right;"><button type="button" class="btn-action-table">Detail</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Render Tabel Anggota
  function renderAnggotaTable() {
    const tbody = document.getElementById('anggotaTableBody');
    const countEl = document.getElementById('anggotaCountText');
    if (!tbody) return;

    const list = getStoredMembers();
    tbody.innerHTML = '';
    if (countEl) countEl.textContent = `Menampilkan ${list.length} anggota resmi`;

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-table-state">Tidak ada data anggota.</td></tr>`;
      return;
    }

    list.forEach((m, idx) => {
      const tr = document.createElement('tr');
      const jurObj = JURUSAN_LIST.find(j => j.id === m.jurusan);
      const jurNama = jurObj ? jurObj.nama : m.jurusan;
      tr.innerHTML = `
        <td style="color: var(--text-muted); font-size: 0.8rem;">${idx + 1}</td>
        <td><strong>${m.nama}</strong></td>
        <td>${m.kelas}</td>
        <td>${jurNama}</td>
        <td>${m.divisi}</td>
        <td><span class="status-pill status-aktif">${m.status}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Render Tabel Rekap
  function renderRekapTable() {
    const tbody = document.getElementById('rekapTableBody');
    const countEl = document.getElementById('rekapCountText');
    if (!tbody) return;

    const members = getStoredMembers();
    const attendance = getStoredAttendance();
    tbody.innerHTML = '';
    if (countEl) countEl.textContent = `Rekapitulasi ${members.length} anggota PMR`;

    members.forEach((m, idx) => {
      const records = attendance.filter(a => a.memberId === m.id || a.nama === m.nama);
      const total = records.length;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="color: var(--text-muted); font-size: 0.8rem;">${idx + 1}</td>
        <td><strong>${m.nama}</strong></td>
        <td>${m.kelas}</td>
        <td>${m.divisi}</td>
        <td style="text-align: center;">${total}</td>
        <td style="text-align: center;">0</td>
        <td style="text-align: center;">0</td>
        <td style="text-align: center; font-weight: 700; color: var(--pmr-red);">${total}</td>
        <td><span class="status-pill status-aktif">${total > 0 ? 'Aktif' : 'Belum Absen'}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  // =========================================================================
  // MODAL 3: TAMBAH ANGGOTA BARU (PORTAL SEKRETARIS)
  // =========================================================================
  const openAddMemberModalBtn = document.getElementById('openAddMemberModalBtn');
  const headerAddMemberBtn = document.getElementById('headerAddMemberBtn');
  const absensiAddMemberPromptBtn = document.getElementById('absensiAddMemberPromptBtn');
  const addMemberModal = document.getElementById('addMemberModal');
  const addMemberModalCloseBtn = document.getElementById('addMemberModalCloseBtn');
  const addMemberModalCancelBtn = document.getElementById('addMemberModalCancelBtn');
  const addMemberForm = document.getElementById('addMemberForm');
  const newMemberNama = document.getElementById('newMemberNama');
  const newMemberNamaError = document.getElementById('newMemberNamaError');
  const newMemberTingkat = document.getElementById('newMemberTingkat');
  const newMemberJurusan = document.getElementById('newMemberJurusan');
  const newMemberRombel = document.getElementById('newMemberRombel');
  const newMemberDivisi = document.getElementById('newMemberDivisi');
  const addMemberSuccessToast = document.getElementById('addMemberSuccessToast');
  const addMemberSuccessToastText = document.getElementById('addMemberSuccessToastText');

  function updateNewMemberRombelOptions() {
    if (!newMemberRombel || !newMemberTingkat || !newMemberJurusan) return;
    const selectedTingkat = newMemberTingkat.value;
    const selectedJurusan = newMemberJurusan.value;

    const matchingRombels = ROMBEL_LIST.filter(r => r.tingkat === selectedTingkat && r.jurusan === selectedJurusan);
    newMemberRombel.innerHTML = '';
    matchingRombels.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.id;
      opt.textContent = r.label;
      newMemberRombel.appendChild(opt);
    });
  }

  function openAddMemberModal() {
    if (!addMemberModal) return;
    if (newMemberNama) newMemberNama.value = '';
    if (newMemberNamaError) newMemberNamaError.style.display = 'none';

    if (newMemberDivisi) {
      newMemberDivisi.innerHTML = '';
      DIVISI_LIST.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = d;
        newMemberDivisi.appendChild(opt);
      });
    }

    if (newMemberTingkat) newMemberTingkat.value = 'X';
    if (newMemberJurusan) newMemberJurusan.value = 'PPLG';
    updateNewMemberRombelOptions();

    addMemberModal.classList.add('show');
    setTimeout(() => {
      if (newMemberNama) newMemberNama.focus();
    }, 100);
  }

  function closeAddMemberModal() {
    if (addMemberModal) addMemberModal.classList.remove('show');
  }

  if (openAddMemberModalBtn) {
    openAddMemberModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAddMemberModal();
    });
  }

  if (headerAddMemberBtn) {
    headerAddMemberBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAddMemberModal();
    });
  }

  if (absensiAddMemberPromptBtn) {
    absensiAddMemberPromptBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAddMemberModal();
    });
  }

  if (addMemberModalCloseBtn) addMemberModalCloseBtn.addEventListener('click', closeAddMemberModal);
  if (addMemberModalCancelBtn) addMemberModalCancelBtn.addEventListener('click', closeAddMemberModal);

  if (newMemberTingkat) newMemberTingkat.addEventListener('change', updateNewMemberRombelOptions);
  if (newMemberJurusan) newMemberJurusan.addEventListener('change', updateNewMemberRombelOptions);

  if (addMemberForm) {
    addMemberForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const namaVal = newMemberNama.value.trim();
      if (!namaVal) {
        if (newMemberNamaError) newMemberNamaError.style.display = 'block';
        newMemberNama.focus();
        return;
      }

      const submitBtn = document.getElementById('saveMemberSubmitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Menyimpan...';
      }

      try {
        let res = await fetch('api.php?action=add_anggota', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nama: namaVal,
            tingkat: newMemberTingkat.value,
            jurusan: newMemberJurusan.value,
            rombel: newMemberRombel.value,
            divisi: newMemberDivisi.value,
            status_keanggotaan: document.getElementById('newMemberStatus').value
          })
        });

        let data = await res.json();
        if (data.status === 'success') {
          await fetchMembersOnline();
          closeAddMemberModal();
          renderAnggotaTable();
          renderRekapTable();

          if (addMemberSuccessToast && addMemberSuccessToastText) {
            addMemberSuccessToastText.textContent = `Anggota "${namaVal}" berhasil disimpan ke database MySQL.`;
            addMemberSuccessToast.style.display = 'block';
            setTimeout(() => { addMemberSuccessToast.style.display = 'none'; }, 5000);
          }
        } else {
          alert("Gagal: " + data.message);
        }
      } catch (err) {
        console.error("Kesalahan jaringan:", err);
        alert("Gagal terhubung ke server api.php.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Simpan Anggota ke Database';
        }
      }
    });
  }

  // Inisialisasi Data Awal dari Database
  async function initApp() {
    await checkPhpApi();
    await fetchMembersOnline();
    await fetchAttendanceOnline();
    renderAnggotaTable();
    renderAbsensiTable();
    renderRekapTable();
  }

  initApp();
});