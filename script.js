const container = document.querySelector('#archives');
const statusElement = document.querySelector('#status');
const countElement = document.querySelector('#archive-count');
const search = document.querySelector('#search');
let archives = [];

function renderArchives() {
  const term = search.value.trim().toLocaleLowerCase();
  const filtered = archives.filter(archive =>
    `${archive.title || ''}`.toLocaleLowerCase().includes(term)
  );
  container.replaceChildren();
  countElement.textContent = `${archives.length} ${archives.length === 1 ? 'archive' : 'archives'}`;
  statusElement.textContent = filtered.length ? '' : (archives.length ? 'No archives match your search.' : 'No archives have been cataloged yet.');

  filtered.forEach((archive, index) => {
    // verification of string for documents
    if (
      typeof archive.file !== 'string' ||
      archive.file.trim() === '') return;
    const card = document.createElement('a');
    card.className = 'archive';
    card.href = encodeURI(archive.file);
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    const number = document.createElement('span');
    number.className = 'archive-number';
    number.textContent = `Archive No. ${String(archive.id ?? index + 1).padStart(3, '0')}`;
    const title = document.createElement('span');
    title.className = 'archive-title';
    title.textContent = archive.title || 'Untitled archive';
    const description = document.createElement('span');
    description.className = 'archive-description';
    description.textContent = archive.description || 'Available for examination.';
    const action = document.createElement('span');
    action.className = 'archive-action';
    action.textContent = 'Open archive ↗';
    card.append(number, title, description, action);
    container.append(card);
  });
}

async function loadArchives() {
  try {
    const response = await fetch('archives.json', {cache: 'no-store'});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Archive catalog must be an array.');
    archives = data;
    renderArchives();
  } catch (error) {
    console.error('Failed to load archives:', error);
    statusElement.textContent = 'Unable to load archives. Please use a local web server or hosted site.';
  }
}
search.addEventListener('input', renderArchives);
loadArchives();
