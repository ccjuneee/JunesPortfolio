/* ============================================
   JUN CHENG — PORTFOLIO
   main.js
   ============================================ */

'use strict';

/* ---- THEME TOGGLE (runs first to avoid flash of wrong theme) ---- */
const themeToggle = document.getElementById('themeToggle');
const STORAGE_KEY  = 'jc-portfolio-theme';

// Apply saved theme immediately — before paint
function updateToggleLabel(theme) {
  themeToggle.setAttribute(
    'aria-label',
    theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
  );
}
function updateLogo(theme) {
  document.querySelectorAll('.nav-logo__img').forEach((img) => {
    img.src = theme === 'light'
      ? './assets/images/Logo_Light.png'    // light模式 → 深色logo
      : './assets/images/Logo_Dark.png';  // dark模式 → 浅色logo
  });
}

const savedTheme = localStorage.getItem(STORAGE_KEY);
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateToggleLabel(savedTheme);
  updateLogo(savedTheme);
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(STORAGE_KEY, next);
  updateToggleLabel(next);
  updateLogo(next);
});
/* ---- CUSTOM CURSOR ---- */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
const cursorGlow = document.getElementById('cursorGlow');

// Current mouse position (dot snaps here instantly)
let mouseX = -100, mouseY = -100;
// Ring position (lerps toward mouse each frame)
let ringX  = -100, ringY  = -100;

// Move dot and glow to exact mouse position immediately
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left  = mouseX + 'px';
  cursorDot.style.top   = mouseY + 'px';
  cursorGlow.style.left = mouseX + 'px';
  cursorGlow.style.top  = mouseY + 'px';
});

// Ring follows with lerp each animation frame — creates the lag effect
function animateRing() {
  // Lerp factor: 0.12 = slow/smooth, 0.2 = snappier
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
requestAnimationFrame(animateRing);

// Hide all layers when cursor leaves the window
document.addEventListener('mouseleave', () => {
  cursorDot.style.opacity  = '0';
  cursorRing.style.opacity = '0';
  cursorGlow.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursorDot.style.opacity  = '1';
  cursorRing.style.opacity = '0.5';
  cursorGlow.style.opacity = '1';
});

// Hover detection: scale up on interactive elements
const interactiveSelector = 'a, button, [role="button"], input, textarea, select, label, .project-card, .skill-tag, .social-link';
const textSelector        = 'input[type="text"], input[type="email"], textarea';

document.querySelectorAll(interactiveSelector).forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursorDot.classList.add('is-hovering');
    cursorRing.classList.add('is-hovering');
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('is-hovering');
    cursorRing.classList.remove('is-hovering');
  });
});

// Hide cursor over text inputs (browser shows text I-beam instead)
document.querySelectorAll(textSelector).forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursorDot.classList.add('is-text');
    cursorRing.classList.add('is-text');
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('is-text');
    cursorRing.classList.remove('is-text');
  });
});


/* ---- NAVBAR SCROLL STATE ---- */
const navbar = document.getElementById('navbar');

const handleNavScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
};
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();


/* ---- MOBILE NAV TOGGLE ---- */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});


/* ---- SMOOTH SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ---- ACTIVE NAV LINK (scroll-position based) ---- */
// Watches each section and marks the matching nav link as active
const sections    = document.querySelectorAll('main section[id]');
const navAnchors  = document.querySelectorAll('.nav-links a[href^="#"]');

const activateNavLink = () => {
  // Find the section whose top edge is closest to (but still above) 40% of the viewport
  const trigger = window.innerHeight * 0.4;
  let current   = '';

  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop <= trigger) {
      current = section.getAttribute('id');
    }
  });

  navAnchors.forEach((link) => {
    link.classList.toggle(
      'nav-active',
      link.getAttribute('href') === `#${current}`
    );
  });
};

window.addEventListener('scroll', activateNavLink, { passive: true });
activateNavLink(); // run once on load


/* ---- .reveal SCROLL OBSERVER (existing system, unchanged) ---- */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach((el) => revealObserver.observe(el));


