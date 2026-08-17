const SNS_STORAGE_KEY = 'shopNShipMvpOrdersV1';

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value || 0));
}

function humanStatus(status) {
  return String(status || '').toLowerCase().split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function loadOrders() {
  const existing = localStorage.getItem(SNS_STORAGE_KEY);
  if (existing) {
    try { return JSON.parse(existing); } catch (_) { /* reset below */ }
  }
  localStorage.setItem(SNS_STORAGE_KEY, JSON.stringify(SNS_SEED_ORDERS));
  return structuredClone(SNS_SEED_ORDERS);
}

function saveOrders(orders) {
  localStorage.setItem(SNS_STORAGE_KEY, JSON.stringify(orders));
}

function resetOrders() {
  localStorage.setItem(SNS_STORAGE_KEY, JSON.stringify(SNS_SEED_ORDERS));
  return structuredClone(SNS_SEED_ORDERS);
}

function calcQuote(q = {}) {
  const fields = ['productPrice','usSalesTax','domesticTransport','internationalFreight','customsDuty','vat','processingFees','localDelivery','serviceFee'];
  const delivered = fields.reduce((sum, key) => sum + Number(q[key] || 0), 0);
  const local = Number(q.localPrice || 0);
  const savings = local > 0 ? local - delivered : null;
  const savingsPct = local > 0 ? (savings / local) * 100 : null;
  return { delivered, savings, savingsPct };
}

function nextOrderId(orders) {
  const max = orders.reduce((m, order) => Math.max(m, Number(String(order.id).replace(/\D/g,'')) || 1000), 1000);
  return `SNS-${max + 1}`;
}

function renderRetailers(target) {
  if (!target) return;
  target.innerHTML = SNS_RETAILERS.map(store => `
    <article class="retailer-card">
      <div class="retailer-logo">${store.initials}</div>
      <div><strong>${store.name}</strong><span>${store.note}</span></div>
    </article>`).join('');
}

function statusClass(status) {
  if (['DELIVERED','CUSTOMS_CLEARED'].includes(status)) return 'status-success';
  if (['CUSTOMS_HOLD','DAMAGED','PAYMENT_FAILED','OUT_OF_STOCK','CANCELLED','REFUNDED'].includes(status)) return 'status-danger';
  if (['REQUESTED','QUOTED','AWAITING_PAYMENT'].includes(status)) return 'status-neutral';
  return 'status-active';
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}
