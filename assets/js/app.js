const navLinks = [
  ['Home', 'index.html'],
  {
    label: 'About Us',
    href: 'about.html',
    submenu: [
      ['Who We Are', 'about.html'],
      ['Our Story', 'about-story.html'],
      ['Vision & Mission', 'about-vision-mission.html'],
      ['Leadership Team', 'about-team.html']
    ]
  },
  {
    label: 'Programs',
    href: 'programs.html',
    submenu: [
      ['All Programs', 'programs.html'],
      ['SuVidya', 'program-suvidya.html'],
      ['SuKalp', 'program-sukalp.html'],
      ['SuMargadarshak', 'program-sumargadarshak.html'],
      ['SuJanavikas', 'program-sujanavikas.html']
    ]
  },
  ['Impact', 'impact.html'],
  ['Get Involved', 'involved.html'],
  ['Stories', 'stories.html'],
  ['News & Events', 'news.html']
];

const utilityLinks = [
  ['Volunteer', 'involved.html#volunteer'],
  ['Partner With Us', 'involved.html#partners'],
  ['Contact', 'contact.html']
];

const ALLOWED_THEMES = new Set(['default', 'sunrise', 'forest']);

try {
  const earlyTheme = localStorage.getItem('sukrupa-theme') || 'default';
  if (ALLOWED_THEMES.has(earlyTheme) && earlyTheme !== 'default') {
    document.documentElement.setAttribute('data-theme', earlyTheme);
  }
} catch (error) {
  // ignore storage access issues
}

function renderNavLink(item) {
  if (Array.isArray(item)) {
    const [name, href] = item;
    return `<a href="${href}" class="transition">${name}</a>`;
  }

  const submenu = item.submenu
    .map(([name, href]) => `<a href="${href}" class="submenu-item block px-3 py-2 rounded-md text-sm">${name}</a>`)
    .join('');

  return `
    <div class="nav-dropdown relative">
      <a href="${item.href}" class="transition inline-flex items-center gap-1">${item.label}<span aria-hidden="true">▾</span></a>
      <div class="submenu-panel absolute left-0 mt-3 w-56 rounded-xl p-2 bg-surface border border-primary/20 shadow-xl">
        ${submenu}
      </div>
    </div>`;
}

function applyTheme(theme) {
  const nextTheme = ALLOWED_THEMES.has(theme) ? theme : 'default';
  if (nextTheme === 'default') {
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', nextTheme);
    document.body.setAttribute('data-theme', nextTheme);
  }
  localStorage.setItem('sukrupa-theme', nextTheme);
  return nextTheme;
}

function injectLayout() {
  const topbar = document.getElementById('topbar');
  const nav = document.getElementById('main-nav');
  const footer = document.getElementById('site-footer');
  if (!topbar || !nav || !footer) return;

  topbar.innerHTML = `<div class="topbar nav-topbar bg-primary text-white text-sm py-2"><div class="max-w-7xl mx-auto px-4 flex flex-wrap justify-end gap-4">${utilityLinks.map(([name, href]) => `<a href="${href}" class="transition">${name}</a>`).join('')}</div></div>`;

  nav.innerHTML = `
    <div class="nav-fixed border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <a href="index.html" class="flex items-center gap-3">
          <img src="assets/images/logo.svg" alt="Sukrupa logo" class="h-10 w-10 rounded-full" />
          <span class="text-primary font-bold text-xl">Sukrupa</span>
        </a>
        <div class="hidden md:flex items-center gap-5 font-medium">
          ${navLinks.map((item) => renderNavLink(item)).join('')}
        </div>
        <div class="flex items-center gap-3">
          <label for="theme-picker" class="sr-only">Choose theme</label>
          <select id="theme-picker" class="border rounded-lg px-2 py-1 bg-surface text-sm" aria-label="Choose theme">
            <option value="default">Theme: Ocean</option>
            <option value="sunrise">Theme: Sunrise</option>
            <option value="forest">Theme: Forest</option>
          </select>
          <a href="donate.html" class="bg-accent text-white px-4 py-2 rounded-full font-semibold">Donate</a>
        </div>
      </div>
    </div>`;

  footer.innerHTML = `
  <footer class="bg-primary text-white mt-16">
    <div class="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-5 gap-8">
      <div><h4 class="font-bold mb-3">About Sukrupa</h4><p class="text-sm text-slate-200">Empowering first-generation learners through education, mentorship and opportunity.</p></div>
      <div><h4 class="font-bold mb-3">Programs</h4><ul class="space-y-1 text-sm text-slate-200"><li>SuVidya</li><li>SuKalp</li><li>SuMargadarshak</li><li>SuJanavikas</li></ul></div>
      <div><h4 class="font-bold mb-3">Get Involved</h4><ul class="space-y-1 text-sm text-slate-200"><li><a href="involved.html">Volunteer</a></li><li><a href="involved.html">Partner</a></li><li><a href="donate.html">Donate</a></li></ul></div>
      <div><h4 class="font-bold mb-3">Contact</h4><p class="text-sm text-slate-200">Bengaluru, India<br/>hello@sukrupa.org</p></div>
      <div><h4 class="font-bold mb-3">Follow Us</h4><p class="text-sm text-slate-200">Instagram · LinkedIn · Facebook · YouTube</p></div>
    </div>
  </footer>`;

  initThemePicker();
}

function initThemePicker() {
  const picker = document.getElementById('theme-picker');
  if (!picker) return;

  const savedTheme = localStorage.getItem('sukrupa-theme') || 'default';
  const activeTheme = applyTheme(savedTheme);
  picker.value = activeTheme;

  picker.addEventListener('change', () => {
    const selectedTheme = applyTheme(picker.value);
    picker.value = selectedTheme;
  });
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  counters.forEach((el) => {
    const target = Number(el.dataset.counter);
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 80));
    const tick = () => {
      cur += step;
      if (cur > target) cur = target;
      el.textContent = `${cur}${el.dataset.suffix || ''}`;
      if (cur < target) requestAnimationFrame(tick);
    };
    tick();
  });
}

function initReveal() {
  const revealEls = [...document.querySelectorAll('.section-reveal')];
  if (!revealEls.length) return;

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.15 });

  revealEls.forEach((el) => observer.observe(el));
}

function initStories() {
  const slides = [...document.querySelectorAll('.story-slide')];
  if (!slides.length) return;

  let i = 0;
  slides[i].classList.add('active');

  setInterval(() => {
    slides[i].classList.remove('active');
    i = (i + 1) % slides.length;
    slides[i].classList.add('active');
  }, 3500);
}

window.addEventListener('DOMContentLoaded', () => {
  injectLayout();
  initReveal();
  initCounters();
  initStories();
});