/* ---- .animate-on-scroll OBSERVER (new explicit system) ---- */
// Targets any element with class="animate-on-scroll"
// Adds "animated" when it enters the viewport — CSS handles the transition
const animateElements = document.querySelectorAll('.animate-on-scroll');

const animateObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        animateObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

animateElements.forEach((el) => animateObserver.observe(el));


/* ---- STAGGERED GRID CHILDREN ---- */
// For any .stagger-grid, assign a CSS --delay variable to each direct child
// so cards animate in one after another without hardcoding delay classes in HTML
document.querySelectorAll('.stagger-grid').forEach((grid) => {
  Array.from(grid.children).forEach((child, i) => {
    child.style.setProperty('--delay', `${i * 80}ms`);
    // Also make each child an animate-on-scroll target automatically
    child.classList.add('animate-on-scroll');
    animateObserver.observe(child);
  });
});

/* ---- WORK UNIVERSE ---- */
const workTagsField  = document.getElementById('workTagsField');
const workStage      = document.getElementById('workStage');
const workStageClose = document.getElementById('workStageClose');
const stageTitle     = document.getElementById('stageTitle');
const stageTag       = document.getElementById('stageTag');
const stageProjTitle = document.getElementById('stageProjTitle');
const stageProjDesc  = document.getElementById('stageProjDesc');
const workCarousel   = document.getElementById('workCarousel');
const carouselPrev   = document.getElementById('carouselPrev');
const carouselNext   = document.getElementById('carouselNext');
const workData       = document.getElementById('workData');

let carouselItems  = [];
let carouselIndex  = 0;

let activeCategory = null;

// ── 磁吸效果 ──
document.querySelectorAll('.work-tag').forEach((tag) => {
  tag.addEventListener('mousemove', (e) => {
    const rect   = tag.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) * 0.28;
    const dy     = (e.clientY - cy) * 0.28;
    tag.style.setProperty('--mx', dx + 'px');
    tag.style.setProperty('--my', dy + 'px');
  });

  tag.addEventListener('mouseleave', () => {
    tag.style.setProperty('--mx', '0px');
    tag.style.setProperty('--my', '0px');
  });

  // hover 整体 dim
  tag.addEventListener('mouseenter', () => {
    workTagsField.classList.add('has-hover');
  });
  tag.addEventListener('mouseleave', () => {
    workTagsField.classList.remove('has-hover');
  });
});

// ── 轮播渲染 ──
function buildCarousel(category) {
  const dataEl = workData.querySelector(`[data-category="${category}"]`);
  if (!dataEl) return;

  carouselItems = Array.from(dataEl.querySelectorAll('article'));
  carouselIndex = 0;
  workCarousel.innerHTML = '';

  carouselItems.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'work-carousel-item';
    div.dataset.index = i;

    const img = document.createElement('img');
    img.src     = item.dataset.thumb || '';
    img.alt     = item.dataset.modalTitle || '';
    img.loading = i === 0 ? 'eager' : 'lazy';
    div.appendChild(img);

    // 悬停非中心 → 切换
    div.addEventListener('mouseenter', () => {
      if (!div.classList.contains('is-center')) {
        goCarousel(Number(div.dataset.index));
      }
    });

    // 点击中心 → 开 modal
div.addEventListener('click', () => {
  if (div.classList.contains('is-center')) {
    openModal(item);
  } else {
    // 非中心：先切换到这张，短暂延迟后打开 modal
    goCarousel(Number(div.dataset.index));
    setTimeout(() => openModal(item), 300);
  }
});

    workCarousel.appendChild(div);
  });

  // 初始化状态
  goCarousel(0);
}

let isAnimating = false;   // ← 在函数外面加这一行（和 carouselIndex 放在一起）

