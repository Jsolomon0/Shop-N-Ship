let orders = loadOrders();
let selectedId = orders[0]?.id;
const list = document.getElementById('adminOrderList');
const detail = document.getElementById('detailCard');
const statusFilter = document.getElementById('statusFilter');
statusFilter.innerHTML += SNS_STATUSES.map(s => `<option value="${s}">${humanStatus(s)}</option>`).join('');

function metricData() {
  const delivered = orders.filter(o => o.status === 'DELIVERED').length;
  const requested = orders.filter(o => o.status === 'REQUESTED').length;
  const customs = orders.filter(o => ['ARRIVED_BAHAMAS','CUSTOMS_PROCESSING','CUSTOMS_HOLD'].includes(o.status)).length;
  const revenue = orders.reduce((sum,o) => sum + Number(o.quote?.serviceFee || 0),0);
  return [
    ['Open requests', requested],['In customs', customs],['Delivered', delivered],['Service fees', money(revenue)]
  ];
}

function renderMetrics() {
  document.getElementById('metricGrid').innerHTML = metricData().map(([label,value]) => `<div class="metric-card"><span>${label}</span><strong>${value}</strong></div>`).join('');
}

function renderList() {
  const filter = statusFilter.value;
  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);
  list.innerHTML = filtered.length ? filtered.map(order => `
    <button class="admin-order-row ${order.id === selectedId ? 'selected' : ''}" data-id="${order.id}">
      <div><strong>${escapeHtml(order.id)}</strong><span>${escapeHtml(order.customerName)}</span></div>
      <div class="order-row-product"><strong>${escapeHtml(order.productName)}</strong><span>${escapeHtml(order.retailer)}</span></div>
      <span class="status-badge ${statusClass(order.status)}">${humanStatus(order.status)}</span>
    </button>`).join('') : '<div class="empty-state"><p>No orders in this status.</p></div>';
  list.querySelectorAll('[data-id]').forEach(btn => btn.addEventListener('click', () => { selectedId = btn.dataset.id; renderAll(); }));
}

function num(v) { return Number(v || 0); }

function renderDetail() {
  const order = orders.find(o => o.id === selectedId);
  if (!order) { detail.innerHTML = '<div class="empty-state"><h3>Select an order</h3></div>'; return; }
  const q = order.quote || {productPrice:'',usSalesTax:0,domesticTransport:0,internationalFreight:'',customsDuty:'',vat:'',processingFees:10,localDelivery:12,serviceFee:'',localPrice:''};
  const total = calcQuote(q);
  detail.innerHTML = `
    <div class="panel-title"><div><span class="eyebrow">${escapeHtml(order.id)}</span><h2>${escapeHtml(order.productName)}</h2><p>${escapeHtml(order.customerName)} · ${escapeHtml(order.retailer)}</p></div><span class="status-badge ${statusClass(order.status)}">${humanStatus(order.status)}</span></div>
    <div class="detail-summary"><div><span>Requested</span><strong>${new Date(order.createdAt).toLocaleDateString()}</strong></div><div><span>Quantity</span><strong>${order.quantity}</strong></div><div><span>Max budget</span><strong>${order.maxBudget ? money(order.maxBudget) : '—'}</strong></div></div>
    <form id="quoteForm" class="quote-editor">
      <h3>Quote builder</h3>
      <div class="form-grid two-col compact">
        ${[['productPrice','Product price'],['usSalesTax','U.S. sales tax'],['domesticTransport','U.S. transport'],['internationalFreight','International freight'],['customsDuty','Estimated customs duty'],['vat','Estimated VAT'],['processingFees','Processing/customs fees'],['localDelivery','Local delivery'],['serviceFee','Shop N Ship fee'],['localPrice','Bahamas comparison price']].map(([key,label]) => `<label><span>${label}</span><input type="number" step="0.01" min="0" name="${key}" value="${q[key] ?? ''}" /></label>`).join('')}
      </div>
      <div class="quote-preview"><div><span>Estimated delivered price</span><strong>${money(total.delivered)}</strong></div>${total.savings !== null ? `<div><span>Estimated customer savings</span><strong>${money(total.savings)} (${total.savingsPct.toFixed(1)}%)</strong></div>` : ''}</div>
      <div class="form-actions"><button class="button button-primary" type="submit">Save &amp; mark quoted</button></div>
    </form>
    <div class="status-editor"><h3>Fulfillment status</h3><div class="status-controls"><select id="statusSelect">${SNS_STATUSES.map(s => `<option value="${s}" ${s === order.status ? 'selected' : ''}>${humanStatus(s)}</option>`).join('')}</select><button id="saveStatus" class="button button-secondary">Update status</button></div></div>
    <div class="admin-notes"><h3>Request details</h3><dl><div><dt>Variant</dt><dd>${escapeHtml(order.variant || '—')}</dd></div><div><dt>Color</dt><dd>${escapeHtml(order.color || '—')}</dd></div><div><dt>Phone</dt><dd>${escapeHtml(order.phone)}</dd></div><div><dt>Delivery</dt><dd>${escapeHtml(order.address)}</dd></div><div><dt>Notes</dt><dd>${escapeHtml(order.notes || '—')}</dd></div></dl></div>`;

  document.getElementById('quoteForm').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    order.quote = Object.fromEntries([...fd.entries()].map(([k,v]) => [k, num(v)]));
    order.status = 'QUOTED';
    order.updatedAt = new Date().toISOString();
    order.timeline = [...new Set([...(order.timeline || []),'QUOTED'])];
    saveOrders(orders); renderAll();
  });
  document.getElementById('saveStatus').addEventListener('click', () => {
    const newStatus = document.getElementById('statusSelect').value;
    order.status = newStatus;
    order.updatedAt = new Date().toISOString();
    if (SNS_PROGRESS_STATUSES.includes(newStatus)) order.timeline = [...new Set([...(order.timeline || []),newStatus])];
    saveOrders(orders); renderAll();
  });
}

function renderAll() { renderMetrics(); renderList(); renderDetail(); }
statusFilter.addEventListener('change', renderList);
document.getElementById('resetData').addEventListener('click', () => { orders = resetOrders(); selectedId = orders[0]?.id; statusFilter.value = 'ALL'; renderAll(); });
renderAll();
