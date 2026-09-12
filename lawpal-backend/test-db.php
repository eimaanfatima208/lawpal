<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';

try {
    // Test database connection
    $stmt = $pdo->query("SELECT 1");
    $result = $stmt->fetch();
    
    // Check if database exists
    $stmt = $pdo->query("SELECT DATABASE()");
    $db_name = $stmt->fetchColumn();
    
    // Check if users table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'users'");
    $table_exists = $stmt->fetch();
    
    echo json_encode([
        'success' => true,
        'message' => 'Database connection successful!',
        'database' => $db_name,
        'users_table_exists' => $table_exists ? true : false
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed',
        'error' => $e->getMessage()
    ]);
}
?>
