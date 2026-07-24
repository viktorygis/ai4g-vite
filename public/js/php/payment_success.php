<?php
require __DIR__ . '/env.php';

$secret_seed = getenv('PAYKEEPER_SECRET');
$id = $_POST['id'];
$sum = $_POST['sum'];
$clientid = $_POST['clientid'];
$orderid = $_POST['orderid'];
$key = $_POST['key'];

if ($key != md5 ($id.number_format($sum, 2, ".", "")
        .$clientid.$orderid.$secret_seed))
{
    echo "Error! Hash mismatch";
    exit;
}

$dbHost     = getenv('DB_HOST');
$dbUsername = getenv('DB_USER');
$dbPassword = getenv('DB_PASS');
$dbName     = getenv('DB_NAME');

$conn = pg_connect("host=$dbHost dbname=$dbName user=$dbUsername password=$dbPassword");

if (!$conn) {
    die("Connection failed: " . pg_last_error());
}

$query = "UPDATE transcribator_payments SET paid = true WHERE order_id = $1";
$result = pg_prepare($conn, "update_payment", $query);
$result = pg_execute($conn, "update_payment", array($orderid));

if (!$result) {
    die("Update failed: " . pg_last_error());
}

pg_close($conn);

echo "OK ".md5($id.$secret_seed);
?>