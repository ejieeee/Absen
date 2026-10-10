/**
 * app.js - Logika Interaktif Aplikasi Absensi PMR SMK Negeri 7 Samarinda
 * Dirancang untuk GitHub Pages dengan Database Cloud Supabase.
 */

// =========================================================================
// CACHE DATA & INTEGRASI SUPABASE
// =========================================================================
let dbAnggotaCache = [];
let dbAbsensiCache = [];

async function fetchMembersOnline() {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    let { data, error } = await client
      .from('tb_anggota')
      .select('*')
      .order('nama', { ascending: true });

    if (!error && data) {
      dbAnggotaCache = data.map(m => ({
        id: String(m.id),
        nama: m.nama,
        kelas: m.kelas,
        jurusanRombel: m.jurusan_rombel,
        divisi: m.divisi
      }));
    }
  } catch (err) {
    console.error("Gagal mengambil data anggota dari Supabase:", err);
  }
}

async function fetchAttendanceOnline() {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    let { data, error } = await client
      .from('tb_absensi')
      .select('*, tb_anggota(nama, kelas, jurusan_rombel, divisi)')
      .order('waktu_presensi', { ascending: false });

    if (!error && data) {
      dbAbsensiCache = data.map(a => {
        let dateTimeParts = a.waktu_presensi ? a.waktu_presensi.split('T') : ['', ''];
        let tgl = dateTimeParts[0];
        let timePart = dateTimeParts[1] ? dateTimeParts[1].substring(0, 5) : '';
        let jamWaktu = timePart ? `${timePart} WITA` : '';
        let m = a.tb_anggota || {};

        return {
          id: `PMR-${a.id}`,
          memberId: String(a.member_id),
          nama: m.nama || 'Anggota',
          kelas: m.kelas || '-',
          jurusanRombel: m.jurusan_rombel || '-',
          divisi: m.divisi || '-',
          tanggal: tgl,
          waktu: jamWaktu,
          tandaTangan: a.signature_data
        };
      });
    }
  } catch (err) {
    console.error("Gagal mengambil data absensi dari Supabase:", err);
  }
}

function getStoredMembers() {
  return dbAnggotaCache;
}

function getStoredAttendance() {
  return dbAbsensiCache;
}

