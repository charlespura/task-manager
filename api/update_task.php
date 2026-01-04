<?php
require 'config.php';

header('Content-Type: application/json');

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if ($data === null) {
    echo json_encode([
        "success" => false,
        "error" => "Invalid or missing JSON body",
        "raw_input" => $raw
    ]);
    exit;
}

$id = $data['id'] ?? null;
$title = $data['title'] ?? null;
$status = $data['status'] ?? null;

if (!$id) {
    echo json_encode([
        "success" => false,
        "error" => "Missing task id",
        "received" => $data
    ]);
    exit;
}

$updateData = [];

if ($title !== null) $updateData['title'] = $title;
if ($status !== null) $updateData['status'] = $status;

if (empty($updateData)) {
    echo json_encode([
        "success" => false,
        "error" => "Nothing to update"
    ]);
    exit;
}

$ch = curl_init(SUPABASE_URL . "/rest/v1/tasks?id=eq.$id");

curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PATCH");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "apikey: " . SUPABASE_KEY,
    "Authorization: Bearer " . SUPABASE_KEY,
    "Content-Type: application/json",
    "Prefer: return=representation"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($updateData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$rows = json_decode($response, true);

if ($httpCode !== 200 || empty($rows)) {
    echo json_encode([
        "success" => false,
        "status_code" => $httpCode,
        "response" => $response
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "updated_task" => $rows[0]
]);
