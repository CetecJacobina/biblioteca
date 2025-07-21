<?php
// Substitua pelo seu ID real do Google Apps Script
$googleScriptURL = 'https://script.google.com/macros/s/AKfycbxzA2CP1baCmzCTfDq8oyjbkLYzMZ9qf4ibTeZ0gfbmuSgd6SYo-urjD2VB-i8GGCd3bw/exec';

header('Content-Type: text/plain');

try {
    // Lê o corpo da requisição (JSON enviado pelo JS)
    $json = file_get_contents('php://input');
    $dados = json_decode($json, true);

    if (!$dados) {
        http_response_code(400);
        echo "❌ Dados inválidos.";
        exit;
    }

    // Inicia uma requisição cURL para o Google Apps Script
    $ch = curl_init($googleScriptURL);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($dados));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);

    $resposta = curl_exec($ch);
    $erro = curl_error($ch);
    curl_close($ch);

    if ($erro) {
        http_response_code(500);
        echo "❌ Erro ao enviar para o GAS: " . $erro;
    } else {
        echo $resposta;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo "❌ Erro geral: " . $e->getMessage();
}
?>
