<?php
/**
 * Proxy PHP Completo para Landing Page /participe
 * Gente Networking
 * 
 * Este script faz proxy da página completa do Cloudflare Pages,
 * ajustando automaticamente todos os caminhos de assets (CSS, JS, imagens)
 */

// Configurações
$base_domain = 'https://lps.gentenetworking.com.br';
$page_path = '/participe';

// Capturar query string se existir
$query_string = $_SERVER['QUERY_STRING'] ?? '';
$full_url = $base_domain . $page_path . ($query_string ? '?' . $query_string : '');

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
    CURLOPT_HTTPHEADER => [
        'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language: pt-BR,pt;q=0.9,en;q=0.8',
    ],
]);

// Executar requisição
$html = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Verificar erros
if (curl_errno($ch)) {
    http_response_code(500);
    echo "Erro ao carregar a página. Por favor, tente novamente.";
    curl_close($ch);
    exit;
}

curl_close($ch);

// Verificar código HTTP
if ($http_code !== 200) {
    http_response_code($http_code);
    echo "Página não encontrada.";
    exit;
}

// Ajustar caminhos no HTML
// 1. Ajustar caminhos relativos de assets para absolutos do Cloudflare Pages
$html = preg_replace(
    '/(href|src)="\/assets\//i',
    '$1="' . $base_domain . '/assets/',
    $html
);

// 2. Ajustar caminhos relativos de /participe/assets para absolutos
$html = preg_replace(
    '/(href|src)="\/participe\/assets\//i',
    '$1="' . $base_domain . '/participe/assets/',
    $html
);

// 3. Ajustar imports de módulos JS
$html = preg_replace(
    '/from\s+[\'"]\/assets\//i',
    'from "' . $base_domain . '/assets/',
    $html
);

// 4. Substituir variáveis de ambiente não processadas (se houver)
$html = str_replace('%VITE_ANALYTICS_ENDPOINT%', '', $html);
$html = str_replace('%VITE_', '', $html);

// 5. Ajustar links internos para manter na mesma origem
$html = preg_replace(
    '/(href)="' . preg_quote($base_domain, '/') . '\/participe/i',
    '$1="/participe',
    $html
);

// Definir headers corretos
header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-cache, must-revalidate');
header('X-Proxied-By: PHP-Proxy');

// Enviar HTML processado
echo $html;
?>
