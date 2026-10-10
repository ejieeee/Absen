/**
 * app.js - Logika Interaktif Aplikasi Absensi PMR SMK Negeri 7 Samarinda
 */

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
        jurusan: m.jurusan,
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
      .select('*, tb_anggota(nama, kelas, jurusan, divisi)')
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
          kelas: m.kelas || 'X',
          jurusan: m.jurusan || '-',
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

document.addEventListener('DOMContentLoaded', () => {
  const state = {
    selectedMember: null,
    signaturePad: null,
    isSecretaryLoggedIn: false,
    activeSubView: 'absensi',
  };

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
    clearSigBtn.addEventListener('click', () => { state.signaturePad.clear(); });
  }

  function updateLiveClock() {
    const clockEl = document.getElementById('liveDateTimeText');
    if (!clockEl) return;
    const now = new Date();
    const hariNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const bulanNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    clockEl.textContent = `${hariNames[now.getDay()]}, ${now.getDate()} ${bulanNames[now.getMonth()]} ${now.getFullYear()} • ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} WITA`;
  }
  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  const searchInput = document.getElementById('memberSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const dropdown = document.getElementById('autocompleteDropdown');
  const selectedMemberCard = document.getElementById('selectedMemberCard');
  const selectedMemberIdInput = document.getElementById('selectedMemberId');
  const changeMemberBtn = document.getElementById('changeMemberBtn');

  function renderAutocomplete(query) {
    const cleanQuery = query.trim().toLowerCase();
    dropdown.innerHTML = '';
    if (!cleanQuery) {
      dropdown.classList.remove('show');
      return;
    }

    const allMembers = getStoredMembers();
    const filtered = allMembers.filter(m => 
      m.nama.toLowerCase().includes(cleanQuery) || 
      m.jurusan.toLowerCase().includes(cleanQuery)
    );

    if (filtered.length === 0) {
      const emptyItem = document.createElement('div');
      emptyItem.className = 'autocomplete-empty';
      emptyItem.innerHTML = `
        <div>Nama anggota tidak ditemukan.</div>
        <button type="button" class="btn-secondary" id="autocompleteAddMemberBtn" style="margin-top: 6px; font-size: 0.8rem; padding: 4px 10px; width: 100%;">
          + Tambah Anggota Secara Manual
        </button>
      `;
      emptyItem.querySelector('#autocompleteAddMemberBtn').addEventListener('click', (ev) => {
        ev.stopPropagation();
        dropdown.classList.remove('show');
        document.getElementById('addMemberModal').classList.add('show');
        document.getElementById('newMemberNama').value = query.trim();
      });
      dropdown.appendChild(emptyItem);
      dropdown.classList.add('show');
      return;
    }

    filtered.forEach(member => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.innerHTML = `
        <div class="autocomplete-item-name">${member.nama}</div>
        <div class="autocomplete-item-meta">Kelas ${member.kelas} • ${member.jurusan}</div>
      `;
      item.addEventListener('click', () => selectMember(member));
      dropdown.appendChild(item);
    });

    dropdown.classList.add('show');
  }

  function selectMember(member) {
    state.selectedMember = member;
    if (selectedMemberIdInput) selectedMemberIdInput.value = member.id;
    if (searchInput) searchInput.value = member.nama;
    if (dropdown) dropdown.classList.remove('show');

    document.getElementById('selectedMemberName').textContent = member.nama;
    document.getElementById('selectedMemberClass').textContent = `Kelas ${member.kelas} - ${member.jurusan}`;
    document.getElementById('selectedMemberDivision').textContent = member.divisi;

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
      clearSearchBtn.style.display = e.target.value ? 'block' : 'none';
      renderAutocomplete(e.target.value);
    });
  }

  if (clearSearchBtn) clearSearchBtn.addEventListener('click', resetMemberSelection);
  if (changeMemberBtn) changeMemberBtn.addEventListener('click', resetMemberSelection);

  // Submit Absensi
  const attendanceForm = document.getElementById('attendanceForm');
  const successCard = document.getElementById('successCard');

  if (attendanceForm) {
    attendanceForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!state.selectedMember) {
        alert('Silakan cari dan pilih nama anggota terlebih dahulu.');
        return;
      }
      if (state.signaturePad.isEmpty()) {
        document.getElementById('signatureError').style.display = 'block';
        return;
      }

      const client = getSupabaseClient();
      if (!client) {
        alert("Gagal terhubung ke Supabase.");
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
        document.getElementById('successSummaryBox').innerHTML = `
          <div class="summary-row"><span class="summary-label">Nama</span><span class="summary-val">${state.selectedMember.nama}</span></div>
          <div class="summary-row"><span class="summary-label">Kelas / Jurusan</span><span class="summary-val">Kelas ${state.selectedMember.kelas} - ${state.selectedMember.jurusan}</span></div>
          <div class="summary-row"><span class="summary-label">Divisi</span><span class="summary-val">${state.selectedMember.divisi}</span></div>
        `;
        successCard.classList.add('visible');
      } else {
        alert("Gagal mencatat absensi: " + error.message);
      }
    });
  }

  document.getElementById('resetFormBtn')?.addEventListener('click', () => {
    successCard.classList.remove('visible');
    attendanceForm.style.display = 'block';
    resetMemberSelection();
    state.signaturePad.clear();
  });

  // Switcher Tab Utama
  document.getElementById('tabBtnMember')?.addEventListener('click', () => {
    document.getElementById('tabBtnMember').classList.add('active');
    document.getElementById('tabBtnSecretary').classList.remove('active');
    document.getElementById('viewMember').style.display = 'block';
    document.getElementById('viewSecretary').style.display = 'none';
  });

  document.getElementById('tabBtnSecretary')?.addEventListener('click', () => {
    document.getElementById('tabBtnSecretary').classList.add('active');
    document.getElementById('tabBtnMember').classList.remove('active');
    document.getElementById('viewMember').style.display = 'none';
    document.getElementById('viewSecretary').style.display = 'block';

    if (state.isSecretaryLoggedIn) {
      document.getElementById('secretaryLoginView').style.display = 'none';
      document.getElementById('secretaryMainView').style.display = 'block';
    } else {
      document.getElementById('secretaryLoginView').style.display = 'block';
      document.getElementById('secretaryMainView').style.display = 'none';
    }
  });

  // Login Sekretaris
  document.getElementById('secretaryLoginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const u = document.getElementById('secUsername').value.trim();
    const p = document.getElementById('secPassword').value.trim();

    if (u === 'sekretaris' && p === 'pmr123') {
      state.isSecretaryLoggedIn = true;
      document.getElementById('secretaryLoginView').style.display = 'none';
      document.getElementById('secretaryMainView').style.display = 'block';
      renderActiveSecretaryView();
      return;
    }

    try {
      const client = getSupabaseClient();
      let { data, error } = await client.from('tb_admin_sekretaris').select('*').eq('username', u).eq('password', p);
      if (!error && data && data.length > 0) {
        state.isSecretaryLoggedIn = true;
        document.getElementById('secretaryLoginView').style.display = 'none';
        document.getElementById('secretaryMainView').style.display = 'block';
        renderActiveSecretaryView();
      } else {
        document.getElementById('loginErrorMsg').style.display = 'block';
      }
    } catch (err) {
      document.getElementById('loginErrorMsg').style.display = 'block';
    }
  });

  document.getElementById('secLogoutBtn')?.addEventListener('click', () => {
    state.isSecretaryLoggedIn = false;
    document.getElementById('secretaryLoginView').style.display = 'block';
    document.getElementById('secretaryMainView').style.display = 'none';
  });

  // Subnav Sekretaris
  document.querySelectorAll('.subnav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.subnav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      state.activeSubView = link.getAttribute('data-subview');
      renderActiveSecretaryView();
    });
  });

  function renderActiveSecretaryView() {
    ['subviewAbsensi', 'subviewAnggota', 'subviewRekap'].forEach(id => {
      document.getElementById(id).style.display = 'none';
    });
    if (state.activeSubView === 'absensi') {
      document.getElementById('subviewAbsensi').style.display = 'block';
      renderAbsensiTable();
    } else if (state.activeSubView === 'anggota') {
      document.getElementById('subviewAnggota').style.display = 'block';
      renderAnggotaTable();
    } else if (state.activeSubView === 'rekap') {
      document.getElementById('subviewRekap').style.display = 'block';
      renderRekapTable();
    }
  }

  function renderAbsensiTable() {
    const tbody = document.getElementById('absensiTableBody');
    if (!tbody) return;
    const list = getStoredAttendance();
    tbody.innerHTML = list.length === 0 ? `<tr><td colspan="5" class="empty-table-state">Belum ada data absensi.</td></tr>` : '';
    list.forEach(item => {
      tbody.innerHTML += `
        <tr>
          <td><div><strong>${item.waktu}</strong></div><div style="font-size:0.75rem; color:var(--text-muted);">${formatTanggalPendek(item.tanggal)}</div></td>
          <td><strong>${item.nama}</strong></td>
          <td>Kelas ${item.kelas} - ${item.jurusan}</td>
          <td>${item.divisi}</td>
          <td>${item.tandaTangan ? `<img src="${item.tandaTangan}" alt="TTD" class="table-signature-thumb">` : '-'}</td>
        </tr>`;
    });
  }

  function renderAnggotaTable() {
    const tbody = document.getElementById('anggotaTableBody');
    if (!tbody) return;
    const list = getStoredMembers();
    tbody.innerHTML = list.length === 0 ? `<tr><td colspan="4" class="empty-table-state">Belum ada data anggota.</td></tr>` : '';
    list.forEach((m, idx) => {
      tbody.innerHTML += `
        <tr>
          <td style="color:var(--text-muted);">${idx + 1}</td>
          <td><strong>${m.nama}</strong></td>
          <td>Kelas ${m.kelas} - ${m.jurusan}</td>
          <td>${m.divisi}</td>
        </tr>`;
    });
  }

  function renderRekapTable() {
    const tbody = document.getElementById('rekapTableBody');
    if (!tbody) return;
    const members = getStoredMembers();
    const attendance = getStoredAttendance();
    tbody.innerHTML = '';
    members.forEach((m, idx) => {
      const total = attendance.filter(a => a.memberId === m.id || a.nama === m.nama).length;
      tbody.innerHTML += `
        <tr>
          <td style="color:var(--text-muted);">${idx + 1}</td>
          <td><strong>${m.nama}</strong></td>
          <td>Kelas ${m.kelas} - ${m.jurusan}</td>
          <td>${m.divisi}</td>
          <td style="text-align:center; font-weight:700; color:var(--pmr-red);">${total}</td>
          <td><span class="status-pill status-aktif">${total > 0 ? 'Aktif' : 'Belum Absen'}</span></td>
        </tr>`;
    });
  }

  // Modal Tambah Anggota
  const addModal = document.getElementById('addMemberModal');
  document.addEventListener('click', (e) => {
    if (e.target.closest('#openAddMemberModalBtn, #headerAddMemberBtn, #autocompleteAddMemberBtn')) {
      e.preventDefault();
      addModal.classList.add('show');
    }
  });

  document.getElementById('addMemberModalCloseBtn')?.addEventListener('click', () => addModal.classList.remove('show'));
  document.getElementById('addMemberModalCancelBtn')?.addEventListener('click', () => addModal.classList.remove('show'));

  document.getElementById('addMemberForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const namaVal = document.getElementById('newMemberNama').value.trim();
    if (!namaVal) {
      document.getElementById('newMemberNamaError').style.display = 'block';
      return;
    }

    const kelasVal = document.getElementById('newMemberKelas').value;
    const jurusanVal = document.getElementById('newMemberJurusan').value;
    const divisiVal = document.getElementById('newMemberDivisi').value;

    const client = getSupabaseClient();
    let { error } = await client.from('tb_anggota').insert([{
      nama: namaVal,
      kelas: kelasVal,
      jurusan: jurusanVal,
      divisi: divisiVal
    }]);

    if (!error) {
      await fetchMembersOnline();
      addModal.classList.remove('show');
      renderAnggotaTable();
      renderRekapTable();
      alert(`Anggota "${namaVal}" berhasil disimpan!`);
    } else {
      alert("Gagal menyimpan: " + error.message);
    }
  });

  async function initApp() {
    await fetchMembersOnline();
    await fetchAttendanceOnline();
    renderAnggotaTable();
    renderAbsensiTable();
    renderRekapTable();
  }

  initApp();
});