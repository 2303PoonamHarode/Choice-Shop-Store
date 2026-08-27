document.addEventListener('DOMContentLoaded', () => {
  if (!window.productsDatabase) return;
  const categoryContainer = document.getElementById('homeCategories');
  if (categoryContainer) {
    const categories = ['Clothing', 'Footwear', 'Bags', 'Accessories'];
    const categoryImages = {
      'Clothing': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
      'Footwear': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop',
      'Bags': 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop',
      'Accessories': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop'
    };
    let catHTML = '';
    categories.forEach(cat => {
      const count = window.productsDatabase.filter(p => p.category === cat).length;
      catHTML += `
        <a href="shop.html?category=${encodeURIComponent(cat)}" style="display: block; position: relative; overflow: hidden; aspect-ratio: 4/5;">
          <img src="${categoryImages[cat]}" alt="${cat}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop';">
          <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(23,23,23,0.8)); padding: 24px; color: white;">
            <h3 style="font-size: 24px; margin-bottom: 4px; font-family: var(--font-display); font-weight: 400;">${cat}</h3>
            <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--c-ivory);">${count} Products</p>
          </div>
        </a>
      `;
    });
    categoryContainer.innerHTML = catHTML;
  }
  const bestsellersContainer = document.getElementById('homeBestsellers');
  if (bestsellersContainer) {
    const bestsellers = window.productsDatabase.filter(p => p.isBestseller).slice(0, 4);
    let html = '';
    bestsellers.forEach(p => html += window.createProductCardHTML(p));
    bestsellersContainer.innerHTML = html;
  }
  const newArrivalsContainer = document.getElementById('homeNewArrivals');
  if (newArrivalsContainer) {
    const newArrivals = window.productsDatabase.filter(p => p.isNew).slice(0, 4);
    let html = '';
    newArrivals.forEach(p => html += window.createProductCardHTML(p));
    newArrivalsContainer.innerHTML = html;
  }
  const dealContainer = document.getElementById('homeDealContainer');
  if (dealContainer) {
    const deal = window.productsDatabase.find(p => p.id === 'p46') || window.productsDatabase.find(p => p.isDeal);
    if (deal) {
      dealContainer.innerHTML = `
        <div style="display: flex; gap: 32px; align-items: center; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 250px;">
            <img src="${deal.images[0]}" alt="${deal.name}" style="width: 100%; aspect-ratio: 1/1; object-fit: cover;"  onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop';">
          </div>
          <div style="flex: 1; min-width: 250px;">
            <div style="color: var(--c-terracotta); font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; margin-bottom: 12px;">Ends in: <span id="countdown">12:34:56</span></div>
            <h3 style="font-size: 32px; font-family: var(--font-display); font-weight: 400; margin-bottom: 16px;">${deal.name}</h3>
            <div style="margin-bottom: 32px;">
              <span style="font-size: 20px; font-weight: 700;">₹${deal.price.toLocaleString('en-IN')}</span>
              ${deal.oldPrice ? `<span style="text-decoration: line-through; color: var(--c-slate); margin-left: 12px; font-size: 14px;">₹${deal.oldPrice.toLocaleString('en-IN')}</span>` : ''}
            </div>
            <a href="product.html?id=${deal.id}" class="btn btn-primary btn-full">Shop This Deal</a>
          </div>
        </div>
      `;
      let time = 12 * 3600 + 34 * 60 + 56;
      setInterval(() => {
        time--;
        if(time < 0) time = 0;
        const h = Math.floor(time / 3600).toString().padStart(2, '0');
        const m = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
        const s = (time % 60).toString().padStart(2, '0');
        const countEl = document.getElementById('countdown');
        if (countEl) countEl.textContent = `${h}:${m}:${s}`;
      }, 1000);
    }
  }
  window.attachProductCardEvents();
});