function goCarousel(index) {
  if (isAnimating) return;           // 动画中直接忽略
  const total = carouselItems.length;
  carouselIndex = (index + total) % total;

  workCarousel.querySelectorAll('.work-carousel-item').forEach((el, i) => {
    el.classList.remove('is-center', 'is-left', 'is-right');
    el.style.opacity       = '';
    el.style.filter        = '';
    el.style.pointerEvents = '';
    el.style.zIndex        = '';

    const dist = ((i - carouselIndex + total) % total);

    if (dist === 0) {
      el.classList.add('is-center');
    } else if (dist === 1) {
      el.classList.add('is-right');
    } else if (dist === total - 1) {
      el.classList.add('is-left');
    } else {
      el.style.opacity       = '0';
      el.style.pointerEvents = 'none';
    }
  });

  updateCarouselInfo();

  // 锁定，等 CSS transition 结束后解锁（时长和 CSS 的 0.55s 对应）
  isAnimating = true;
  setTimeout(() => { isAnimating = false; }, 580);
}

function updateCarouselInfo() {
  const current = carouselItems[carouselIndex];
  if (!current) return;
  stageTag.textContent       = current.dataset.modalTag   || '';
  stageProjTitle.textContent = current.dataset.modalTitle || '';
  stageProjDesc.textContent  = current.dataset.modalDesc  || '';
}

// ── 打开分类 ──
document.querySelectorAll('.work-tag').forEach((tag) => {
  tag.addEventListener('click', () => {
    const category = tag.dataset.category;
    activeCategory = category;

    // 标签名填入舞台标题
    stageTitle.textContent = tag.textContent.trim();

    // 渲染轮播
    buildCarousel(category);

    // 标签场隐藏，舞台展开
    workTagsField.style.opacity        = '0';
    workTagsField.style.pointerEvents  = 'none';
    workStage.hidden = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        workStage.classList.add('is-open');
      });
    });
  });
});

// ── 关闭舞台 ──
function closeStage() {
  workStage.classList.remove('is-open');
  workTagsField.style.opacity       = '1';
  workTagsField.style.pointerEvents = '';
  activeCategory = null;
  workStage.addEventListener('transitionend', () => {
    workStage.hidden = true;
  }, { once: true });
}

workStageClose.addEventListener('click', closeStage);

// 箭头
carouselPrev.addEventListener('click', () => goCarousel(carouselIndex - 1));
carouselNext.addEventListener('click', () => goCarousel(carouselIndex + 1));

// 键盘
document.addEventListener('keydown', (e) => {
  if (!workStage.classList.contains('is-open')) return;
  if (e.key === 'ArrowLeft')  goCarousel(carouselIndex - 1);
  if (e.key === 'ArrowRight') goCarousel(carouselIndex + 1);
  if (e.key === 'Escape')     closeStage();
});

// 触摸滑动
let wTouchX = 0;
workCarousel.addEventListener('touchstart', (e) => {
  wTouchX = e.touches[0].clientX;
}, { passive: true });
workCarousel.addEventListener('touchend', (e) => {
  const diff = wTouchX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) goCarousel(carouselIndex + (diff > 0 ? 1 : -1));
}, { passive: true });

/* ---- PROJECT MODAL ---- */
const modalBackdrop   = document.getElementById('modalBackdrop');
const modalClose      = document.getElementById('modalClose');
const modalTag        = document.getElementById('modalTag');
const modalTitle      = document.getElementById('modalTitle');
const modalDesc       = document.getElementById('modalDesc');
const modalSlider     = document.getElementById('modalSlider');
const sliderTrack     = document.getElementById('modalSliderTrack');
const sliderDots      = document.getElementById('sliderDots');
const sliderPrev      = document.getElementById('sliderPrev');
const sliderNext      = document.getElementById('sliderNext');

let currentIndex = 0;
let totalSlides  = 0;

