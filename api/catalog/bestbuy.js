'use strict';

const BESTBUY_ENDPOINT = 'https://api.bestbuy.com/v1/products';

function clampInt(value, min, max, fallback) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}
function cleanTerms(input) {
  return String(input || '').trim().split(/\s+/)
    .map(t => t.replace(/[^a-zA-Z0-9+._-]/g, ''))
    .filter(Boolean).slice(0, 6);
}
function num(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number.parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : null;
}
function transportRecommendation(product) {
  const weight = num(product.shippingWeight) ?? num(product.weight);
  const dims = [num(product.height), num(product.width), num(product.depth)].filter(v => v !== null);
  const maxDim = dims.length ? Math.max(...dims) : null;
  if (weight !== null && weight > 25) return 'OCEAN_RECOMMENDED';
  if (maxDim !== null && maxDim > 30) return 'OCEAN_RECOMMENDED';
  if (weight !== null && maxDim !== null) return 'AIR_OR_OCEAN_REVIEW';
  return 'MANUAL_REVIEW';
}
function normalize(product) {
  const weight = num(product.shippingWeight) ?? num(product.weight);
  const height = num(product.height);
  const width = num(product.width);
  const depth = num(product.depth);
  return {
    source:'bestbuy', sourceLabel:'Best Buy Products API', retailer:'Best Buy',
    retailerSku:product.sku ? String(product.sku) : null, upc:product.upc || null, gtin:null,
    modelNumber:product.modelNumber || null, manufacturer:product.manufacturer || null,
    name:product.name || null, description:product.shortDescription || null,
    imageUrl:product.largeFrontImage || product.largeImage || product.image || null,
    sourceUrl:product.url || null, usPrice:num(product.salePrice), regularPrice:num(product.regularPrice),
    priceUpdatedAt:product.priceUpdateDate || null,
    availability:product.onlineAvailability ? 'ONLINE_AVAILABLE' : (product.inStoreAvailability ? 'STORE_AVAILABILITY_ONLY' : 'UNAVAILABLE'),
    onlineAvailability:Boolean(product.onlineAvailability), inStoreAvailability:Boolean(product.inStoreAvailability),
    shippingWeightLb:weight, packageDimensions:null, packageDimensionsStatus:'NOT_PROVIDED_BY_SOURCE',
    productDimensions:(height !== null || width !== null || depth !== null) ? {heightIn:height,widthIn:width,depthIn:depth} : null,
    dimensionsArePackageDimensions:false, transportRecommendation:transportRecommendation(product),
    transportReviewRequired:true, categoryPath:Array.isArray(product.categoryPath) ? product.categoryPath : [],
    rating:num(product.customerReviewAverage), reviewCount:num(product.customerReviewCount),
    commerceMode:'DISCOVERY_REQUEST',
    verification:{livePrice:true,liveAvailability:true,realImage:Boolean(product.largeFrontImage || product.largeImage || product.image),retailerSku:Boolean(product.sku),upc:Boolean(product.upc),accuratePackageDimensions:false}
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control','s-maxage=120, stale-while-revalidate=300');
  if (req.method !== 'GET') return res.status(405).json({error:'METHOD_NOT_ALLOWED'});
  const apiKey = process.env.BESTBUY_API_KEY;
  if (!apiKey) return res.status(503).json({error:'SOURCE_NOT_CONFIGURED',source:'bestbuy',message:'BESTBUY_API_KEY is not configured in Vercel.'});

  const page=clampInt(req.query.page,1,1000,1);
  const pageSize=clampInt(req.query.pageSize,1,100,24);
  const terms=cleanTerms(req.query.q || req.query.query || '');
  const filters=['active=true'];
  for (const term of terms) filters.push(`search=${term}`);

  const show=['sku','upc','name','shortDescription','salePrice','regularPrice','priceUpdateDate','onlineAvailability','inStoreAvailability','image','largeFrontImage','largeImage','shippingWeight','weight','height','width','depth','url','modelNumber','manufacturer','categoryPath','customerReviewAverage','customerReviewCount'].join(',');
  const params=new URLSearchParams({apiKey,format:'json',page:String(page),pageSize:String(pageSize),show,sort:'customerReviewCount.desc'});
  const url=`${BESTBUY_ENDPOINT}(${filters.join('&')})?${params.toString()}`;

  try {
    const response=await fetch(url,{headers:{Accept:'application/json'}});
    const payload=await response.json().catch(()=>({}));
    if (!response.ok) return res.status(response.status).json({error:'UPSTREAM_ERROR',source:'bestbuy',status:response.status,message:payload.errorMessage || payload.error || 'Best Buy API request failed.'});
    const items=(payload.products || []).map(normalize).filter(x=>x.name && x.usPrice !== null);
    return res.status(200).json({
      source:'bestbuy',sourceLabel:'Best Buy Products API',commerceMode:'DISCOVERY_REQUEST',
      page:payload.currentPage || page,totalPages:payload.totalPages || 1,total:payload.total || items.length,items,
      sourceLimitations:[
        'Best Buy exposes product dimensions and shipping weight, but not guaranteed package dimensions for every product.',
        'Transport eligibility remains subject to dangerous-goods and freight review.',
        'Shop N Ship checkout must not imply Best Buy authorization; deeper commerce requires the appropriate Best Buy commerce relationship.'
      ]
    });
  } catch (error) {
    return res.status(502).json({error:'UPSTREAM_UNAVAILABLE',source:'bestbuy',message:error.message});
  }
};
