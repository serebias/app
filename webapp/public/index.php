<?php
?><!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PulseTV Studio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/styles.css">
  <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
</head>
<body>
  <div class="bg-orb orb-a"></div>
  <div class="bg-orb orb-b"></div>

  <main class="layout">
    <aside class="sidebar glass">
      <div class="brand">
        <div class="brand-dot"></div>
        <div>
          <p class="muted">Painel IPTV</p>
          <h1>PulseTV Studio</h1>
        </div>
      </div>

      <form id="sourceForm" class="source-form">
        <label for="m3uUrl">URL da lista M3U/M3U8</label>
        <div class="source-row">
          <input id="m3uUrl" type="url" placeholder="https://exemplo.com/lista.m3u" required>
          <button type="submit">Carregar</button>
        </div>
        <p class="muted small">Use apenas conteúdos para os quais você possui autorização de transmissão.</p>
      </form>

      <div class="filters">
        <label for="searchInput">Buscar canal</label>
        <input id="searchInput" type="search" placeholder="Digite nome ou grupo...">
      </div>

      <div class="channel-meta">
        <div>
          <span class="muted">Canais</span>
          <strong id="channelCount">0</strong>
        </div>
        <div>
          <span class="muted">Grupo ativo</span>
          <strong id="activeGroup">Todos</strong>
        </div>
      </div>

      <div id="groupTags" class="group-tags"></div>
      <ul id="channelList" class="channel-list"></ul>
    </aside>

    <section class="player-panel glass">
      <div class="player-head">
        <div>
          <p class="muted">Agora reproduzindo</p>
          <h2 id="channelTitle">Nenhum canal selecionado</h2>
        </div>
        <span id="channelGroup" class="badge">-</span>
      </div>

      <div class="player-wrap">
        <video id="videoPlayer" controls playsinline></video>
      </div>

      <div class="info-grid">
        <article>
          <h3>Guia rápido</h3>
          <ul>
            <li>Cole uma URL M3U válida e clique em <strong>Carregar</strong>.</li>
            <li>Filtre por grupo para montar seu fluxo de navegação.</li>
            <li>Clique no canal desejado para iniciar o stream.</li>
          </ul>
        </article>
        <article>
          <h3>Qualidade profissional</h3>
          <p>Interface premium, foco em legibilidade, carregamento assíncrono e player com suporte HLS para uma experiência robusta em desktop e mobile.</p>
        </article>
      </div>

      <p id="statusMsg" class="status">Pronto para carregar sua lista.</p>
    </section>
  </main>

  <script src="assets/app.js"></script>
</body>
</html>
