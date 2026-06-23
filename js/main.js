(() => {
  const grid      = document.getElementById('proj-grid');
  const filterRow = document.getElementById('filter-row');

  function cardHTML(p) {
    const honorBadge = p.honor
      ? `<span class="honor">${p.honor}</span>`
      : '';

    const stackItems = p.stack
      .map(s => `<span>${s}</span>`)
      .join('');

    const repoLink = p.repo
      ? `<a class="repo-link" href="${p.repo}" target="_blank" rel="noopener">
           ver repositorio →
         </a>`
      : '';

    return `
      <article class="card">
        <div class="card-top">
          <span class="cat">${p.category}</span>
          ${honorBadge}
        </div>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="stack">${stackItems}</div>
        ${repoLink}
      </article>`;
  }

  function renderProjects(activeFilter) {
    const list = activeFilter === 'Todos'
      ? PROJECTS
      : PROJECTS.filter(p => p.category === activeFilter);

    grid.innerHTML = list.length
      ? list.map(cardHTML).join('')
      : '<p class="proj-empty">No hay proyectos en esta categoría todavía.</p>';
  }

  function renderFilters() {
    const categories = ['Todos', ...new Set(PROJECTS.map(p => p.category))];

    filterRow.innerHTML = categories
      .map(c => `<button class="filter-btn${c === 'Todos' ? ' active' : ''}" data-cat="${c}">${c}</button>`)
      .join('');

    filterRow.addEventListener('click', e => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      filterRow.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.dataset.cat);
    });
  }

  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (!sections.length || !navLinks.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(a => a.classList.remove('active'));
        const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (link) link.classList.add('active');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => io.observe(s));
  }

  function initCopyButtons() {
    document.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.dataset.copy).then(() => {
          btn.classList.add('copied');
          const icon = btn.querySelector('svg');
          icon.innerHTML = '<polyline points="20 6 9 17 4 12"/>';
          setTimeout(() => {
            btn.classList.remove('copied');
            icon.innerHTML = '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>';
          }, 2000);
        });
      });
    });
  }

  renderFilters();
  renderProjects('Todos');
  initActiveNav();
  initCopyButtons();
})();
