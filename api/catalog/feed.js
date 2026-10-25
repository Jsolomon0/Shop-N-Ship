'use strict';

const SOURCES = {
  brandsmart:{label:'BrandsMart USA',env:'BRANDSMART_FEED_URL'},
  homedepot:{label:'Home Depot',env:'HOME_DEPOT_FEED_URL'},
  walmart:{label:'Walmart',env:'WALMART_FEED_URL'}
};
function clampInt(value,min,max,fallback){const n=Number.parseInt(value,10);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback;}
function parseCsv(text){const rows=[];let row=[],field='',quoted=false;for(let i=0;i<text.length;i++){const ch=text[i];if(quoted){if(ch==='"'&&text[i+1]==='"'){field+='"';i++;}else if(ch==='"')quoted=false;else field+=ch;}else if(ch==='"')quoted=true;else if(ch===','){row.push(field);field='';}else if(ch==='\n'){row.push(field.replace(/\r$/,''));rows.push(row);row=[];field='';}else field+=ch;}if(field.length||row.length){row.push(field);rows.push(row);}if(!rows.length)return[];const headers=rows[0].map(h=>h.trim());return rows.slice(1).filter(r=>r.some(v=>String(v).trim())).map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??''])));}
function first(row,aliases){const normalized=Object.fromEntries(Object.entries(row).map(([k,v])=>[String(k).toLowerCase().replace(/[^a-z0-9]/g,''),v]));for(const alias of aliases){const key=alias.toLowerCase().replace(/[^a-z0-9]/g,'');if(normalized[key]!==undefined&&normalized[key]!=='')return normalized[key];}return null;}
function num(v){if(v===null||v===undefined||v==='')return null;const n=Number.parseFloat(String(v).replace(/[^0-9.-]/g,''));return Number.isFinite(n)?n:null;}
function normalizeRow(row,source){
  const cfg=SOURCES[source];
  const length=num(first(row,['package_length','shipping_length','length','product_length']));
  const width=num(first(row,['package_width','shipping_width','width','product_width']));
  const height=num(first(row,['package_height','shipping_height','height','product_height']));
  const explicitPackage=['package_length','package_width','package_height','shipping_length','shipping_width','shipping_height'].some(k=>first(row,[k])!==null);
  const inventoryValue=first(row,['availability','stock_status','inventory_status','in_stock','stock','quantity']);
  const availabilityText=String(inventoryValue??'').toLowerCase();
  const available=['1','true','yes','in stock','instock','available'].some(x=>availabilityText===x)||(num(inventoryValue)??0)>0;
  const image=first(row,['image_url','imageurl','image','large_image','largeimage']);
  const sku=first(row,['sku','item_id','itemid','product_id','productid','merchant_sku']);
  const upc=first(row,['upc','upc_code']);
  const gtin=first(row,['gtin','gtin14','ean']);
  return {
    source,sourceLabel:`${cfg.label} authorized feed`,retailer:cfg.label,retailerSku:sku,upc,gtin,
    modelNumber:first(row,['model_number','model','mpn']),manufacturer:first(row,['brand','manufacturer']),
    name:first(row,['title','name','product_name','productname']),description:first(row,['description','short_description','shortdescription']),
    imageUrl:image,sourceUrl:first(row,['product_url','producturl','url','link','deeplink']),
    usPrice:num(first(row,['sale_price','saleprice','price','current_price','currentprice'])),
    regularPrice:num(first(row,['regular_price','regularprice','msrp','list_price','listprice'])),
    priceUpdatedAt:first(row,['updated_at','updatedat','last_updated','lastupdated']),
    availability:available?'AVAILABLE':(inventoryValue===null?'UNKNOWN':'UNAVAILABLE'),
    shippingWeightLb:num(first(row,['shipping_weight','shippingweight','weight_lb','weightlbs','weight'])),
    packageDimensions:explicitPackage&&(length!==null||width!==null||height!==null)?{lengthIn:length,widthIn:width,heightIn:height}:null,
    packageDimensionsStatus:explicitPackage?'SOURCE_PROVIDED':'NOT_CONFIRMED_AS_PACKAGE_DIMENSIONS',
    productDimensions:!explicitPackage&&(length!==null||width!==null||height!==null)?{lengthIn:length,widthIn:width,heightIn:height}:null,
    dimensionsArePackageDimensions:explicitPackage,transportRecommendation:'MANUAL_REVIEW',transportReviewRequired:true,
    categoryPath:[first(row,['category','category_name','categoryname','department'])].filter(Boolean),
    commerceMode:'DISCOVERY_REQUEST',
    verification:{livePrice:true,liveAvailability:inventoryValue!==null,realImage:Boolean(image),retailerSku:Boolean(sku),upc:Boolean(upc||gtin),accuratePackageDimensions:explicitPackage}
  };
}
module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=900');
  if(req.method!=='GET')return res.status(405).json({error:'METHOD_NOT_ALLOWED'});
  const source=String(req.query.source||'').toLowerCase();const cfg=SOURCES[source];
  if(!cfg)return res.status(400).json({error:'UNKNOWN_SOURCE'});
  const feedUrl=process.env[cfg.env];
  if(!feedUrl)return res.status(503).json({error:'SOURCE_NOT_CONFIGURED',source,message:`${cfg.env} is not configured in Vercel.`});
  const page=clampInt(req.query.page,1,10000,1),pageSize=clampInt(req.query.pageSize,1,100,24),q=String(req.query.q||'').trim().toLowerCase();
  try{
    const response=await fetch(feedUrl,{headers:{Accept:'application/json,text/csv,text/plain;q=0.9,*/*;q=0.5'}});
    if(!response.ok)return res.status(502).json({error:'UPSTREAM_ERROR',source,status:response.status});
    const type=String(response.headers.get('content-type')||'').toLowerCase();const body=await response.text();let rows;
    if(type.includes('json')||body.trim().startsWith('[')||body.trim().startsWith('{')){const parsed=JSON.parse(body);rows=Array.isArray(parsed)?parsed:(parsed.products||parsed.items||parsed.data||[]);}else rows=parseCsv(body);
    let items=rows.map(r=>normalizeRow(r,source)).filter(x=>x.name&&x.usPrice!==null&&x.imageUrl);
    if(q)items=items.filter(x=>[x.name,x.retailerSku,x.upc,x.gtin,x.manufacturer].filter(Boolean).join(' ').toLowerCase().includes(q));
    const total=items.length,from=(page-1)*pageSize;items=items.slice(from,from+pageSize);
    return res.status(200).json({source,sourceLabel:`${cfg.label} authorized feed`,commerceMode:'DISCOVERY_REQUEST',page,totalPages:Math.max(1,Math.ceil(total/pageSize)),total,items});
  }catch(error){return res.status(502).json({error:'FEED_PARSE_OR_FETCH_ERROR',source,message:error.message});}
};
