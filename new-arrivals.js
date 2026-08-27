document.addEventListener('DOMContentLoaded', () => {
  if (!window.productsDatabase) return;
  const newProducts = window.productsDatabase.filter(p => p.isNew);
  newProducts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  const ntwGrid = document.getElementById('newThisWeekGrid');
  if (ntwGrid) {
    const top4 = newProducts.slice(0, 4);
    let html = '';
    top4.forEach(p => html += window.createProductCardHTML(p));
    ntwGrid.innerHTML = html;
  }
  const trendingGrid = document.getElementById('trendingNewGrid');
  if (trendingGrid) {
    const next8 = newProducts.slice(4, 12);
    let html = '';
    next8.forEach(p => html += window.createProductCardHTML(p));
    trendingGrid.innerHTML = html;
  }
  window.attachProductCardEvents();
});
