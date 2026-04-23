<?php
$ds = DIRECTORY_SEPARATOR;
$storeFolder = 'uploads';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!empty($_FILES)) {
        $tempFile = $_FILES['file']['tmp_name'];
        $extension = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
        $uuid = uniqid(); // Генерация уникального идентификатора
        $targetPath = dirname(__FILE__) . $ds . $storeFolder . $ds;
        $targetFile = $targetPath . $uuid . '.' . $extension; // Полный путь с UUID и расширением

        if (move_uploaded_file($tempFile, $targetFile)) {
            // Файл успешно перемещен
            echo json_encode(["status" => "success", "uuid" => $uuid . '.' . $extension]);
        } else {
            // Ошибка при перемещении файла
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to move uploaded file."]);
        }
    } else {
        // Нет файлов для загрузки
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "No files to upload."]);
    }
} else {
    // Метод запроса не POST
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method Not Allowed"]);
}
