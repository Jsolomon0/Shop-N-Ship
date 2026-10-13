const state = {
  search: '',
  retailer: 'ALL',
  category: 'ALL',
  shipping: 'ALL',
  page: 1,
  pageSize: 24
};

const el = {
  grid: document.getElementById('catalogGrid'),
  count: document.getElementById('catalogCount'),
  search: document.getElementById('catalogSearch'),
  retailer: document.getElementById('retailerFilter'),
  category: document.getElementById('categoryFilter'),
  shipping: document.getElementById('shippingFilter'),
  pagination: document.getElementById('pagination')
};

function optionList(values) {
  return ['<option value="ALL">All</option>'].concat(values.map(v => '<option value="' + escapeHtml(v) + '">' + escapeHtml(v) + '</option>')).join('');
}

function unique(values) {
  return [...new Set(values)].sort((a,b) => a.localeCompare(b));
}

function filteredItems() {
  const q = state.search.trim().toLowerCase();
  return SNS_CATALOG.filter(item => {
    const searchHit = !q || [item.name,item.retailer,item.category,item.catalogSku].join(' ').toLowerCase().includes(q);
    const retailerHit = state.retailer === 'ALL' || item.retailer === state.retailer;
    const categoryHit = state.category === 'ALL' || item.category === state.category;
    const shippingHit = state.shipping === 'ALL' || item.shippingEligibility === state.shipping || item.shippingEligibility === 'BOTH';
    return searchHit && retailerHit && categoryHit && shippingHit;
  });
}

function productCard(item) {
  const e = snsEstimateLanded(item);
  const priceLabel = item.priceStatus === 'SHOPPER_CONFIRM' ? 'Budget estimate' : 'Starting U.S. price';
  const customsLabel = item.customs.confidence === 'HIGH' ? 'Customs profile' : 'Customs estimate';
  return `
    <article class="catalog-card">
      <div class="catalog-image"><img src="${item.imageUrl}" alt="" /><span>${escapeHtml(item.category.split(' ')[0])}</span></div>
      <div class="catalog-card-body">
        <div class="catalog-meta"><span>${escapeHtml(item.retailer)}</span><span>${escapeHtml(item.catalogSku)}</span></div>
        <h3>${escapeHtml(item.name)}</h3>
        <div class="catalog-price-row"><div><small>${priceLabel}</small><strong>${money(item.usPrice)}</strong></div><div class="delivered-est"><small>Est. Nassau delivered</small><strong>${money(e.delivered)}</strong></div></div>
        <div class="catalog-badges"><span>${escapeHtml(item.shippingEligibility)}</span><span>${escapeHtml(item.sourcingMode)}</span><span>${customsLabel}: ${item.dutyRatePct}% duty</span></div>
        <dl class="catalog-facts">
          <div><dt>Weight</dt><dd>${item.weightLb} lb</dd></div>
          <div><dt>Size</dt><dd>${item.lengthIn} × ${item.widthIn} × ${item.heightIn} in</dd></div>
          <div><dt>Shop N Ship fee</dt><dd>${money(e.serviceFee + e.shopperFee)}</dd></div>
          <div><dt>Freight estimate</dt><dd>${money(e.freight)}</dd></div>
        </dl>
        <a class="button button-primary catalog-shop" href="request.html?sku=${encodeURIComponent(item.catalogSku)}&retailer=${encodeURIComponent(item.retailer)}&product=${encodeURIComponent(item.name)}&price=${encodeURIComponent(item.usPrice)}">Shop this item</a>
      </div>
    </article>`;
}

function render() {
  const items = filteredItems();
  const pages = Math.max(1, Math.ceil(items.length / state.pageSize));
  if (state.page > pages) state.page = pages;
  const start = (state.page - 1) * state.pageSize;
  const visible = items.slice(start, start + state.pageSize);
  el.count.textContent = items.length + ' catalog items';
  el.grid.innerHTML = visible.length ? visible.map(productCard).join('') : '<div class="card empty-state catalog-empty"><h3>No matching items</h3><p>Try another store, category, or search term.</p></div>';
  el.pagination.innerHTML = pages > 1 ? `
    <button class="button button-secondary" ${state.page === 1 ? 'disabled' : ''} data-page="${state.page - 1}">Previous</button>
    <span>Page ${state.page} of ${pages}</span>
    <button class="button button-secondary" ${state.page === pages ? 'disabled' : ''} data-page="${state.page + 1}">Next</button>` : '';
  el.pagination.querySelectorAll('[data-page]').forEach(btn => btn.addEventListener('click', () => {
    state.page = Number(btn.dataset.page);
    render();
    window.scrollTo({top: document.querySelector('.catalog-toolbar').offsetTop - 90, behavior:'smooth'});
  }));
}

el.retailer.innerHTML = optionList(unique(SNS_CATALOG.map(i => i.retailer)));
el.category.innerHTML = optionList(unique(SNS_CATALOG.map(i => i.category)));
el.shipping.innerHTML = '<option value="ALL">Air or ocean</option><option value="AIR">Air eligible</option><option value="OCEAN">Ocean eligible</option>';

el.search.addEventListener('input', e => { state.search = e.target.value; state.page = 1; render(); });
el.retailer.addEventListener('change', e => { state.retailer = e.target.value; state.page = 1; render(); });
el.category.addEventListener('change', e => { state.category = e.target.value; state.page = 1; render(); });
el.shipping.addEventListener('change', e => { state.shipping = e.target.value; state.page = 1; render(); });

render();
