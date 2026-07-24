<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $client_login = $_POST['Имя'];
    $optional_phone = $_POST['Телефон'];
    $order_sum = "15000";  // Сумма заказа
    $orderid = uniqid();  // Генерация уникального ID заказа

    $payment_parameters = http_build_query(array(
        "clientid" => $client_login,
        "orderid" => $orderid,
        "sum" => $order_sum,
        "client_phone" => $optional_phone
    ));

    $options = array("http" => array(
        "method" => "POST",
        "header" => "Content-type: application/x-www-form-urlencoded",
        "content" => $payment_parameters
    ));

    $context = stream_context_create($options);
    $result = file_get_contents("https://ai4g.server.paykeeper.ru/order/inline/", FALSE, $context);
    if ($result === FALSE) {
        echo "Ошибка при отправке запроса на оплату.";
    } else {
        echo $result;
    }
} else {
    echo "Неверный метод запроса.";
}
?>
