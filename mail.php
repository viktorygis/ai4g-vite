<?php
// Файлы phpmailer
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

function httpPost($url, $data)
{
    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($curl);
    curl_close($curl);
    return $response;
}

$user_login = generateRandomString();
$user_password = generateRandomString();

$title = "Заявка на serf-сессию";
//$file = $_FILES['file'];
$body = "";
$c = true;
// Формирование самого письма
// $title = "Заголовок письма";
foreach ( $_POST as $key => $value ) {
  if ( $value != "" && $key != "project_name" && $key != "admin_email" && $key != "form_subject" ) {
    $body .= "
    " . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #f8f8f8;">' ) . "
      <td style='padding: 10px; border: #e9e9e9 1px solid;'><b>$key</b></td>
      <td style='padding: 10px; border: #e9e9e9 1px solid;'>$value</td>
    </tr>
    ";
  }
}

$body = "<table style='width: 100%;'>$body</table>";

$client_body = "
<tr>
  <td style='padding: 10px; border: #e9e9e9 1px solid;'><b>Ваш логин для входа:</b></td>
  <td style='padding: 10px; border: #e9e9e9 1px solid;'>$user_login</td>
</tr>
<tr>
  <td style='padding: 10px; border: #e9e9e9 1px solid;'><b>Ваш пароль:</b></td>
  <td style='padding: 10px; border: #e9e9e9 1px solid;'>$user_password</td>
</tr>
";


// Настройки PHPMailer
$mail = new PHPMailer\PHPMailer\PHPMailer();

try {
  $mail->isSMTP();
  $mail->CharSet = "UTF-8";
  $mail->SMTPAuth   = true;

  // Настройки вашей почты
  $mail->Host       = 'mail.nic.ru'; // SMTP сервера вашей почты
  $mail->Username   = 'no-reply@ai4g.ru'; // Логин на почте
  $mail->Password   = '5tgbNHY^'; // Пароль на почте
  $mail->SMTPSecure = 'ssl';
  $mail->Port       = 465;

  $mail->setFrom('no-reply@ai4g.ru', 'Заявка с сайта'); // Адрес самой почты и имя отправителя

  // Получатель письма
  $mail->addAddress('info@ai4g.ru');

  // Прикрипление файлов к письму
  //if (!empty($file['name'][0])) {
  //  for ($ct = 0; $ct < count($file['tmp_name']); $ct++) {
  //    $uploadfile = tempnam(sys_get_temp_dir(), sha1($file['name'][$ct]));
  //    $filename = $file['name'][$ct];
  //    if (move_uploaded_file($file['tmp_name'][$ct], $uploadfile)) {
  //        $mail->addAttachment($uploadfile, $filename);
  //        $rfile[] = "Файл $filename прикреплён";
  //    } else {
  //        $rfile[] = "Не удалось прикрепить файл $filename";
  //   }
  // }
  // }

  // Отправка сообщения
  $mail->isHTML(true);
  $mail->Subject = $title;
  $mail->Body = $body;

  $mail->send();

} catch (Exception $e) {
  $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
}

$mail = new PHPMailer\PHPMailer\PHPMailer();
httpPost("https://ai4g.ru/autoregister", array('name' => $_POST['Имя'], 'nickname' => $user_login, 'phone' => $_POST['Телефон'], 'email' => $_POST['email'], 'birthdate' => "2023-04-04", 'pass' => $user_password, 'checkpass' => $user_password));

try {
  $mail->isSMTP();
  $mail->CharSet = "UTF-8";
  $mail->SMTPAuth   = true;

  // Настройки вашей почты
  $mail->Host       = 'mail.nic.ru'; // SMTP сервера вашей почты
  $mail->Username   = 'no-reply@ai4g.ru'; // Логин на почте
  $mail->Password   = '5tgbNHY^'; // Пароль на почте
  $mail->SMTPSecure = 'ssl';
  $mail->Port       = 465;

  $mail->setFrom('no-reply@ai4g.ru', 'AI4G');

  $mail->addAddress($_POST['email']);

  $mail->isHTML(true);
  $mail->Subject = "Ваши данные для входа в личный кабинет AI4G";
  $mail->Body = $client_body;

  $mail->send();

} catch (Exception $e) {
  $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
}

