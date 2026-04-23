<?php
// ============== RECAPTCHA VALIDATION ==============
$recaptchaSecret = '6LfKg1osAAAAAD4DUGLMEThRJuXYzWv-95TJWLQh'; // <-- подставьте ваш реальный SECRET KEY
$recaptchaResponse = $_POST['g-recaptcha-response'] ?? '';

if (!$recaptchaResponse) {
  http_response_code(403);
  echo json_encode(['status' => 'error', 'message' => 'reCAPTCHA not filled']);
  exit;
}

$verifyResponse = file_get_contents(
  'https://www.google.com/recaptcha/api/siteverify?secret=' . urlencode($recaptchaSecret) . '&response=' . urlencode($recaptchaResponse)
);
$responseData = json_decode($verifyResponse);

if (!$responseData || empty($responseData->success)) {
  http_response_code(403);
  echo json_encode(['status' => 'error', 'message' => 'reCAPTCHA failed']);
  exit;
}
// ============== /RECAPTCHA VALIDATION ==============


require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

ini_set('display_errors', 0);
error_reporting(E_ALL);

// --- Настройки (лучше хранить в env)
$smtpLogin = 'no-reply@ai4g.ru';
$smtpPass = 'Dxv-7zJ-g2g-vAY';

// Предпочтительный хост (совпадает с сертификатом)
$smtpHostPrimary = 'sm26.hosting.reg.ru';
$smtpHostFallback = 'mail.ai4g.ru'; // fallback, если нужно

function generateRandomString($length = 10)
{
  $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  $charactersLength = strlen($characters);
  $randomString = '';
  for ($i = 0; $i < $length; $i++) {
    $randomString .= $characters[random_int(0, $charactersLength - 1)];
  }
  return $randomString;
}

function httpPost($url, $data)
{
  $curl = curl_init($url);
  curl_setopt($curl, CURLOPT_POST, true);
  curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($curl, CURLOPT_TIMEOUT, 10);
  $response = curl_exec($curl);
  $err = curl_error($curl);
  curl_close($curl);
  return ['response' => $response, 'error' => $err];
}

// Формируем тело письма безопасно
$user_login = generateRandomString();
$user_password = generateRandomString();
$title = "Заявка на serf-сессию";

$body = "";
$c = true;
foreach ($_POST as $key => $value) {
  if ($value !== "" && $key != "project_name" && $key != "admin_email" && $key != "form_subject") {
    $k = htmlspecialchars($key, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $v = nl2br(htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));
    $body .= (($c = !$c) ? '<tr>' : '<tr style="background-color: #f8f8f8;">') .
      "<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>{$k}</b></td>" .
      "<td style='padding: 10px; border: #e9e9e9 1px solid;'>{$v}</td>" .
      "</tr>";
  }
}
$body = "<table style='width:100%;'>{$body}</table>";

$client_body = "<table style='width:100%;'>
<tr><td style='padding:10px;border:#e9e9e9 1px solid;'><b>Ваш логин для входа:</b></td><td style='padding:10px;border:#e9e9e9 1px solid;'>"
  . htmlspecialchars($user_login) . "</td></tr>
<tr><td style='padding:10px;border:#e9e9e9 1px solid;'><b>Ваш пароль:</b></td><td style='padding:10px;border:#e9e9e9 1px solid;'>"
  . htmlspecialchars($user_password) . "</td></tr>
</table>";

