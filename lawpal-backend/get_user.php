<?php
// Return user row by id (id + email must match - minimal auth so app can refresh name from DB)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
$email = isset($_GET['email']) ? trim($_GET['email']) : '';

if ($id < 1 || $email === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'id and email required']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, full_name, email, role FROM users WHERE id = ? AND email = ?");
    $stmt->execute([$id, $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }

    $full_name = '';
    foreach ($user as $key => $value) {
        if (strtolower($key) === 'full_name' && $value !== null && (string) $value !== '') {
            $full_name = trim((string) $value);
            break;
        }
    }
    if ($full_name === '') {
        $full_name = trim((string) ($user['full_name'] ?? $user['fullName'] ?? ''));
    }

    echo json_encode([
        'success' => true,
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
