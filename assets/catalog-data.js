const SNS_CATALOG_POLICY = {
  currency: 'USD',
  vatRatePct: 10,
  customsProcessing: { ratePct: 1, minimum: 10, maximum: 1000, scope: 'shipment' },
  serviceFeeTiers: [
    { max: 99.99, pct: 15, minimum: 10 },
    { max: 499.99, pct: 12, minimum: 12 },
    { max: 999.99, pct: 9, minimum: 18 },
    { max: Infinity, pct: 6, minimum: 35 }
  ],
  shopperStoreFee: 8,
  localDelivery: { standard: 12, oversized: 25 },
  freight: {
    air: { perLb: 7.5, minimum: 15 },
    ocean: { perCubicFt: 18, minimum: 25 }
  },
  notes: [
    'Catalog prices are launch estimates, not guaranteed retailer prices.',
    'Final retailer price is re-verified before purchase.',
    'Customs classification and fees are provisional until final shipment review.',
    'Processing fees are assessed at shipment/declaration level; catalog estimates assume a standalone item.'
  ]
};

const SNS_CATALOG_GROUPS = [
  { category:'Phones & Tablets', count:20, retailers:['Apple','Best Buy','Walmart','Amazon','Costco',"Sam's Club"], names:['Unlocked smartphone 128GB','Unlocked smartphone 256GB','Premium smartphone 256GB','Tablet 10–11 inch Wi-Fi','Tablet 12–13 inch Wi-Fi'], basePrice:399, step:90, weightLb:1.6, dims:[11,8,4], ship:'AIR', hs:'8517', duty:10, levy:5, confidence:'MEDIUM', mode:'ONLINE' },
  { category:'Computers & Accessories', count:28, retailers:['Best Buy','Amazon','Walmart','Costco','BrandsMart USA'], names:['13-inch laptop','15-inch laptop','Business laptop','Gaming laptop','27-inch monitor','Wireless keyboard & mouse','USB-C dock','External SSD 1TB'], basePrice:79, step:85, weightLb:6, dims:[18,14,5], ship:'AIR', hs:'8471', duty:0, levy:0, confidence:'HIGH', mode:'ONLINE' },
  { category:'Televisions', count:12, retailers:['BrandsMart USA','Best Buy','Walmart','Costco',"Sam's Club"], names:['43-inch 4K Smart TV','50-inch 4K Smart TV','55-inch 4K Smart TV','65-inch 4K Smart TV'], basePrice:249, step:100, weightLb:38, dims:[58,36,7], ship:'OCEAN', hs:'8528', duty:35, levy:5, confidence:'MEDIUM', mode:'QUOTE_REQUIRED' },
  { category:'Streaming & Smart Audio', count:8, retailers:['Amazon','Best Buy','Walmart'], names:['4K streaming stick','Streaming TV box','Smart speaker','Smart display'], basePrice:39, step:35, weightLb:2.2, dims:[10,8,5], ship:'AIR', hs:'8525', duty:0, levy:0, confidence:'HIGH', mode:'ONLINE' },
  { category:'Gaming', count:16, retailers:['Best Buy','Walmart','Amazon','Target','Costco'], names:['Current-generation game console','Handheld game console','VR headset','Wireless game controller','Gaming headset'], basePrice:79, step:95, weightLb:8, dims:[18,14,8], ship:'AIR', hs:'9504', duty:45, levy:0, confidence:'HIGH', mode:'ONLINE' },
  { category:'Cameras & Smart Home', count:18, retailers:['Amazon','Best Buy','Walmart','Home Depot'], names:['Wi-Fi security camera','Video doorbell','Smart alarm kit','Digital camera','Outdoor camera kit','Smart thermostat'], basePrice:59, step:55, weightLb:3, dims:[12,9,6], ship:'AIR', hs:'8525', duty:0, levy:0, confidence:'HIGH', mode:'ONLINE' },
  { category:'Home & Kitchen', count:28, retailers:['Walmart','Amazon','Target','Costco',"Sam's Club",'Burlington','Ross'], names:['Air fryer','Countertop blender','Coffee maker','Cookware set','Rice cooker','Toaster oven','Food processor','Vacuum cleaner'], basePrice:39, step:40, weightLb:12, dims:[18,16,14], ship:'BOTH', hs:'8509', duty:35, levy:0, confidence:'LOW', mode:'ONLINE' },
  { category:'Major Appliances & Climate', count:16, retailers:['Home Depot','BrandsMart USA','Costco',"Sam's Club"], names:['Window air conditioner','Portable air conditioner','Fully automatic washer','Electric dryer','Chest freezer','Compact refrigerator'], basePrice:299, step:140, weightLb:95, dims:[32,30,38], ship:'OCEAN', hs:'8415', duty:5, levy:10, confidence:'MEDIUM', mode:'QUOTE_REQUIRED' },
  { category:'Fashion', count:38, retailers:['Burlington','Ross','Walmart','Target',"Macy's",'Nordstrom','TJ Maxx','Marshalls'], names:["Women's dress","Women's handbag","Men's polo shirt","Men's jeans","Women's activewear set","Men's dress shirt","Kids clothing set",'Luggage carry-on'], basePrice:24, step:18, weightLb:2.5, dims:[16,12,5], ship:'AIR', hs:'6110', duty:20, levy:0, confidence:'MEDIUM', mode:'SHOPPER' },
  { category:'Shoes & Sneakers', count:22, retailers:['Nike','Foot Locker','Burlington','Ross','Walmart',"Macy's",'Nordstrom'], names:['Running shoes','Basketball sneakers','Casual sneakers','Dress shoes','Sandals','Kids sneakers'], basePrice:39, step:28, weightLb:3, dims:[14,10,6], ship:'AIR', hs:'6404', duty:20, levy:0, confidence:'LOW', mode:'SHOPPER' },
  { category:'Beauty & Personal Care', count:18, retailers:['Sephora','Ulta','Walmart','Target','Burlington','Ross'], names:['Skincare set','Makeup set','Hair styling tool','Fragrance set','Electric toothbrush','Hair care bundle'], basePrice:29, step:24, weightLb:2, dims:[11,8,5], ship:'AIR', hs:'3304', duty:20, levy:0, confidence:'LOW', mode:'SHOPPER' },
  { category:'Baby & Kids', count:24, retailers:['Walmart','Target','Amazon','Costco',"Sam's Club"], names:['Diaper case','Baby wipes case','Convertible car seat','Baby stroller','High chair','Playpen / travel crib','Baby bottle set','Toddler clothing bundle'], basePrice:29, step:35, weightLb:12, dims:[20,16,12], ship:'BOTH', hs:'9401', duty:0, levy:0, confidence:'HIGH', mode:'ONLINE' },
  { category:'Tools & Home Improvement', count:20, retailers:['Home Depot','Amazon','Walmart'], names:['Cordless drill kit','Hand tool set','Circular saw','Impact driver','Smart lock','Plumbing fixture set','LED work light'], basePrice:49, step:45, weightLb:10, dims:[18,12,8], ship:'BOTH', hs:'8205', duty:25, levy:0, confidence:'HIGH', mode:'ONLINE' },
  { category:'Bulk Household', count:16, retailers:["Sam's Club",'Costco','Walmart','Amazon'], names:['Toilet paper case','Paper towel case','Laundry detergent pack','Dishwashing supply pack','Personal care multipack','Cleaning supplies bundle'], basePrice:24, step:18, weightLb:18, dims:[22,18,15], ship:'OCEAN', hs:'4818', duty:10, levy:0, confidence:'LOW', mode:'ONLINE' },
  { category:'Furniture & Décor', count:16, retailers:['IKEA','Wayfair','Target','Home Depot','Costco',"Sam's Club",'Burlington','Ross'], names:['Accent chair','Nightstand','Storage cabinet','Area rug','Desk','Bar stool set','Bedding set','Floor lamp'], basePrice:49, step:55, weightLb:34, dims:[28,24,20], ship:'OCEAN', hs:'9403', duty:25, levy:0, confidence:'LOW', mode:'QUOTE_REQUIRED' }
];

function snsRoundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function snsServiceFee(merchandise) {
  const tier = SNS_CATALOG_POLICY.serviceFeeTiers.find(t => merchandise <= t.max) || SNS_CATALOG_POLICY.serviceFeeTiers.at(-1);
  return snsRoundMoney(Math.max(tier.minimum, merchandise * (tier.pct / 100)));
}

function snsEstimateFreight(item, mode) {
  if (mode === 'AIR') {
    return snsRoundMoney(Math.max(SNS_CATALOG_POLICY.freight.air.minimum, item.weightLb * SNS_CATALOG_POLICY.freight.air.perLb));
  }
  const cubicFt = (item.lengthIn * item.widthIn * item.heightIn) / 1728;
  return snsRoundMoney(Math.max(SNS_CATALOG_POLICY.freight.ocean.minimum, cubicFt * SNS_CATALOG_POLICY.freight.ocean.perCubicFt));
}

function snsEstimateLanded(item, preferredMode) {
  const mode = preferredMode || (item.shippingEligibility === 'OCEAN' ? 'OCEAN' : 'AIR');
  const freight = snsEstimateFreight(item, mode);
  const duty = snsRoundMoney(item.usPrice * (item.dutyRatePct / 100));
  const processing = snsRoundMoney(Math.max(
    SNS_CATALOG_POLICY.customsProcessing.minimum,
    Math.min(SNS_CATALOG_POLICY.customsProcessing.maximum, item.usPrice * (SNS_CATALOG_POLICY.customsProcessing.ratePct / 100))
  ));
  const vatBase = item.usPrice + freight + duty + item.environmentalLevy + processing;
  const vat = snsRoundMoney(vatBase * (SNS_CATALOG_POLICY.vatRatePct / 100));
  const serviceFee = snsServiceFee(item.usPrice);
  const shopperFee = item.sourcingMode === 'SHOPPER' ? SNS_CATALOG_POLICY.shopperStoreFee : 0;
  const localDelivery = item.oversized ? SNS_CATALOG_POLICY.localDelivery.oversized : SNS_CATALOG_POLICY.localDelivery.standard;
  const delivered = snsRoundMoney(item.usPrice + freight + duty + item.environmentalLevy + processing + vat + serviceFee + shopperFee + localDelivery);
  return { mode, freight, duty, processing, vat, serviceFee, shopperFee, localDelivery, delivered };
}

