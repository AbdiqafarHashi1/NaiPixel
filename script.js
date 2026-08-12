const data = window.NAIROBI_PIXEL_DATA;
const app = document.getElementById('app');

const safeWa = (label) => `${data.links.whatsapp}?text=${encodeURIComponent(`Hi NairobiPixel, I'm interested in the ${label} package.`)}`;

/** Numbered image slots correspond to assets/IMAGE_GUIDE.txt. */
function imageSlot(path, alt, number) {
  return `<div class="image-wrap reveal">
    <!-- IMAGE ${number}: ${alt}. Replacement details: assets/IMAGE_GUIDE.txt -->
    <img src="${path}" alt="${alt}" loading="lazy" data-image-slot="${number}" onerror="this.closest('.image-wrap').classList.add('missing');this.hidden=true" />
    <div class="missing-note" aria-hidden="true"><span class="slot-number">${number}</span>Image placeholder<br><small>See assets/IMAGE_GUIDE.txt</small></div>
  </div>`;
}

const sectionHeading = (kicker, title, intro = '') => `<div class="section-heading"><p class="kicker">${kicker}</p><h2>${title}</h2>${intro ? `<p class="section-intro">${intro}</p>` : ''}</div>`;

app.innerHTML = `
<section class="hero section-dark" aria-labelledby="hero-title">
  <div class="container hero-grid">
    <div class="hero-copy reveal">
      <p class="kicker eyebrow-line">Digital growth systems</p>
      <h1 id="hero-title">Turn your business into a <span>digital growth engine.</span></h1>
      <p class="sub">We design and build websites, ordering systems, dashboards and automations that help ambitious Kenyan businesses win more customers and run smarter.</p>
      <div class="actions"><a class="btn btn-gold" href="#portfolio">Explore our work →</a><a class="btn btn-dark" href="${data.links.whatsapp}" target="_blank" rel="noreferrer">Build my system</a></div>
      <ul class="trust-points"><li>Mobile-first</li><li>Built for conversion</li><li>Fast delivery</li><li>Made in Kenya</li></ul>
    </div>
    <div class="hero-visual" aria-label="Selected NairobiPixel work">
      <div class="mockup mockup-main">${imageSlot('assets/portfolio/eastleigh/hero-desktop.png','Eastleigh Properties desktop homepage','01')}</div>
      <div class="mockup mockup-phone">${imageSlot('assets/portfolio/beirut-delivery/menu-mobile.png','Beirut Delivery mobile menu','02')}</div>
      <div class="mockup mockup-stat"><span class="kicker">Built to perform</span><strong>24/7</strong><small>Your digital system keeps working.</small></div>
    </div>
  </div>
</section>

<section class="trusted" aria-label="Businesses served"><div class="container trusted-inner"><p class="kicker">Trusted by</p><div class="trusted-row">${data.trustedBusinesses.map(x => `<span>${x}</span>`).join('')}</div></div></section>

<section id="services" class="section-light"><div class="container">
  ${sectionHeading('What we build','Everything your business needs to <span>grow online.</span>','Practical digital tools, thoughtfully designed around your customers and daily operations.')}
  <div class="service-grid">${data.services.map(s => `<article class="reveal"><i aria-hidden="true">${s[2]}</i><h3>${s[0]}</h3><p>${s[1]}</p></article>`).join('')}</div>
</div></section>

<section id="portfolio" class="section-dark"><div class="container">
  ${sectionHeading('Selected work','Digital systems built for <span>real business.</span>','From customer-facing experiences to the dashboards behind them.')}
  <div class="project-grid">${data.projects.map(p => `<article class="project reveal">${imageSlot(p.image,p.name,p.slot)}<div class="body"><p class="cat">${p.category}</p><h3>${p.name}</h3><p>${p.description}</p><div class="row"><a class="btn btn-gold" href="${p.live}" target="_blank" rel="noreferrer">View project</a><a class="btn btn-ghost" href="${data.links.whatsapp}" target="_blank" rel="noreferrer">Ask about it</a></div></div></article>`).join('')}</div>
</div></section>

<section class="section-light"><div class="container">
  ${sectionHeading('Case studies','Problems solved. <span>Results delivered.</span>','A closer look at how the right system makes everyday business easier.')}
  <div class="case-list">${data.caseStudies.map(c => `<article class="reveal">${imageSlot(c.image,c.title,c.slot)}<div><p class="cat">Case study</p><h3>${c.title}</h3><p><strong>Challenge:</strong> ${c.challenge}</p><p><strong>Solution:</strong> ${c.solution}</p><p><strong>Result:</strong> ${c.result}</p><a href="${data.links.whatsapp}" target="_blank" rel="noreferrer">Discuss a similar project →</a></div></article>`).join('')}</div>
</div></section>

<section id="packages" class="section-dark"><div class="container">
  ${sectionHeading('Packages & pricing','Clear packages. <span>Room to grow.</span>','Start with what you need today. Every package can be tailored to your business.')}
  <div class="price-grid">${data.pricing.map((p,i) => `<article class="price-card reveal ${i === 1 ? 'featured' : ''}">${i === 1 ? '<span class="popular">Popular</span>' : ''}<p class="pack-ico" aria-hidden="true">${p.icon}</p><h3>${p.name}</h3><p class="price">${p.price}</p><ul>${p.items.map(item => `<li>${item}</li>`).join('')}</ul><a class="btn btn-gold" href="${safeWa(p.name)}" target="_blank" rel="noreferrer">Get started →</a></article>`).join('')}</div>
  <p class="helper-note">Not sure which one fits? Tell us what you want to achieve and we’ll recommend the simplest route.</p>
</div></section>

<section class="section-light" id="about"><div class="container social-wrap">
  <div class="social-copy reveal"><p class="kicker">Proof in the numbers</p><h2>Designed for outcomes, <span>not decoration.</span></h2><p>Beautiful is only the beginning. We focus on systems that create visibility, simplify work and move customers toward action.</p><div class="stats">${data.stats.map(s => `<article><h3>${s[0]}</h3><p>${s[1]}</p></article>`).join('')}</div></div>
  <div class="social-visual reveal">${imageSlot('assets/portfolio/social-growth/instagram-grid.png','Social media campaign grid','05')}<div class="mini-cards">${data.analytics.map(a => `<article><h4>${a[1]}</h4><p>${a[0]}</p></article>`).join('')}<article><h4>Steady momentum</h4><div class="chart" aria-hidden="true"></div></article></div></div>
</div></section>

<section id="process" class="section-dark"><div class="container">
  ${sectionHeading('How it works','A clear path from idea to <span>impact.</span>','No confusing process. No disappearing acts. Just focused collaboration from start to launch.')}
  <div class="timeline">${data.timeline.map(t => `<article class="reveal"><span>${t[0]}</span><h3>${t[1]}</h3><p>${t[2]}</p></article>`).join('')}</div>
</div></section>

<section class="cta-band"><div class="container cta-wrap"><div><p class="kicker">Your next move</p><h2>Ready to build something that moves your business forward?</h2><p>Let’s turn your idea into a system that works.</p></div><div class="actions"><a class="btn btn-light" href="${data.links.whatsapp}" target="_blank" rel="noreferrer">Chat on WhatsApp</a></div></div></section>

<footer id="contact"><div class="container footer"><div><a class="brand" href="#home"><span class="brand-mark">NP</span><span>Nairobi<strong>Pixel</strong></span></a><p>Digital systems for ambitious Kenyan businesses.</p></div><div><h4>Explore</h4><a href="#portfolio">Our work</a><a href="#services">Services</a><a href="#packages">Packages</a><a href="#process">Process</a></div><div><h4>Services</h4><p>Websites</p><p>Ordering systems</p><p>Dashboards</p><p>Automation</p></div><div><h4>Start a project</h4><a href="tel:+254700370377">0700 370 377</a><p>Nairobi, Kenya</p><a href="${data.links.whatsapp}" target="_blank" rel="noreferrer">WhatsApp →</a></div></div><div class="copy">© 2026 NairobiPixel. Built in Nairobi.</div></footer>`;

const toggle = document.querySelector('.menu-toggle');
const drawer = document.querySelector('.mobile-drawer');
const backdrop = document.querySelector('.mobile-backdrop');
const closeBtn = document.querySelector('.menu-close');
const closeMenu = () => { drawer.classList.remove('open'); backdrop.classList.remove('show'); toggle.setAttribute('aria-expanded','false'); document.body.classList.remove('no-scroll'); };
const openMenu = () => { drawer.classList.add('open'); backdrop.classList.add('show'); toggle.setAttribute('aria-expanded','true'); document.body.classList.add('no-scroll'); };
toggle.addEventListener('click', () => drawer.classList.contains('open') ? closeMenu() : openMenu());
closeBtn.addEventListener('click', closeMenu);
backdrop.addEventListener('click', closeMenu);
document.addEventListener('keydown', event => event.key === 'Escape' && closeMenu());
drawer.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('in'));
} else {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
  }), { threshold: .08, rootMargin: '0px 0px -30px' });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
