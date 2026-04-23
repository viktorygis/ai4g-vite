<?php
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

// Настройки PHPMailer
$mail = new PHPMailer\PHPMailer\PHPMailer();

try {
    $mail->isSMTP();
    $mail->CharSet = "UTF-8";
    $mail->SMTPAuth = true;

    // Настройки SMTP
    $mail->Host = 'mail.ai4g.ru'; // SMTP сервер
    $mail->Username = 'no-reply@ai4g.ru'; // Логин
    $mail->Password = 'SYp-9H7-XmV-USj'; // Пароль
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;

    // Включение отладки
    $mail->SMTPDebug = 2; // Уровень отладки: 2 = подробный вывод отладки
    $mail->Debugoutput = 'html'; // Формат вывода отладки

    // Отправитель
    $mail->setFrom('no-reply@ai4g.ru', 'Тестовая отправка');

    // Получатель
    $mail->addAddress('lobanov.n2003@gmail.com'); // Измените на реальный email

    // Настройки письма
    $mail->isHTML(true);
    $mail->Subject = "Тестовая заявка";
    $mail->Body = "<h1>Привет, Никита!</h1><p>Это тестовое сообщение.</p><p>Телефон: 89144553896</p>";

    // Отправка
    if ($mail->send()) {
        echo "Сообщение успешно отправлено.";
    } else {
        echo "Сообщение не отправлено. Ошибка: {$mail->ErrorInfo}";
    }
} catch (Exception $e) {
    echo "Ошибка при отправке сообщения: {$mail->ErrorInfo}";
}
?>
