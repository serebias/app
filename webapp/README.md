# PulseTV Studio (PHP + JavaScript)

Aplicação web para carregar e reproduzir listas IPTV em formato M3U/M3U8 com interface premium.

## Requisitos

- PHP 8.0+ (CLI ou Apache/Nginx com suporte a PHP)

## Como rodar localmente

```bash
cd webapp
php -S localhost:8080 -t public
```

Depois, abra no navegador:

- `http://localhost:8080`

> O frontend envia a URL para `public/api/parse.php`, que processa a lista e devolve os canais em JSON.

## Observação legal

Use apenas listas e streams para os quais você tenha autorização de uso e distribuição.
