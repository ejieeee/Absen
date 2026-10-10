<?php
/**
 * Koneksi PDO ke MariaDB/MySQL (XAMPP) untuk Sistem Absensi PMR UKS.
 * Membuat database & tabel otomatis jika belum ada.
 */

define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'uks_pmr');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

function jsonResponse(bool $ok, $data = null, string $error = '', int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    $payload = ['ok' => $ok];
    if ($ok) {
        $payload['data'] = $data;
    } else {
        $payload['error'] = $error;
    }
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function pdoOptions(): array
{
    return [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
}

function getDb(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsnDb = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
    try {
        $pdo = new PDO($dsnDb, DB_USER, DB_PASS, pdoOptions());
    } catch (PDOException $e) {
        if (stripos($e->getMessage(), 'Unknown database') === false) {
            throw $e;
        }
        $root = new PDO('mysql:host=' . DB_HOST . ';charset=' . DB_CHARSET, DB_USER, DB_PASS, pdoOptions());
        $root->exec(
            'CREATE DATABASE IF NOT EXISTS `' . DB_NAME . '` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
        );
        $pdo = new PDO($dsnDb, DB_USER, DB_PASS, pdoOptions());
    }

    ensureSchema($pdo);
    return $pdo;
}

function ensureSchema(PDO $pdo): void
{
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS members (
            id VARCHAR(32) PRIMARY KEY,
            nama VARCHAR(150) NOT NULL,
            kelas VARCHAR(50) NOT NULL,
            tingkat ENUM('X','XI') NOT NULL,
            jurusan ENUM('PPLG','TJKT','DKV','Animasi') NOT NULL,
            divisi VARCHAR(100) NOT NULL,
            status VARCHAR(80) NOT NULL DEFAULT 'Anggota Wira',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_members_nama (nama),
            INDEX idx_members_kelas (kelas)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS attendances (
            id VARCHAR(40) PRIMARY KEY,
            member_id VARCHAR(32) NULL,
            nama VARCHAR(150) NOT NULL,
            kelas VARCHAR(50) NOT NULL,
            tingkat VARCHAR(10) NOT NULL,
            jurusan VARCHAR(50) NOT NULL,
            divisi VARCHAR(100) NOT NULL,
            jenis_kegiatan VARCHAR(100) NOT NULL,
            tanggal DATE NOT NULL,
            waktu VARCHAR(30) NOT NULL,
            timestamp DATETIME NULL,
            tanda_tangan LONGTEXT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_attendances_tanggal (tanggal),
            INDEX idx_attendances_member_id (member_id),
            CONSTRAINT fk_att_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    $count = (int) $pdo->query('SELECT COUNT(*) FROM members')->fetchColumn();
    if ($count === 0) {
        seedMembers($pdo);
    }

    $attCount = (int) $pdo->query('SELECT COUNT(*) FROM attendances')->fetchColumn();
    if ($attCount === 0) {
        seedAttendances($pdo);
    }
}

function seedMembers(PDO $pdo): void
{
    $members = [
        ['M-01', 'Dimas Pratama', 'XI PPLG 1', 'XI', 'PPLG', 'Pertolongan Pertama', 'Pengurus (Ketua)'],
        ['M-02', 'Nadia Fitriani', 'XI PPLG 1', 'XI', 'PPLG', 'Perawatan Keluarga', 'Pengurus (Sekretaris)'],
        ['M-03', 'Rafi Alamsyah', 'XI PPLG 2', 'XI', 'PPLG', 'Tandu & Evakuasi', 'Anggota Wira'],
        ['M-04', 'Siti Nurhaliza', 'XI PPLG 2', 'XI', 'PPLG', 'Kepemimpinan & Humas', 'Anggota Wira'],
        ['M-05', "Ezio Zai'im", 'X PPLG 1', 'X', 'PPLG', 'Pertolongan Pertama', 'Calon Anggota'],
        ['M-06', 'Ahmad Faiz', 'X PPLG 1', 'X', 'PPLG', 'Pasang Bongkar Tenda', 'Calon Anggota'],
        ['M-07', 'Zahra Amelia', 'X PPLG 2', 'X', 'PPLG', 'Perawatan Keluarga', 'Calon Anggota'],
        ['M-08', 'Bagus Setiawan', 'X PPLG 2', 'X', 'PPLG', 'Tandu & Evakuasi', 'Calon Anggota'],
        ['M-09', 'Rendy Saputra', 'XI TJKT 1', 'XI', 'TJKT', 'Tandu & Evakuasi', 'Pengurus (Koord. Divisi)'],
        ['M-10', 'Dewi Safitri', 'XI TJKT 1', 'XI', 'TJKT', 'Donor Darah & Kesja', 'Anggota Wira'],
        ['M-11', 'Kevin Arya', 'XI TJKT 2', 'XI', 'TJKT', 'Pertolongan Pertama', 'Anggota Wira'],
        ['M-12', 'Aulia Rahma', 'XI TJKT 2', 'XI', 'TJKT', 'Perawatan Keluarga', 'Anggota Wira'],
        ['M-13', 'Bayu Wardhana', 'XI TJKT 3', 'XI', 'TJKT', 'Pasang Bongkar Tenda', 'Anggota Wira'],
        ['M-14', 'Tiara Maharani', 'XI TJKT 3', 'XI', 'TJKT', 'Kepemimpinan & Humas', 'Anggota Wira'],
        ['M-15', 'Muhammad Rizky', 'X TJKT 1', 'X', 'TJKT', 'Pertolongan Pertama', 'Calon Anggota'],
        ['M-16', 'Intan Permata', 'X TJKT 1', 'X', 'TJKT', 'Perawatan Keluarga', 'Calon Anggota'],
        ['M-17', 'Fajar Nugraha', 'X TJKT 2', 'X', 'TJKT', 'Tandu & Evakuasi', 'Calon Anggota'],
        ['M-18', 'Putri Rahayu', 'X TJKT 2', 'X', 'TJKT', 'Donor Darah & Kesja', 'Calon Anggota'],
        ['M-19', 'Galih Perkasa', 'X TJKT 3', 'X', 'TJKT', 'Pasang Bongkar Tenda', 'Calon Anggota'],
        ['M-20', 'Anisa Zahra', 'X TJKT 3', 'X', 'TJKT', 'Pertolongan Pertama', 'Calon Anggota'],
        ['M-21', 'Aditya Pratama', 'XI DKV 1', 'XI', 'DKV', 'Kepemimpinan & Humas', 'Pengurus (Humas)'],
        ['M-22', 'Clarissa Maharani', 'XI DKV 1', 'XI', 'DKV', 'Perawatan Keluarga', 'Anggota Wira'],
        ['M-23', 'Daffa Ramadhan', 'XI DKV 2', 'XI', 'DKV', 'Pertolongan Pertama', 'Anggota Wira'],
        ['M-24', 'Elsa Kurnia', 'XI DKV 2', 'XI', 'DKV', 'Donor Darah & Kesja', 'Anggota Wira'],
        ['M-25', 'Farhan Maulana', 'X DKV 1', 'X', 'DKV', 'Tandu & Evakuasi', 'Calon Anggota'],
        ['M-26', 'Gita Larasati', 'X DKV 1', 'X', 'DKV', 'Perawatan Keluarga', 'Calon Anggota'],
        ['M-27', 'Hendra Wijaya', 'X DKV 2', 'X', 'DKV', 'Pertolongan Pertama', 'Calon Anggota'],
        ['M-28', 'Indah Puspita', 'X DKV 2', 'X', 'DKV', 'Pasang Bongkar Tenda', 'Calon Anggota'],
        ['M-29', 'Jovan Nathaniel', 'XI Animasi', 'XI', 'Animasi', 'Pertolongan Pertama', 'Anggota Wira'],
        ['M-30', 'Keisha Aurelia', 'XI Animasi', 'XI', 'Animasi', 'Perawatan Keluarga', 'Anggota Wira'],
        ['M-31', 'Lukman Hakim', 'XI Animasi', 'XI', 'Animasi', 'Tandu & Evakuasi', 'Anggota Wira'],
        ['M-32', 'Maura Cantika', 'X Animasi', 'X', 'Animasi', 'Kepemimpinan & Humas', 'Calon Anggota'],
        ['M-33', 'Naufal Irawan', 'X Animasi', 'X', 'Animasi', 'Donor Darah & Kesja', 'Calon Anggota'],
        ['M-34', 'Octavia Salma', 'X Animasi', 'X', 'Animasi', 'Pertolongan Pertama', 'Calon Anggota'],
    ];

    $stmt = $pdo->prepare(
        'INSERT INTO members (id, nama, kelas, tingkat, jurusan, divisi, status) VALUES (?,?,?,?,?,?,?)'
    );
    foreach ($members as $row) {
        $stmt->execute($row);
    }
}

function seedAttendances(PDO $pdo): void
{
    $sig = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='60' viewBox='0 0 160 60'><path d='M20 42 Q 35 15, 55 35 T 90 25 T 125 38 T 145 20' fill='none' stroke='%2318181B' stroke-width='2' stroke-linecap='round'/></svg>";

    $rows = [
        ['PMR-20261010-001', 'M-01', 'Dimas Pratama', 'XI PPLG 1', 'XI', 'PPLG', 'Pertolongan Pertama', 'Latihan Rutin', '2026-10-10', '16:05 WITA', '2026-10-10 16:05:00'],
        ['PMR-20261010-002', 'M-02', 'Nadia Fitriani', 'XI PPLG 1', 'XI', 'PPLG', 'Perawatan Keluarga', 'Latihan Rutin', '2026-10-10', '16:08 WITA', '2026-10-10 16:08:00'],
        ['PMR-20261010-003', 'M-09', 'Rendy Saputra', 'XI TJKT 1', 'XI', 'TJKT', 'Tandu & Evakuasi', 'Latihan Rutin', '2026-10-10', '16:12 WITA', '2026-10-10 16:12:00'],
        ['PMR-20261010-004', 'M-11', 'Kevin Arya', 'XI TJKT 2', 'XI', 'TJKT', 'Pertolongan Pertama', 'Latihan Rutin', '2026-10-10', '16:15 WITA', '2026-10-10 16:15:00'],
        ['PMR-20261010-005', 'M-21', 'Aditya Pratama', 'XI DKV 1', 'XI', 'DKV', 'Kepemimpinan & Humas', 'Latihan Rutin', '2026-10-10', '16:18 WITA', '2026-10-10 16:18:00'],
        ['PMR-20261009-001', 'M-05', "Ezio Zai'im", 'X PPLG 1', 'X', 'PPLG', 'Pertolongan Pertama', 'Piket UKS', '2026-10-09', '09:30 WITA', '2026-10-09 09:30:00'],
        ['PMR-20261009-002', 'M-12', 'Aulia Rahma', 'XI TJKT 2', 'XI', 'TJKT', 'Perawatan Keluarga', 'Piket UKS', '2026-10-09', '13:15 WITA', '2026-10-09 13:15:00'],
        ['PMR-20261006-001', 'M-01', 'Dimas Pratama', 'XI PPLG 1', 'XI', 'PPLG', 'Pertolongan Pertama', 'Bantuan Medis Upacara', '2026-10-06', '06:50 WITA', '2026-10-06 06:50:00'],
        ['PMR-20261006-002', 'M-15', 'Muhammad Rizky', 'X TJKT 1', 'X', 'TJKT', 'Pertolongan Pertama', 'Bantuan Medis Upacara', '2026-10-06', '06:55 WITA', '2026-10-06 06:55:00'],
        ['PMR-20261003-001', 'M-03', 'Rafi Alamsyah', 'XI PPLG 2', 'XI', 'PPLG', 'Tandu & Evakuasi', 'Latihan Rutin', '2026-10-03', '16:00 WITA', '2026-10-03 16:00:00'],
        ['PMR-20261003-002', 'M-29', 'Jovan Nathaniel', 'XI Animasi', 'XI', 'Animasi', 'Pertolongan Pertama', 'Latihan Rutin', '2026-10-03', '16:04 WITA', '2026-10-03 16:04:00'],
        ['PMR-20261003-003', 'M-32', 'Maura Cantika', 'X Animasi', 'X', 'Animasi', 'Kepemimpinan & Humas', 'Latihan Rutin', '2026-10-03', '16:10 WITA', '2026-10-03 16:10:00'],
    ];

    $stmt = $pdo->prepare(
        'INSERT INTO attendances (id, member_id, nama, kelas, tingkat, jurusan, divisi, jenis_kegiatan, tanggal, waktu, timestamp, tanda_tangan)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?)'
    );
    foreach ($rows as $row) {
        $row[] = $sig;
        $stmt->execute($row);
    }
}

function mapMember(array $row): array
{
    return [
        'id' => $row['id'],
        'nama' => $row['nama'],
        'kelas' => $row['kelas'],
        'tingkat' => $row['tingkat'],
        'jurusan' => $row['jurusan'],
        'divisi' => $row['divisi'],
        'status' => $row['status'],
    ];
}

function mapAttendance(array $row): array
{
    return [
        'id' => $row['id'],
        'memberId' => $row['member_id'],
        'nama' => $row['nama'],
        'kelas' => $row['kelas'],
        'tingkat' => $row['tingkat'],
        'jurusan' => $row['jurusan'],
        'divisi' => $row['divisi'],
        'jenisKegiatan' => $row['jenis_kegiatan'],
        'tanggal' => $row['tanggal'],
        'waktu' => $row['waktu'],
        'timestamp' => $row['timestamp'],
        'tandaTangan' => $row['tanda_tangan'],
    ];
}

function nextMemberId(PDO $pdo): string
{
    $n = (int) $pdo->query('SELECT COUNT(*) FROM members')->fetchColumn();
    do {
        $n++;
        $id = 'M-' . str_pad((string) $n, 2, '0', STR_PAD_LEFT);
        $check = $pdo->prepare('SELECT 1 FROM members WHERE id = ?');
        $check->execute([$id]);
    } while ($check->fetchColumn());
    return $id;
}
