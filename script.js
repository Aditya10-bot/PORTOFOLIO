/**
 * Portfolio Website Script
 * Handles Theme Toggling, Responsive Menu, Portfolio Filters, and Contact Form Submission.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initPortfolioFilters();
  initCertificateLoadMore();
  initCertificateFilters();
  initContactForm();
  initScrollHighlight();
});

/**
 * 1. THEME MANAGEMENT (Dark / Light Mode)
 * Uses Tailwind CSS 'dark' class on <html> element and stores setting in localStorage.
 */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
  const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

  // Change the icons inside the button based on previous settings
  if (
    localStorage.getItem('color-theme') === 'dark' ||
    (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark');
    themeToggleLightIcon.classList.remove('hidden');
    themeToggleDarkIcon.classList.add('hidden');
  } else {
    document.documentElement.classList.remove('dark');
    themeToggleDarkIcon.classList.remove('hidden');
    themeToggleLightIcon.classList.add('hidden');
  }

  themeToggleBtn.addEventListener('click', () => {
    // Toggle icons inside button
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

    // If set via local storage previously
    if (localStorage.getItem('color-theme')) {
      if (localStorage.getItem('color-theme') === 'light') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      }
    } else {
      // If not set previously
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      }
    }
  });
}

/**
 * 2. MOBILE NAVIGATION MENU
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuLinks = mobileMenu.querySelectorAll('a');

  // Toggle mobile menu
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Close menu when clicking a link
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });

  // Close menu when clicking outside of it
  document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.add('hidden');
    }
  });
}

/**
 * 3. PORTFOLIO FILTER SYSTEM
 */
function initPortfolioFilters() {
  const filterButtons = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active states from all filter buttons
      filterButtons.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white');
        b.classList.add('bg-gray-100', 'text-gray-700', 'dark:bg-slate-800', 'dark:text-gray-300');
      });

      // Add active state to clicked button
      btn.classList.remove('bg-gray-100', 'text-gray-700', 'dark:bg-slate-800', 'dark:text-gray-300');
      btn.classList.add('bg-indigo-600', 'text-white');

      const filterValue = btn.getAttribute('data-filter');

      // Filter project cards
      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hidden');
          // Trigger slight fade animation
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/**
 * 4. SCROLL ACTIVE LINK HIGHLIGHTING
 */
function initScrollHighlight() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-indigo-600', 'dark:text-indigo-400');
      link.classList.add('text-gray-700', 'dark:text-gray-300');
      
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.remove('text-gray-700', 'dark:text-gray-300');
        link.classList.add('text-indigo-600', 'dark:text-indigo-400');
      }
    });
  });
}

/**
 * 5. CONTACT FORM (Formspree Integration via Fetch API)
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const submitText = document.getElementById('form-submit-text');
  const submitSpinner = document.getElementById('form-submit-spinner');
  
  // Custom Toast elements
  const toastSuccess = document.getElementById('toast-success');
  const toastError = document.getElementById('toast-error');

  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // ==========================================
    // PETUNJUK INTEGRASI EMAIL (FORMSPREE)
    // ==========================================
    // 1. Buat akun gratis di https://formspree.io
    // 2. Buat Form Baru ("Create Form") di dashboard Formspree Anda.
    // 3. Salin URL Aksi / Endpoint yang diberikan (misalnya: https://formspree.io/f/xbjnqpyz)
    // 4. Masukkan URL tersebut ke variabel FORMSPREE_URL di bawah ini:
    const FORMSPREE_URL = 'https://formspree.io/f/xgojzlqa'; // <-- Ganti 'placeholder' dengan ID form Anda.
    // ==========================================

    if (FORMSPREE_URL.includes('placeholder')) {
      showToast(toastError, 'Formulir belum dikonfigurasi! Harap edit file script.js dan masukkan URL Formspree Anda.');
      return;
    }

    // Set loading state
    submitBtn.disabled = true;
    submitText.classList.add('hidden');
    submitSpinner.classList.remove('hidden');

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        showToast(toastSuccess, 'Pesan Anda berhasil dikirim! Terima kasih.');
        form.reset();
      } else {
        const errorData = await response.json();
        showToast(toastError, errorData.error || 'Terjadi kesalahan saat mengirim pesan. Coba lagi nanti.');
      }
    } catch (error) {
      showToast(toastError, 'Koneksi internet bermasalah. Gagal mengirim pesan.');
    } finally {
      // Reset loading state
      submitBtn.disabled = false;
      submitText.classList.remove('hidden');
      submitSpinner.classList.add('hidden');
    }
  });
}

/**
 * Utility to display custom toaster message
 */
