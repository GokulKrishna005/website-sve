// Regenerate the nine static service pages after editing this catalogue.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const captions = JSON.parse(fs.readFileSync(path.join(__dirname, 'photo-captions.json'), 'utf8'));
const existing = new Set(fs.readdirSync(path.join(root, 'assets/images/work')));

const services = [
  {
    slug: 'german-tents', title: 'German Tents', group: 'german-tents',
    lead: 'A covered setting with room for the whole occasion.',
    intro: 'German tents create a flexible, weather-conscious space for large gatherings. These photographs show different exterior, interior, and installation views from company projects.',
    uses: ['Conference and audience seating', 'Wedding and reception layouts', 'Covered event and dining areas'],
    photos: ['german-tent-open-front-01.jpeg','german-tent-open-frame-01.jpeg','german-tent-conference-interior-01.jpeg','german-tent-white-enclosure-01.jpeg','german-tent-draped-night-01.jpeg','german-tent-seating-lawn-01.jpeg','german-tent-windowed-exterior-01.jpeg','german-tent-empty-interior-01.jpeg']
  },
  {
    slug: 'pagoda-tents', title: 'Pagoda Tents', group: 'pagoda-tents',
    lead: 'A distinctive canopy for smaller outdoor spaces.',
    intro: 'The pointed roof of a pagoda tent gives entry points, counters, and garden areas a clear visual identity. Single units and connected arrangements can suit different site plans.',
    uses: ['Welcome and registration areas', 'Outdoor counters and food stations', 'Garden and open-air gatherings'],
    photos: ['pagoda-tent-pair-open-front-01.jpeg','pagoda-tent-single-outdoor-01.jpeg','pagoda-tent-linked-row-01.jpeg','pagoda-tent-row-night-01.jpeg']
  },
  {
    slug: 'octonorm-stalls', title: 'Octonorm Stalls', group: 'octonorm-stalls',
    lead: 'Modular exhibition space that helps exhibitors stand out.',
    intro: 'Octonorm layouts offer a practical framework for exhibition stalls and information counters. The photographs show both individual booths and rows of modular spaces.',
    uses: ['Trade fairs and expos', 'Product demonstrations', 'Branded information counters'],
    photos: ['octonorm-stall-expo-front-01.jpeg','octonorm-stall-white-modular-01.jpeg','octonorm-stall-row-indoor-01.jpeg','octonorm-stall-single-indoor-01.jpeg']
  },
  {
    slug: 'jewellery-showcases', title: 'Jewellery Showcases', group: 'jewellery-showcases',
    lead: 'A thoughtful setting for the pieces people come to see.',
    intro: 'Display counters, illuminated details, and exhibition layouts help jewellery presentations feel considered. These project photos show several completed showcase arrangements.',
    uses: ['Jewellery exhibitions', 'Retail pop-ups', 'Premium product presentations'],
    photos: ['jewellery-showcase-mk-jewels-corner-01.jpeg','jewellery-showcase-mk-jewels-front-01.jpeg','jewellery-showcase-darshan-interior-01.jpeg','jewellery-showcase-rj-jewellers-01.jpeg','jewellery-showcase-limelight-01.jpeg']
  },
  {
    slug: 'stages-platforms', title: 'Stages & Platforms', group: 'stages-lighting',
    lead: 'Give each presentation a place to focus on.',
    intro: 'A stage establishes the focal point for a ceremony, speech, or performance. The images below show stage arrangements in covered event spaces, with screens and seating around them.',
    uses: ['Ceremonies and awards', 'Speeches and conferences', 'Performances and presentations'],
    photos: ['event-stage-colour-lights-01.jpeg','event-stage-colour-lights-02.jpeg','event-stage-auditorium-tent-01.jpeg']
  },
  {
    slug: 'furniture', title: 'Furniture', group: 'furniture-seating',
    lead: 'Comfortable layouts for the people who make the event.',
    intro: 'From formal banquet tables to relaxed lounge seating, the right furniture shapes how guests use a space. These photographs show several seating and table arrangements.',
    uses: ['Banquet dining', 'Audience and conference seating', 'Lounge and hospitality zones'],
    photos: ['event-seating-banquet-blue-01.jpeg','event-seating-lounge-sofas-01.jpeg','event-seating-white-sofas-01.jpeg','event-furniture-bar-table-stools-01.jpeg','event-seating-banquet-white-01.jpeg','event-seating-banquet-outdoor-01.jpeg','event-seating-banquet-gold-01.jpeg','event-seating-blue-under-tent-01.jpeg']
  },
  {
    slug: 'branding', title: 'Branding', group: 'registration-desks',
    lead: 'Make the first point of contact feel like your event.',
    intro: 'Registration counters and backdrops can carry the event identity while helping guests find their way. These photographs focus on branded entry and check-in areas.',
    uses: ['Registration and check-in', 'Sponsor and event backdrops', 'Exhibition welcome areas'],
    photos: ['registration-desk-blue-backdrop-01.jpeg','registration-desk-indoor-queue-01.jpeg','registration-desk-outdoor-multi-counter-01.jpeg']
  },
  {
    slug: 'carpeting', title: 'Carpeting', group: 'german-tents',
    lead: 'A clear path and a finished floor for the event.',
    intro: 'Carpeting helps define entrances, aisles, and covered spaces. The company photos here show red-carpet approaches at tent installations; ask us about colours and floor coverage for your venue.',
    uses: ['Entrances and arrival routes', 'Aisles through covered spaces', 'Stage and exhibition approaches'],
    photos: ['german-tent-entry-red-carpet-01.jpeg','german-tent-red-carpet-exterior-01.jpeg','german-tent-red-carpet-exterior-02.jpeg']
  },
  {
    slug: 'sound-lighting', title: 'Sound & Lighting', group: 'stages-lighting',
    lead: 'Let the audience see and hear the moment.',
    intro: 'Lighting rigs, loudspeakers, and stage effects support speeches and performances. These photographs show the equipment and the atmosphere it helps create at real events.',
    uses: ['Speeches and presentations', 'Stage shows and performances', 'Evening celebrations'],
    photos: ['event-stage-auditorium-tent-01.jpeg','event-stage-colour-lights-01.jpeg','event-stage-colour-lights-02.jpeg']
  }
];

