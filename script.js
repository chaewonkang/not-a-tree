const THEME_KEY = 'nat-theme';
const html = document.documentElement;
const toggle = document.getElementById('themeToggle');
const label = document.getElementById('toggleLabel');

// Sync scroll-padding-top with sticky header height
function updateScrollPadding() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  html.style.scrollPaddingTop = header.offsetHeight + 24 + 'px';
}

updateScrollPadding();
window.addEventListener('resize', updateScrollPadding, { passive: true });

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  label.textContent = theme === 'dark' ? 'Light' : 'Dark';
  toggle.setAttribute('aria-label', theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환');
}

function getInitialTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

toggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

applyTheme(getInitialTheme());

// Scroll-triggered reveal
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('[data-animate]').forEach((el) => {
  revealObserver.observe(el);
});

// TOC active section tracking
const tocLinks = document.querySelectorAll('.toc-link');
const sections = document.querySelectorAll('#s-questions, #s-about, #s-output, #s-how, #s-fit, #s-apply');

let activeSectionId = null;

const tocObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeSectionId = entry.target.id;
        tocLinks.forEach((link) => {
          const isActive = link.dataset.section === activeSectionId;
          link.classList.toggle('active', isActive);
        });
      }
    });
  },
  { threshold: 0.25, rootMargin: '-10% 0px -60% 0px' }
);

sections.forEach((sec) => tocObserver.observe(sec));

// Quotes
(function () {
  const QUOTES = [
    {
      ko: "디자인은 단순히 어떻게 보이고 느껴지는가의 문제가 아닙니다. 디자인은 어떻게 작동하는가입니다.",
      en: "Design is not just what it looks like and feels like. Design is how it works.",
      author: "Steve Jobs",
    },
    {
      ko: "완벽함이란 더 이상 더할 것이 없을 때가 아니라, 더 이상 뺄 것이 없을 때 이루어진다.",
      en: "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.",
      author: "Antoine de Saint-Exupéry",
    },
    {
      ko: "디테일은 디테일이 아닙니다. 디테일이 디자인을 만듭니다.",
      en: "The details are not the details. They make the design.",
      author: "Charles Eames",
    },
    {
      ko: "가장 심오한 기술은 사라지는 기술입니다. 그것은 일상의 직물 속에 스며들어 더 이상 구별할 수 없게 됩니다.",
      en: "The most profound technologies are those that disappear. They weave themselves into the fabric of everyday life until they are indistinguishable from it.",
      author: "Mark Weiser",
    },
    {
      ko: "기술은 좋지도 나쁘지도 않습니다. 그렇다고 중립적이지도 않습니다.",
      en: "Technology is neither good nor bad; nor is it neutral.",
      author: "Melvin Kranzberg",
    },
    {
      ko: "프로그래밍에 대한 사고방식에 영향을 주지 않는 언어는 배울 가치가 없습니다.",
      en: "A language that doesn't affect the way you think about programming is not worth knowing.",
      author: "Alan Perlis",
    },
    {
      ko: "추상화의 목적은 모호해지는 것이 아니라, 완전히 정확해질 수 있는 새로운 의미의 층위를 만드는 것입니다.",
      en: "The purpose of abstracting is not to be vague, but to create a new semantic level in which one can be absolutely precise.",
      author: "Edsger W. Dijkstra",
    },
    {
      ko: "컴퓨터가 생각할 수 있는가라는 질문은, 잠수함이 수영할 수 있는가라는 질문보다 더 흥미롭지 않습니다.",
      en: "The question of whether a computer can think is no more interesting than the question of whether a submarine can swim.",
      author: "Edsger W. Dijkstra",
    },
    {
      ko: "우리는 구석기 시대의 감정, 중세의 제도, 그리고 신과 같은 기술을 가지고 있습니다.",
      en: "We have Paleolithic emotions, medieval institutions, and godlike technology.",
      author: "E. O. Wilson",
    },
    {
      ko: "모든 것은 디자인됩니다. 하지만 잘 디자인된 것은 드뭅니다.",
      en: "Everything is designed. Few things are designed well.",
      author: "Brian Reed",
    },
  ];

  const box    = document.querySelector('.quotes-box');
  const inner  = box && box.querySelector('.quote-inner');
  const textEl = box && box.querySelector('.quote-text');
  const enEl   = box && box.querySelector('.quote-text-en');
  const authEl = box && box.querySelector('.quote-author');
  if (!box) return;

  let current = Math.floor(Math.random() * QUOTES.length);

  function render(q) {
    textEl.textContent = q.ko;
    enEl.textContent   = q.en;
    authEl.textContent = '— ' + q.author;
  }

  function show(index) {
    inner.classList.add('fade-out');
    setTimeout(() => {
      render(QUOTES[index]);
      inner.classList.remove('fade-out');
    }, 400);
  }

  function next() {
    current = (current + 1) % QUOTES.length;
    show(current);
  }

  render(QUOTES[current]);

  // Auto-advance every 6s
  let timer = setInterval(next, 6000);

  function advance() {
    clearInterval(timer);
    next();
    timer = setInterval(next, 6000);
  }

  box.addEventListener('click', advance);
}());

// Letter scramble for site title
(function () {
  const FONTS = [
    "'Playfair Display', serif",
    "'Abril Fatface', serif",
    "'Bebas Neue', sans-serif",
    "'Dancing Script', cursive",
    "'Space Mono', monospace",
    "'Courier Prime', monospace",
    "'JetBrains Mono', monospace",
    "-apple-system, sans-serif",
  ];

  const title = document.querySelector('.site-title');
  if (!title) return;

  // Split into individual letter spans
  title.innerHTML = Array.from(title.textContent).map((ch) => {
    if (ch === ' ') return '<span class="letter-space" aria-hidden="true"></span>';
    return `<span class="letter">${ch}</span>`;
  }).join('');

  const letters = title.querySelectorAll('.letter');
  let scrambleInterval = null;

  function randomFont() {
    return FONTS[Math.floor(Math.random() * FONTS.length)];
  }

  function startScramble() {
    if (scrambleInterval) return;
    scrambleInterval = setInterval(() => {
      letters.forEach((letter) => {
        letter.style.fontFamily = randomFont();
      });
    }, 100);
  }

  function stopScramble() {
    clearInterval(scrambleInterval);
    scrambleInterval = null;
  }

  let scrollTimer = null;

  window.addEventListener('scroll', () => {
    startScramble();
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(stopScramble, 200);
  }, { passive: true });
}());
