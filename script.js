const year = document.querySelector('#year');

if (year) {
  year.textContent = new Date().getFullYear();
}

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav a');
const statementBand = document.querySelector('.statement-band');

menuToggle.addEventListener('click', () => {
  const isOpen = header.classList.toggle('nav-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    header.classList.remove('nav-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  });
});

function updateHeaderStyle() {
  if (!statementBand) {
    return;
  }

  const statementBottom = statementBand.offsetTop + statementBand.offsetHeight;
  header.classList.toggle('is-colored', window.scrollY >= statementBottom - 12);
}

updateHeaderStyle();
window.addEventListener('scroll', updateHeaderStyle, { passive: true });
window.addEventListener('resize', updateHeaderStyle);

const caseTabs = document.querySelectorAll('[data-case-tab]');
const casePanels = document.querySelectorAll('[data-case-panel]');
const savedCase = localStorage.getItem('selectedCaseStudy');

function selectCaseStudy(selectedCase) {
  const selectedTab = [...caseTabs].find((tab) => tab.dataset.caseTab === selectedCase);

  if (!selectedTab) {
    return;
  }

  caseTabs.forEach((item) => {
    const isSelected = item === selectedTab;
    item.classList.toggle('is-active', isSelected);
    item.setAttribute('aria-selected', String(isSelected));
  });

  casePanels.forEach((panel) => {
    const isSelected = panel.dataset.casePanel === selectedCase;
    panel.classList.toggle('is-active', isSelected);
    panel.hidden = !isSelected;
  });
}

caseTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const selectedCase = tab.dataset.caseTab;
    selectCaseStudy(selectedCase);
    localStorage.setItem('selectedCaseStudy', selectedCase);
  });
});

if (savedCase) {
  selectCaseStudy(savedCase);
}

const hlTabs = document.querySelectorAll('[data-hl-tab]');
const hlPanels = document.querySelectorAll('[data-hl-panel]');

hlTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const selectedSection = tab.dataset.hlTab;

    hlTabs.forEach((item) => {
      const isSelected = item === tab;
      item.classList.toggle('is-active', isSelected);
      item.setAttribute('aria-selected', String(isSelected));
    });

    hlPanels.forEach((panel) => {
      const isSelected = panel.dataset.hlPanel === selectedSection;
      panel.classList.toggle('is-active', isSelected);
      panel.hidden = !isSelected;
    });
  });
});

const detailTabs = document.querySelectorAll('[data-detail-tab]');
const detailPanels = document.querySelectorAll('[data-detail-panel]');

detailTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const [group, section] = tab.dataset.detailTab.split(':');

    detailTabs.forEach((item) => {
      const isSameGroup = item.dataset.detailTab.startsWith(`${group}:`);
      const isSelected = item === tab;

      if (isSameGroup) {
        item.classList.toggle('is-active', isSelected);
        item.setAttribute('aria-selected', String(isSelected));
      }
    });

    detailPanels.forEach((panel) => {
      const isSameGroup = panel.dataset.detailPanel.startsWith(`${group}:`);
      const isSelected = panel.dataset.detailPanel === `${group}:${section}`;

      if (isSameGroup) {
        panel.classList.toggle('is-active', isSelected);
        panel.hidden = !isSelected;
      }
    });
  });
});

const skillTabs = document.querySelectorAll('[data-skill-tab]');
const skillPanels = document.querySelectorAll('[data-skill-panel]');

skillTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const selectedSkill = tab.dataset.skillTab;
    const isClosing = tab.classList.contains('is-active');

    skillTabs.forEach((item) => {
      const isSelected = !isClosing && item === tab;
      item.classList.toggle('is-active', isSelected);
      item.setAttribute('aria-selected', String(isSelected));
    });

    skillPanels.forEach((panel) => {
      const isSelected = !isClosing && panel.dataset.skillPanel === selectedSkill;
      panel.classList.toggle('is-active', isSelected);
      panel.setAttribute('aria-hidden', String(!isSelected));
    });
  });
});

const pixelGrid = document.querySelector('[data-pixel-grid]');
const pixelSwatches = document.querySelectorAll('[data-pixel-color]');
let activePixelColor = '#010626';

