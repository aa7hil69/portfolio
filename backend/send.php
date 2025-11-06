<?php
declare(strict_types=1);

require __DIR__ . '/src/PHPMailer.php';
require __DIR__ . '/src/SMTP.php';
require __DIR__ . '/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// CORS (lock to frontend)
header('Access-Control-Allow-Origin: https://jj2-alpha.vercel.app');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  exit;
}

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
  echo json_encode(['ok' => false, 'error' => 'Invalid submission']);
  exit;
}

try {
  // Env guard
  if (!getenv('SMTP_USER') || !getenv('SMTP_PASS') || !getenv('CONTACT_INBOX')) {
    throw new Exception("Mail configuration missing");
  }

  $mail = new PHPMailer(true);
  $mail->isSMTP();
  $mail->Host       = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
  $mail->SMTPAuth   = true;
  $mail->Username   = getenv('SMTP_USER');
  $mail->Password   = getenv('SMTP_PASS');
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
  $mail->Port       = getenv('SMTP_PORT') ?: 465;

  $mail->setFrom(getenv('SMTP_USER'), 'Website');
  $mail->addAddress(getenv('CONTACT_INBOX'), 'Contact Inbox');
  $mail->addReplyTo($email, $name);

  $mail->isHTML(false);
  $mail->Subject = "New message from {$name}";
  $mail->Body    = "From: {$name} <{$email}>\n\n{$message}";

  $mail->send();

  echo json_encode(['ok' => true]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}
