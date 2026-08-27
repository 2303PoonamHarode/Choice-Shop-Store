document.addEventListener('DOMContentLoaded', () => {
  if (!window.productsDatabase) return;
  const FREE_SHIPPING_THRESHOLD = 1499;
  const SHIPPING_COST = 150;
  let promoApplied = false;
  const renderCart = () => {
    const cart = StorageApp.getCart();
    const container = document.getElementById('cartItemsContainer');
    const summary = document.getElementById('cartSummaryContainer');
    const recs = document.getElementById('cartRecsContainer');
    document.getElementById('cartTabCount').textContent = cart.reduce((a,c) => a + c.quantity, 0);
    if (cart.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          </div>
          <h2 class="empty-state-title">Your bag is empty</h2>
          <p class="empty-state-desc">Looks like you haven't added anything to your bag yet.</p>
          <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
        </div>
      `;
      summary.style.display = 'none';
      recs.style.display = 'block'; 
    } else {
      let html = '';
      let subtotal = 0;
      cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += `
          <div class="cart-item">
            <a href="product.html?id=${item.id}">
              <img src="${item.images[0]}" alt="${item.name}" class="cart-item-img" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop';">
            </a>
            <div class="cart-item-details">
              <div class="cart-item-header">
                <a href="product.html?id=${item.id}" class="cart-item-title">${item.name}</a>
                <span class="cart-item-price">₹${itemTotal.toLocaleString('en-IN')}</span>
              </div>
              <div class="cart-item-meta">
                ${item.category} | Size: ${item.size} | Color: ${item.color} <br>
                Price: ₹${item.price.toLocaleString('en-IN')}
              </div>
              <div class="cart-item-actions">
                <div class="cart-qty-ctrl">
                  <button onclick="updateQty('${item.id}', '${item.size}', '${item.color}', ${item.quantity - 1})">-</button>
                  <input type="text" value="${item.quantity}" readonly>
                  <button onclick="updateQty('${item.id}', '${item.size}', '${item.color}', ${item.quantity + 1})">+</button>
                </div>
                <div>
                  <button class="cart-item-remove" style="margin-right: 12px;" onclick="moveToWishlist('${item.id}', '${item.size}', '${item.color}')">Move to Wishlist</button>
                  <button class="cart-item-remove" onclick="removeCartItem('${item.id}', '${item.size}', '${item.color}')">Remove</button>
                </div>
              </div>
            </div>
          </div>
        `;
      });
      container.innerHTML = html;
      summary.style.display = 'block';
      const discount = promoApplied ? Math.floor(subtotal * 0.1) : 0;
      const subAfterDiscount = subtotal - discount;
      const isFreeShipping = subAfterDiscount >= FREE_SHIPPING_THRESHOLD;
      const shipping = isFreeShipping ? 0 : SHIPPING_COST;
      const total = subAfterDiscount + shipping;
      document.getElementById('summSubtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
      document.getElementById('summShipping').textContent = isFreeShipping ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`;
      document.getElementById('summTotal').textContent = `₹${total.toLocaleString('en-IN')}`;
      const discRow = document.getElementById('summDiscountRow');
      if (promoApplied) {
        discRow.style.display = 'flex';
        document.getElementById('summDiscount').textContent = `-₹${discount.toLocaleString('en-IN')}`;
      } else {
        discRow.style.display = 'none';
      }
      const fsProgress = document.getElementById('fsProgress');
      const fsText = document.getElementById('fsText');
      if (isFreeShipping) {
        fsProgress.style.width = '100%';
        fsText.innerHTML = '<span style="color:#22c55e;">You have free shipping!</span>';
      } else {
        const remaining = FREE_SHIPPING_THRESHOLD - subAfterDiscount;
        const pct = (subAfterDiscount / FREE_SHIPPING_THRESHOLD) * 100;
        fsProgress.style.width = `${pct}%`;
        fsText.textContent = `Add ₹${remaining.toLocaleString('en-IN')} more for free shipping`;
      }
    }
  };
  window.updateQty = (id, size, color, newQty) => {
    StorageApp.updateCartQuantity(id, size, color, newQty);
    renderCart();
  };
  window.removeCartItem = (id, size, color) => {
    StorageApp.removeFromCart(id, size, color);
    renderCart();
  };
  window.moveToWishlist = (id, size, color) => {
    const product = window.productsDatabase.find(p => p.id === id);
    if(product) {
      if(!StorageApp.isInWishlist(id)) {
        StorageApp.toggleWishlist(product);
      }
      StorageApp.removeFromCart(id, size, color);
      renderCart();
      renderWishlist();
      window.showToast('Moved to Wishlist');
    }
  };
  document.getElementById('applyPromoBtn').addEventListener('click', () => {
    const code = document.getElementById('promoInput').value.trim().toUpperCase();
    if (code === 'CHOICE10') {
      if(promoApplied) {
        window.showToast('Promo already applied');
      } else {
        promoApplied = true;
        window.showToast('Promo Applied: 10% Off');
        renderCart();
      }
    } else {
      window.showToast('Invalid Promo Code');
    }
  });
  const renderWishlist = () => {
    const wishlist = StorageApp.getWishlist();
    const grid = document.getElementById('wishlistGrid');
    document.getElementById('wishlistTabCount').textContent = wishlist.length;
    if (wishlist.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </div>
          <h2 class="empty-state-title">Your wishlist is empty</h2>
          <p class="empty-state-desc">Save items you love here and buy them later.</p>
          <a href="shop.html" class="btn btn-primary">Discover Items</a>
        </div>
      `;
    } else {
      let html = '';
      wishlist.forEach(p => {
        html += `
          <div style="position: relative;">
            <button onclick="window.removeWishlistItem('${p.id}')" style="position: absolute; top: 12px; right: 12px; z-index: 10; background: var(--c-white); border: 1px solid var(--c-sand); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            ${window.createProductCardHTML(p).replace(/<button class="product-wishlist-btn.*?<\/button>/, '')}
          </div>
        `;
      });
      grid.innerHTML = html;
      window.attachProductCardEvents();
    }
  };
  window.removeWishlistItem = (id) => {
    StorageApp.removeFromWishlist(id);
    renderWishlist();
  };
  const renderRecs = () => {
    const grid = document.getElementById('cartRecommendations');
    const recs = window.productsDatabase.filter(p => p.isFeatured).slice(0, 4);
    let html = '';
    recs.forEach(p => html += window.createProductCardHTML(p));
    grid.innerHTML = html;
    window.attachProductCardEvents();
  };
  const tabCartBtn = document.getElementById('tabCartBtn');
  const tabWishlistBtn = document.getElementById('tabWishlistBtn');
  const cartContent = document.getElementById('cartContent');
  const wishlistContent = document.getElementById('wishlistContent');
  tabCartBtn.addEventListener('click', () => {
    tabCartBtn.classList.add('active');
    tabWishlistBtn.classList.remove('active');
    cartContent.style.display = 'block';
    wishlistContent.style.display = 'none';
  });
  tabWishlistBtn.addEventListener('click', () => {
    tabWishlistBtn.classList.add('active');
    tabCartBtn.classList.remove('active');
    wishlistContent.style.display = 'block';
    cartContent.style.display = 'none';
  });
  const urlParams = new URLSearchParams(window.location.search);
  if(urlParams.get('tab') === 'wishlist') {
    tabWishlistBtn.click();
  }
  renderCart();
  renderWishlist();
  renderRecs();
});
