/**
 * Navigation Functionality
 * Handles mobile menu, dropdowns, and smooth scrolling
 */

// ============================
// INITIALIZATION
// ============================

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initDropdowns();
  initSmoothScroll();
});

// ============================
// MOBILE MENU
// ============================

function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const body = document.body;
  
  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    const isActive = menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (isActive) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
  });

  // Close menu when clicking on a link
  mobileMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      // Only close if it's not a dropdown toggle
      if (!link.classList.contains('dropdown-toggle')) {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        body.style.overflow = '';
      }
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      menuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
      body.style.overflow = '';
    }
  });

  // Close menu on window resize (if switching to desktop view)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 1024) {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        body.style.overflow = '';
      }
    }, 250);
  });
}

// ============================
// DROPDOWN MENUS
// ============================

function initDropdowns() {
  const dropdowns = document.querySelectorAll('.dropdown');
  
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    if (!toggle || !menu) return;

    // Toggle on click
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isActive = dropdown.classList.contains('active');
      
      // Close all other dropdowns
      closeAllDropdowns();
      
      // Toggle current dropdown
      if (!isActive) {
        dropdown.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Hover behavior for desktop
    if (window.innerWidth >= 1024) {
      let hoverTimer;
      
      dropdown.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
          closeAllDropdowns();
          dropdown.classList.add('active');
          toggle.setAttribute('aria-expanded', 'true');
        }, 100);
      });
      
      dropdown.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
          dropdown.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');
        }, 100);
      });
    }

    // Keyboard navigation
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      } else if (e.key === 'Escape') {
        closeAllDropdowns();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const firstLink = menu.querySelector('.nav-link');
        if (firstLink) firstLink.focus();
      }
    });

    // Navigate within menu
    menu.querySelectorAll('.nav-link').forEach((link, index, links) => {
      link.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextLink = links[index + 1] || links[0];
          nextLink.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevLink = links[index - 1] || links[links.length - 1];
          prevLink.focus();
        } else if (e.key === 'Escape') {
          closeAllDropdowns();
          toggle.focus();
        }
      });
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      closeAllDropdowns();
    }
  });

  // Close dropdowns on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
    }
  });
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.classList.remove('active');
    const toggle = dropdown.querySelector('.dropdown-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  });
}

// ============================
// SMOOTH SCROLLING
// ============================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#" or empty
      if (!href || href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      
      // Get header height for offset
      const header = document.querySelector('.site-header');
      const headerHeight = header ? header.offsetHeight : 0;
      
      // Calculate position
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = targetPosition - headerHeight - 20;
      
      // Smooth scroll
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Update URL without jumping
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', href);
      }
      
      // Focus target for accessibility
      target.focus({ preventScroll: true });
    });
  });
}

// ============================
// ACTIVE LINK HIGHLIGHTING
// ============================

function updateActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.pageYOffset >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// Initialize active link highlighting
document.addEventListener('DOMContentLoaded', updateActiveLinks);

// Export functions for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initMobileMenu,
    initDropdowns,
    initSmoothScroll,
    closeAllDropdowns,
    updateActiveLinks
  };
}
