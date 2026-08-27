document.addEventListener('DOMContentLoaded', () => {
  if (!window.productsDatabase) return;
  const cart = StorageApp.getCart();
  if (cart.length === 0) {
    alert("Your cart is empty. Redirecting to shop.");
    window.location.href = "shop.html";
    return;
  }
  const container = document.getElementById('checkoutItems');
  let html = '';
  let subtotal = 0;
  cart.forEach(item => {
    const total = item.price * item.quantity;
    subtotal += total;
    html += `
      <div class="summary-item">
        <img src="${item.images[0]}" alt="${item.name}" class="summary-item-img" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop';">
        <div class="summary-item-info">
          <div class="summary-item-title">${item.name}</div>
          <div class="summary-item-meta">Size: ${item.size} | Color: ${item.color}</div>
          <div class="summary-item-meta">Qty: ${item.quantity} &times; ₹${item.price.toLocaleString('en-IN')}</div>
        </div>
        <div class="summary-item-price">₹${total.toLocaleString('en-IN')}</div>
      </div>
    `;
  });
  container.innerHTML = html;
  const shipping = subtotal >= 1499 ? 0 : 150;
  const totalAmount = subtotal + shipping;
  document.getElementById('cSubtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  document.getElementById('cShipping').textContent = shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`;
  document.getElementById('cTotal').textContent = `₹${totalAmount.toLocaleString('en-IN')}`;
  const paymentOptions = document.querySelectorAll('.payment-option');
  const paymentDetails = document.querySelectorAll('.payment-details');
  paymentOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      paymentOptions.forEach(o => o.classList.remove('active'));
      paymentDetails.forEach(d => d.classList.remove('active'));
      opt.classList.add('active');
      opt.querySelector('input').checked = true;
      document.getElementById(opt.getAttribute('data-target')).classList.add('active');
    });
  });
  const form = document.getElementById('checkoutForm');
  const validateField = (id, group, isEmail = false) => {
    const el = document.getElementById(id);
    const grp = document.getElementById(group);
    let valid = true;
    if(!el.value.trim()) {
      valid = false;
    } else if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) {
      valid = false;
    }
    if(!valid) {
      grp.classList.add('has-error');
    } else {
      grp.classList.remove('has-error');
    }
    return valid;
  };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v1 = validateField('cEmail', 'groupEmail', true);
    const v2 = validateField('cPhone', 'groupPhone');
    const v3 = validateField('cName', 'groupName');
    const v4 = validateField('cAddress', 'groupAddress');
    const v5 = validateField('cCity', 'groupCity');
    const v6 = validateField('cState', 'groupState');
    const v7 = validateField('cZip', 'groupZip');
    if (v1 && v2 && v3 && v4 && v5 && v6 && v7) {
      const orderId = `CHO-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const name = document.getElementById('cName').value;
      const method = document.querySelector('input[name="payment"]:checked').value;
      document.getElementById('checkoutMain').style.display = 'none';
      const conf = document.getElementById('orderConfirmation');
      conf.style.display = 'block';
      document.getElementById('confName').textContent = name;
      document.getElementById('confOrderNo').textContent = orderId;
      document.getElementById('confTotal').textContent = `₹${totalAmount.toLocaleString('en-IN')}`;
      document.getElementById('confMethod').textContent = method === 'cod' ? 'Cash on Delivery' : method.toUpperCase();
      StorageApp.clearCart();
      window.scrollTo(0, 0);
    } else {
      window.showToast('Please correct the highlighted errors.');
    }
  });
});
