document.addEventListener('DOMContentLoaded', () => {
  if (!window.productsDatabase) return;
  const mosaic = document.getElementById('categoryMosaic');
  const catsData = [
    { name: 'Clothing', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop', cls: 'cat-large', desc: 'Everyday essentials and tailored pieces.' },
    { name: 'Footwear', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop', cls: '', desc: 'Step out in style.' },
    { name: 'Bags', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop', cls: '', desc: 'Carry it all.' },
    { name: 'Accessories', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop', cls: '', desc: 'The finishing touches.' },
    { name: 'Outerwear', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop', cls: '', desc: 'Layer up for any weather.' }
  ];
  let html = '';
  catsData.forEach(cat => {
    const count = window.productsDatabase.filter(p => p.category === cat.name).length;
    html += `
      <a href="shop.html?category=${encodeURIComponent(cat.name)}" class="cat-card ${cat.cls}">
        <img src="${cat.img}" alt="${cat.name}" class="cat-img"  onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop';">
        <div class="cat-overlay">
          <h2 class="cat-card-title">${cat.name}</h2>
          <p style="color: var(--c-ivory); margin-bottom: 16px; font-size: 14px; line-height: 1.6;">${cat.desc}</p>
          <span style="font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 2px;">Explore ${count} Items &rarr;</span>
        </div>
      </a>
    `;
  });
  if (mosaic) mosaic.innerHTML = html;
});