// Функция отправки через указанный SMTP-хост. Возвращает ['ok'=>bool,'error'=>string]
function send_via_smtp($host, $smtpLogin, $smtpPass, $fromEmail, $fromName, $toEmail, $subject, $htmlBody)
{
  $mail = new PHPMailer(true);
  try {
    $mail->isSMTP();
    $mail->Host = $host;
    $mail->SMTPAuth = true;
    $mail->Username = $smtpLogin;
    $mail->Password = $smtpPass;
    // сначала пробуем SMTPS (implicit SSL)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($fromEmail, $fromName);
    $mail->addAddress($toEmail);
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $htmlBody;
    // Не включаем debug в продакшене
    // $mail->SMTPDebug = 2;
    $mail->send();
    return ['ok' => true, 'error' => ''];
  } catch (Exception $e) {
    // Если не удалось через 465, попытаться через 587 (STARTTLS)
    $err = $mail->ErrorInfo;
    try {
      $mail = new PHPMailer(true);
      $mail->isSMTP();
      $mail->Host = $host;
      $mail->SMTPAuth = true;
      $mail->Username = $smtpLogin;
      $mail->Password = $smtpPass;
      $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
      $mail->Port = 587;
      $mail->CharSet = 'UTF-8';
      $mail->setFrom($fromEmail, $fromName);
      $mail->addAddress($toEmail);
      $mail->isHTML(true);
      $mail->Subject = $subject;
      $mail->Body = $htmlBody;
      $mail->send();
      return ['ok' => true, 'error' => ''];
    } catch (Exception $e2) {
      $err2 = $mail->ErrorInfo;
      return ['ok' => false, 'error' => "First: {$err}; Second: {$err2}"];
    }
  }
}

// 1) Отправка администратору (информирам о заявке)
$adminEmail = 'info@ai4g.ru';
$fromEmail = 'no-reply@ai4g.ru';
$fromName = 'Заявка с сайта';

$result = send_via_smtp($smtpHostPrimary, $smtpLogin, $smtpPass, $fromEmail, $fromName, $adminEmail, $title, $body);

if (!$result['ok']) {
  // попробуем fallback host
  error_log("Send admin via primary failed: " . $result['error']);
  $resultFallback = send_via_smtp($smtpHostFallback, $smtpLogin, $smtpPass, $fromEmail, $fromName, $adminEmail, $title, $body);
  if ($resultFallback['ok']) {
    $result = $resultFallback;
    error_log("Send admin via fallback succeeded");
  } else {
    error_log("Send admin via fallback failed: " . $resultFallback['error']);
  }
}

// 2) Регистрация на внешнем сервисе (выполняем независимо, но логируем)
$autoreg = httpPost("https://ai4g.ru/autoregister", array(
  'name' => isset($_POST['Имя']) ? $_POST['Имя'] : '',
  'nickname' => $user_login,
  'phone' => isset($_POST['Телефон']) ? $_POST['Телефон'] : '',
  'email' => isset($_POST['email']) ? $_POST['email'] : '',
  'birthdate' => "2023-04-04",
  'pass' => $user_password,
  'checkpass' => $user_password
));
if ($autoreg['error']) {
  error_log("Autoreg error: " . $autoreg['error']);
} else {
  error_log("Autoreg response: " . $autoreg['response']);
}

// 3) Отправка письма клиенту (если указан email)
$clientEmail = isset($_POST['email']) ? $_POST['email'] : '';
$clientSendResult = ['ok' => false, 'error' => 'no client email'];
if ($clientEmail !== '') {
  $clientSendResult = send_via_smtp($smtpHostPrimary, $smtpLogin, $smtpPass, $fromEmail, 'AI4G', $clientEmail, "Ваши данные для входа в личный кабинет AI4G", $client_body);
  if (!$clientSendResult['ok']) {
    error_log("Client send primary failed: " . $clientSendResult['error']);
    $clientSendResult = send_via_smtp($smtpHostFallback, $smtpLogin, $smtpPass, $fromEmail, 'AI4G', $clientEmail, "Ваши данные для входа в личный кабинет AI4G", $client_body);
    if ($clientSendResult['ok']) {
      error_log("Client send via fallback succeeded");
    } else {
      error_log("Client send via fallback failed: " . $clientSendResult['error']);
    }
  }
}

//Итоговый ответ в формате JSON
header('Content-Type: application/json; charset=utf-8');

// Проверка на бота (если скрытое поле заполнено, то это бот и не нужно отправлять письма)
if (!empty($_POST['hidden_field'])) {
  http_response_code(403);
  echo json_encode(['status' => 'error', 'message' => 'Bot detected']);
  exit;
}

//Итоговый ответ
if (($result['ok'] ?? false) && ($clientSendResult['ok'] ?? true)) {
  echo json_encode(['status' => 'ok', 'message' => 'Письма отправлены']);
} else {
  $errAdmin = $result['error'] ?? 'unknown';
  $errClient = $clientSendResult['error'] ?? '';
  echo json_encode(['status' => 'error', 'admin_error' => $errAdmin, 'client_error' => $errClient]);
}
