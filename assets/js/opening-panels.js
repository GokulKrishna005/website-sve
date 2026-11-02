(() => {
  const stage = document.querySelector('.intro-stage');
  const cue = stage?.querySelector('.entry-cue');
  if (!cue) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const slides = [
    {src: 'assets/images/opening/company-3.jpg', alt: 'Decorated event setting inside a transparent tent'},
    {src: 'assets/images/services/pagoda-tents/pagoda-tent-linked-row-01.jpeg', alt: 'A row of pagoda tents at an event venue'},
    {src: 'assets/images/opening/company-5.jpg', alt: 'Draped German tent interior ready for an event'},
    {src: 'assets/images/opening/company-6.jpg', alt: 'Illuminated German tent at dusk'},
    {src: 'assets/images/opening/company-1.jpg', alt: 'An award presentation at an event'}
  ];

  const host = document.createElement('div');
  host.className = 'opening-panels';
  const panel = document.createElement('div');
  panel.className = 'opening-panel';
  host.append(panel);
  cue.before(host);

  const frames = slides.map(({src, alt}, index) => {
    const frame = document.createElement('div');
    frame.className = `opening-frame${index === 0 ? ' active' : ''}`;
    frame.setAttribute('aria-hidden', String(index !== 0));
    const backdrop = new Image();
    backdrop.className = 'opening-backdrop';
    backdrop.src = src;
    backdrop.alt = '';
    backdrop.decoding = 'async';
    const photo = new Image();
    photo.className = 'opening-photo';
    photo.src = src;
    photo.alt = alt;
    photo.decoding = 'async';
    const mount = document.createElement('div');
    mount.className = 'opening-photo-mount';
    mount.append(photo);
    frame.append(backdrop, mount);
    panel.append(frame);
    return frame;
  });

  const left = document.createElement('div');
  const right = document.createElement('div');
  left.className = 'opening-curtain opening-curtain-left';
  right.className = 'opening-curtain opening-curtain-right';
  left.setAttribute('aria-hidden', 'true');
  right.setAttribute('aria-hidden', 'true');
  panel.append(left, right);

  let index = 0;
  let visible = false;
  let changing = false;
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(stage);

  const advance = () => {
    if (!visible || document.hidden || changing || reducedMotion.matches) return;
    changing = true;
    panel.classList.remove('curtains-open');
    setTimeout(() => {
      frames[index].classList.remove('active');
      frames[index].setAttribute('aria-hidden', 'true');
      index = (index + 1) % frames.length;
      frames[index].classList.add('active');
      frames[index].setAttribute('aria-hidden', 'false');
      requestAnimationFrame(() => {
        panel.classList.add('curtains-open');
        changing = false;
      });
    }, 520);
  };

  setTimeout(() => {
    host.classList.add('ready');
    panel.classList.add('curtains-open');
    if (!reducedMotion.matches) setInterval(advance, 3500);
  }, reducedMotion.matches ? 0 : 4200);
})();

