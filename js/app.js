/**
 * app.js - Logika Interaktif Aplikasi Absensi PMR SMK Negeri 7 Samarinda
 * Dirancang dengan interaksi halus, validasi ramah pengguna, dan tanpa elemen dekoratif berlebih.
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================
  const state = {
    selectedMember: null,
    selectedActivity: 'Latihan Rutin',
    signaturePad: null,
    isSecretaryLoggedIn: false,
    activeSubView: 'absensi',
    highlightedAutocompleteIndex: -1,
    filteredAutocompleteList: []
  };

  // =========================================================================
  // INISIALISASI CANVAS TANDA TANGAN
  // =========================================================================
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

  // Tombol Hapus Tanda Tangan
  const clearSigBtn = document.getElementById('clearSignatureBtn');
  if (clearSigBtn && state.signaturePad) {
    clearSigBtn.addEventListener('click', () => {
      state.signaturePad.clear();
    });
  }

  // =========================================================================
  // WAKTU LIVE & SIMULASI WAKTU OTOMATIS (WITA)
  // =========================================================================
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

  // =========================================================================
  // RENDER JENIS KEGIATAN DI FORMULIR
  // =========================================================================
  const activityRadioGroup = document.getElementById('activityRadioGroup');
  if (activityRadioGroup) {
    activityRadioGroup.innerHTML = '';
    JENIS_KEGIATAN_LIST.forEach((kegiatan, index) => {
      const isChecked = index === 0;
      const label = document.createElement('label');
      label.className = `activity-radio-label ${isChecked ? 'selected' : ''}`;

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'jenisKegiatan';
      radio.value = kegiatan.id;
      radio.checked = isChecked;

      radio.addEventListener('change', () => {
        document.querySelectorAll('.activity-radio-label').forEach(el => el.classList.remove('selected'));
        label.classList.add('selected');
        state.selectedActivity = kegiatan.id;
      });

      const textWrap = document.createElement('div');
      textWrap.className = 'activity-text-wrap';

      const title = document.createElement('div');
      title.className = 'activity-text-title';
      title.textContent = kegiatan.label;

      const desc = document.createElement('div');
      desc.className = 'activity-text-desc';
      desc.textContent = kegiatan.deskripsi;

      textWrap.appendChild(title);
      textWrap.appendChild(desc);

      label.appendChild(radio);
      label.appendChild(textWrap);

      activityRadioGroup.appendChild(label);
    });
  }

  // =========================================================================
  // PENCARIAN & AUTOCOMPLETE NAMA ANGGOTA
  // =========================================================================
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
      emptyItem.textContent = 'Nama anggota tidak ditemukan dalam daftar PMR.';
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

    // Tampilkan informasi read-only
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

    // Keyboard navigation (Arrow Up, Down, Enter, Esc)
    searchInput.addEventListener('keydown', (e) => {
      const items = dropdown.querySelectorAll('.autocomplete-item');
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        state.highlightedAutocompleteIndex = (state.highlightedAutocompleteIndex + 1) % items.length;
        updateHighlightedItem(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        state.highlightedAutocompleteIndex = (state.highlightedAutocompleteIndex - 1 + items.length) % items.length;
        updateHighlightedItem(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (state.highlightedAutocompleteIndex >= 0 && state.filteredAutocompleteList[state.highlightedAutocompleteIndex]) {
          selectMember(state.filteredAutocompleteList[state.highlightedAutocompleteIndex]);
        }
      } else if (e.key === 'Escape') {
        dropdown.classList.remove('show');
      }
    });
  }

  function updateHighlightedItem(items) {
    items.forEach((item, idx) => {
      if (idx === state.highlightedAutocompleteIndex) {
        item.classList.add('highlighted');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('highlighted');
      }
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', resetMemberSelection);
  }

  if (changeMemberBtn) {
    changeMemberBtn.addEventListener('click', resetMemberSelection);
  }

  // Tutup dropdown jika klik di luar
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });

  // =========================================================================
  // MODAL LOGIKA: KONFIRMASI RINGKASAN SEBELUM KIRIM
  // =========================================================================
  const confirmModal = document.getElementById('confirmModal');
  const confirmModalCloseBtn = document.getElementById('confirmModalCloseBtn');
  const confirmModalCancelBtn = document.getElementById('confirmModalCancelBtn');
  const confirmModalProceedBtn = document.getElementById('confirmModalProceedBtn');
  const confirmModalContent = document.getElementById('confirmModalContent');
  const confirmModalSignatureImg = document.getElementById('confirmModalSignatureImg');

  function openConfirmModal() {
    if (!state.selectedMember) return;

    const now = new Date();
    const dateFormatted = formatTanggalIndo(now.toISOString().split('T')[0]);
    const jam = String(now.getHours()).padStart(2, '0');
    const menit = String(now.getMinutes()).padStart(2, '0');
    const timeFormatted = `${jam}:${menit} WITA`;

    const jurObj = JURUSAN_LIST.find(j => j.id === state.selectedMember.jurusan);
    const jurNama = jurObj ? jurObj.nama : state.selectedMember.jurusan;

    confirmModalContent.innerHTML = `
      <div class="summary-row">
        <span class="summary-label">Nama Anggota</span>
        <span class="summary-val">${state.selectedMember.nama}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Kelas & Rombel</span>
        <span class="summary-val">${state.selectedMember.kelas}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Jurusan</span>
        <span class="summary-val">${jurNama}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Divisi PMR</span>
        <span class="summary-val">${state.selectedMember.divisi}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Jenis Kegiatan</span>
        <span class="summary-val">${state.selectedActivity}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Waktu Presensi</span>
        <span class="summary-val">${dateFormatted} • ${timeFormatted}</span>
      </div>
    `;

    confirmModalSignatureImg.src = state.signaturePad.toDataURL();
    confirmModal.classList.add('show');
  }

  function closeConfirmModal() {
    confirmModal.classList.remove('show');
  }

  if (confirmModalCloseBtn) confirmModalCloseBtn.addEventListener('click', closeConfirmModal);
  if (confirmModalCancelBtn) confirmModalCancelBtn.addEventListener('click', closeConfirmModal);

  // =========================================================================
  // SUBMIT FORMULIR ABSENSI
  // =========================================================================
  const attendanceForm = document.getElementById('attendanceForm');
  const successCard = document.getElementById('successCard');
  const resetFormBtn = document.getElementById('resetFormBtn');
  const signatureError = document.getElementById('signatureError');

  if (attendanceForm) {
    attendanceForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validasi 1: Anggota harus dipilih
      if (!state.selectedMember) {
        searchInput.focus();
        alert('Silakan cari dan pilih nama anggota terlebih dahulu.');
        return;
      }

      // Validasi 2: Tanda tangan tidak boleh kosong
      if (state.signaturePad.isEmpty()) {
        signatureError.style.display = 'block';
        canvasEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      } else {
        signatureError.style.display = 'none';
      }

      // Tampilkan ringkasan sebelum pengiriman
      openConfirmModal();
    });
  }

  // Tombol Kirim Sekarang di Modal Konfirmasi
  if (confirmModalProceedBtn) {
    confirmModalProceedBtn.addEventListener('click', () => {
      closeConfirmModal();

      const now = new Date();
      const jam = String(now.getHours()).padStart(2, '0');
      const menit = String(now.getMinutes()).padStart(2, '0');
      const timeFormatted = `${jam}:${menit} WITA`;
      const dateStr = now.toISOString().split('T')[0];
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const recordId = `PMR-${dateStr.replace(/-/g, '')}-${randomSuffix}`;

      // Buat record presensi baru
      const newRecord = {
        id: recordId,
        memberId: state.selectedMember.id,
        nama: state.selectedMember.nama,
        kelas: state.selectedMember.kelas,
        tingkat: state.selectedMember.tingkat,
        jurusan: state.selectedMember.jurusan,
        divisi: state.selectedMember.divisi,
        jenisKegiatan: state.selectedActivity,
        tanggal: dateStr,
        waktu: timeFormatted,
        timestamp: now.toISOString(),
        tandaTangan: state.signaturePad.toDataURL()
      };

      // Simpan ke dataset
      saveAttendanceRecord(newRecord);

      // Tampilkan State Sukses
      attendanceForm.style.display = 'none';

      const jurObj = JURUSAN_LIST.find(j => j.id === state.selectedMember.jurusan);
      const jurNama = jurObj ? jurObj.nama : state.selectedMember.jurusan;

      document.getElementById('successSummaryBox').innerHTML = `
        <div class="summary-row">
          <span class="summary-label">Kode Referensi</span>
          <span class="summary-val" style="font-family: var(--font-mono); font-size: 0.82rem;">${recordId}</span>
        </div>
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
          <span class="summary-label">Kegiatan</span>
          <span class="summary-val">${state.selectedActivity}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Waktu Tercatat</span>
          <span class="summary-val">${formatTanggalIndo(dateStr)} • ${timeFormatted}</span>
        </div>
      `;

      successCard.classList.add('visible');

      // Segarkan tabel admin jika sedang dibuka di latar
      renderAbsensiTable();
      renderRekapTable();
    });
  }

  // Tombol Catat Absensi Lain (Reset Formulir)
  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      successCard.classList.remove('visible');
      attendanceForm.style.display = 'block';
      resetMemberSelection();
      state.signaturePad.clear();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // SWITCHER TAB UTAMA (FORMULIR ANGGOTA VS PORTAL SEKRETARIS)
  // =========================================================================
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

      // Pastikan canvas tetap terkalibrasi jika kembali ke formulir
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

      // Cek status login
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

  // =========================================================================
  // PORTAL SEKRETARIS: LOGIN & LOGOUT
  // =========================================================================
  const secretaryLoginForm = document.getElementById('secretaryLoginForm');
  const secUsernameInput = document.getElementById('secUsername');
  const secPasswordInput = document.getElementById('secPassword');
  const loginErrorMsg = document.getElementById('loginErrorMsg');
  const secLogoutBtn = document.getElementById('secLogoutBtn');

  if (secretaryLoginForm) {
    secretaryLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = secUsernameInput.value.trim();
      const p = secPasswordInput.value.trim();

      // Kredensial simulasi sederhana
      if (u === 'sekretaris' && p === 'pmr123') {
        state.isSecretaryLoggedIn = true;
        loginErrorMsg.style.display = 'none';
        document.getElementById('secretaryLoginView').style.display = 'none';
        document.getElementById('secretaryMainView').style.display = 'block';
        populateAdminFilterDropdowns();
        renderActiveSecretaryView();
      } else {
        loginErrorMsg.style.display = 'block';
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

  // =========================================================================
  // POPULASI FILTER DROPDOWNS SEKRETARIS
  // =========================================================================
  function populateAdminFilterDropdowns() {
    // 1. Rombel filter (Semua 16 Rombel)
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

    // 2. Divisi filter
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

    // 3. Kegiatan filter
    const kegiatanSel = document.getElementById('filterAbsensiKegiatan');
    if (kegiatanSel) {
      kegiatanSel.innerHTML = '<option value="all">Semua Kegiatan</option>';
      JENIS_KEGIATAN_LIST.forEach(k => {
        const opt = document.createElement('option');
        opt.value = k.id;
        opt.textContent = k.label;
        kegiatanSel.appendChild(opt);
      });
    }
  }

  // =========================================================================
  // SUB-NAV SEKRETARIS (ABSENSI / ANGGOTA / REKAP)
  // =========================================================================
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

    subviewAbsensi.style.display = 'none';
    subviewAnggota.style.display = 'none';
    subviewRekap.style.display = 'none';

    if (state.activeSubView === 'absensi') {
      subviewAbsensi.style.display = 'block';
      titleEl.textContent = 'Absensi Anggota';
      subEl.textContent = 'Daftar catatan kehadiran latihan rutin, piket UKS, dan tugas PMR';
      exportBtn.style.display = 'inline-flex';
      exportBtn.textContent = 'Ekspor Absensi (CSV)';
      renderAbsensiTable();
    } else if (state.activeSubView === 'anggota') {
      subviewAnggota.style.display = 'block';
      titleEl.textContent = 'Data Anggota PMR';
      subEl.textContent = 'Struktur anggota resmi PMR Wira SMK Negeri 7 Samarinda (16 Rombel)';
      exportBtn.style.display = 'inline-flex';
      exportBtn.textContent = 'Ekspor Anggota (CSV)';
      renderAnggotaTable();
    } else if (state.activeSubView === 'rekap') {
      subviewRekap.style.display = 'block';
      titleEl.textContent = 'Rekap Kehadiran';
      subEl.textContent = 'Rekapitulasi total keikutsertaan kegiatan per anggota';
      exportBtn.style.display = 'none';
      renderRekapTable();
    }
  }

  // =========================================================================
  // TABEL 1: LOG ABSENSI ANGGOTA
  // =========================================================================
  const filterAbsensiNama = document.getElementById('filterAbsensiNama');
  const filterAbsensiTanggal = document.getElementById('filterAbsensiTanggal');
  const filterAbsensiTingkat = document.getElementById('filterAbsensiTingkat');
  const filterAbsensiJurusan = document.getElementById('filterAbsensiJurusan');
  const filterAbsensiRombel = document.getElementById('filterAbsensiRombel');
  const filterAbsensiDivisi = document.getElementById('filterAbsensiDivisi');
  const filterAbsensiKegiatan = document.getElementById('filterAbsensiKegiatan');
  const resetFilterAbsensiBtn = document.getElementById('resetFilterAbsensiBtn');

  [filterAbsensiNama, filterAbsensiTanggal, filterAbsensiTingkat, filterAbsensiJurusan, filterAbsensiRombel, filterAbsensiDivisi, filterAbsensiKegiatan]
    .forEach(el => {
      if (el) el.addEventListener('input', renderAbsensiTable);
    });

  if (resetFilterAbsensiBtn) {
    resetFilterAbsensiBtn.addEventListener('click', () => {
      filterAbsensiNama.value = '';
      filterAbsensiTanggal.value = 'all';
      filterAbsensiTingkat.value = 'all';
      filterAbsensiJurusan.value = 'all';
      filterAbsensiRombel.value = 'all';
      filterAbsensiDivisi.value = 'all';
      filterAbsensiKegiatan.value = 'all';
      renderAbsensiTable();
    });
  }

  function getFilteredAttendance() {
    const list = getStoredAttendance();
    const qNama = filterAbsensiNama.value.trim().toLowerCase();
    const tglMode = filterAbsensiTanggal.value;
    const tingkat = filterAbsensiTingkat.value;
    const jurusan = filterAbsensiJurusan.value;
    const rombel = filterAbsensiRombel.value;
    const divisi = filterAbsensiDivisi.value;
    const kegiatan = filterAbsensiKegiatan.value;

    const todayStr = new Date().toISOString().split('T')[0];

    return list.filter(item => {
      if (qNama && !item.nama.toLowerCase().includes(qNama)) return false;

      // Tanggal filter
      if (tglMode === 'today' && item.tanggal !== todayStr) return false;
      if (tglMode === '7days') {
        const itemDate = new Date(item.tanggal);
        const diffDays = (new Date() - itemDate) / (1000 * 60 * 60 * 24);
        if (diffDays > 7) return false;
      }
      if (tglMode === 'month') {
        const [y, m] = item.tanggal.split('-');
        const now = new Date();
        if (Number(y) !== now.getFullYear() || Number(m) !== (now.getMonth() + 1)) return false;
      }

      // Filter hirarki kelas
      if (tingkat !== 'all' && item.tingkat !== tingkat) return false;
      if (jurusan !== 'all' && item.jurusan !== jurusan) return false;
      if (rombel !== 'all' && item.kelas !== rombel) return false;
      if (divisi !== 'all' && item.divisi !== divisi) return false;
      if (kegiatan !== 'all' && item.jenisKegiatan !== kegiatan) return false;

      return true;
    });
  }

  function renderAbsensiTable() {
    const tbody = document.getElementById('absensiTableBody');
    const countEl = document.getElementById('absensiCountText');
    if (!tbody) return;

    const filtered = getFilteredAttendance();
    tbody.innerHTML = '';
    countEl.textContent = `Menampilkan ${filtered.length} catatan kehadiran`;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-table-state">
            Tidak ada catatan absensi yang sesuai dengan kriteria filter.
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach(item => {
      const tr = document.createElement('tr');

      // Waktu presensi format pendek
      const tdWaktu = document.createElement('td');
      tdWaktu.style.whiteSpace = 'nowrap';
      tdWaktu.innerHTML = `
        <div style="font-weight: 600; font-size: 0.86rem;">${item.waktu}</div>
        <div style="font-size: 0.76rem; color: var(--text-muted);">${formatTanggalPendek(item.tanggal)}</div>
      `;

      // Nama
      const tdNama = document.createElement('td');
      tdNama.innerHTML = `<span style="font-weight: 600;">${item.nama}</span>`;

      // Kelas & Rombel
      const tdKelas = document.createElement('td');
      tdKelas.textContent = item.kelas;

      // Divisi
      const tdDivisi = document.createElement('td');
      tdDivisi.textContent = item.divisi;

      // Jenis Kegiatan
      const tdKegiatan = document.createElement('td');
      tdKegiatan.textContent = item.jenisKegiatan;

      // Tanda Tangan
      const tdSig = document.createElement('td');
      if (item.tandaTangan) {
        tdSig.innerHTML = `<img src="${item.tandaTangan}" alt="TTD" class="table-signature-thumb">`;
      } else {
        tdSig.textContent = '-';
      }

      // Aksi
      const tdAksi = document.createElement('td');
      tdAksi.style.textAlign = 'right';
      const detailBtn = document.createElement('button');
      detailBtn.type = 'button';
      detailBtn.className = 'btn-action-table';
      detailBtn.textContent = 'Lihat Detail';
      detailBtn.addEventListener('click', () => openDetailModal(item));
      tdAksi.appendChild(detailBtn);

      tr.appendChild(tdWaktu);
      tr.appendChild(tdNama);
      tr.appendChild(tdKelas);
      tr.appendChild(tdDivisi);
      tr.appendChild(tdKegiatan);
      tr.appendChild(tdSig);
      tr.appendChild(tdAksi);

      tbody.appendChild(tr);
    });
  }

  // =========================================================================
  // DETAIL MODAL ABSENSI
  // =========================================================================
  const detailModal = document.getElementById('detailModal');
  const detailModalCloseBtn = document.getElementById('detailModalCloseBtn');
  const detailModalCloseFooterBtn = document.getElementById('detailModalCloseFooterBtn');
  const detailModalBody = document.getElementById('detailModalBody');

  function openDetailModal(record) {
    const jurObj = JURUSAN_LIST.find(j => j.id === record.jurusan);
    const jurNama = jurObj ? jurObj.nama : record.jurusan;

    detailModalBody.innerHTML = `
      <div class="success-summary-box">
        <div class="summary-row">
          <span class="summary-label">Kode Referensi</span>
          <span class="summary-val" style="font-family: var(--font-mono); font-size: 0.8rem;">${record.id}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Nama Anggota</span>
          <span class="summary-val">${record.nama}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Kelas & Rombel</span>
          <span class="summary-val">${record.kelas}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Jurusan</span>
          <span class="summary-val">${jurNama}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Divisi</span>
          <span class="summary-val">${record.divisi}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Kegiatan</span>
          <span class="summary-val">${record.jenisKegiatan}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Waktu Presensi</span>
          <span class="summary-val">${formatTanggalIndo(record.tanggal)} • ${record.waktu}</span>
        </div>
      </div>
      <div class="modal-signature-preview">
        <div style="font-size: 0.74rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">
          Tanda Tangan Digital Resmi
        </div>
        <img src="${record.tandaTangan}" alt="Tanda Tangan Digital" style="max-height: 120px;">
      </div>
    `;

    detailModal.classList.add('show');
  }

  function closeDetailModal() {
    detailModal.classList.remove('show');
  }

  if (detailModalCloseBtn) detailModalCloseBtn.addEventListener('click', closeDetailModal);
  if (detailModalCloseFooterBtn) detailModalCloseFooterBtn.addEventListener('click', closeDetailModal);

  // =========================================================================
  // TABEL 2: DATA ANGGOTA PMR
  // =========================================================================
  const filterAnggotaNama = document.getElementById('filterAnggotaNama');
  const filterAnggotaTingkat = document.getElementById('filterAnggotaTingkat');
  const filterAnggotaJurusan = document.getElementById('filterAnggotaJurusan');
  const filterAnggotaRombel = document.getElementById('filterAnggotaRombel');
  const filterAnggotaDivisi = document.getElementById('filterAnggotaDivisi');
  const resetFilterAnggotaBtn = document.getElementById('resetFilterAnggotaBtn');

  [filterAnggotaNama, filterAnggotaTingkat, filterAnggotaJurusan, filterAnggotaRombel, filterAnggotaDivisi]
    .forEach(el => {
      if (el) el.addEventListener('input', renderAnggotaTable);
    });

  if (resetFilterAnggotaBtn) {
    resetFilterAnggotaBtn.addEventListener('click', () => {
      filterAnggotaNama.value = '';
      filterAnggotaTingkat.value = 'all';
      filterAnggotaJurusan.value = 'all';
      filterAnggotaRombel.value = 'all';
      filterAnggotaDivisi.value = 'all';
      renderAnggotaTable();
    });
  }

  function getFilteredMembers() {
    const q = filterAnggotaNama.value.trim().toLowerCase();
    const tingkat = filterAnggotaTingkat.value;
    const jurusan = filterAnggotaJurusan.value;
    const rombel = filterAnggotaRombel.value;
    const divisi = filterAnggotaDivisi.value;

    const allMembers = getStoredMembers();
    return allMembers.filter(m => {
      if (q && !m.nama.toLowerCase().includes(q)) return false;
      if (tingkat !== 'all' && m.tingkat !== tingkat) return false;
      if (jurusan !== 'all' && m.jurusan !== jurusan) return false;
      if (rombel !== 'all' && m.kelas !== rombel) return false;
      if (divisi !== 'all' && m.divisi !== divisi) return false;
      return true;
    });
  }

  function renderAnggotaTable() {
    const tbody = document.getElementById('anggotaTableBody');
    const countEl = document.getElementById('anggotaCountText');
    if (!tbody) return;

    const allMembers = getStoredMembers();
    const filtered = getFilteredMembers();
    tbody.innerHTML = '';
    countEl.textContent = `Menampilkan ${filtered.length} dari ${allMembers.length} anggota resmi`;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="empty-table-state">
            Tidak ada anggota yang sesuai dengan kriteria pencarian.
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach((m, idx) => {
      const tr = document.createElement('tr');
      const jurObj = JURUSAN_LIST.find(j => j.id === m.jurusan);
      const jurNama = jurObj ? jurObj.nama : m.jurusan;

      let statusClass = 'status-calon';
      if (m.status.includes('Pengurus')) statusClass = 'status-pengurus';
      else if (m.status.includes('Wira')) statusClass = 'status-aktif';

      tr.innerHTML = `
        <td style="color: var(--text-muted); font-size: 0.8rem;">${idx + 1}</td>
        <td><strong>${m.nama}</strong></td>
        <td>${m.kelas}</td>
        <td>${jurNama}</td>
        <td>${m.divisi}</td>
        <td><span class="status-pill ${statusClass}">${m.status}</span></td>
      `;

      tbody.appendChild(tr);
    });
  }

  // =========================================================================
  // TABEL 3: REKAPITULASI KEHADIRAN (NO CHARTS)
  // =========================================================================
  const filterRekapPeriode = document.getElementById('filterRekapPeriode');
  const filterRekapTingkat = document.getElementById('filterRekapTingkat');
  const filterRekapJurusan = document.getElementById('filterRekapJurusan');
  const filterRekapDivisi = document.getElementById('filterRekapDivisi');
  const exportRekapCsvBtn = document.getElementById('exportRekapCsvBtn');

  [filterRekapPeriode, filterRekapTingkat, filterRekapJurusan, filterRekapDivisi]
    .forEach(el => {
      if (el) el.addEventListener('change', renderRekapTable);
    });

  function getRekapData() {
    const attendance = getStoredAttendance();
    const tingkat = filterRekapTingkat.value;
    const jurusan = filterRekapJurusan.value;
    const divisi = filterRekapDivisi.value;

    const allMembers = getStoredMembers();
    // Filter anggota sesuai kriteria
    const members = allMembers.filter(m => {
      if (tingkat !== 'all' && m.tingkat !== tingkat) return false;
      if (jurusan !== 'all' && m.jurusan !== jurusan) return false;
      if (divisi !== 'all' && m.divisi !== divisi) return false;
      return true;
    });

    // Hitung kehadiran
    return members.map(m => {
      const records = attendance.filter(a => a.memberId === m.id || a.nama === m.nama);
      const latihanCount = records.filter(r => r.jenisKegiatan === 'Latihan Rutin').length;
      const piketCount = records.filter(r => r.jenisKegiatan === 'Piket UKS').length;
      const tugasLainCount = records.filter(r => r.jenisKegiatan !== 'Latihan Rutin' && r.jenisKegiatan !== 'Piket UKS').length;
      const total = records.length;

      let keaktifan = 'Cukup';
      let badgeClass = 'status-calon';
      if (total >= 3) {
        keaktifan = 'Sangat Aktif';
        badgeClass = 'status-aktif';
      } else if (total >= 1) {
        keaktifan = 'Aktif';
        badgeClass = 'status-aktif';
      } else {
        keaktifan = 'Perlu Perhatian';
        badgeClass = 'status-pengurus';
      }

      return {
        member: m,
        latihanCount,
        piketCount,
        tugasLainCount,
        total,
        keaktifan,
        badgeClass
      };
    });
  }

  function renderRekapTable() {
    const tbody = document.getElementById('rekapTableBody');
    const countEl = document.getElementById('rekapCountText');
    if (!tbody) return;

    const rekapData = getRekapData();
    tbody.innerHTML = '';
    countEl.textContent = `Rekapitulasi ${rekapData.length} anggota PMR`;

    if (rekapData.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="empty-table-state">
            Tidak ada data anggota yang sesuai untuk direkap.
          </td>
        </tr>
      `;
      return;
    }

    rekapData.forEach((row, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="color: var(--text-muted); font-size: 0.8rem;">${idx + 1}</td>
        <td><strong>${row.member.nama}</strong></td>
        <td>${row.member.kelas}</td>
        <td>${row.member.divisi}</td>
        <td style="text-align: center; font-weight: 500;">${row.latihanCount}</td>
        <td style="text-align: center; font-weight: 500;">${row.piketCount}</td>
        <td style="text-align: center; font-weight: 500;">${row.tugasLainCount}</td>
        <td style="text-align: center; font-weight: 700; color: var(--pmr-red);">${row.total}</td>
        <td><span class="status-pill ${row.badgeClass}">${row.keaktifan}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  // =========================================================================
  // EKSPOR CSV (ABSENSI & REKAP)
  // =========================================================================
  function downloadCsv(filename, csvContent) {
    // Tambahkan UTF-8 BOM agar Excel di Windows membaca karakter dengan benar
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Ekspor Absensi CSV
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      if (state.activeSubView === 'absensi') {
        const records = getFilteredAttendance();
        if (records.length === 0) {
          alert('Tidak ada data absensi untuk diekspor.');
          return;
        }

        let csv = 'ID Presensi,Tanggal,Waktu,Nama Anggota,Kelas,Divisi,Jenis Kegiatan\r\n';
        records.forEach(r => {
          csv += `"${r.id}","${r.tanggal}","${r.waktu}","${r.nama}","${r.kelas}","${r.divisi}","${r.jenisKegiatan}"\r\n`;
        });

        downloadCsv(`Presensi_PMR_SMKN7_${new Date().toISOString().split('T')[0]}.csv`, csv);
      } else if (state.activeSubView === 'anggota') {
        const members = getFilteredMembers();
        if (members.length === 0) {
          alert('Tidak ada data anggota untuk diekspor.');
          return;
        }

        let csv = 'No,Nama Lengkap,Kelas,Jurusan,Divisi,Status Keanggotaan\r\n';
        members.forEach((m, i) => {
          const jurObj = JURUSAN_LIST.find(j => j.id === m.jurusan);
          const jurNama = jurObj ? jurObj.nama : m.jurusan;
          csv += `"${i + 1}","${m.nama}","${m.kelas}","${jurNama}","${m.divisi}","${m.status}"\r\n`;
        });

        downloadCsv(`Data_Anggota_PMR_SMKN7_${new Date().toISOString().split('T')[0]}.csv`, csv);
      }
    });
  }

  // Ekspor Rekap CSV
  if (exportRekapCsvBtn) {
    exportRekapCsvBtn.addEventListener('click', () => {
      const rekapData = getRekapData();
      if (rekapData.length === 0) {
        alert('Tidak ada data rekap untuk diekspor.');
        return;
      }

      let csv = 'No,Nama Anggota,Kelas,Divisi,Latihan Rutin,Piket UKS,Tugas Lain,Total Kehadiran,Status Keaktifan\r\n';
      rekapData.forEach((row, i) => {
        csv += `"${i + 1}","${row.member.nama}","${row.member.kelas}","${row.member.divisi}",${row.latihanCount},${row.piketCount},${row.tugasLainCount},${row.total},"${row.keaktifan}"\r\n`;
      });

      downloadCsv(`Rekap_Kehadiran_PMR_SMKN7_${new Date().toISOString().split('T')[0]}.csv`, csv);
    });
  }

  // =========================================================================
  // MODAL 3: TAMBAH ANGGOTA BARU (PORTAL SEKRETARIS)
  // =========================================================================
  const openAddMemberModalBtn = document.getElementById('openAddMemberModalBtn');
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
  const newMemberStatus = document.getElementById('newMemberStatus');
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
    newMemberNama.value = '';
    newMemberNamaError.style.display = 'none';

    if (newMemberDivisi) {
      newMemberDivisi.innerHTML = '';
      DIVISI_LIST.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = d;
        newMemberDivisi.appendChild(opt);
      });
    }

    newMemberTingkat.value = 'X';
    newMemberJurusan.value = 'PPLG';
    updateNewMemberRombelOptions();

    addMemberModal.classList.add('show');
    setTimeout(() => newMemberNama.focus(), 100);
  }

  function closeAddMemberModal() {
    if (addMemberModal) {
      addMemberModal.classList.remove('show');
    }
  }

  if (openAddMemberModalBtn) {
    openAddMemberModalBtn.addEventListener('click', openAddMemberModal);
  }

  if (addMemberModalCloseBtn) {
    addMemberModalCloseBtn.addEventListener('click', closeAddMemberModal);
  }

  if (addMemberModalCancelBtn) {
    addMemberModalCancelBtn.addEventListener('click', closeAddMemberModal);
  }

  if (newMemberTingkat) {
    newMemberTingkat.addEventListener('change', updateNewMemberRombelOptions);
  }

  if (newMemberJurusan) {
    newMemberJurusan.addEventListener('change', updateNewMemberRombelOptions);
  }

  if (newMemberNama) {
    newMemberNama.addEventListener('input', () => {
      if (newMemberNama.value.trim()) {
        newMemberNamaError.style.display = 'none';
      }
    });
  }

  if (addMemberForm) {
    addMemberForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const namaVal = newMemberNama.value.trim();
      if (!namaVal) {
        newMemberNamaError.style.display = 'block';
        newMemberNama.focus();
        return;
      }

      const tingkatVal = newMemberTingkat.value;
      const jurusanVal = newMemberJurusan.value;
      const rombelVal = newMemberRombel.value;
      const divisiVal = newMemberDivisi.value;
      const statusVal = newMemberStatus.value;

      const newMember = {
        nama: namaVal,
        tingkat: tingkatVal,
        jurusan: jurusanVal,
        kelas: rombelVal,
        divisi: divisiVal,
        status: statusVal
      };

      // Simpan langsung ke database/localStorage
      saveMemberRecord(newMember);

      closeAddMemberModal();

      // Refresh tabel anggota & rekap
      renderAnggotaTable();
      renderRekapTable();

      // Tampilkan toast notifikasi berhasil
      if (addMemberSuccessToast && addMemberSuccessToastText) {
        const jurObj = JURUSAN_LIST.find(j => j.id === jurusanVal);
        const jurLabel = jurObj ? jurObj.nama : jurusanVal;
        addMemberSuccessToastText.textContent = `Anggota "${namaVal}" (${rombelVal} • ${jurLabel}) berhasil disimpan ke database.`;
        addMemberSuccessToast.style.display = 'block';

        setTimeout(() => {
          addMemberSuccessToast.style.display = 'none';
        }, 5000);
      }
    });
  }

  // Tutup Modal dengan tombol ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeConfirmModal();
      closeDetailModal();
      closeAddMemberModal();
    }
  });

  // Navigasi URL Hash & Query Param untuk memudahkan pengujian & demo
  function handleUrlHash() {
    const hash = window.location.hash.toLowerCase();
    const searchParams = new URLSearchParams(window.location.search);
    const searchQuery = searchParams.get('search');
    const memberIdParam = searchParams.get('member');

    if (memberIdParam) {
      const found = getStoredMembers().find(m => m.id === memberIdParam);
      if (found) selectMember(found);
    } else if (searchQuery && searchInput) {
      searchInput.value = searchQuery;
      renderAutocomplete(searchQuery);
    }

    if (hash === '#secretary' || hash === '#login') {
      switchMainTab('secretary');
    } else if (hash === '#admin' || hash === '#admin-absensi') {
      state.isSecretaryLoggedIn = true;
      state.activeSubView = 'absensi';
      switchMainTab('secretary');
      populateAdminFilterDropdowns();
      subnavLinks.forEach(l => l.classList.toggle('active', l.getAttribute('data-subview') === 'absensi'));
      renderActiveSecretaryView();
    } else if (hash === '#admin-anggota') {
      state.isSecretaryLoggedIn = true;
      state.activeSubView = 'anggota';
      switchMainTab('secretary');
      populateAdminFilterDropdowns();
      subnavLinks.forEach(l => l.classList.toggle('active', l.getAttribute('data-subview') === 'anggota'));
      renderActiveSecretaryView();
    } else if (hash === '#admin-tambah-anggota') {
      state.isSecretaryLoggedIn = true;
      state.activeSubView = 'anggota';
      switchMainTab('secretary');
      populateAdminFilterDropdowns();
      subnavLinks.forEach(l => l.classList.toggle('active', l.getAttribute('data-subview') === 'anggota'));
      renderActiveSecretaryView();
      openAddMemberModal();
    } else if (hash === '#admin-rekap') {
      state.isSecretaryLoggedIn = true;
      state.activeSubView = 'rekap';
      switchMainTab('secretary');
      populateAdminFilterDropdowns();
      subnavLinks.forEach(l => l.classList.toggle('active', l.getAttribute('data-subview') === 'rekap'));
      renderActiveSecretaryView();
    }
  }

  window.addEventListener('hashchange', handleUrlHash);
  handleUrlHash();

});
