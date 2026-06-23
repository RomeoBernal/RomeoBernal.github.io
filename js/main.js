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

  renderFilters();
  renderProjects('Todos');
  initActiveNav();
})();