// =========================================================================
// LOGIKA UTAMA APLIKASI (DOM LOADED)
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const state = {
    selectedMember: null,
    signaturePad: null,
    isSecretaryLoggedIn: false,
    activeSubView: 'absensi',
    highlightedAutocompleteIndex: -1,
    filteredAutocompleteList: []
  };

  // 1. Inisialisasi Canvas Tanda Tangan Digital
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

  // 2. Jam Digital WITA
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

  // 3. Autocomplete Nama Anggota
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
             m.jurusanRombel.toLowerCase().includes(cleanQuery);
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

      const nameEl = document.createElement('div');
      nameEl.className = 'autocomplete-item-name';
      nameEl.textContent = member.nama;

      const metaEl = document.createElement('div');
      metaEl.className = 'autocomplete-item-meta';
      metaEl.textContent = `Kelas ${member.kelas} • ${member.jurusanRombel}`;

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
    if (selectedMemberIdInput) selectedMemberIdInput.value = member.id;
    if (searchInput) searchInput.value = member.nama;
    if (dropdown) dropdown.classList.remove('show');

    const nameEl = document.getElementById('selectedMemberName');
    const classEl = document.getElementById('selectedMemberClass');
    const majorEl = document.getElementById('selectedMemberMajor');
    const divEl = document.getElementById('selectedMemberDivision');

    if (nameEl) nameEl.textContent = member.nama;
    if (classEl) classEl.textContent = member.kelas;
    if (majorEl) majorEl.textContent = member.jurusanRombel;
    if (divEl) divEl.textContent = member.divisi;

    if (selectedMemberCard) selectedMemberCard.classList.add('visible');
    if (clearSearchBtn) clearSearchBtn.style.display = 'block';
  }

  function resetMemberSelection() {
    state.selectedMember = null;
    if (selectedMemberIdInput) selectedMemberIdInput.value = '';
    if (searchInput) searchInput.value = '';
    if (selectedMemberCard) selectedMemberCard.classList.remove('visible');
    if (dropdown) dropdown.classList.remove('show');
    if (clearSearchBtn) clearSearchBtn.style.display = 'none';
    if (searchInput) searchInput.focus();
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (clearSearchBtn) clearSearchBtn.style.display = val ? 'block' : 'none';
      renderAutocomplete(val);
    });

    searchInput.addEventListener('focus', () => {
      if (searchInput.value) renderAutocomplete(searchInput.value);
    });
  }

  if (clearSearchBtn) clearSearchBtn.addEventListener('click', resetMemberSelection);
  if (changeMemberBtn) changeMemberBtn.addEventListener('click', resetMemberSelection);

  document.addEventListener('click', (e) => {
    if (searchInput && dropdown && !searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });

  // 4. Submit Absensi Anggota
  const attendanceForm = document.getElementById('attendanceForm');
  const successCard = document.getElementById('successCard');
  const resetFormBtn = document.getElementById('resetFormBtn');
  const signatureError = document.getElementById('signatureError');

  if (attendanceForm) {
    attendanceForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!state.selectedMember) {
        if (searchInput) searchInput.focus();
        alert('Silakan cari dan pilih nama anggota terlebih dahulu.');
        return;
      }

      if (state.signaturePad && state.signaturePad.isEmpty()) {
        if (signatureError) signatureError.style.display = 'block';
        if (canvasEl) canvasEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      } else if (signatureError) {
        signatureError.style.display = 'none';
      }

      const submitBtn = document.getElementById('submitAttendanceBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Mengirim...';
      }

      try {
        const client = getSupabaseClient();
        if (!client) {
          alert("Gagal terhubung ke Supabase. Periksa file supabase-config.js Anda.");
          return;
        }

        let { error } = await client.from('tb_absensi').insert([{
          member_id: parseInt(state.selectedMember.id, 10),
          signature_data: state.signaturePad.toDataURL()
        }]);

        if (!error) {
          await fetchAttendanceOnline();
          renderAbsensiTable();
          renderRekapTable();

          attendanceForm.style.display = 'none';
          const now = new Date();
          const dateStr = now.toISOString().split('T')[0];
          const jam = String(now.getHours()).padStart(2, '0');
          const menit = String(now.getMinutes()).padStart(2, '0');
          const timeFormatted = `${jam}:${menit} WITA`;

          const summaryBox = document.getElementById('successSummaryBox');
          if (summaryBox) {
            summaryBox.innerHTML = `
              <div class="summary-row">
                <span class="summary-label">Nama Anggota</span>
                <span class="summary-val">${state.selectedMember.nama}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Kelas & Rombel</span>
                <span class="summary-val">${state.selectedMember.kelas} • ${state.selectedMember.jurusanRombel}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Divisi</span>
                <span class="summary-val">${state.selectedMember.divisi}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Waktu Presensi</span>
                <span class="summary-val">${formatTanggalIndo(dateStr)} • ${timeFormatted}</span>
              </div>
            `;
          }

          if (successCard) successCard.classList.add('visible');
        } else {
          alert("Gagal mencatat absensi: " + error.message);
        }
      } catch (err) {
        console.error("Kesalahan pengiriman absensi:", err);
        alert("Terjadi kesalahan jaringan.");
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
      if (successCard) successCard.classList.remove('visible');
      if (attendanceForm) attendanceForm.style.display = 'block';
      resetMemberSelection();
      if (state.signaturePad) state.signaturePad.clear();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 5. Switcher Tab Utama (Formulir vs Sekretaris)
  const tabBtnMember = document.getElementById('tabBtnMember');
  const tabBtnSecretary = document.getElementById('tabBtnSecretary');
  const viewMember = document.getElementById('viewMember');
  const viewSecretary = document.getElementById('viewSecretary');
  const brandHomeLink = document.getElementById('brandHomeLink');

  function switchMainTab(target) {
    if (target === 'member') {
      if (tabBtnMember) {
        tabBtnMember.classList.add('active');
        tabBtnMember.setAttribute('aria-selected', 'true');
      }
      if (tabBtnSecretary) {
        tabBtnSecretary.classList.remove('active');
        tabBtnSecretary.setAttribute('aria-selected', 'false');
      }
      if (viewMember) viewMember.style.display = 'block';
      if (viewSecretary) viewSecretary.style.display = 'none';

      if (state.signaturePad) state.signaturePad.resizeCanvas();
    } else {
      if (tabBtnSecretary) {
        tabBtnSecretary.classList.add('active');
        tabBtnSecretary.setAttribute('aria-selected', 'true');
      }
      if (tabBtnMember) {
        tabBtnMember.classList.remove('active');
        tabBtnMember.setAttribute('aria-selected', 'false');
      }
      if (viewMember) viewMember.style.display = 'none';
      if (viewSecretary) viewSecretary.style.display = 'block';

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
  if (brandHomeLink) {
    brandHomeLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchMainTab('member');
    });
  }

  // 6. Login Sekretaris via Supabase
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
        const client = getSupabaseClient();
        if (!client) {
          // Fallback login lokal jika Supabase belum terkonfigurasi
          if (u === 'sekretaris' && p === 'pmr123') {
            state.isSecretaryLoggedIn = true;
            document.getElementById('secretaryLoginView').style.display = 'none';
            document.getElementById('secretaryMainView').style.display = 'block';
            renderActiveSecretaryView();
            return;
          }
        }

        let { data, error } = await client
          .from('tb_admin_sekretaris')
          .select('*')
          .eq('username', u)
          .eq('password', p)
          .single();

        if (!error && data) {
          state.isSecretaryLoggedIn = true;
          if (loginErrorMsg) loginErrorMsg.style.display = 'none';
          document.getElementById('secretaryLoginView').style.display = 'none';
          document.getElementById('secretaryMainView').style.display = 'block';
          renderActiveSecretaryView();
        } else {
          if (loginErrorMsg) {
            loginErrorMsg.style.display = 'block';
            loginErrorMsg.textContent = 'Username atau password salah.';
          }
        }
      } catch (err) {
        if (loginErrorMsg) {
          loginErrorMsg.style.display = 'block';
          loginErrorMsg.textContent = 'Gagal terhubung ke database.';
        }
      }
    });
  }

  if (secLogoutBtn) {
    secLogoutBtn.addEventListener('click', () => {
      state.isSecretaryLoggedIn = false;
      document.getElementById('secretaryLoginView').style.display = 'block';
      document.getElementById('secretaryMainView').style.display = 'none';
      if (secPasswordInput) secPasswordInput.value = '';
    });
  }

  // 7. Render Subviews Portal Sekretaris
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

    if (subviewAbsensi) subviewAbsensi.style.display = 'none';
    if (subviewAnggota) subviewAnggota.style.display = 'none';
    if (subviewRekap) subviewRekap.style.display = 'none';

    if (state.activeSubView === 'absensi') {
      if (subviewAbsensi) subviewAbsensi.style.display = 'block';
      renderAbsensiTable();
    } else if (state.activeSubView === 'anggota') {
      if (subviewAnggota) subviewAnggota.style.display = 'block';
      renderAnggotaTable();
    } else if (state.activeSubView === 'rekap') {
      if (subviewRekap) subviewRekap.style.display = 'block';
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
      tbody.innerHTML = `<tr><td colspan="6" class="empty-table-state">Belum ada data absensi.</td></tr>`;
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
        <td>${item.kelas} • ${item.jurusanRombel}</td>
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
      tbody.innerHTML = `<tr><td colspan="5" class="empty-table-state">Belum ada data anggota.</td></tr>`;
      return;
    }

    list.forEach((m, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="color: var(--text-muted); font-size: 0.8rem;">${idx + 1}</td>
        <td><strong>${m.nama}</strong></td>
        <td>${m.kelas}</td>
        <td>${m.jurusanRombel}</td>
        <td>${m.divisi}</td>
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
        <td>${m.kelas} • ${m.jurusanRombel}</td>
        <td>${m.divisi}</td>
        <td style="text-align: center; font-weight: 700; color: var(--pmr-red);">${total}</td>
        <td><span class="status-pill status-aktif">${total > 0 ? 'Aktif' : 'Belum Absen'}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  // 8. Modal Tambah Anggota (Event Delegation Aman)
  const addMemberModal = document.getElementById('addMemberModal');
  const addMemberModalCloseBtn = document.getElementById('addMemberModalCloseBtn');
  const addMemberModalCancelBtn = document.getElementById('addMemberModalCancelBtn');
  const addMemberForm = document.getElementById('addMemberForm');
  const newMemberNama = document.getElementById('newMemberNama');
  const newMemberNamaError = document.getElementById('newMemberNamaError');
  const addMemberSuccessToast = document.getElementById('addMemberSuccessToast');
  const addMemberSuccessToastText = document.getElementById('addMemberSuccessToastText');

  function openAddMemberModal() {
    if (!addMemberModal) return;
    if (newMemberNama) newMemberNama.value = '';
    if (newMemberNamaError) newMemberNamaError.style.display = 'none';

    addMemberModal.classList.add('show');
    setTimeout(() => {
      if (newMemberNama) newMemberNama.focus();
    }, 100);
  }

  function closeAddMemberModal() {
    if (addMemberModal) addMemberModal.classList.remove('show');
  }

  document.addEventListener('click', (e) => {
    const targetBtn = e.target.closest('#openAddMemberModalBtn, #headerAddMemberBtn, #absensiAddMemberPromptBtn');
    if (targetBtn) {
      e.preventDefault();
      openAddMemberModal();
    }
  });

  if (addMemberModalCloseBtn) addMemberModalCloseBtn.addEventListener('click', closeAddMemberModal);
  if (addMemberModalCancelBtn) addMemberModalCancelBtn.addEventListener('click', closeAddMemberModal);

  if (addMemberForm) {
    addMemberForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const namaVal = newMemberNama.value.trim();
      if (!namaVal) {
        if (newMemberNamaError) newMemberNamaError.style.display = 'block';
        newMemberNama.focus();
        return;
      }

      const kelasVal = document.getElementById('newMemberKelas') ? document.getElementById('newMemberKelas').value : 'X';
      const jurusanRombelVal = document.getElementById('newMemberJurusanRombel') ? document.getElementById('newMemberJurusanRombel').value : 'PPLG - X PPLG 1';
      const divisiVal = document.getElementById('newMemberDivisi') ? document.getElementById('newMemberDivisi').value : 'Litbang Jaya';

      const submitBtn = document.getElementById('saveMemberSubmitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Menyimpan...';
      }

      try {
        const client = getSupabaseClient();
        if (!client) {
          alert("Gagal terhubung ke Supabase.");
          return;
        }

        let { error } = await client.from('tb_anggota').insert([{
          nama: namaVal,
          kelas: kelasVal,
          jurusan_rombel: jurusanRombelVal,
          divisi: divisiVal
        }]);

        if (!error) {
          await fetchMembersOnline();
          closeAddMemberModal();
          renderAnggotaTable();
          renderRekapTable();

          if (addMemberSuccessToast && addMemberSuccessToastText) {
            addMemberSuccessToastText.textContent = `Anggota "${namaVal}" berhasil disimpan ke database.`;
            addMemberSuccessToast.style.display = 'block';
            setTimeout(() => { addMemberSuccessToast.style.display = 'none'; }, 5000);
          }
        } else {
          alert("Gagal menyimpan anggota: " + error.message);
        }
      } catch (err) {
        console.error("Kesalahan jaringan:", err);
        alert("Gagal menyimpan data.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Simpan Anggota ke Database';
        }
      }
    });
  }

  // 9. Inisialisasi Aplikasi saat Pertama Kali Dibuka
  async function initApp() {
    await fetchMembersOnline();
    await fetchAttendanceOnline();
    renderAnggotaTable();
    renderAbsensiTable();
    renderRekapTable();
  }

  initApp();
});