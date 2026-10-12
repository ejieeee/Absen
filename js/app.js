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

  function renderAutocomplete(query) {
    const cleanQuery = query.trim().toLowerCase();
    dropdown.innerHTML = '';
    
    if (!cleanQuery) {
      dropdown.classList.remove('show');
      return;
    }

    const allMembers = getStoredMembers();
    
    // Filter berdasarkan nama atau jurusan
    const filtered = allMembers.filter(m => 
      (m.nama && m.nama.toLowerCase().includes(cleanQuery)) || 
      (m.jurusan && m.jurusan.toLowerCase().includes(cleanQuery))
    );

    if (filtered.length === 0) {
      const emptyItem = document.createElement('div');
      emptyItem.className = 'autocomplete-empty';
      emptyItem.innerHTML = `
        <div style="padding: 10px 14px; color: var(--text-muted);">Nama anggota tidak ditemukan.</div>
        <button type="button" class="btn-secondary" id="autocompleteAddMemberBtn" style="margin: 6px 14px 10px; font-size: 0.8rem; padding: 6px 10px; width: calc(100% - 28px);">
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
        <div class="autocomplete-item-meta">${formatKelasJurusan(member.kelas, member.jurusan)} • Divisi ${member.divisi}</div>
      `;
      item.addEventListener('click', () => selectMember(member));
      dropdown.appendChild(item);
    });

    dropdown.classList.add('show');
  }

  // Pastikan data dimuat saat aplikasi pertama kali berjalan
  async function initApp() {
    await fetchMembersOnline();
    await fetchAttendanceOnline();
    renderAnggotaTable();
    renderAbsensiTable();
    renderRekapTable();
  }

  initApp();