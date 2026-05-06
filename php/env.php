<?php
/**
 * Загружает переменные из php/.env в окружение процесса.
 * Используется всеми PHP-скриптами вместо жёстко прописанных секретов.
 * Реальный файл .env хранится только на сервере и НЕ коммитится в git.
 * Шаблон с пустыми значениями — php/.env.example.
 */

$envFile = __DIR__ . '/.env';
if (!file_exists($envFile)) {
    error_log('[env.php] .env file not found: ' . $envFile);
    return;
}

$lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
foreach ($lines as $line) {
    $line = trim($line);
    if ($line === '' || $line[0] === '#') {
        continue;
    }
    if (strpos($line, '=') === false) {
        continue;
    }
    [$key, $value] = explode('=', $line, 2);
    $key   = trim($key);
    $value = trim($value);
    if ($key !== '' && !array_key_exists($key, $_ENV)) {
        putenv("$key=$value");
        $_ENV[$key] = $value;
    }
}
