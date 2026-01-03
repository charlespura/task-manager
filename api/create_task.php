<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

// Optional: dummy user_id
$data['user_id'] = null;

$ch = curl_init(SUPABASE_URL . "/rest/v1/tasks");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "apikey: " . SUPABASE_KEY,
    "Authorization: Bearer " . SUPABASE_KEY,
    "Content-Type: application/json",
    "Prefer: return=minimal"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);

header('Content-Type: application/json');
if ($err) {
    echo json_encode(["success" => false, "error" => $err]);
} else {
    echo json_encode(["success" => true]);
}
