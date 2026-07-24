Файлы php в папке `php/` :
.env - содержит настройки для PHPMailer (SMTP-сервер, логин, пароль и т.д.)
env.php - подключение к .env и настройка PHPMailer
mail.php  -  Форма записи на сессию request-form.html  и form-validation.js
payment.php -  form_handler.php
upload.php - allegro.html и transcribator-page.js

не известно для чего предназначены следующие файлы:
download.php - ?
form_handler.php- ?
info.php- ?
pay.php -  ? использует env.php но не известно для чего предназначен
payment_success.php - ? использует env.php но не известно для чего предназначен
trst.php-  ?


autoload.php - ? PHPMailer\get_oauth_token.php