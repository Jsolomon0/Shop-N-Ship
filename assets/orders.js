const result = document.getElementById('orderResult');
const input = document.getElementById('lookupInput');

function renderOrder(order) {
  if (!order) {
    result.innerHTML = '<div class="card empty-state"><h3>Order not found</h3><p>Check the ID and try again.</p></div>';
    return;
  }
  const quote = order.quote ? calcQuote(order.quote) : null;
  const timeline = SNS_PROGRESS_STATUSES.map(status => {
    const completed = order.timeline?.includes(status);
    const current = order.status === status;
    if (!completed && !current) return '';
    return `<div class="timeline-item ${completed ? 'complete' : ''} ${current ? 'current' : ''}"><span></span><div><strong>${humanStatus(status)}</strong>${current ? '<small>Current status</small>' : ''}</div></div>`;
  }).join('');
  result.innerHTML = `
    <section class="card order-detail">
      <div class="order-detail-head"><div><span class="eyebrow">${escapeHtml(order.id)}</span><h2>${escapeHtml(order.productName)}</h2><p>${escapeHtml(order.retailer)} · Qty ${order.quantity}</p></div><span class="status-badge ${statusClass(order.status)}">${humanStatus(order.status)}</span></div>
      ${quote ? `<div class="customer-total"><span>Estimated delivered price</span><strong>${money(quote.delivered)}</strong>${quote.savings !== null ? `<small>Estimated savings vs. comparison: ${money(quote.savings)} (${quote.savingsPct.toFixed(1)}%)</small>` : ''}</div>` : '<div class="notice">Your request is waiting for a quote.</div>'}
      <div class="detail-columns">
        <div><h3>Tracking timeline</h3><div class="timeline">${timeline}</div></div>
        <div class="order-facts"><h3>Order details</h3><dl><div><dt>Customer</dt><dd>${escapeHtml(order.customerName)}</dd></div><div><dt>Delivery</dt><dd>${escapeHtml(order.address)}</dd></div><div><dt>Variant</dt><dd>${escapeHtml(order.variant || '—')}</dd></div><div><dt>Color</dt><dd>${escapeHtml(order.color || '—')}</dd></div><div><dt>Last updated</dt><dd>${new Date(order.updatedAt).toLocaleString()}</dd></div></dl></div>
      </div>
    </section>`;
}

function lookup(id) {
  const order = loadOrders().find(o => o.id.toLowerCase() === String(id).trim().toLowerCase());
  renderOrder(order);
}

document.getElementById('lookupForm').addEventListener('submit', e => { e.preventDefault(); lookup(input.value); });
document.querySelectorAll('[data-order]').forEach(btn => btn.addEventListener('click', () => { input.value = btn.dataset.order; lookup(btn.dataset.order); }));
const params = new URLSearchParams(location.search);
if (params.get('order')) { input.value = params.get('order'); lookup(params.get('order')); }