const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const tentSizes = {
  'german-tents': [
    ['German tents', ['20 × 250', '30 × 200', '40 × 400', '50 × 200', '66 × 200', '80 × 200', '100 × 300', '133 × 300']],
    ['Transparent German tents', ['20 × 83', '30 × 83', '40 × 120', '50 × 120']]
  ],
  'pagoda-tents': [
    ['Pagoda tents', ['20 × 20', '15 × 15', '10 × 10']]
  ]
};
const imagePath = (service, file) => `../assets/images/${existing.has(file) ? 'work' : 'services/' + service.group}/${file}`;
const output = path.join(root, 'services');
fs.mkdirSync(output, { recursive: true });

for (const [index, service] of services.entries()) {
  for (const file of service.photos) {
    const local = path.join(root, imagePath(service, file).slice(3));
    if (!fs.existsSync(local)) throw new Error(`Missing photo: ${local}`);
  }
  const cover = imagePath(service, service.photos[0]);
  const pictures = service.photos.map((file, i) => {
    const caption = captions[file] || file.replace(/-\d+\.jpeg$/, '').replace(/-/g, ' ');
    const src = imagePath(service, file);
    return `<figure class="detail-photo"><a href="${src}" target="_blank" rel="noopener" aria-label="Open full photo: ${escape(caption)}"><img src="${src}" alt="${escape(caption)}" width="1200" height="900" loading="lazy" decoding="async"></a><figcaption><span>${String(i + 1).padStart(2, '0')} / ${String(service.photos.length).padStart(2, '0')}</span>${escape(caption)}</figcaption></figure>`;
  }).join('\n');
  const related = services.filter(other => other.slug !== service.slug).slice((index + 1) % services.length).concat(services.filter(other => other.slug !== service.slug)).slice(0, 3);
  const enquiry = `../index.html?service=${encodeURIComponent(service.title)}#enquiry`;
  const isTent = service.slug === 'german-tents' || service.slug === 'pagoda-tents';
  const tentType = service.slug === 'german-tents' ? 'german' : 'pagoda';
  const heroVisual = isTent
    ? `<div class="detail-hero-viewer" id="tent-3d"><div class="tent-grid" id="tent-viewers" data-tent-type="${tentType}"></div><p class="tent-disclaimer">Illustrative 3D concept, not exact product specifications. Confirm available sizes, colours, and side walls with our team.</p><noscript><p>Enable JavaScript to rotate the model. The project photographs below remain available without JavaScript.</p></noscript></div>`
    : `<figure class="detail-cover"><img src="${cover}" alt="${escape(captions[service.photos[0]] || service.title)}" width="1200" height="900" fetchpriority="high"><figcaption>From our work · ${escape(service.title)}</figcaption></figure>`;
  const sizeSection = isTent ? `<section class="detail-sizes" aria-labelledby="sizes-title"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">STANDARD SIZES AVAILABLE</p><h2 id="sizes-title">Find a fit for your space.</h2></div><p>Sizes below follow the company chart. Measurement units were not specified; ask us to confirm exact dimensions and availability for your event.</p></div><div class="size-groups">${tentSizes[service.slug].map(([label, sizes]) => `<div class="size-group"><h3>${escape(label)}</h3><ul>${sizes.map(size => `<li>${escape(size)}</li>`).join('')}</ul></div>`).join('')}</div></div></section>` : '';
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(service.title)} | Sree Vijayalakshmi Enterprises</title>
<meta name="description" content="Explore ${escape(service.title.toLowerCase())} projects, photos, and use cases from Sree Vijayalakshmi Enterprises in Bengaluru.">
<meta name="theme-color" content="#ffffff">
<link rel="icon" href="../assets/images/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../assets/css/styles.css">
<link rel="stylesheet" href="../assets/css/theme-animation.css">
<link rel="stylesheet" href="../assets/css/paper-theme.css">
<link rel="stylesheet" href="../assets/css/service-detail.css?v=8">
${isTent ? '<link rel="stylesheet" href="../assets/css/tents.css?v=7">' : ''}
<script src="../assets/js/theme.js" defer></script>
${isTent ? '<script src="../assets/js/tents.js?v=7" defer></script>' : ''}
</head>
<body>
<button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch to dark theme" aria-pressed="false" hidden><span class="theme-label">Dark mode</span></button>
<a class="skip" href="#main">Skip to content</a>
<div class="topbar"><div class="wrap"><span>Based in Bengaluru. Built for occasions across South India.</span><a href="tel:+919902044446">+91 99020 44446 ↗</a></div></div>
<header class="wrap header detail-header"><a class="brand" href="../index.html" aria-label="Sree Vijayalakshmi Enterprises home"><img class="header-logo" src="../assets/images/sve-mark.svg" width="435" height="195" alt="SVE"><span class="brand-name">SREE VIJAYALAKSHMI<br>ENTERPRISES</span></a><nav aria-label="Main navigation"><a href="../index.html#services">All services</a><a href="../index.html#gallery">Gallery</a><a class="nav-cta" href="${enquiry}">Plan your event ↗</a></nav></header>
<main id="main">
<section class="detail-hero"><div class="wrap detail-hero-grid"><div class="detail-heading"><a class="detail-back" href="../index.html#services">← Back to all services</a><p class="eyebrow">${String(index + 1).padStart(2, '0')} / OUR SERVICES</p><h1>${escape(service.title)}</h1><p class="detail-lead">${escape(service.lead)}</p><p>${escape(service.intro)}</p><div class="detail-actions"><a class="button" href="${enquiry}">Ask about ${escape(service.title)} <span>↗</span></a>${isTent ? '<a class="underlined" href="#tent-3d">Explore in 3D ↓</a>' : ''}<a class="underlined" href="#project-photos">View project photos ↓</a></div></div>${heroVisual}</div></section>
<section class="detail-uses wrap" aria-labelledby="use-title"><div><p class="eyebrow">WHERE IT FITS</p><h2 id="use-title">Made for the occasion.</h2></div><ul>${service.uses.map(use => `<li>${escape(use)}</li>`).join('')}</ul></section>
${sizeSection}
<section class="detail-gallery" id="project-photos"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">FROM OUR WORK / ${String(service.photos.length).padStart(2, '0')} PHOTOS</p><h2>${escape(service.title)} in focus.</h2></div><p>Explore these company project photos. Select an image to open the full photograph.</p></div><div class="detail-grid">${pictures}</div></div></section>
<section class="detail-next wrap"><div><p class="eyebrow">LET'S PLAN YOUR SETUP</p><h2>Tell us what you have in mind.</h2><p>Share the date, venue, and size of your event. We can discuss a suitable setup and confirm availability in a quotation.</p></div><a class="button" href="${enquiry}">Request a quotation <span>↗</span></a></section>
<section class="detail-related wrap"><p class="eyebrow">MORE TO EXPLORE</p><h2>Explore other services.</h2><div class="detail-related-list">${related.map(item => `<a href="${item.slug}.html">${escape(item.title)} <span>↗</span></a>`).join('')}</div></section>
</main>
<footer><div class="wrap footer-top"><a class="brand footer-brand" href="../index.html"><img class="header-logo" src="../assets/images/sve-mark.svg" width="435" height="195" alt="SVE"><span class="brand-name">SREE VIJAYALAKSHMI<br>ENTERPRISES</span></a><p>One place for all your event solutions.</p><a href="../index.html#services">All services ↑</a></div><div class="wrap footer-bottom"><span>© ${new Date().getFullYear()} Sree Vijayalakshmi Enterprises</span><span>Bengaluru, Karnataka · Serving South India</span></div></footer>
</body></html>\n`;
  fs.writeFileSync(path.join(output, `${service.slug}.html`), html);
}
console.log(`Generated ${services.length} service pages.`);
