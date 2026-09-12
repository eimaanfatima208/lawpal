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

$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (empty($data['email']) || empty($data['password']) || empty($data['role'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

$email = trim($data['email']);
$password = $data['password'];
$role = $data['role'];

// Validate role
if (!in_array($role, ['client', 'lawyer', 'admin'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid role']);
    exit;
}

// Check if user exists
try {
    $stmt = $pdo->prepare("SELECT id, full_name, email, password, role FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Account not found. Please register first.']);
        exit;
    }
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid password']);
        exit;
    }
    
    // Verify role
    if ($user['role'] !== $role) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Role mismatch']);
        exit;
    }
    
    // Login successful - get full_name from row (PDO may return column names in different case)
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
        'message' => 'Login successful',
        'user' => [
            'id' => (int) $user['id'],
            'full_name' => $full_name,
            'email' => $user['email'],
            'role' => $user['role']
        ]
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
    exit;
}
