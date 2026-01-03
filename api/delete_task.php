<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'];

$ch = curl_init(SUPABASE_URL . "/rest/v1/tasks?id=eq.$id");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  "apikey: " . SUPABASE_KEY,
  "Authorization: Bearer " . SUPABASE_KEY
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

curl_exec($ch);
curl_close($ch);

echo json_encode(["success" => true]);
