<?php
// Указываем папку, где хранятся видео
$videoDir = __DIR__ . '/uploads/';

// Получаем имя файла из параметра запроса
if (isset($_GET['file'])) {
    $filename = basename($_GET['file']); // Получаем только имя файла без пути

    // Полный путь к файлу
    $filePath = $videoDir . $filename;

    // Проверяем, существует ли файл и является ли он файлом
    if (file_exists($filePath) && is_file($filePath)) {
        // Определяем тип контента
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Content-Length: ' . filesize($filePath));
        header('Cache-Control: must-revalidate');
        header('Pragma: public');

        // Читаем файл и отправляем его пользователю
        readfile($filePath);
        exit;
    } else {
        echo "Файл не найден!";
        http_response_code(404); // Отправляем 404 HTTP статус
    }
} else {
    echo "Имя файла не указано!";
    http_response_code(400); // Отправляем 400 HTTP статус
}
?>
