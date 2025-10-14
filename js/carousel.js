// Small accessible carousel for the filiere-grid
(function () {
  const carousel = document.querySelector('.filiere-carousel');
  if (!carousel) return;
  const track = carousel.querySelector('.filiere-grid');
  const prev = carousel.querySelector('.carousel-btn.prev');
  const next = carousel.querySelector('.carousel-btn.next');

  const scrollByPage = (dir = 1) => {
    const width = track.clientWidth;
    track.scrollBy({ left: width * dir, behavior: 'smooth' });
  };

  prev.addEventListener('click', () => scrollByPage(-1));
  next.addEventListener('click', () => scrollByPage(1));

  // keyboard support when user focuses inside the carousel
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByPage(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollByPage(1); }
  });

  // make container focusable for keyboard listeners
  track.tabIndex = 0;
})();
