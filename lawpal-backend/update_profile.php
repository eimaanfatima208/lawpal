<?php
// Update user full_name (e.g. set "Eimaan Fati"). Requires login credentials.
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

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['email']) || empty($data['password']) || empty($data['role']) || !isset($data['full_name'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'email, password, role and full_name are required']);
    exit;
}

$email = trim($data['email']);
$password = $data['password'];
$role = $data['role'];
$full_name = trim((string) $data['full_name']);

if ($full_name === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'full_name cannot be empty']);
    exit;
}

if (!in_array($role, ['client', 'lawyer', 'admin'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid role']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, full_name, email, password, role FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Account not found']);
        exit;
    }

    if (!password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid password']);
        exit;
    }

    if ($user['role'] !== $role) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Role mismatch']);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE users SET full_name = ? WHERE id = ?");
    $stmt->execute([$full_name, $user['id']]);

    echo json_encode([
        'success' => true,
        'message' => 'Profile updated. Please log in again to see your name.',
        'user' => [
            'id' => (int) $user['id'],
            'full_name' => $full_name,
            'email' => $user['email'],
            'role' => $user['role']
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
    exit;
}