if (pixelGrid && pixelSwatches.length) {
  const starterPixels = new Map([
    [17, '#D94179'],
    [18, '#D94179'],
    [33, '#D94179'],
    [50, '#D94179'],
    [67, '#F2A766'],
    [68, '#F2A766'],
    [69, '#F2A766'],
    [84, '#F2A766'],
    [99, '#141259'],
    [100, '#141259'],
    [101, '#141259'],
    [116, '#141259'],
    [132, '#010626'],
    [148, '#010626'],
    [164, '#010626'],
    [180, '#010626'],
  ]);

  pixelSwatches.forEach((swatch) => {
    swatch.addEventListener('click', () => {
      activePixelColor = swatch.dataset.pixelColor;

      pixelSwatches.forEach((item) => {
        item.classList.toggle('is-active', item === swatch);
      });
    });
  });

  for (let index = 0; index < 256; index += 1) {
    const cell = document.createElement('button');
    const starterColor = starterPixels.get(index);

    cell.className = 'pixel-cell';
    cell.type = 'button';
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `Paint pixel ${index + 1}`);

    if (starterColor) {
      cell.style.background = starterColor;
    }

    cell.addEventListener('click', () => {
      cell.style.background = activePixelColor;
    });

    pixelGrid.append(cell);
  }
}

const gallery = document.querySelector('.case-gallery');
const galleryTracks = document.querySelectorAll('.case-gallery-track');
let galleryRampFrame;

function rampGallerySpeed(targetRate) {
  cancelAnimationFrame(galleryRampFrame);

  const animations = [...galleryTracks].flatMap((track) => track.getAnimations());
  const startRates = animations.map((animation) => animation.playbackRate || 1);
  const startTime = performance.now();
  const duration = 700;

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    animations.forEach((animation, index) => {
      animation.playbackRate = startRates[index] + (targetRate - startRates[index]) * eased;
    });

    if (progress < 1) {
      galleryRampFrame = requestAnimationFrame(step);
    }
  }

  galleryRampFrame = requestAnimationFrame(step);
}

if (gallery) {
  gallery.addEventListener('mouseenter', () => rampGallerySpeed(0.28));
  gallery.addEventListener('mouseleave', () => rampGallerySpeed(1));
}

document.querySelectorAll('.website-portal').forEach((portal) => {
  const iframe = portal.querySelector('iframe');

  if (iframe) {
    iframe.addEventListener('load', () => {
      portal.classList.add('is-live');
    });
  }
});

const heroPuzzle = document.querySelector('.hero-puzzle');
const puzzlePieces = document.querySelectorAll('.puzzle-piece');
const puzzleSolve = document.querySelector('.puzzle-solve');
const puzzleLayout = [
  [0, 0, 24.3, 23.8],
  [24.3, 0, 31.5, 23.8],
  [55.8, 0, 23.4, 14.6],
  [79.1, 0, 20.9, 23],
  [78.3, 0, 0.3, 85.5],
  [55.8, 14.6, 23.3, 8.4],
  [57.7, 22.3, 21.3, 0.8],
  [55.9, 22.9, 22.9, 0.2],
  [76.9, 22.3, 2, 0.7],
  [79.1, 23, 20.9, 44.4],
  [0, 23.8, 30.1, 44],
  [30.1, 23.8, 25.7, 44],
  [55.8, 23, 10.8, 25.4],
  [66.6, 23, 12.5, 25.4],
  [55.8, 48.4, 10.8, 18.5],
  [66.6, 48.4, 12.5, 18.3],
  [67.1, 66.7, 12, 0.3],
  [57.9, 66.9, 21, 0.2],
  [78.5, 66.9, 0.2, 0.2],
  [79.1, 67.4, 20.9, 32.6],
  [0, 67.8, 30.1, 32.4],
  [30.1, 67.8, 25.7, 32.4],
  [55.8, 67.4, 23.3, 32.4],
];

