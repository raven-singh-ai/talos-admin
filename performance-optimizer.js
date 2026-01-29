/**
 * 🚀 Performance Optimizer for TalosPro Admin
 * Adds caching, lazy loading, and optimization for fast, robust feel
 */

(function() {
  'use strict';

  // =====================================
  // 1. SMART CACHING SYSTEM
  // =====================================
  
  class SmartCache {
    constructor(ttl = 5 * 60 * 1000) { // 5 minutes default
      this.cache = new Map();
      this.ttl = ttl;
    }
    
    set(key, value, customTTL) {
      const expiresAt = Date.now() + (customTTL || this.ttl);
      this.cache.set(key, { value, expiresAt });
    }
    
    get(key) {
      const item = this.cache.get(key);
      if (!item) return null;
      
      if (Date.now() > item.expiresAt) {
        this.cache.delete(key);
        return null;
      }
      
      return item.value;
    }
    
    has(key) {
      return this.get(key) !== null;
    }
    
    clear() {
      this.cache.clear();
    }
    
    // Invalidate by pattern
    invalidate(pattern) {
      const regex = new RegExp(pattern);
      for (const key of this.cache.keys()) {
        if (regex.test(key)) {
          this.cache.delete(key);
        }
      }
    }
  }
  
  // Global cache instance
  window.dataCache = new SmartCache();
  
  // =====================================
  // 2. OPTIMIZED FETCH WRAPPER
  // =====================================
  
  window.cachedFetch = async function(url, options = {}, cacheTime = 5 * 60 * 1000) {
    const cacheKey = `${url}_${JSON.stringify(options)}`;
    
    // Check cache first
    const cached = window.dataCache.get(cacheKey);
    if (cached) {
      console.log('✅ Cache hit:', url);
      return cached;
    }
    
    console.log('⬇️ Fetching:', url);
    
    // Add timeout to fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Cache the result
      window.dataCache.set(cacheKey, data, cacheTime);
      
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      
      throw error;
    }
  };
  
  // =====================================
  // 3. DEBOUNCE & THROTTLE UTILITIES
  // =====================================
  
  window.debounce = function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  window.throttle = function(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };
  
  // =====================================
  // 4. LAZY IMAGE LOADING
  // =====================================
  
  function setupLazyImages() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  // =====================================
  // 5. VIRTUAL SCROLLING FOR TABLES
  // =====================================
  
  class VirtualScroller {
    constructor(container, itemHeight, renderItem) {
      this.container = container;
      this.itemHeight = itemHeight;
      this.renderItem = renderItem;
      this.items = [];
      this.visibleStart = 0;
      this.visibleEnd = 0;
      this.scrollTop = 0;
      
      this.setupScrollListener();
    }
    
    setData(items) {
      this.items = items;
      this.render();
    }
    
    setupScrollListener() {
      const scrollHandler = window.throttle(() => {
        this.scrollTop = this.container.scrollTop;
        this.render();
      }, 16); // ~60fps
      
      this.container.addEventListener('scroll', scrollHandler);
    }
    
    render() {
      const containerHeight = this.container.clientHeight;
      const totalHeight = this.items.length * this.itemHeight;
      
      this.visibleStart = Math.floor(this.scrollTop / this.itemHeight);
      this.visibleEnd = Math.ceil((this.scrollTop + containerHeight) / this.itemHeight);
      
      // Add buffer
      const bufferSize = 5;
      const start = Math.max(0, this.visibleStart - bufferSize);
      const end = Math.min(this.items.length, this.visibleEnd + bufferSize);
      
      const visibleItems = this.items.slice(start, end);
      
      // Calculate offset
      const offsetY = start * this.itemHeight;
      
      // Render visible items
      const html = `
        <div style="height: ${totalHeight}px; position: relative;">
          <div style="transform: translateY(${offsetY}px);">
            ${visibleItems.map(item => this.renderItem(item)).join('')}
          </div>
        </div>
      `;
      
      this.container.innerHTML = html;
    }
  }
  
  window.VirtualScroller = VirtualScroller;
  
  // =====================================
  // 6. SKELETON LOADER GENERATOR
  // =====================================
  
  window.createSkeleton = function(type = 'card', count = 1) {
    const skeletons = {
      card: `
        <div class="skeleton rounded-xl p-6 space-y-4">
          <div class="skeleton h-4 w-3/4 rounded"></div>
          <div class="skeleton h-8 w-1/2 rounded"></div>
          <div class="skeleton h-4 w-full rounded"></div>
        </div>
      `,
      row: `
        <tr>
          <td class="px-4 py-3"><div class="skeleton h-4 w-32 rounded"></div></td>
          <td class="px-4 py-3"><div class="skeleton h-4 w-24 rounded"></div></td>
          <td class="px-4 py-3"><div class="skeleton h-4 w-20 rounded"></div></td>
          <td class="px-4 py-3"><div class="skeleton h-4 w-16 rounded"></div></td>
        </tr>
      `,
      stat: `
        <div class="glass rounded-xl p-6 stat-card">
          <div class="skeleton h-4 w-20 rounded mb-4"></div>
          <div class="skeleton h-8 w-24 rounded mb-2"></div>
          <div class="skeleton h-3 w-16 rounded"></div>
        </div>
      `
    };
    
    return Array(count).fill(skeletons[type] || skeletons.card).join('');
  };
  
  // =====================================
  // 7. PROGRESSIVE LOADING
  // =====================================
  
  window.progressiveLoad = async function(loadFunc, container, options = {}) {
    const {
      skeletonType = 'card',
      skeletonCount = 3,
      errorMessage = 'Failed to load data'
    } = options;
    
    // Show skeleton
    container.innerHTML = window.createSkeleton(skeletonType, skeletonCount);
    
    try {
      const data = await loadFunc();
      
      // Small delay for smooth transition
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return data;
    } catch (error) {
      console.error('Progressive load error:', error);
      container.innerHTML = `
        <div class="p-6 text-center text-red-400">
          <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>${errorMessage}</p>
          <button onclick="location.reload()" class="btn-ghost btn-sm mt-3">
            Retry
          </button>
        </div>
      `;
      throw error;
    }
  };
  
  // =====================================
  // 8. BATCH OPERATIONS
  // =====================================
  
  window.batchFetch = async function(urls, options = {}) {
    const {
      batchSize = 5,
      cacheTime = 5 * 60 * 1000
    } = options;
    
    const results = [];
    
    // Process in batches
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(url => window.cachedFetch(url, {}, cacheTime))
      );
      results.push(...batchResults);
    }
    
    return results;
  };
  
  // =====================================
  // 9. REQUEST DEDUPLICATION
  // =====================================
  
  const pendingRequests = new Map();
  
  window.dedupeFetch = async function(url, options = {}) {
    const key = `${url}_${JSON.stringify(options)}`;
    
    // Check if request is already pending
    if (pendingRequests.has(key)) {
      console.log('🔄 Deduped request:', url);
      return pendingRequests.get(key);
    }
    
    // Create new request
    const promise = window.cachedFetch(url, options).finally(() => {
      pendingRequests.delete(key);
    });
    
    pendingRequests.set(key, promise);
    return promise;
  };
  
  // =====================================
  // 10. PERFORMANCE MONITORING
  // =====================================
  
  window.perfMonitor = {
    marks: new Map(),
    
    start(label) {
      this.marks.set(label, performance.now());
    },
    
    end(label) {
      const start = this.marks.get(label);
      if (!start) {
        console.warn(`No start mark for: ${label}`);
        return;
      }
      
      const duration = performance.now() - start;
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
      
      this.marks.delete(label);
      return duration;
    },
    
    measure(label, fn) {
      this.start(label);
      const result = fn();
      
      if (result instanceof Promise) {
        return result.finally(() => this.end(label));
      }
      
      this.end(label);
      return result;
    }
  };
  
  // =====================================
  // 11. PRELOAD CRITICAL RESOURCES
  // =====================================
  
  window.preloadCritical = function() {
    // Preload fonts
    const fonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
    ];
    
    fonts.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = url;
      document.head.appendChild(link);
    });
  };
  
  // =====================================
  // 12. CLEANUP ON PAGE UNLOAD
  // =====================================
  
  window.addEventListener('beforeunload', () => {
    // Clear pending requests
    pendingRequests.clear();
    
    // Optionally clear cache (or keep it for faster back button)
    // window.dataCache.clear();
  });
  
  // =====================================
  // INITIALIZE
  // =====================================
  
  document.addEventListener('DOMContentLoaded', () => {
    console.log('⚡ Performance optimizer loaded');
    
    // Setup lazy images
    setupLazyImages();
    
    // Preload critical resources
    window.preloadCritical();
    
    // Monitor initial page load
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(`📊 Page fully loaded in ${loadTime.toFixed(0)}ms`);
      
      // Mark as fast/slow
      if (loadTime < 2000) {
        console.log('✅ Fast load!');
      } else if (loadTime < 4000) {
        console.log('⚠️ Moderate load');
      } else {
        console.log('🐌 Slow load - check network/API');
      }
    });
  });
  
  // =====================================
  // EXPOSE GLOBAL API
  // =====================================
  
  window.perf = {
    cache: window.dataCache,
    fetch: window.cachedFetch,
    dedupe: window.dedupeFetch,
    batch: window.batchFetch,
    progressive: window.progressiveLoad,
    skeleton: window.createSkeleton,
    monitor: window.perfMonitor,
    debounce: window.debounce,
    throttle: window.throttle
  };
  
})();
