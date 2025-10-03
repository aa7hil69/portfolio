<?php
declare(strict_types=1);

// PHPMailer class includes (relative to backend/)
require __DIR__ . '/src/PHPMailer.php';
require __DIR__ . '/src/SMTP.php';
require __DIR__ . '/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// CORS for local dev (Vite on 5173)
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

// Read JSON or form data
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$data = (stripos($contentType, 'application/json') !== false)
  ? (json_decode(file_get_contents('php://input'), true) ?: [])
  : $_POST;

$name    = trim($data['name'] ?? '');
$email   = trim($data['email'] ?? '');
$message = trim($data['message'] ?? '');
$hp      = trim($data['website'] ?? ''); // honeypot

// Basic validation + honeypot
if ($hp !== '' || $name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $message === '') {
  http_response_code(422);
  header('Content-Type: application/json');
  echo json_encode(['ok' => false, 'error' => 'Invalid submission']);
  exit;
}

try {
  $mail = new PHPMailer(true);
  $mail->isSMTP();
  $mail->Host       = 'smtp.gmail.com';
  $mail->SMTPAuth   = true;
  $mail->Username   = 'garyjjcomp@gmail.com';       // your Gmail
  $mail->Password   = 'wbpyvoiowoobuoec';    // your Gmail App Password (spaces allowed; Gmail shows 4x4)
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // if this fails, try ENCRYPTION_SMTPS with port 465
  $mail->Port       = 587;                      // or 465 with SMTPS

  // From/To
  $mail->setFrom('garyjjcomp@gmail.com', 'Website');
  // Change to where you want to receive messages (can be the same Gmail)
  $mail->addAddress('garyjjcomp@gmail.com', 'Contact Inbox');
  $mail->addReplyTo($email, $name);

  // Content
  $mail->isHTML(false);
  $mail->Subject = "New message from {$name}";
  $mail->Body    = "From: {$name} <{$email}>\n\n{$message}";

  $mail->send();

  header('Content-Type: application/json');
  echo json_encode(['ok' => true]);
} catch (Exception $e) {
  http_response_code(500);
  header('Content-Type: application/json');
  echo json_encode(['ok' => false, 'error' => $mail->ErrorInfo]);
}