if (heroPuzzle && puzzlePieces.length) {
  const shuffledGrid = [
    [25, 0],
    [50, 0],
    [75, 0],
    [100, 0],
    [25, 20],
    [50, 20],
    [75, 20],
    [100, 20],
    [25, 40],
    [50, 40],
    [75, 40],
    [100, 40],
    [25, 60],
    [50, 60],
    [75, 60],
    [100, 60],
    [25, 80],
    [50, 80],
    [75, 80],
    [100, 80],
    [37.5, 50],
    [62.5, 70],
    [87.5, 30],
  ];
  const shuffleOrder = [11, 4, 18, 1, 21, 8, 15, 2, 19, 6, 13, 0, 22, 9, 16, 5, 20, 7, 14, 3, 17, 10, 12];
  const manualGridOverrides = {
    9: [100, 60],
    19: [100, 80],
  };

  puzzlePieces.forEach((piece, index) => {
    const [x, y, width, height] = puzzleLayout[index] || [0, 0, 18, 18];
    const [gridX, gridY] = manualGridOverrides[index] || shuffledGrid[shuffleOrder[index]] || [0, 0];
    const scatterSpread = 1.18;
    const scatterX = (gridX - x) * scatterSpread;
    const scatterY = (gridY - y) * 1.08;
    const rotate = ((index % 7) - 3) * 2.6;

    piece.setAttribute('role', 'button');
    piece.setAttribute('tabindex', '0');
    piece.setAttribute('aria-label', 'Reveal and move image slice');
    piece.setAttribute('draggable', 'false');
    piece.style.setProperty('--home-x', `${x}%`);
    piece.style.setProperty('--home-y', `${y}%`);
    piece.style.setProperty('--piece-w', `${width}%`);
    piece.style.setProperty('--piece-h', `${height}%`);
    piece.style.setProperty('--scatter-x', `${scatterX}%`);
    piece.style.setProperty('--scatter-y', `${scatterY}%`);
    piece.style.setProperty('--scatter-r', '0deg');
    piece.style.setProperty('--float-delay', `${(index % 6) * -0.42}s`);
  });

  let dragState = null;
  let movedPiece = false;

  function togglePuzzleAssembly() {
    heroPuzzle.classList.toggle('is-assembled');

    if (heroPuzzle.classList.contains('is-assembled')) {
      puzzlePieces.forEach((piece) => {
        piece.style.setProperty('--drag-x', '0px');
        piece.style.setProperty('--drag-y', '0px');
        piece.classList.add('is-flipped');
      });
    }
  }

  heroPuzzle.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      togglePuzzleAssembly();
    }
  });

  if (puzzleSolve) {
    puzzleSolve.addEventListener('click', (event) => {
      event.stopPropagation();
      heroPuzzle.classList.add('is-assembled');

      puzzlePieces.forEach((piece) => {
        piece.style.setProperty('--drag-x', '0px');
        piece.style.setProperty('--drag-y', '0px');
        piece.classList.add('is-flipped');
      });
    });
  }

  puzzlePieces.forEach((piece) => {
    piece.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      movedPiece = false;
      piece.classList.add('is-dragging');
      piece.setPointerCapture(event.pointerId);
      const currentX = Number.parseFloat(piece.style.getPropertyValue('--drag-x')) || 0;
      const currentY = Number.parseFloat(piece.style.getPropertyValue('--drag-y')) || 0;
      dragState = {
        piece,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: currentX,
        originY: currentY,
        wasAssembled: heroPuzzle.classList.contains('is-assembled'),
      };
    });

    piece.addEventListener('pointermove', (event) => {
      if (!dragState || dragState.piece !== piece) {
        return;
      }

      const nextX = dragState.originX + event.clientX - dragState.startX;
      const nextY = dragState.originY + event.clientY - dragState.startY;

      if (Math.abs(event.clientX - dragState.startX) > 3 || Math.abs(event.clientY - dragState.startY) > 3) {
        movedPiece = true;
      }

      piece.style.setProperty('--drag-x', `${nextX}px`);
      piece.style.setProperty('--drag-y', `${nextY}px`);
    });

    piece.addEventListener('pointerup', (event) => {
      if (!dragState || dragState.piece !== piece) {
        return;
      }

      piece.releasePointerCapture(event.pointerId);
      piece.classList.remove('is-dragging');
      dragState = null;
    });

    piece.addEventListener('dragstart', (event) => {
      event.preventDefault();
    });

    piece.addEventListener('click', (event) => {
      event.stopPropagation();

      if (movedPiece) {
        movedPiece = false;
        return;
      }

      piece.classList.add('is-flipped');
    });

    piece.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        piece.classList.add('is-flipped');
      }
    });
  });
}
