/**
 * Main JavaScript Functionality
 * Handles animations, carousels, forms, and interactive features
 */

// ============================
// INITIALIZATION
// ============================

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initAnimations();
  initCounters();
  initCarousels();
  initForms();
});

// ============================
// STICKY HEADER
// ============================

function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        
        // Hide header when scrolling down, show when scrolling up
        if (currentScrollY > lastScrollY && currentScrollY > 300) {
          header.classList.add('header-hidden');
        } else {
          header.classList.remove('header-hidden');
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
      });
      
      ticking = true;
    }
  });
}

// ============================
// SCROLL ANIMATIONS
// ============================

function initAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with data-animate attribute
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });

  // Animation styles
  const style = document.createElement('style');
  style.textContent = `
    [data-animate].animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

// ============================
// ANIMATED COUNTERS
// ============================

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-counter'));
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = formatNumber(target);
      clearInterval(timer);
    } else {
      element.textContent = formatNumber(Math.floor(current));
    }
  }, 16);
}

function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
}

// ============================
// CAROUSELS
// ============================

function initCarousels() {
  const carousels = document.querySelectorAll('.carousel');
  
  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dotsContainer = carousel.querySelector('.carousel-controls');
    
    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const slideCount = slides.length;
    let autoplayInterval;

    // Create dots
    if (dotsContainer) {
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
      });
    }

    function goToSlide(index) {
      currentIndex = index;
      const offset = -100 * currentIndex;
      track.style.transform = `translateX(${offset}%)`;
      
      // Update dots
      const dots = dotsContainer?.querySelectorAll('.carousel-dot');
      dots?.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % slideCount;
      goToSlide(currentIndex);
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + slideCount) % slideCount;
      goToSlide(currentIndex);
    }

    // Auto-advance
    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoplay();
    });

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // Start autoplay
    startAutoplay();
  });
}

// ============================
// FORMS
// ============================

function initForms() {
  const forms = document.querySelectorAll('form[data-form]');
  
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      // Validate
      const errors = validateForm(data, form);
      if (errors.length > 0) {
        showErrors(form, errors);
        return;
      }
      
      // Clear previous errors
      clearErrors(form);
      
      // Submit
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        if (response.ok) {
          showMessage(form, 'Thank you! Your message has been sent.', 'success');
          form.reset();
        } else {
          throw new Error('Submission failed');
        }
      } catch (error) {
        showMessage(form, 'Sorry, there was an error. Please try again.', 'error');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  });
}

function validateForm(data, form) {
  const errors = [];
  
  // Email validation
  if (data.email && !validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }
  
  // Required fields
  form.querySelectorAll('[required]').forEach(field => {
    if (!data[field.name] || data[field.name].trim() === '') {
      errors.push({ 
        field: field.name, 
        message: `${field.labels[0]?.textContent || field.name} is required` 
      });
    }
  });
  
  return errors;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showErrors(form, errors) {
  clearErrors(form);
  
  errors.forEach(error => {
    const field = form.querySelector(`[name="${error.field}"]`);
    if (field) {
      field.classList.add('form-error');
      
      const errorMsg = document.createElement('span');
      errorMsg.classList.add('form-error-message');
      errorMsg.textContent = error.message;
      field.parentNode.appendChild(errorMsg);
    }
  });
}

function clearErrors(form) {
  form.querySelectorAll('.form-error').forEach(field => {
    field.classList.remove('form-error');
  });
  
  form.querySelectorAll('.form-error-message').forEach(msg => {
    msg.remove();
  });
}

function showMessage(form, message, type) {
  const messageEl = document.createElement('div');
  messageEl.className = `form-message form-message-${type}`;
  messageEl.textContent = message;
  messageEl.style.cssText = `
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    background-color: ${type === 'success' ? '#d4edda' : '#f8d7da'};
    color: ${type === 'success' ? '#155724' : '#721c24'};
  `;
  
  form.appendChild(messageEl);
  
  setTimeout(() => {
    messageEl.remove();
  }, 5000);
}

// ============================
// UTILITY FUNCTIONS
// ============================

function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export functions for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initStickyHeader,
    initAnimations,
    initCounters,
    initCarousels,
    initForms,
    validateEmail
  };
}
