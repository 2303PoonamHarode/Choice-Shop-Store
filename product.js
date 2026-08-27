document.addEventListener('DOMContentLoaded', () => {
  if (!window.productsDatabase) return;
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const product = window.productsDatabase.find(p => p.id === productId);
  const mainContent = document.getElementById('mainContent');
  if (!product) {
    mainContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <h2 class="empty-state-title">Product Not Found</h2>
        <p class="empty-state-desc">The product you are looking for does not exist or has been removed.</p>
        <a href="shop.html" class="btn btn-primary">Back to Shop</a>
      </div>
    `;
    return;
  }
  StorageApp.addRecentlyViewed(product);
  document.title = `${product.name} | ChoiceShoppingStore.online`;
  document.getElementById('productBreadcrumb').innerHTML = `
    <a href="index.html">Home</a> <span>/</span> 
    <a href="shop.html?category=${encodeURIComponent(product.category)}">${product.category}</a> <span>/</span> 
    <span style="color: var(--c-midnight);">${product.name}</span>
  `;
  const isWishlisted = StorageApp.isInWishlist(product.id);
  const oldPriceHTML = product.oldPrice ? `<span class="prod-old-price">₹${product.oldPrice.toLocaleString('en-IN')}</span>` : '';
  const badgeHTML = product.badge ? `<span style="background:var(--c-terracotta); color:var(--c-white); padding:4px 8px; font-size:10px; text-transform:uppercase; font-weight:600; letter-spacing:1px; margin-left:12px; vertical-align: middle;">${product.badge}</span>` : '';
  let galleryHTML = `<div class="gallery-main-container"><img src="${product.images[0]}" id="mainImage" class="gallery-main" alt="${product.name}"  onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop';"></div>`;
  if (product.images.length > 1) {
    galleryHTML += `<div class="gallery-thumbs">`;
    product.images.forEach((img, idx) => {
      galleryHTML += `<img src="${img}" class="gallery-thumb ${idx === 0 ? 'active' : ''}" data-src="${img}" alt="Thumbnail ${idx+1}"  onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop';">`;
    });
    galleryHTML += `</div>`;
  }
  let sizesHTML = '';
  product.sizes.forEach((size, idx) => {
    sizesHTML += `<button class="size-btn ${idx === 0 ? 'active' : ''}" data-size="${size}">${size}</button>`;
  });
  const detailHTML = `
    <div>${galleryHTML}</div>
    <div>
      <div class="prod-category">${product.category}</div>
      <h1 class="prod-name">${product.name} ${badgeHTML}</h1>
      <div class="product-rating" style="margin-bottom: 16px;">
        <svg class="star" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        <span>${product.rating} (${product.reviewCount} Reviews)</span>
      </div>
      <div class="prod-price-row">
        <span class="prod-price">₹${product.price.toLocaleString('en-IN')}</span>
        ${oldPriceHTML}
      </div>
      <p class="prod-desc">${product.description}</p>
      <div style="margin-bottom: var(--spacing-lg);">
        <span class="selector-label">Color: <span style="color:var(--c-midnight); font-weight:400;">${product.color}</span></span>
      </div>
      <div>
        <span class="selector-label">Select Size:</span>
        <div class="size-grid">${sizesHTML}</div>
      </div>
      <div style="margin-bottom: 8px;">
        <span class="selector-label">Quantity:</span>
      </div>
      <div class="action-row">
        <div class="quantity-selector">
          <button class="qty-btn" id="qtyMinus">-</button>
          <input type="number" class="qty-input" id="qtyInput" value="1" min="1" max="${product.stock}" readonly>
          <button class="qty-btn" id="qtyPlus">+</button>
        </div>
        <button class="btn btn-primary" id="addToCartBtn" style="flex:1;">Add to Bag</button>
        <button class="btn-wishlist ${isWishlisted ? 'active' : ''}" id="wishlistBtn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
      </div>
      <div style="font-size: 0.85rem; color: var(--c-slate); display: flex; align-items: center; gap: 8px; margin-bottom: var(--spacing-2xl);">
        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #22c55e;"></div> In Stock (${product.stock} available)
      </div>
      <!-- Tabs -->
      <div>
        <div class="tabs">
          <button class="tab-btn active" data-target="tab-features">Features</button>
          <button class="tab-btn" data-target="tab-shipping">Shipping & Returns</button>
          <button class="tab-btn" data-target="tab-reviews">Reviews</button>
        </div>
        <div class="tab-content active" id="tab-features">
          <ul>
            ${product.features.map(f => `<li>${f}</li>`).join('')}
            <li>Material: ${product.material}</li>
          </ul>
        </div>
        <div class="tab-content" id="tab-shipping">
          <p><strong>Free Standard Shipping</strong> on all orders over ₹1,499. Delivery within 3-5 business days.</p>
          <p style="margin-top:12px;"><strong>Easy 7-Day Returns:</strong> If you are not completely satisfied, you may return items within 7 days of delivery for a full refund or exchange. Items must be in original condition with tags attached.</p>
        </div>
        <div class="tab-content" id="tab-reviews">
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
            <div style="font-size: 3rem; font-family: var(--font-display);">${product.rating}</div>
            <div>
              <div class="product-rating" style="margin-bottom: 4px;">
                <svg class="star" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <svg class="star" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <svg class="star" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <svg class="star" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <svg class="star" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              <div>Based on ${product.reviewCount} reviews</div>
            </div>
          </div>
          <p><em>Customer reviews are currently visible only to registered buyers.</em></p>
        </div>
      </div>
    </div>
  `;
  document.getElementById('productDetail').innerHTML = detailHTML;
  const mainImg = document.getElementById('mainImage');
  const thumbs = document.querySelectorAll('.gallery-thumb');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      mainImg.src = thumb.getAttribute('data-src');
    });
  });
  let selectedSize = product.sizes[0];
  const sizeBtns = document.querySelectorAll('.size-btn');
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = btn.getAttribute('data-size');
    });
  });
  const qtyInput = document.getElementById('qtyInput');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  let qty = 1;
  qtyMinus.addEventListener('click', () => { if(qty > 1) { qty--; qtyInput.value = qty; }});
  qtyPlus.addEventListener('click', () => { if(qty < product.stock) { qty++; qtyInput.value = qty; }});
  document.getElementById('addToCartBtn').addEventListener('click', () => {
    if(!selectedSize) {
      alert("Please select a size");
      return;
    }
    StorageApp.addToCart(product, qty, selectedSize, product.color);
  });
  const wBtn = document.getElementById('wishlistBtn');
  wBtn.addEventListener('click', () => {
    const active = StorageApp.toggleWishlist(product);
    if(active) {
      wBtn.classList.add('active');
      wBtn.querySelector('svg').setAttribute('fill', 'currentColor');
    } else {
      wBtn.classList.remove('active');
      wBtn.querySelector('svg').setAttribute('fill', 'none');
    }
  });
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.getAttribute('data-target')).classList.add('active');
    });
  });
  const relatedGrid = document.getElementById('relatedProducts');
  const related = window.productsDatabase.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  if(related.length > 0) {
    let rHTML = '';
    related.forEach(p => rHTML += window.createProductCardHTML(p));
    relatedGrid.innerHTML = rHTML;
  } else {
    relatedGrid.parentElement.style.display = 'none';
  }
  const rvSection = document.getElementById('recentlyViewedSection');
  const rvGrid = document.getElementById('recentlyViewedGrid');
  const recent = StorageApp.getRecentlyViewed().filter(p => p.id !== product.id).slice(0, 4);
  if(recent.length > 0) {
    rvSection.style.display = 'block';
    let rvHTML = '';
    recent.forEach(p => rvHTML += window.createProductCardHTML(p));
    rvGrid.innerHTML = rvHTML;
  }
  window.attachProductCardEvents();
});
