<?php
/**
 * Proxy PHP para Landing Page /participe
 * Gente Networking
 * 
 * Este script faz proxy reverso server-side para a landing page hospedada
 * no Cloudflare Pages, mantendo a URL original gentenetworking.com.br/participe
 * 
 * Compatível com pixels de rastreamento (Meta Ads, Google Ads, etc.)
 */

// Configurações
$target_url = 'https://lps.gentenetworking.com.br/participe';
$base_domain = 'https://lps.gentenetworking.com.br';

// Capturar o caminho adicional (ex: /participe/teste)
$request_uri = $_SERVER['REQUEST_URI'];
$path = str_replace('/participe', '', parse_url($request_uri, PHP_URL_PATH));
$query = parse_url($request_uri, PHP_URL_QUERY);

// Construir URL completa
$full_url = $target_url . $path;
if ($query) {
    $full_url .= '?' . $query;
}

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
    CURLOPT_ENCODING => '', // Aceita gzip/deflate
]);

// Passar headers do cliente
$client_headers = [];
foreach (getallheaders() as $name => $value) {
    // Não passar headers que podem causar problemas
    $skip_headers = ['host', 'connection', 'accept-encoding', 'content-length'];
    if (!in_array(strtolower($name), $skip_headers)) {
        $client_headers[] = "$name: $value";
    }
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $client_headers);

// Se for POST, passar os dados
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
}

// Executar requisição
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);

// Verificar erros
if (curl_errno($ch)) {
    http_response_code(502);
    echo '<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Erro - Gente Networking</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        h1 { color: #1E5A96; }
        p { color: #666; }
    </style>
</head>
<body>
    <h1>Erro ao carregar a página</h1>
    <p>Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.</p>
    <p><a href="https://gentenetworking.com.br">Voltar para o site principal</a></p>
</body>
</html>';
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
    
    // Não passar headers que podem causar problemas
    $skip_response_headers = [
        'transfer-encoding',
        'content-encoding',
        'connection',
        'set-cookie', // Cookies do Cloudflare não são necessários
    ];
    
    $header_lower = strtolower(explode(':', $header)[0]);
    if (!in_array($header_lower, $skip_response_headers)) {
        header($header, false);
    }
}

// Definir código HTTP
http_response_code($http_code);

// Processar o HTML para ajustar URLs
$body = str_replace($base_domain, '', $body);
$body = str_replace('href="/', 'href="/participe/', $body);
$body = str_replace('src="/', 'src="/participe/', $body);

// Ajustar URLs absolutas do Cloudflare Pages
$body = str_replace('https://lps.gentenetworking.com.br/', '/participe/', $body);

// Garantir que o Content-Type está correto
if (!headers_sent()) {
    header('Content-Type: text/html; charset=UTF-8');
}

// Enviar conteúdo
echo $body;
?>
