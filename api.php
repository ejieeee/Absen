<?php
/**
 * API JSON untuk anggota & presensi PMR.
 * GET/POST api.php?resource=health|members|attendances
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/db.php';

$resource = isset($_GET['resource']) ? strtolower(trim((string) $_GET['resource'])) : '';
$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = getDb();
} catch (Throwable $e) {
    jsonResponse(false, null, 'Gagal terhubung ke MySQL: ' . $e->getMessage(), 500);
}

if ($resource === 'health') {
    jsonResponse(true, [
        'driver' => 'mysql',
        'database' => DB_NAME,
        'host' => DB_HOST,
        'connected' => true,
    ]);
}

if ($resource === 'members') {
    if ($method === 'GET') {
        $stmt = $pdo->query('SELECT * FROM members ORDER BY nama ASC');
        $rows = array_map('mapMember', $stmt->fetchAll());
        jsonResponse(true, $rows);
    }

    if ($method === 'POST') {
        $body = json_decode((string) file_get_contents('php://input'), true);
        if (!is_array($body)) {
            jsonResponse(false, null, 'Body JSON tidak valid.', 400);
        }

        $nama = trim((string) ($body['nama'] ?? ''));
        $kelas = trim((string) ($body['kelas'] ?? ''));
        $tingkat = trim((string) ($body['tingkat'] ?? ''));
        $jurusan = trim((string) ($body['jurusan'] ?? ''));
        $divisi = trim((string) ($body['divisi'] ?? ''));
        $status = trim((string) ($body['status'] ?? 'Anggota Wira'));
        $id = trim((string) ($body['id'] ?? ''));

        if ($nama === '' || $kelas === '' || $tingkat === '' || $jurusan === '' || $divisi === '') {
            jsonResponse(false, null, 'Nama, kelas, tingkat, jurusan, dan divisi wajib diisi.', 422);
        }

        if ($id === '') {
            $id = nextMemberId($pdo);
        }

        $stmt = $pdo->prepare(
            'INSERT INTO members (id, nama, kelas, tingkat, jurusan, divisi, status)
             VALUES (:id, :nama, :kelas, :tingkat, :jurusan, :divisi, :status)
             ON DUPLICATE KEY UPDATE
                nama = VALUES(nama),
                kelas = VALUES(kelas),
                tingkat = VALUES(tingkat),
                jurusan = VALUES(jurusan),
                divisi = VALUES(divisi),
                status = VALUES(status)'
        );
        $stmt->execute([
            ':id' => $id,
            ':nama' => $nama,
            ':kelas' => $kelas,
            ':tingkat' => $tingkat,
            ':jurusan' => $jurusan,
            ':divisi' => $divisi,
            ':status' => $status !== '' ? $status : 'Anggota Wira',
        ]);

        jsonResponse(true, [
            'id' => $id,
            'nama' => $nama,
            'kelas' => $kelas,
            'tingkat' => $tingkat,
            'jurusan' => $jurusan,
            'divisi' => $divisi,
            'status' => $status !== '' ? $status : 'Anggota Wira',
        ], '', 201);
    }
}

if ($resource === 'attendances') {
    if ($method === 'GET') {
        $stmt = $pdo->query('SELECT * FROM attendances ORDER BY timestamp DESC, created_at DESC');
        $rows = array_map('mapAttendance', $stmt->fetchAll());
        jsonResponse(true, $rows);
    }

    if ($method === 'POST') {
        $body = json_decode((string) file_get_contents('php://input'), true);
        if (!is_array($body)) {
            jsonResponse(false, null, 'Body JSON tidak valid.', 400);
        }

        $id = trim((string) ($body['id'] ?? ''));
        $memberId = trim((string) ($body['memberId'] ?? $body['member_id'] ?? ''));
        $nama = trim((string) ($body['nama'] ?? ''));
        $kelas = trim((string) ($body['kelas'] ?? ''));
        $tingkat = trim((string) ($body['tingkat'] ?? ''));
        $jurusan = trim((string) ($body['jurusan'] ?? ''));
        $divisi = trim((string) ($body['divisi'] ?? ''));
        $jenisKegiatan = trim((string) ($body['jenisKegiatan'] ?? $body['jenis_kegiatan'] ?? ''));
        $tanggal = trim((string) ($body['tanggal'] ?? ''));
        $waktu = trim((string) ($body['waktu'] ?? ''));
        $timestamp = trim((string) ($body['timestamp'] ?? ''));
        $tandaTangan = (string) ($body['tandaTangan'] ?? $body['tanda_tangan'] ?? '');

        if ($nama === '' || $jenisKegiatan === '' || $tanggal === '') {
            jsonResponse(false, null, 'Nama, jenis kegiatan, dan tanggal wajib diisi.', 422);
        }

        if ($id === '') {
            $id = 'PMR-' . date('Ymd') . '-' . random_int(100, 999);
        }

        $tsSql = null;
        if ($timestamp !== '') {
            $parsed = strtotime($timestamp);
            $tsSql = $parsed ? date('Y-m-d H:i:s', $parsed) : null;
        }

        $stmt = $pdo->prepare(
            'INSERT INTO attendances
                (id, member_id, nama, kelas, tingkat, jurusan, divisi, jenis_kegiatan, tanggal, waktu, timestamp, tanda_tangan)
             VALUES
                (:id, :member_id, :nama, :kelas, :tingkat, :jurusan, :divisi, :jenis_kegiatan, :tanggal, :waktu, :timestamp, :tanda_tangan)
             ON DUPLICATE KEY UPDATE
                member_id = VALUES(member_id),
                nama = VALUES(nama),
                kelas = VALUES(kelas),
                tingkat = VALUES(tingkat),
                jurusan = VALUES(jurusan),
                divisi = VALUES(divisi),
                jenis_kegiatan = VALUES(jenis_kegiatan),
                tanggal = VALUES(tanggal),
                waktu = VALUES(waktu),
                timestamp = VALUES(timestamp),
                tanda_tangan = VALUES(tanda_tangan)'
        );

        $stmt->execute([
            ':id' => $id,
            ':member_id' => $memberId !== '' ? $memberId : null,
            ':nama' => $nama,
            ':kelas' => $kelas,
            ':tingkat' => $tingkat,
            ':jurusan' => $jurusan,
            ':divisi' => $divisi,
            ':jenis_kegiatan' => $jenisKegiatan,
            ':tanggal' => $tanggal,
            ':waktu' => $waktu !== '' ? $waktu : date('H:i') . ' WITA',
            ':timestamp' => $tsSql,
            ':tanda_tangan' => $tandaTangan !== '' ? $tandaTangan : null,
        ]);

        jsonResponse(true, [
            'id' => $id,
            'memberId' => $memberId !== '' ? $memberId : null,
            'nama' => $nama,
            'kelas' => $kelas,
            'tingkat' => $tingkat,
            'jurusan' => $jurusan,
            'divisi' => $divisi,
            'jenisKegiatan' => $jenisKegiatan,
            'tanggal' => $tanggal,
            'waktu' => $waktu !== '' ? $waktu : date('H:i') . ' WITA',
            'timestamp' => $timestamp,
            'tandaTangan' => $tandaTangan,
        ], '', 201);
    }
}

jsonResponse(false, null, 'Resource tidak ditemukan. Gunakan health, members, atau attendances.', 404);
