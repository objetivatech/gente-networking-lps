<?php
/**
 * Proxy PHP para Arquivos Estáticos (CSS, JS, Imagens)
 * Gente Networking
 * 
 * Este script serve arquivos estáticos do Cloudflare Pages com o MIME type correto
 */

// Configurações
$base_domain = 'https://lps.gentenetworking.com.br';

// Capturar o caminho completo
$request_uri = $_SERVER['REQUEST_URI'];

// Construir URL completa no Cloudflare Pages
$full_url = $base_domain . $request_uri;

// Inicializar cURL
$ch = curl_init();

// Configurar cURL
curl_setopt_array($ch, [
    CURLOPT_URL => $full_url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS => 5,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_USERAGENT => $_SERVER['HTTP_USER_AGENT'] ?? 'Mozilla/5.0',
    CURLOPT_HEADER => true,
]);

// Executar requisição
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);

// Verificar erros
if (curl_errno($ch)) {
    http_response_code(404);
    curl_close($ch);
    exit;
}

curl_close($ch);

// Separar headers e body
$headers = substr($response, 0, $header_size);
$body = substr($response, $header_size);

// Processar headers da resposta
$header_lines = explode("\r\n", $headers);
foreach ($header_lines as $header) {
    // Pular linha vazia e status line
    if (empty($header) || strpos($header, 'HTTP/') === 0) {
        continue;
    }
    
    // Passar headers importantes
    $header_lower = strtolower(explode(':', $header)[0]);
    if (in_array($header_lower, ['content-type', 'content-length', 'cache-control', 'expires', 'etag'])) {
        header($header, false);
    }
}

// Definir código HTTP
http_response_code($http_code);

// Enviar conteúdo
echo $body;
?>
