const state={source:'bestbuy',q:'',page:1,pageSize:24,status:null,loading:false};
const el={
  grid:document.getElementById('catalogGrid'),count:document.getElementById('catalogCount'),
  search:document.getElementById('catalogSearch'),source:document.getElementById('sourceFilter'),
  pagination:document.getElementById('pagination'),status:document.getElementById('sourceStatus'),
  limitations:document.getElementById('sourceLimitations')
};
function liveBadge(text,cls=''){return `<span class="live-badge ${cls}">${escapeHtml(text)}</span>`;}
function sourceEndpoint(){if(state.source==='bestbuy')return `/api/catalog/bestbuy?page=${state.page}&pageSize=${state.pageSize}&q=${encodeURIComponent(state.q)}`;return `/api/catalog/feed?source=${encodeURIComponent(state.source)}&page=${state.page}&pageSize=${state.pageSize}&q=${encodeURIComponent(state.q)}`;}
function providerOption(source){const suffix=source.configured?'LIVE':'SETUP REQUIRED';return `<option value="${source.id}">${escapeHtml(source.label)} — ${suffix}</option>`;}
function renderSourceStatus(){const source=state.status?.sources?.find(x=>x.id===state.source);if(!source)return;const attribution=document.getElementById('bestBuyAttribution');if(attribution)attribution.hidden=state.source!=='bestbuy';el.status.innerHTML=source.configured?`${liveBadge('LIVE','ok')} <strong>${escapeHtml(source.label)}</strong> · ${escapeHtml(source.integration)} · live source enabled`:`${liveBadge('SETUP REQUIRED','warn')} <strong>${escapeHtml(source.label)}</strong> · ${escapeHtml(source.integration)} · add credentials/feed in Vercel`;}
function verificationRows(item){const v=item.verification||{};return [['Live price',v.livePrice],['Availability',v.liveAvailability],['Real image',v.realImage],['SKU',v.retailerSku],['UPC/GTIN',v.upc],['Package dimensions',v.accuratePackageDimensions]].map(([name,ok])=>`<span class="verify-chip ${ok?'verified':'missing'}">${ok?'✓':'—'} ${name}</span>`).join('');}
function productCard(item){
  const e=snsEstimateLiveOffer(item),image=item.imageUrl||'assets/catalog-placeholder.svg',delivered=e.complete?money(e.delivered):'Quote required';
  const reason=e.complete?'Provisional landed estimate':(e.reason==='CUSTOMS_CLASSIFICATION_REQUIRED'?'Customs review required':'Freight quote required');
  const customs=e.customs?`${e.customs.label} · ${e.customs.dutyPct}% duty`:'Needs customs classification';
  return `<article class="catalog-card live-offer-card">
    <div class="catalog-image"><img src="${escapeHtml(image)}" alt="" loading="lazy" /><span>${escapeHtml(item.retailer)}</span></div>
    <div class="catalog-card-body">
      <div class="catalog-meta"><span>${escapeHtml(item.retailer)}</span><span>SKU ${escapeHtml(item.retailerSku||'—')}</span></div>
      <h3>${escapeHtml(item.name)}</h3>
      <div class="catalog-price-row"><div><small>Current U.S. price</small><strong>${money(item.usPrice)}</strong></div><div class="delivered-est"><small>Est. Nassau delivered</small><strong>${delivered}</strong></div></div>
      <p class="live-reason">${escapeHtml(reason)} · ${escapeHtml(customs)}</p>
      <div class="verification-grid">${verificationRows(item)}</div>
      <dl class="catalog-facts">
        <div><dt>UPC/GTIN</dt><dd>${escapeHtml(item.upc||item.gtin||'Not supplied')}</dd></div>
        <div><dt>Shipping weight</dt><dd>${item.shippingWeightLb?`${item.shippingWeightLb} lb`:'Not supplied'}</dd></div>
        <div><dt>Dimensions</dt><dd>${item.packageDimensions?`${item.packageDimensions.lengthIn||'—'} × ${item.packageDimensions.widthIn||'—'} × ${item.packageDimensions.heightIn||'—'} in package`:(item.productDimensions?'Product dimensions only':'Not supplied')}</dd></div>
        <div><dt>Availability</dt><dd>${escapeHtml(humanStatus(item.availability))}</dd></div>
      </dl>
      <a class="button button-primary catalog-shop" href="request.html?retailer=${encodeURIComponent(item.retailer)}&product=${encodeURIComponent(item.name)}&price=${encodeURIComponent(item.usPrice)}&sku=${encodeURIComponent(item.retailerSku||'')}&url=${encodeURIComponent(item.sourceUrl||'')}">Request this item</a>
      ${item.sourceUrl?`<a class="retailer-source-link" href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">View retailer listing ↗</a>`:''}
    </div></article>`;
}
async function loadStatus(){try{const r=await fetch('/api/catalog/status');state.status=await r.json();el.source.innerHTML=state.status.sources.filter(x=>x.id!=='amazon').map(providerOption).join('');el.source.value=state.source;renderSourceStatus();}catch{el.status.textContent='Unable to read source configuration.';}}
async function loadCatalog(){
  state.loading=true;el.grid.innerHTML='<div class="card empty-state catalog-empty"><h3>Loading live retailer data…</h3></div>';el.pagination.innerHTML='';
  try{
    const r=await fetch(sourceEndpoint()),payload=await r.json();
    if(!r.ok){el.count.textContent='0 live offers';el.grid.innerHTML=`<div class="card empty-state catalog-empty"><h3>${escapeHtml(payload.error==='SOURCE_NOT_CONFIGURED'?'Source setup required':'Live source unavailable')}</h3><p>${escapeHtml(payload.message||'Configure this retailer source in Vercel and try again.')}</p></div>`;el.limitations.innerHTML='';return;}
    el.count.textContent=`${Number(payload.total||0).toLocaleString()} live offers available from source`;
    el.grid.innerHTML=(payload.items||[]).length?payload.items.map(productCard).join(''):'<div class="card empty-state catalog-empty"><h3>No live products found</h3><p>Try a different search.</p></div>';
    const limits=[...(payload.sourceLimitations||[])];
    if(payload.sourcePolicy) limits.unshift(payload.sourcePolicy);
    if(payload.affiliateUse==='REFERRAL_DISCOVERY') limits.unshift('Affiliate feed content is used for product discovery/referral only; Shop N Ship procurement is a separate transaction unless the retailer grants written approval.');
    if(payload.sourceFetchedAt) limits.push('Latest feed fetch: '+new Date(payload.sourceFetchedAt).toLocaleString()+'.');
    el.limitations.innerHTML=limits.map(x=>`<li>${escapeHtml(x)}</li>`).join('');
    const pages=Number(payload.totalPages||1);state.page=Number(payload.page||state.page);
    if(pages>1)el.pagination.innerHTML=`<button class="button button-secondary" data-p="${Math.max(1,state.page-1)}" ${state.page<=1?'disabled':''}>Previous</button><span>Page ${state.page} of ${pages}</span><button class="button button-secondary" data-p="${Math.min(pages,state.page+1)}" ${state.page>=pages?'disabled':''}>Next</button>`;
    el.pagination.querySelectorAll('[data-p]').forEach(b=>b.addEventListener('click',()=>{state.page=Number(b.dataset.p);loadCatalog();window.scrollTo({top:document.querySelector('.catalog-toolbar').offsetTop-90,behavior:'smooth'});}));
  }catch(err){el.grid.innerHTML=`<div class="card empty-state catalog-empty"><h3>Live catalog error</h3><p>${escapeHtml(err.message)}</p></div>`;}finally{state.loading=false;}
}
let searchTimer;el.search.addEventListener('input',e=>{clearTimeout(searchTimer);state.q=e.target.value;state.page=1;searchTimer=setTimeout(loadCatalog,350);});
el.source.addEventListener('change',e=>{state.source=e.target.value;state.page=1;renderSourceStatus();loadCatalog();});
(async()=>{await loadStatus();await loadCatalog();})();
