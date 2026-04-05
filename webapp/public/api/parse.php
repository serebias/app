<?php
header('Content-Type: application/json; charset=utf-8');

$url = isset($_GET['url']) ? trim($_GET['url']) : '';

if (!$url || !filter_var($url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode(['error' => 'URL inválida.']);
    exit;
}

$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'timeout' => 12,
        'header' => "User-Agent: PulseTVStudio/1.0\r\n",
    ],
]);

$content = @file_get_contents($url, false, $context);

if ($content === false) {
    http_response_code(502);
    echo json_encode(['error' => 'Falha ao baixar a lista M3U.']);
    exit;
}

$lines = preg_split('/\R/', $content);
$channels = [];
$current = null;

foreach ($lines as $line) {
    $line = trim($line);

    if ($line === '') {
        continue;
    }

    if (str_starts_with($line, '#EXTINF:')) {
        $name = 'Canal sem nome';
        $group = 'Sem grupo';

        if (preg_match('/group-title="([^"]+)"/', $line, $groupMatch)) {
            $group = trim($groupMatch[1]);
        }

        if (preg_match('/,(.+)$/', $line, $nameMatch)) {
            $name = trim($nameMatch[1]);
        }

        $current = ['name' => $name, 'group' => $group];
        continue;
    }

    if ($current !== null && filter_var($line, FILTER_VALIDATE_URL)) {
        $current['url'] = $line;
        $channels[] = $current;
        $current = null;
    }
}

echo json_encode([
    'channels' => $channels,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