// 跳到指定索引
function goToSlide(index) {
  currentIndex = (index + totalSlides) % totalSlides;
  sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

  // 暂停所有视频，播放当前的
  sliderTrack.querySelectorAll('video').forEach((v, i) => {
    if (i === currentIndex) {
      v.play().catch(() => {});   // 自动播放（静音状态）
    } else {
      v.pause();
    }
  });

  // 更新圆点
  sliderDots.querySelectorAll('.slider-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
}

// 打开 modal，解析多图数据
function openModal(card) {
  const imgs  = (card.dataset.modalImgs || '').split('|').map(s => s.trim()).filter(Boolean);
  totalSlides = imgs.length;
  currentIndex = 0;

  // 清空 track 和 dots
  sliderTrack.innerHTML = '';
  sliderDots.innerHTML  = '';

 // 渲染图片或视频
imgs.forEach((src, i) => {
  const isVideo = /\.(mp4|mov|webm|ogg)$/i.test(src);
  let   media;

  if (isVideo) {
    media = document.createElement('video');
    media.src      = src;
    media.controls = true;
    media.muted    = true;       // 静音自动播放，用户可手动开声音
    media.loop     = true;
    media.playsInline = true;
    media.preload  = i === 0 ? 'auto' : 'none';
  } else {
    media = document.createElement('img');
    media.src     = src;
    media.alt     = card.dataset.modalTitle || '';
    media.loading = i === 0 ? 'eager' : 'lazy';
  }

  sliderTrack.appendChild(media);

  // 渲染圆点
  const dot = document.createElement('button');
  dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Go to image ${i + 1}`);
  dot.addEventListener('click', () => goToSlide(i));
  sliderDots.appendChild(dot);
});

  // 单图时隐藏控件
  modalSlider.classList.toggle('single', totalSlides <= 1);

  // 重置位置
  sliderTrack.style.transform = 'translateX(0)';

  // 填充文字
  modalTag.textContent   = card.dataset.modalTag   || '';
  modalTitle.textContent = card.dataset.modalTitle || '';
  modalDesc.textContent  = card.dataset.modalDesc  || '';

  // 打开
  modalBackdrop.hidden = false;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      modalBackdrop.classList.add('is-open');
    });
  });
  document.body.classList.add('modal-open');
  modalClose.focus();
}

// 关闭
function closeModal() {
  modalBackdrop.classList.remove('is-open');
  document.body.classList.remove('modal-open');
  modalBackdrop.addEventListener('transitionend', () => {
    modalBackdrop.hidden = true;
  }, { once: true });
}

// 箭头点击
sliderPrev.addEventListener('click', () => goToSlide(currentIndex - 1));
sliderNext.addEventListener('click', () => goToSlide(currentIndex + 1));

// 键盘左右切换
document.addEventListener('keydown', (e) => {
  if (!modalBackdrop.classList.contains('is-open')) return;
  if (e.key === 'ArrowLeft')  goToSlide(currentIndex - 1);
  if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
  if (e.key === 'Escape')     closeModal();
});

// 触摸滑动支持
let touchStartX = 0;
modalSlider.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
modalSlider.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) goToSlide(currentIndex + (diff > 0 ? 1 : -1));
}, { passive: true });

// 绑定卡片点击
document.querySelectorAll('.project-card').forEach((card) => {
  card.addEventListener('click', () => openModal(card));
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(card);
    }
  });
});

// 关闭方式
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeModal();
});

/* ---- CONTACT FORM ---- */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // 验证姓名
    const name    = document.getElementById('formName');
    const nameErr = document.getElementById('nameError');
    if (!name.value.trim()) {
      name.classList.add('is-error');
      nameErr.classList.add('show');
      valid = false;
    } else {
      name.classList.remove('is-error');
      nameErr.classList.remove('show');
    }

    // 验证邮箱
    const email    = document.getElementById('formEmail');
    const emailErr = document.getElementById('emailError');
    const emailOk  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    if (!emailOk) {
      email.classList.add('is-error');
      emailErr.classList.add('show');
      valid = false;
    } else {
      email.classList.remove('is-error');
      emailErr.classList.remove('show');
    }

    // 验证留言
    const msg    = document.getElementById('formMessage');
    const msgErr = document.getElementById('messageError');
    if (!msg.value.trim()) {
      msg.classList.add('is-error');
      msgErr.classList.add('show');
      valid = false;
    } else {
      msg.classList.remove('is-error');
      msgErr.classList.remove('show');
    }

    if (!valid) return;

    // 通过验证 — 显示成功提示，重置表单
    // 注意：这里是前端展示，实际发送邮件需要后端或 Formspree 服务
    const successMsg = document.getElementById('formSuccess');
    successMsg.hidden = false;
    contactForm.reset();

    // 3秒后隐藏成功提示
    setTimeout(() => { successMsg.hidden = true; }, 3000);
  });
}