<?php
session_start();

// Генерация CSRF токена
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Проверка CSRF токена
    if (!hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
        die('Неверный CSRF токен.');
    }

    // Функция для очистки данных
    function test_input($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }

    // Проверка и очистка данных
    $name = test_input($_POST['Имя']);
    $phone = test_input($_POST['Телефон']);
    $email = filter_var(test_input($_POST['email']), FILTER_VALIDATE_EMAIL);
    $contact = test_input($_POST['contact']);

    // Проверка на пустые значения
    if (empty($name) || empty($phone) || empty($email) || empty($contact)) {
        die('Заполните все поля.');
    }

    // Проверка валидности email
    if (!$email) {
        die('Некорректный email.');
    }

    // Сохранение данных в сессии
    $_SESSION['name'] = $name;
    $_SESSION['phone'] = $phone;
    $_SESSION['email'] = $email;
    $_SESSION['contact'] = $contact;

    // Отображение кнопки оплаты
    echo '<h3>Спасибо за регистрацию!</h3>';
    echo '<form action="/php/payment.php" method="POST">';
    echo '<button type="submit">Оплатить</button>';
    echo '</form>';
}
?>
