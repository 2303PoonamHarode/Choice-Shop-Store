document.addEventListener('DOMContentLoaded', () => {
  if (!window.productsDatabase) return;
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category');
  const initialSearch = urlParams.get('search');
  if (initialCategory) {
    document.getElementById('shopTitle').textContent = initialCategory;
  }
  if (initialSearch) {
    document.getElementById('shopTitle').textContent = `Search results for "${initialSearch}"`;
  }
  const categoryFiltersContainer = document.getElementById('categoryFilters');
  const categories = ['Clothing', 'Footwear', 'Bags', 'Accessories', 'Outerwear'];
  categories.forEach(cat => {
    const isChecked = initialCategory === cat ? 'checked' : '';
    categoryFiltersContainer.innerHTML += `
      <label class="filter-option">
        <input type="checkbox" class="cat-filter" value="${cat}" ${isChecked}> ${cat}
      </label>
    `;
  });
  let currentPage = 1;
  const itemsPerPage = 12;
  let filteredProducts = [...window.productsDatabase];
  const renderGrid = () => {
    const grid = document.getElementById('shopGrid');
    const resultCount = document.getElementById('resultCount');
    const pagination = document.getElementById('pagination');
    if (filteredProducts.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <h2 class="empty-state-title">No products found</h2>
          <p class="empty-state-desc">Try adjusting your filters or search query to find what you're looking for.</p>
          <button class="btn btn-outline" id="clearFiltersBtn">Clear Filters</button>
        </div>
      `;
      resultCount.textContent = `0 Results`;
      pagination.innerHTML = '';
      document.getElementById('clearFiltersBtn')?.addEventListener('click', () => {
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelector('input[name="price"][value="all"]').checked = true;
        document.querySelector('input[name="rating"][value="all"]').checked = true;
        window.location.href = 'shop.html';
      });
      return;
    }
    resultCount.textContent = `Showing ${filteredProducts.length} Results`;
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredProducts.slice(startIdx, startIdx + itemsPerPage);
    let html = '';
    paginatedItems.forEach(p => html += window.createProductCardHTML(p));
    grid.innerHTML = html;
    if (totalPages > 1) {
      let pagHtml = `<button class="page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>&lt;</button>`;
      for (let i = 1; i <= totalPages; i++) {
        pagHtml += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
      }
      pagHtml += `<button class="page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>&gt;</button>`;
      pagination.innerHTML = pagHtml;
      document.querySelectorAll('.page-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', (e) => {
          currentPage = parseInt(e.target.getAttribute('data-page'));
          renderGrid();
          window.scrollTo(0, 0);
        });
      });
    } else {
      pagination.innerHTML = '';
    }
    window.attachProductCardEvents();
  };
  const applyFilters = () => {
    let result = [...window.productsDatabase];
    if (initialSearch) {
      const q = initialSearch.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    const checkedCats = Array.from(document.querySelectorAll('.cat-filter:checked')).map(cb => cb.value);
    if (checkedCats.length > 0) {
      result = result.filter(p => checkedCats.includes(p.category));
    }
    const priceVal = document.querySelector('input[name="price"]:checked')?.value;
    if (priceVal && priceVal !== 'all') {
      if (priceVal === '0-2000') result = result.filter(p => p.price < 2000);
      else if (priceVal === '2000-5000') result = result.filter(p => p.price >= 2000 && p.price <= 5000);
      else if (priceVal === '5000+') result = result.filter(p => p.price > 5000);
    }
    const ratingVal = document.querySelector('input[name="rating"]:checked')?.value;
    if (ratingVal && ratingVal !== 'all') {
      result = result.filter(p => p.rating >= parseFloat(ratingVal));
    }
    const sortVal = document.getElementById('sortSelect').value;
    if (sortVal === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortVal === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sortVal === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sortVal === 'newest') result.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    filteredProducts = result;
    currentPage = 1;
    renderGrid();
  };
  document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(el => {
    el.addEventListener('change', applyFilters);
  });
  document.getElementById('sortSelect').addEventListener('change', applyFilters);
  const filterSidebar = document.getElementById('filterSidebar');
  const openSidebar = document.getElementById('openSidebar');
  const closeSidebar = document.getElementById('closeSidebar');
  const applyFiltersBtnMobile = document.getElementById('applyFiltersBtnMobile');
  const clearFiltersSidebarBtn = document.getElementById('clearFiltersSidebarBtn');

  if (openSidebar && filterSidebar && closeSidebar) {
    openSidebar.addEventListener('click', () => filterSidebar.classList.add('open'));
    closeSidebar.addEventListener('click', () => filterSidebar.classList.remove('open'));
  }
  
  if (applyFiltersBtnMobile) {
    applyFiltersBtnMobile.addEventListener('click', () => {
      filterSidebar.classList.remove('open');
      applyFilters();
    });
  }

  if (clearFiltersSidebarBtn) {
    clearFiltersSidebarBtn.addEventListener('click', () => {
      document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
      document.querySelector('input[name="price"][value="all"]').checked = true;
      document.querySelector('input[name="rating"][value="all"]').checked = true;
      applyFilters();
      if (window.innerWidth <= 900) {
        filterSidebar.classList.remove('open');
      }
    });
  }
  applyFilters();
});
