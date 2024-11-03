<?php
$targetUrl = "http://localhost:3000/";
if (!isset($_SERVER["REQUEST_METHOD"])) exit;

// test first
$headers = get_headers($targetUrl);

// Check if $headers is an array and the first element starts with "HTTP/"
$isTargetOnline = is_array($headers) && strpos($headers[0], 'HTTP/') === 0;

if (!$isTargetOnline) {
    header('Content-Type: application/json');
        echo json_encode(array(
            "message" => "Nodejs server offline!"
        ));
        exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $postData = file_get_contents("php://input");

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $targetUrl . "pdf");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $responseCurl = curl_exec($ch);
    curl_close($ch);

    if (isset($responseCurl) && $responseCurl) {
        header("Content-Type: application/pdf");
        header('Content-Disposition: attachment');
        header('filename: postrev.pdf');
        echo $responseCurl;
        exit;
    } else {
        header('Content-Type: application/json');
        echo json_encode(array(
            "message" => "Nodejs is active but fetching data erred!"
        ));
        exit;
    }
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $responseGet = file_get_contents($targetUrl . "pdf");
    if ($responseGet === false) {
        $errorMessage = error_get_last()['message'];
        header("Content-Type: application/json");
        echo json_encode(array(
            "message" => $errorMessage
        ));
        exit;
    }
    if (isset($responseGet) && $responseGet) {
        header("Content-Type: application/pdf");
        header('Content-Disposition: attachment');
        header('filename: rew.pdf');
        echo $responseGet;
        exit;
    } else {
        header("Content-Type: application/json");
        echo json_encode(array(
            "message" => "Nodejs is active but fetching data erred!"
        ));
        exit;
    }
}
