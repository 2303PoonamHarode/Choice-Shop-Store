const STORAGE_KEYS = {
  CART: 'choice_cart',
  WISHLIST: 'choice_wishlist',
  RECENT: 'choice_recently_viewed'
};
const StorageApp = {
  getCart() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
  },
  saveCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    this.updateCounters();
  },
  addToCart(product, quantity = 1, size = 'M', color = 'Default') {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(item => 
      item.id === product.id && item.size === size && item.color === color
    );
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ ...product, quantity, size, color });
    }
    this.saveCart(cart);
    window.showToast('Added to Cart');
  },
  removeFromCart(productId, size, color) {
    let cart = this.getCart();
    cart = cart.filter(item => !(item.id === productId && item.size === size && item.color === color));
    this.saveCart(cart);
    window.showToast('Removed from Cart');
  },
  updateCartQuantity(productId, size, color, newQuantity) {
    if (newQuantity < 1) return;
    const cart = this.getCart();
    const index = cart.findIndex(item => item.id === productId && item.size === size && item.color === color);
    if (index > -1) {
      cart[index].quantity = newQuantity;
      this.saveCart(cart);
    }
  },
  clearCart() {
    localStorage.removeItem(STORAGE_KEYS.CART);
    this.updateCounters();
  },
  getWishlist() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST)) || [];
  },
  saveWishlist(wishlist) {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    this.updateCounters();
  },
  toggleWishlist(product) {
    let wishlist = this.getWishlist();
    const index = wishlist.findIndex(item => item.id === product.id);
    if (index > -1) {
      wishlist.splice(index, 1);
      this.saveWishlist(wishlist);
      window.showToast('Removed from Wishlist');
      return false; 
    } else {
      wishlist.push(product);
      this.saveWishlist(wishlist);
      window.showToast('Added to Wishlist');
      return true; 
    }
  },
  isInWishlist(productId) {
    const wishlist = this.getWishlist();
    return wishlist.some(item => item.id === productId);
  },
  removeFromWishlist(productId) {
    let wishlist = this.getWishlist();
    wishlist = wishlist.filter(item => item.id !== productId);
    this.saveWishlist(wishlist);
    window.showToast('Removed from Wishlist');
  },
  getRecentlyViewed() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT)) || [];
  },
  addRecentlyViewed(product) {
    let recent = this.getRecentlyViewed();
    recent = recent.filter(item => item.id !== product.id);
    recent.unshift(product);
    if (recent.length > 8) recent.pop();
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(recent));
  },
  updateCounters() {
    const cartCount = this.getCart().reduce((acc, item) => acc + item.quantity, 0);
    const wishlistCount = this.getWishlist().length;
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = cartCount;
      el.style.display = cartCount > 0 ? 'flex' : 'none';
    });
    document.querySelectorAll('.wishlist-count').forEach(el => {
      el.textContent = wishlistCount;
      el.style.display = wishlistCount > 0 ? 'flex' : 'none';
    });
  }
};
window.showToast = function(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
    </span>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};
document.addEventListener('DOMContentLoaded', () => {
  StorageApp.updateCounters();
  const searchTriggers = document.querySelectorAll('.trigger-search');
  const searchOverlay = document.getElementById('searchOverlay');
  const closeSearch = document.getElementById('closeSearch');
  const globalSearchForm = document.getElementById('globalSearchForm');
  const globalSearchInput = document.getElementById('globalSearchInput');
  if (searchOverlay) {
    searchTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        searchOverlay.classList.add('open');
        if(globalSearchInput) setTimeout(() => globalSearchInput.focus(), 300);
      });
    });
    if(closeSearch) {
      closeSearch.addEventListener('click', () => {
        searchOverlay.classList.remove('open');
      });
    }
    if(globalSearchForm && globalSearchInput) {
      globalSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = globalSearchInput.value.trim();
        if(q) {
          window.location.href = `shop.html?search=${encodeURIComponent(q)}`;
        }
      });
    }
  }
  const mobileMenuBtn = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const mobileOverlay = document.getElementById('mobileOverlay');
  if (mobileMenuBtn && mobileMenu && mobileOverlay && mobileMenuClose) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      mobileOverlay.classList.add('open');
    });
    const closeMenu = () => {
      mobileMenu.classList.remove('open');
      mobileOverlay.classList.remove('open');
    };
    mobileMenuClose.addEventListener('click', closeMenu);
    mobileOverlay.addEventListener('click', closeMenu);
  }
});
window.createProductCardHTML = function(product) {
  const isWishlisted = StorageApp.isInWishlist(product.id);
  const badgeHTML = product.badge ? `<div class="product-badge">${product.badge}</div>` : '';
  const oldPriceHTML = product.oldPrice ? `<span class="product-old-price">₹${product.oldPrice.toLocaleString('en-IN')}</span>` : '';
  return `
    <div class="product-card">
      <div class="product-image-container">
        ${badgeHTML}
        <button class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${product.id}" aria-label="Toggle wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
        <a href="product.html?id=${product.id}">
          <img src="${product.images[0]}" alt="${product.name}" class="product-image" loading="lazy"  onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop';">
        </a>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <a href="product.html?id=${product.id}">
          <h3 class="product-name">${product.name}</h3>
        </a>
        <div class="product-rating">
          <svg class="star" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          ${product.rating} (${product.reviewCount})
        </div>
        <div class="product-price-row">
          <span class="product-price">₹${product.price.toLocaleString('en-IN')}</span>
          ${oldPriceHTML}
        </div>
        <button class="btn btn-outline btn-full add-to-cart-btn" data-id="${product.id}">Add to Bag</button>
      </div>
    </div>
  `;
};
window.attachProductCardEvents = function() {
  document.querySelectorAll('.product-wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id');
      const product = window.productsDatabase.find(p => p.id === id);
      if (product) {
        const isNowInWishlist = StorageApp.toggleWishlist(product);
        if (isNowInWishlist) {
          btn.classList.add('active');
          btn.querySelector('svg').setAttribute('fill', 'currentColor');
        } else {
          btn.classList.remove('active');
          btn.querySelector('svg').setAttribute('fill', 'none');
        }
      }
    });
  });
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id');
      const product = window.productsDatabase.find(p => p.id === id);
      if (product) {
        StorageApp.addToCart(product, 1, product.sizes[0] || 'M', product.color || 'Default');
      }
    });
  });
};
