<?php
// Handle preflight OPTIONS request FIRST, before any other code
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$raw_input = file_get_contents('php://input');
$data = json_decode($raw_input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data: ' . json_last_error_msg()]);
    exit;
}

if (empty($data) || empty($data['full_name']) || empty($data['email']) || empty($data['password']) || empty($data['confirm_password']) || empty($data['role'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

$full_name = trim($data['full_name']);
$email = trim($data['email']);
$password = $data['password'];
$confirm_password = $data['confirm_password'];
$role = $data['role'];

$serial_no_hc = isset($data['serial_no_hc']) ? trim($data['serial_no_hc']) : null;
$father_name = isset($data['father_name']) ? trim($data['father_name']) : null;
$lc_enr_date = !empty($data['lc_enr_date']) ? trim($data['lc_enr_date']) : null;
$hc_enr_date = !empty($data['hc_enr_date']) ? trim($data['hc_enr_date']) : null;
$specialty = isset($data['specialty']) ? trim($data['specialty']) : null;
$education = isset($data['education']) ? trim($data['education']) : null;
$city = isset($data['city']) ? trim($data['city']) : null;
$gender = isset($data['gender']) ? trim($data['gender']) : null;

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

if ($password !== $confirm_password) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
    exit;
}

if (!in_array($role, ['client', 'lawyer', 'admin'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid role']);
    exit;
}

if ($role === 'lawyer') {
    if (empty($serial_no_hc) || empty($lc_enr_date) || empty($hc_enr_date) || empty($specialty)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'For lawyer registration, Serial No (HC), LC enrolment date, HC enrolment date, and specialty are required'
        ]);
        exit;
    }
}

try {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email already registered']);
        exit;
    }

    if ($role === 'lawyer' && $serial_no_hc) {
        $chk = $pdo->prepare("SELECT id FROM users WHERE serial_no_hc = ?");
        $chk->execute([$serial_no_hc]);
        if ($chk->fetch()) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'This High Court serial number is already registered']);
            exit;
        }
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    exit;
}

try {
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    if ($role === 'lawyer') {
        $stmt = $pdo->prepare(
            "INSERT INTO users
            (full_name, email, password, role, serial_no_hc, father_name, lc_enr_date, hc_enr_date, specialty, education, city, gender)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $full_name,
            $email,
            $hashed_password,
            $role,
            $serial_no_hc,
            $father_name ?: null,
            $lc_enr_date,
            $hc_enr_date,
            $specialty,
            $education ?: null,
            $city ?: 'Lahore',
            in_array($gender, ['male', 'female', 'other'], true) ? $gender : null,
        ]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)");
        $stmt->execute([$full_name, $email, $hashed_password, $role]);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Registration successful. Please login.'
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Registration failed: ' . $e->getMessage()
    ]);
    exit;
}