function showToast(toastEl, message) {
  if (!toastEl) return;
  
  const textContainer = toastEl.querySelector('.toast-msg');
  if (textContainer) {
    textContainer.innerText = message;
  }
  
  toastEl.classList.remove('translate-y-24', 'opacity-0');
  toastEl.classList.add('translate-y-0', 'opacity-100');

  // Auto-hide after 5 seconds
  setTimeout(() => {
    toastEl.classList.add('translate-y-24', 'opacity-0');
    toastEl.classList.remove('translate-y-0', 'opacity-100');
  }, 5000);
}

/**
 * 3.5. CERTIFICATE SHOW MORE / LOAD MORE SYSTEM
 */
function initCertificateLoadMore() {
  const toggleBtn = document.getElementById('btn-toggle-certs');
  const btnText = document.getElementById('btn-toggle-certs-text');
  const btnIcon = document.getElementById('btn-toggle-certs-icon');
  const certsWrapper = document.getElementById('certs-wrapper');
  const certsOverlay = document.getElementById('certs-overlay');
  const filterContainer = document.getElementById('certs-filter-container');

  if (!toggleBtn || !certsWrapper) return;

  let isExpanded = false;

  toggleBtn.addEventListener('click', () => {
    isExpanded = !isExpanded;

    if (isExpanded) {
      // Calculate full scrollHeight
      const fullHeight = certsWrapper.scrollHeight;
      certsWrapper.style.maxHeight = fullHeight + 'px';

      // Hide overlay gradient
      if (certsOverlay) {
        certsOverlay.classList.add('opacity-0', 'pointer-events-none');
      }

      // Show filter buttons (fade in)
      if (filterContainer) {
        filterContainer.classList.remove('hidden');
        // Force reflow
        void filterContainer.offsetWidth;
        filterContainer.classList.remove('opacity-0');
        filterContainer.classList.add('opacity-100');
      }

      // Update button text and icon
      btnText.textContent = 'Sembunyikan';
      btnIcon.classList.add('rotate-180');

      // After transition, clear max-height so filtering is responsive
      setTimeout(() => {
        if (isExpanded) {
          certsWrapper.style.maxHeight = 'none';
        }
      }, 700);
    } else {
      // Collapse section
      // 1. Reset filter container first
      if (filterContainer) {
        filterContainer.classList.remove('opacity-100');
        filterContainer.classList.add('opacity-0');
        setTimeout(() => {
          if (!isExpanded) {
            filterContainer.classList.add('hidden');
          }
        }, 500);
      }

      // 2. Programmatically trigger click on 'Semua' filter button to show all cards before collapsing
      const allFilterBtn = document.querySelector('.cert-filter-btn[data-filter="all"]');
      if (allFilterBtn) {
        allFilterBtn.click();
      }

      // 3. Dynamic target height based on device viewport
      const targetHeight = window.innerWidth >= 1024 ? '620px' : '1550px';

      // 4. Force container back to absolute height before transition
      certsWrapper.style.maxHeight = certsWrapper.scrollHeight + 'px';
      void certsWrapper.offsetWidth;
      certsWrapper.style.maxHeight = targetHeight;

      // Show overlay gradient again
      if (certsOverlay) {
        certsOverlay.classList.remove('opacity-0', 'pointer-events-none');
      }

      // Update button text and icon
      btnText.textContent = 'Lihat Semua Sertifikat';
      btnIcon.classList.remove('rotate-180');

      // Scroll smoothly back to top of certificates section
      const certsSection = document.getElementById('certificates');
      if (certsSection) {
        certsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
}

/**
 * 3.6. CERTIFICATE FILTER SYSTEM
 */
function initCertificateFilters() {
  const filterButtons = document.querySelectorAll('.cert-filter-btn');
  const certificateCards = document.querySelectorAll('.certificate-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active states from all filter buttons
      filterButtons.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white');
        b.classList.add('bg-gray-100', 'text-gray-700', 'dark:bg-slate-800', 'dark:text-gray-300');
      });

      // Add active state to clicked button
      btn.classList.remove('bg-gray-100', 'text-gray-700', 'dark:bg-slate-800', 'dark:text-gray-300');
      btn.classList.add('bg-indigo-600', 'text-white');

      const filterValue = btn.getAttribute('data-filter');

      // Filter certificate cards
      certificateCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          // Trigger slight fade animation
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}


