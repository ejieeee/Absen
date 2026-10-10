<?php
// Konfigurasi Database MySQL
$host     = "127.0.0.1";
$username = "root";
$password = ""; // Sesuaikan password MySQL Anda (kosongkan jika default XAMPP)
$database = "uks_pmr";

// Header untuk mengizinkan Akses CORS & Mengembalikan JSON
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Membuat Koneksi MySQLi
$conn = new mysqli($host, $username, $password, $database);

// Cek Koneksi
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Koneksi database gagal: " . $conn->connect_error]);
    exit();
}

// Menangkap Method HTTP & Aksi
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// 1. CEK KONEKSI (TEST)
if ($action == 'test_connection') {
    echo json_encode(["status" => "success", "message" => "Berhasil terhubung ke database uks_pmr"]);
    exit();
}

// 2. AMBIL DATA ANGGOTA (UNTUK AUTOCOMPLETE & TABEL)
if ($action == 'get_anggota' && $method == 'GET') {
    $result = $conn->query("SELECT * FROM tb_anggota ORDER BY nama ASC");
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $data]);
    exit();
}

// 3. TAMBAH ANGGOTA BARU
if ($action == 'add_anggota' && $method == 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    
    $nama               = $conn->real_escape_string($input['nama'] ?? '');
    $tingkat            = $conn->real_escape_string($input['tingkat'] ?? '');
    $jurusan            = $conn->real_escape_string($input['jurusan'] ?? '');
    $rombel             = $conn->real_escape_string($input['rombel'] ?? '');
    $divisi             = $conn->real_escape_string($input['divisi'] ?? '');
    $status_keanggotaan = $conn->real_escape_string($input['status_keanggotaan'] ?? 'Anggota Wira');

    if (empty($nama) || empty($tingkat) || empty($jurusan) || empty($rombel) || empty($divisi)) {
        echo json_encode(["status" => "error", "message" => "Semua kolom wajib diisi!"]);
        exit();
    }

    $sql = "INSERT INTO tb_anggota (nama, tingkat, jurusan, rombel, divisi, status_keanggotaan) 
            VALUES ('$nama', '$tingkat', '$jurusan', '$rombel', '$divisi', '$status_keanggotaan')";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Anggota baru berhasil ditambahkan", "id" => $conn->insert_id]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal menyimpan: " . $conn->error]);
    }
    exit();
}

// 4. KIRIM ABSENSI BARU (DENGAN TANGGAL OTOMATIS & TANDA TANGAN BASE64)
if ($action == 'add_absensi' && $method == 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    
    $member_id      = intval($input['member_id'] ?? 0);
    $jenis_kegiatan = $conn->real_escape_string($input['jenis_kegiatan'] ?? '');
    $signature_data = $conn->real_escape_string($input['signature_data'] ?? '');

    if ($member_id <= 0 || empty($jenis_kegiatan) || empty($signature_data)) {
        echo json_encode(["status" => "error", "message" => "Data absensi tidak lengkap!"]);
        exit();
    }

    // Menggunakan NOW() agar tanggal & waktu otomatis dari server (tidak bisa dimanipulasi)
    $sql = "INSERT INTO tb_absensi (member_id, jenis_kegiatan, waktu_presensi, signature_data) 
            VALUES ($member_id, '$jenis_kegiatan', NOW(), '$signature_data')";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Absensi berhasil dicatat!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal mencatat absensi: " . $conn->error]);
    }
    exit();
}

// 5. AMBIL DATA REKAP & RIWAYAT ABSENSI (UNTUK PORTAL SEKRETARIS)
if ($action == 'get_absensi' && $method == 'GET') {
    $sql = "SELECT a.*, m.nama, m.tingkat, m.jurusan, m.rombel, m.divisi 
            FROM tb_absensi a 
            JOIN tb_anggota m ON a.member_id = m.id 
            ORDER BY a.waktu_presensi DESC";
    $result = $conn->query($sql);
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $data]);
    exit();
}

// 6. LOGIN ADMIN SEKRETARIS
if ($action == 'login' && $method == 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $username = $conn->real_escape_string($input['username'] ?? '');
    $password = $input['password'] ?? '';

    $result = $conn->query("SELECT * FROM tb_admin_sekretaris WHERE username = '$username'");
    if ($result->num_rows > 0) {
        $admin = $result->fetch_assoc();
        // Cek password (bisa disesuaikan jika menggunakan password_verify)
        if ($password === $admin['password']) {
            echo json_encode(["status" => "success", "message" => "Login berhasil", "nama" => $admin['nama_lengkap']]);
        } else {
            echo json_encode(["status" => "error", "message" => "Kata sandi salah"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Username tidak ditemukan"]);
    }
    exit();
}

$conn->close();
?>