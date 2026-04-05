const form = document.getElementById('sourceForm');
const m3uUrlInput = document.getElementById('m3uUrl');
const searchInput = document.getElementById('searchInput');
const channelList = document.getElementById('channelList');
const groupTags = document.getElementById('groupTags');
const channelCount = document.getElementById('channelCount');
const activeGroupLabel = document.getElementById('activeGroup');
const channelTitle = document.getElementById('channelTitle');
const channelGroup = document.getElementById('channelGroup');
const statusMsg = document.getElementById('statusMsg');
const video = document.getElementById('videoPlayer');

let hls;
let channels = [];
let activeGroup = 'Todos';

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const url = m3uUrlInput.value.trim();

  if (!url) {
    renderStatus('Informe uma URL válida para continuar.', true);
    return;
  }

  renderStatus('Carregando lista e processando canais...');

  try {
    const response = await fetch(`api/parse.php?url=${encodeURIComponent(url)}`);

    if (!response.ok) {
      throw new Error('Não foi possível carregar a lista informada.');
    }

    const payload = await response.json();

    if (!payload.channels?.length) {
      throw new Error('A lista foi lida, mas nenhum canal válido foi encontrado.');
    }

    channels = payload.channels;
    activeGroup = 'Todos';

    renderGroups();
    renderChannelList();
    renderStatus(`Lista carregada com sucesso: ${channels.length} canais disponíveis.`);
  } catch (error) {
    channels = [];
    renderGroups();
    renderChannelList();
    renderStatus(error.message, true);
  }
});

searchInput.addEventListener('input', () => {
  renderChannelList();
});

function renderGroups() {
  const groups = ['Todos', ...new Set(channels.map((channel) => channel.group || 'Sem grupo'))];

  groupTags.innerHTML = groups
    .map((group) => `
      <button class="tag ${group === activeGroup ? 'active' : ''}" data-group="${escapeHtml(group)}">${escapeHtml(group)}</button>
    `)
    .join('');

  groupTags.querySelectorAll('.tag').forEach((tag) => {
    tag.addEventListener('click', () => {
      activeGroup = tag.dataset.group;
      activeGroupLabel.textContent = activeGroup;
      renderGroups();
      renderChannelList();
    });
  });

  activeGroupLabel.textContent = activeGroup;
}

function renderChannelList() {
  const term = searchInput.value.toLowerCase().trim();

  const filtered = channels.filter((channel) => {
    const group = channel.group || 'Sem grupo';
    const matchesGroup = activeGroup === 'Todos' || group === activeGroup;
    const haystack = `${channel.name} ${group}`.toLowerCase();
    const matchesTerm = !term || haystack.includes(term);

    return matchesGroup && matchesTerm;
  });

  channelCount.textContent = String(filtered.length);

  if (!filtered.length) {
    channelList.innerHTML = '<li class="channel-item">Nenhum canal encontrado para os filtros atuais.</li>';
    return;
  }

  channelList.innerHTML = filtered
    .map((channel) => `
      <li class="channel-item" data-url="${escapeHtml(channel.url)}" data-name="${escapeHtml(channel.name)}" data-group="${escapeHtml(channel.group || 'Sem grupo')}">
        <span class="name">${escapeHtml(channel.name)}</span>
        <small class="muted">${escapeHtml(channel.group || 'Sem grupo')}</small>
      </li>
    `)
    .join('');

  channelList.querySelectorAll('.channel-item').forEach((item) => {
    item.addEventListener('click', () => {
      channelList.querySelectorAll('.channel-item').forEach((el) => el.classList.remove('active'));
      item.classList.add('active');

      playChannel(item.dataset.url, item.dataset.name, item.dataset.group);
    });
  });
}

function playChannel(url, name, group) {
  channelTitle.textContent = name;
  channelGroup.textContent = group;

  if (hls) {
    hls.destroy();
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
    video.play().catch(() => renderStatus('Selecione novamente para iniciar o stream.', true));
    renderStatus(`Reproduzindo: ${name}`);
    return;
  }

  if (window.Hls?.isSupported()) {
    hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play().catch(() => renderStatus('A reprodução foi bloqueada pelo navegador até interação.', true));
    });
    hls.on(Hls.Events.ERROR, () => {
      renderStatus('Erro ao reproduzir canal. Tente outro stream.', true);
    });
    renderStatus(`Reproduzindo: ${name}`);
    return;
  }

  renderStatus('Seu navegador não suporta HLS nativamente.', true);
}

function renderStatus(message, isError = false) {
  statusMsg.textContent = message;
  statusMsg.style.borderColor = isError ? 'rgba(255,95,143,0.6)' : 'rgba(151, 171, 242, 0.2)';
  statusMsg.style.color = isError ? '#ff9fbc' : '#e6ecff';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
