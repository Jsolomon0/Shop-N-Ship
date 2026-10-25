const SNS_LIVE_CATALOG_POLICY = {
  vatRatePct: 10,
  processingFee: { ratePct: 1, minimum: 10, maximum: 1000 },
  airFreight: { perLb: 7.5, minimum: 15 },
  localDelivery: { standard: 12, oversized: 25 },
  serviceFeeTiers: [
    { max: 99.99, pct: 15, minimum: 10 },
    { max: 499.99, pct: 12, minimum: 12 },
    { max: 999.99, pct: 9, minimum: 18 },
    { max: Infinity, pct: 6, minimum: 35 }
  ]
};

const SNS_CUSTOMS_PROFILES = [
  { test:/\b(cell(ular)? phone|smartphone|iphone)\b/i, hs:'8517', label:'Cellular telephone', dutyPct:10, levy:5, confidence:'HIGH' },
  { test:/\btelevision|\btv\b/i, hs:'8528', label:'Television', dutyPct:35, levy:5, confidence:'HIGH' },
  { test:/\b(computer monitor|display monitor)\b/i, hs:'8471', label:'Computer monitor', dutyPct:0, levy:0, confidence:'HIGH' },
  { test:/\b(usb cable|usb-c|keyboard|mouse|computer accessory|dock|docking station)\b/i, hs:'8471', label:'Computer accessory', dutyPct:0, levy:0, confidence:'MEDIUM' },
  { test:/\b(digital camera|camera)\b/i, hs:'8525', label:'Digital camera', dutyPct:0, levy:0, confidence:'MEDIUM' },
  { test:/\b(security camera|surveillance camera|video doorbell|security system)\b/i, hs:'8525', label:'Surveillance/security system', dutyPct:0, levy:0, confidence:'MEDIUM' },
  { test:/\bbluetooth speaker\b/i, hs:'8518', label:'Bluetooth speaker', dutyPct:0, levy:0, confidence:'HIGH' },
  { test:/\b(fire tv|fire stick|streaming stick|apple tv|android tv)\b/i, hs:'8525', label:'Streaming/TV box', dutyPct:0, levy:0, confidence:'MEDIUM' },
  { test:/\bwindow air conditioner|window a\/c|wall air conditioner\b/i, hs:'8415', label:'Wall/window air conditioner', dutyPct:5, levy:10, confidence:'HIGH' },
  { test:/\brefrigerator\b/i, hs:'8418', label:'Refrigerator', dutyPct:0, levy:15, confidence:'HIGH' },
  { test:/\btoaster\b/i, hs:'8516', label:'Toaster', dutyPct:35, levy:0, confidence:'HIGH' },
  { test:/\bcoffee maker\b/i, hs:'8416', label:'Coffee maker', dutyPct:35, levy:0, confidence:'HIGH' },
  { test:/\bshampoo\b/i, hs:'3305', label:'Shampoo', dutyPct:25, levy:0, confidence:'HIGH' },
  { test:/\b(sneaker|tennis shoe|running shoe)\b/i, hs:'6404', label:'Tennis shoes', dutyPct:20, levy:0, confidence:'MEDIUM' }
];

function snsLiveRound(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function snsLiveServiceFee(price) {
  const tier = SNS_LIVE_CATALOG_POLICY.serviceFeeTiers.find(t => price <= t.max) || SNS_LIVE_CATALOG_POLICY.serviceFeeTiers.at(-1);
  return snsLiveRound(Math.max(tier.minimum, price * (tier.pct / 100)));
}

function snsCustomsProfile(item) {
  const haystack = [item.name, item.description, ...(item.categoryPath || []).map(x => typeof x === 'string' ? x : x.name)].filter(Boolean).join(' ');
  const match = SNS_CUSTOMS_PROFILES.find(p => p.test.test(haystack));
  return match ? { ...match, status:'PROVISIONAL', source:'Bahamas Customs Frequently Imported Items 2024' } : null;
}

function snsEstimateLiveOffer(item) {
  const price = Number(item.usPrice || 0);
  if (!price) return { complete:false, reason:'PRICE_MISSING' };
  const customs = snsCustomsProfile(item);
  const serviceFee = snsLiveServiceFee(price);
  const processing = snsLiveRound(Math.max(SNS_LIVE_CATALOG_POLICY.processingFee.minimum, Math.min(SNS_LIVE_CATALOG_POLICY.processingFee.maximum, price * .01)));
  const delivery = item.transportRecommendation === 'OCEAN_RECOMMENDED' ? SNS_LIVE_CATALOG_POLICY.localDelivery.oversized : SNS_LIVE_CATALOG_POLICY.localDelivery.standard;

  let freight = null;
  let freightBasis = null;
  if (item.transportRecommendation !== 'OCEAN_RECOMMENDED' && Number(item.shippingWeightLb) > 0) {
    freight = snsLiveRound(Math.max(SNS_LIVE_CATALOG_POLICY.airFreight.minimum, Number(item.shippingWeightLb) * SNS_LIVE_CATALOG_POLICY.airFreight.perLb));
    freightBasis = 'AIR_WEIGHT_ESTIMATE';
  }

  const duty = customs ? snsLiveRound(price * customs.dutyPct / 100) : null;
  const levy = customs ? customs.levy : null;
  if (!customs || freight === null) {
    return { complete:false, customs, serviceFee, processing, delivery, freight, freightBasis, reason:!customs ? 'CUSTOMS_CLASSIFICATION_REQUIRED' : 'FREIGHT_QUOTE_REQUIRED' };
  }
  const vatBase = price + freight + duty + levy + processing;
  const vat = snsLiveRound(vatBase * SNS_LIVE_CATALOG_POLICY.vatRatePct / 100);
  const delivered = snsLiveRound(price + freight + duty + levy + processing + vat + serviceFee + delivery);
  return { complete:true, customs, freight, freightBasis, duty, levy, processing, vat, serviceFee, delivery, delivered };
}
