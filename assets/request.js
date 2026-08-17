const retailerSelect = document.getElementById('retailerSelect');
retailerSelect.innerHTML = '<option value="">Choose a retailer</option>' + SNS_RETAILERS.map(r => `<option>${r.name}</option>`).join('');

document.getElementById('requestForm').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const orders = loadOrders();
  const order = {
    id: nextOrderId(orders),
    requestType: data.get('requestType'),
    retailer: data.get('retailer'),
    url: data.get('url'),
    productName: data.get('productName'),
    quantity: Number(data.get('quantity') || 1),
    variant: data.get('variant'),
    color: data.get('color'),
    maxBudget: Number(data.get('maxBudget') || 0),
    notes: data.get('notes'),
    customerName: data.get('customerName'),
    email: data.get('email'),
    phone: data.get('phone'),
    deliveryArea: data.get('deliveryArea'),
    address: data.get('address'),
    status: 'REQUESTED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    quote: null,
    timeline: ['REQUESTED']
  };
  orders.unshift(order);
  saveOrders(orders);
  form.classList.add('hidden');
  const success = document.getElementById('successPanel');
  success.classList.remove('hidden');
  success.innerHTML = `
    <div class="success-icon">✓</div>
    <span class="eyebrow">Request received</span>
    <h2>${escapeHtml(order.id)}</h2>
    <p>We created your request for <strong>${escapeHtml(order.productName)}</strong> from ${escapeHtml(order.retailer)}.</p>
    <p>Your next step is to wait for the delivered-cost quote. In this MVP demo, you can prepare the quote from the admin screen.</p>
    <div class="hero-actions"><a class="button button-primary" href="orders.html?order=${encodeURIComponent(order.id)}">Track request</a><a class="button button-secondary" href="admin.html">Open admin demo</a></div>`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
