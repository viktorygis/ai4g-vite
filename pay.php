<?php
$dbHost = 'localhost';
$dbUsername = 'dly';
$dbPassword = '20piter05';
$dbName = 'nirdb';

$conn = pg_connect("host=$dbHost dbname=$dbName user=$dbUsername password=$dbPassword");

if (!$conn) {
    die("Connection failed: " . pg_last_error());
}

$email = $_POST['email'];
$phone = $_POST['phone'];
$files = json_decode($_POST['files'], true);
$price = $_POST['price'];
$format = $_POST['format'];
$order_id = uniqid();

error_log("Received values: Email: $email, Phone: $phone, Files: " . print_r($files, true) . ", Price: $price, Format: $format, Order ID: $order_id");


$query = "INSERT INTO transcribator_payments (email, phone, files, format, price, paid, trans, order_id) VALUES ($1, $2, $3, $4, $5, false, false, $6)";
$result = pg_prepare($conn, "insert_payment", $query);
$result = pg_execute($conn, "insert_payment", array($email, $phone, json_encode($files),$format, $price, $order_id));

if (!$result) {
    die("Insertion failed: " . pg_last_error());
}

pg_close($conn);

// оплата

$user="admin";
$password="ade246013433";

# Basic-авторизация передаётся как base64
$base64=base64_encode("$user:$password");
$headers=Array();
array_push($headers,'Content-Type: application/x-www-form-urlencoded');

# Подготавливаем заголовок для авторизации
array_push($headers,'Authorization: Basic '.$base64);

$server_paykeeper="https://ai4g.server.paykeeper.ru/";

$payment_data = array (
    "pay_amount" => $price,
    "clientid" => $email,
    "orderid" => $order_id,
    "client_email" => $email,
    "service_name" => "Транскрибатор \"Аллегро\"",
    "client_phone" => $phone
);

# Готовим первый запрос на получение токена безопасности
$uri="/info/settings/token/";

# Для сетевых запросов в этом примере используется cURL
$curl=curl_init();

curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
curl_setopt($curl,CURLOPT_URL,$server_paykeeper.$uri);
curl_setopt($curl,CURLOPT_CUSTOMREQUEST,'GET');
curl_setopt($curl,CURLOPT_HTTPHEADER,$headers);
curl_setopt($curl,CURLOPT_HEADER,false);

# Инициируем запрос к API
$response=curl_exec($curl);
$php_array=json_decode($response,true);

# В ответе должно быть заполнено поле token, иначе - ошибка
if (isset($php_array['token'])) $token=$php_array['token']; else die();

# Готовим запрос 3.4 JSON API на получение счёта
$uri="/change/invoice/preview/";

# Формируем список POST параметров
$request = http_build_query(array_merge($payment_data, array ('token'=>$token)));

curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
curl_setopt($curl,CURLOPT_URL,$server_paykeeper.$uri);
curl_setopt($curl,CURLOPT_CUSTOMREQUEST,'POST');
curl_setopt($curl,CURLOPT_HTTPHEADER,$headers);
curl_setopt($curl,CURLOPT_HEADER,false);
curl_setopt($curl,CURLOPT_POSTFIELDS,$request);


$response=json_decode(curl_exec($curl),true);
# В ответе должно быть поле invoice_id, иначе - ошибка
if (isset($response['invoice_id'])) $invoice_id = $response['invoice_id']; else die();
$link = "$server_paykeeper/bill/$invoice_id/";
echo $link;

?>
