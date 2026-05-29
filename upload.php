// upload.php
<?php
$ds = DIRECTORY_SEPARATOR;
$storeFolder = 'uploads';

// ПОДДЕРЖИВАЕМЫЕ ФОРМАТЫ
$allowedExtensions = ['mp3', 'mp4', 'wav', 'mov', 'm4a', 'ogg', 'webm', 'mkv'];
$allowedMimes = [
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/webm',
    'audio/x-m4a',
    'video/mp4',
    'video/quicktime',
    'video/x-matroska',
    'application/octet-stream' // для некоторых браузеров
];

// МАКСИМАЛЬНЫЙ РАЗМЕР (50 МБ)
$maxFileSize = 50 * 1024 * 1024;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method Not Allowed"]);
    exit;
}

if (empty($_FILES)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "No files to upload."]);
    exit;
}

$tempFile = $_FILES['file']['tmp_name'] ?? null;
$originalName = $_FILES['file']['name'] ?? '';
$fileSize = $_FILES['file']['size'] ?? 0;

// ВАЛИДАЦИЯ ЗАГРУЗКИ
if (empty($tempFile) || !is_uploaded_file($tempFile)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid upload."]);
    exit;
}

// ВАЛИДАЦИЯ РАЗМЕРА
if ($fileSize > $maxFileSize) {
    http_response_code(413);
    echo json_encode(["status" => "error", "message" => "File too large."]);
    exit;
}

// ВАЛИДАЦИЯ РАСШИРЕНИЯ
$extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
if (!in_array($extension, $allowedExtensions, true)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid file type."]);
    exit;
}

// ВАЛИДАЦИЯ MIME-ТИПА
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($tempFile);
if (!in_array($mimeType, $allowedMimes, true)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid MIME type."]);
    exit;
}

// ПРОВЕРКА И СОЗДАНИЕ ДИРЕКТОРИИ
$targetPath = dirname(__FILE__) . $ds . $storeFolder . $ds;
if (!is_dir($targetPath)) {
    if (!mkdir($targetPath, 0755, true)) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to create upload directory."]);
        exit;
    }
}

// ГЕНЕРИРОВАНИЕ УНИКАЛЬНОГО ИМЕНИ
$uuid = bin2hex(random_bytes(16)) . '.' . $extension;
$targetFile = $targetPath . $uuid;

// ПЕРЕМЕЩЕНИЕ ФАЙЛА
if (!move_uploaded_file($tempFile, $targetFile)) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to move uploaded file."]);
    exit;
}

// УСПЕХ
http_response_code(200);
echo json_encode(["status" => "success", "uuid" => $uuid]);
exit;
?>