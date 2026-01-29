/**
 * 🎨 Modern UI Enhancements for TalosPro Admin
 * Adds counter animations, smooth transitions, and micro-interactions
 */

(function() {
  'use strict';

  // =====================================
  // 1. ANIMATED COUNTERS
  // =====================================
  
  function animateCounter(element, start, end, duration = 1000) {
    const startTime = performance.now();
    const startValue = parseFloat(start) || 0;
    const endValue = parseFloat(end);
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentValue = startValue + (endValue - startValue) * easeProgress;
      
      // Format number
      if (endValue >= 1000000) {
        element.textContent = (currentValue / 1000000).toFixed(1) + 'M';
      } else if (endValue >= 1000) {
        element.textContent = (currentValue / 1000).toFixed(1) + 'K';
      } else {
        element.textContent = Math.floor(currentValue).toLocaleString();
      }
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Final value
        if (endValue >= 1000000) {
          element.textContent = (endValue / 1000000).toFixed(1) + 'M';
        } else if (endValue >= 1000) {
          element.textContent = (endValue / 1000).toFixed(1) + 'K';
        } else {
          element.textContent = endValue.toLocaleString();
        }
      }
    }
    
    requestAnimationFrame(update);
  }
  
  // Initialize counters when stats load
  function initCounters() {
    const statElements = [
      'totalUsers',
      'activeUsers', 
      'totalRevenue',
      'conversionRate'
    ];
    
    statElements.forEach(id => {
      const element = document.getElementById(id);
      if (element && element.dataset.value) {
        element.classList.add('animate-count');
        animateCounter(element, 0, element.dataset.value, 1200);
      }
    });
  }
  
  // Watch for stats to load (when loading skeleton is replaced)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.dataset && node.dataset.value) {
          animateCounter(node, 0, node.dataset.value, 1200);
        }
      });
    });
  });
  
  // Observe stat cards
  document.addEventListener('DOMContentLoaded', () => {
    const statsContainer = document.querySelector('.grid');
    if (statsContainer) {
      observer.observe(statsContainer, {
        childList: true,
        subtree: true
      });
    }
  });

  // =====================================
  // 2. CARD ENTRANCE ANIMATIONS
  // =====================================
  
  function animateCardsOnScroll() {
    const cards = document.querySelectorAll('.glass, .card-hover');
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          cardObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    cards.forEach((card) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      cardObserver.observe(card);
    });
  }

  // =====================================
  // 3. BUTTON RIPPLE EFFECT
  // =====================================
  
  function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-ghost, button');
    
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          left: ${x}px;
          top: ${y}px;
          pointer-events: none;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
        `;
        
        // Add keyframes if not exists
        if (!document.getElementById('ripple-keyframes')) {
          const style = document.createElement('style');
          style.id = 'ripple-keyframes';
          style.textContent = `
            @keyframes ripple {
              to {
                transform: scale(4);
                opacity: 0;
              }
            }
          `;
          document.head.appendChild(style);
        }
        
        const container = this.style.position === 'relative' || this.style.position === 'absolute' 
          ? this 
          : this.parentElement;
        
        if (this.style.position !== 'relative' && this.style.position !== 'absolute') {
          this.style.position = 'relative';
        }
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // =====================================
  // 4. SMOOTH SIDEBAR TRANSITIONS
  // =====================================
  
  function enhanceSidebar() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    sidebarLinks.forEach(link => {
      // Add smooth hover effect
      link.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      });
      
      // Add click animation
      link.addEventListener('click', function(e) {
        // Remove active from others
        sidebarLinks.forEach(l => l.classList.remove('active'));
        // Add to this one
        this.classList.add('active');
        
        // Store in localStorage
        localStorage.setItem('activeNav', this.getAttribute('href'));
      });
    });
    
    // Restore active state from localStorage
    const activePage = localStorage.getItem('activeNav');
    if (activePage) {
      const currentPage = window.location.pathname.split('/').pop();
      sidebarLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
          link.classList.add('active');
        }
      });
    }
  }

  // =====================================
  // 5. TABLE ROW ANIMATIONS
  // =====================================
  
  function enhanceTables() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
      const rows = table.querySelectorAll('tbody tr');
      
      rows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-10px)';
        
        setTimeout(() => {
          row.style.transition = 'all 0.3s ease';
          row.style.opacity = '1';
          row.style.transform = 'translateX(0)';
        }, index * 50);
      });
    });
  }

  // =====================================
  // 6. LOADING STATE TRANSITIONS
  // =====================================
  
  function smoothLoadingTransitions() {
    const skeletons = document.querySelectorAll('.animate-pulse');
    
    const loadObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (node.classList && node.classList.contains('animate-pulse')) {
            const parent = mutation.target;
            parent.style.transition = 'opacity 0.3s ease';
            parent.style.opacity = '0';
            setTimeout(() => {
              parent.style.opacity = '1';
            }, 50);
          }
        });
      });
    });
    
    skeletons.forEach(skeleton => {
      loadObserver.observe(skeleton.parentElement, { childList: true });
    });
  }

  // =====================================
  // 7. GRADIENT TEXT SHIMMER
  // =====================================
  
  function addTextShimmer() {
    const gradientTexts = document.querySelectorAll('.gradient-text, .bg-gradient-to-r');
    
    gradientTexts.forEach(text => {
      text.style.backgroundSize = '200% 200%';
      text.style.animation = 'gradient-shift 3s ease infinite';
    });
    
    // Add keyframes
    if (!document.getElementById('gradient-shift-keyframes')) {
      const style = document.createElement('style');
      style.id = 'gradient-shift-keyframes';
      style.textContent = `
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // =====================================
  // 8. INITIALIZE ALL ENHANCEMENTS
  // =====================================
  
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Initializing modern UI enhancements...');
    
    // Delay animations slightly to let page settle
    setTimeout(() => {
      animateCardsOnScroll();
      addRippleEffect();
      enhanceSidebar();
      smoothLoadingTransitions();
      addTextShimmer();
    }, 100);
    
    // Tables load after data fetch, watch for them
    const tableObserver = new MutationObserver(() => {
      const tables = document.querySelectorAll('table tbody tr');
      if (tables.length > 0) {
        enhanceTables();
        tableObserver.disconnect();
      }
    });
    
    tableObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  });

  // =====================================
  // 9. PAGE TRANSITION
  // =====================================
  
  // Fade out on navigation
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && link.href.endsWith('.html') && !link.target) {
      e.preventDefault();
      document.body.style.transition = 'opacity 0.3s ease';
      document.body.style.opacity = '0';
      setTimeout(() => {
        window.location.href = link.href;
      }, 300);
    }
  });

})();