function snsBuildCatalog() {
  const items = [];
  let sequence = 1;
  SNS_CATALOG_GROUPS.forEach((group, groupIndex) => {
    for (let i = 0; i < group.count; i++) {
      const retailer = group.retailers[i % group.retailers.length];
      const baseName = group.names[i % group.names.length];
      const cycle = Math.floor(i / group.names.length);
      const price = snsRoundMoney(group.basePrice + ((i % 5) * group.step) + (cycle * Math.max(5, group.step * 0.22)));
      const weightMultiplier = 1 + ((i % 4) * 0.08);
      const dimsMultiplier = 1 + ((i % 3) * 0.05);
      const sourcingMode = ['Burlington','Ross','TJ Maxx','Marshalls'].includes(retailer) ? 'SHOPPER' : group.mode;
      const oversized = group.ship === 'OCEAN' && (group.weightLb >= 30 || group.dims[0] >= 28);
      const sku = 'SNS-' + String(sequence).padStart(4,'0');
      const item = {
        id: sku,
        catalogSku: sku,
        retailerSku: null,
        retailer,
        name: baseName + (cycle ? ' — option ' + (cycle + 1) : ''),
        category: group.category,
        imageUrl: 'assets/catalog-placeholder.svg',
        imageStatus: 'PLACEHOLDER',
        sourceUrl: null,
        usPrice: price,
        priceStatus: sourcingMode === 'SHOPPER' ? 'SHOPPER_CONFIRM' : 'ESTIMATE',
        priceUpdatedAt: '2026-10-13',
        weightLb: snsRoundMoney(group.weightLb * weightMultiplier),
        lengthIn: snsRoundMoney(group.dims[0] * dimsMultiplier),
        widthIn: snsRoundMoney(group.dims[1] * dimsMultiplier),
        heightIn: snsRoundMoney(group.dims[2] * dimsMultiplier),
        shippingEligibility: group.ship,
        sourcingMode,
        oversized,
        customs: {
          hsCode: group.hs,
          description: group.category,
          classificationStatus: 'PROVISIONAL',
          confidence: group.confidence,
          dutyRatePct: group.duty,
          environmentalLevy: group.levy,
          vatRatePct: SNS_CATALOG_POLICY.vatRatePct
        },
        dutyRatePct: group.duty,
        environmentalLevy: group.levy,
        tags: [group.category, retailer, sourcingMode, group.ship]
      };
      item.estimate = snsEstimateLanded(item);
      items.push(item);
      sequence++;
    }
  });
  return items;
}

const SNS_CATALOG = snsBuildCatalog();
