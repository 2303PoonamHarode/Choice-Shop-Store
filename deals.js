document.addEventListener('DOMContentLoaded', () => {
  if (!window.productsDatabase) return;
  const deals = window.productsDatabase.filter(p => p.isDeal);
  const dodContainer = document.getElementById('dealOfTheDay');
  if (dodContainer && deals.length > 0) {
    const mainDeal = deals.find(p => p.oldPrice && p.price < p.oldPrice) || deals[0];
    const savings = mainDeal.oldPrice - mainDeal.price;
    const percent = Math.round((savings / mainDeal.oldPrice) * 100);
    dodContainer.innerHTML = `
      <div style="flex: 1; min-width: 300px;">
        <img src="${mainDeal.images[0]}" alt="${mainDeal.name}" style="width: 100%; aspect-ratio: 4/5; object-fit: cover;"  onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop';">
      </div>
      <div style="flex: 1; min-width: 300px;">
        <div style="display: inline-block; border: 1px solid var(--c-midnight); padding: 4px 12px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">Deal of the Day</div>
        <h2 style="font-size: 48px; font-family: var(--font-display); font-weight: 400; line-height: 1.1; margin-bottom: 16px;">${mainDeal.name}</h2>
        <p style="color: var(--c-slate); margin-bottom: 24px; font-size: 14px; line-height: 1.6;">${mainDeal.description}</p>
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
          <span style="font-size: 32px; font-weight: 700; color: var(--c-terracotta);">₹${mainDeal.price.toLocaleString('en-IN')}</span>
          <span style="font-size: 16px; color: var(--c-slate); text-decoration: line-through;">₹${mainDeal.oldPrice.toLocaleString('en-IN')}</span>
        </div>
        <div style="margin-bottom: 32px; font-size: 14px; font-weight: 600;">
          <span style="color: #22c55e;">Save ₹${savings.toLocaleString('en-IN')} (${percent}% Off)</span>
        </div>
        <div style="margin-bottom: 24px;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Offer ends in:</div>
          <div style="font-size: 24px; font-family: var(--font-display); font-weight: 400;" id="dealTimer">08:45:12</div>
        </div>
        <button class="btn btn-primary add-to-cart-btn" data-id="${mainDeal.id}">Add to Bag</button>
      </div>
    `;
    let time = 8 * 3600 + 45 * 60 + 12;
    setInterval(() => {
      time--;
      if(time < 0) time = 0;
      const h = Math.floor(time / 3600).toString().padStart(2, '0');
      const m = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
      const s = (time % 60).toString().padStart(2, '0');
      const el = document.getElementById('dealTimer');
      if (el) el.textContent = `${h}h ${m}m ${s}s`;
    }, 1000);
  }
  const thirtyOff = deals.filter(p => p.oldPrice && (p.oldPrice - p.price)/p.oldPrice >= 0.2).slice(0, 8);
  const thirtyGrid = document.getElementById('thirtyOffGrid');
  if (thirtyGrid) {
    let html = '';
    thirtyOff.forEach(p => html += window.createProductCardHTML(p));
    thirtyGrid.innerHTML = html;
  }
  const trendingDeals = deals.filter(p => !thirtyOff.includes(p)).slice(0, 4);
  const trendingGrid = document.getElementById('trendingDealsGrid');
  if (trendingGrid) {
    let html = '';
    trendingDeals.forEach(p => html += window.createProductCardHTML(p));
    trendingGrid.innerHTML = html;
  }
  window.attachProductCardEvents();
});
