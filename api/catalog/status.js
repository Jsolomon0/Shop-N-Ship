'use strict';

module.exports=function handler(req,res){
  if(req.method!=='GET')return res.status(405).json({error:'METHOD_NOT_ALLOWED'});
  res.setHeader('Cache-Control','s-maxage=60, stale-while-revalidate=120');
  return res.status(200).json({
    sources:[
      {id:'bestbuy',label:'Best Buy',configured:Boolean(process.env.BESTBUY_API_KEY),integration:'OFFICIAL_API',commerceMode:'DISCOVERY_REQUEST'},
      {id:'brandsmart',label:'BrandsMart USA',configured:Boolean(process.env.BRANDSMART_FEED_URL),integration:'AUTHORIZED_FEED',commerceMode:'DISCOVERY_REQUEST'},
      {id:'homedepot',label:'Home Depot',configured:Boolean(process.env.HOME_DEPOT_FEED_URL),integration:'AUTHORIZED_FEED',commerceMode:'DISCOVERY_REQUEST'},
      {id:'walmart',label:'Walmart',configured:Boolean(process.env.WALMART_FEED_URL),integration:'AUTHORIZED_FEED',commerceMode:'DISCOVERY_REQUEST'},
      {id:'amazon',label:'Amazon',configured:false,integration:'CREATORS_API_PLANNED',commerceMode:'NOT_IMPLEMENTED'}
    ]
  });
};
