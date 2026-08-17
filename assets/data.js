const SNS_RETAILERS = [
  { name: 'Amazon', initials: 'AM', note: 'Online marketplace' },
  { name: 'Walmart', initials: 'WM', note: 'General merchandise' },
  { name: 'Target', initials: 'TG', note: 'General merchandise' },
  { name: 'Best Buy', initials: 'BB', note: 'Electronics' },
  { name: 'Apple', initials: 'AP', note: 'Technology' },
  { name: 'Nike', initials: 'NK', note: 'Footwear & apparel' },
  { name: "Macy's", initials: 'MC', note: 'Fashion & home' },
  { name: 'Nordstrom', initials: 'NS', note: 'Premium fashion' },
  { name: 'Sephora', initials: 'SP', note: 'Beauty' },
  { name: 'Home Depot', initials: 'HD', note: 'Home improvement' },
  { name: 'BrandsMart USA', initials: 'BM', note: 'Electronics & appliances' },
  { name: 'Burlington', initials: 'BL', note: 'Off-price fashion & home' },
  { name: "Sam's Club", initials: 'SC', note: 'Bulk & household' },
  { name: 'Other U.S. retailer', initials: '+', note: 'Request another store' }
];

const SNS_STATUSES = [
  'REQUESTED','QUOTED','AWAITING_PAYMENT','PAID','PURCHASING','PURCHASED','EN_ROUTE_TO_US_HUB','AT_US_HUB','READY_TO_SHIP','IN_TRANSIT','ARRIVED_BAHAMAS','CUSTOMS_PROCESSING','CUSTOMS_CLEARED','OUT_FOR_DELIVERY','DELIVERED','PRICE_CHANGED','OUT_OF_STOCK','PAYMENT_FAILED','CUSTOMS_HOLD','DAMAGED','RETURN_REQUESTED','CANCELLED','REFUNDED'
];

const SNS_PROGRESS_STATUSES = ['REQUESTED','QUOTED','AWAITING_PAYMENT','PAID','PURCHASING','PURCHASED','EN_ROUTE_TO_US_HUB','AT_US_HUB','READY_TO_SHIP','IN_TRANSIT','ARRIVED_BAHAMAS','CUSTOMS_PROCESSING','CUSTOMS_CLEARED','OUT_FOR_DELIVERY','DELIVERED'];

const SNS_SEED_ORDERS = [
  {
    id:'SNS-1001', requestType:'URL_REQUEST', retailer:'Best Buy', productName:'MacBook Air 13-inch', quantity:1, variant:'M4 / 16GB / 256GB', color:'Midnight', customerName:'Alicia R.', email:'alicia@example.com', phone:'+1 242 555 0121', address:'Cable Beach, Nassau', status:'CUSTOMS_PROCESSING', createdAt:'2026-08-12T14:32:00Z', updatedAt:'2026-08-16T18:15:00Z',
    quote:{productPrice:899,usSalesTax:0,domesticTransport:0,internationalFreight:34,customsDuty:0,vat:93.3,processingFees:10,localDelivery:15,serviceFee:65,localPrice:1199},
    timeline:['REQUESTED','QUOTED','AWAITING_PAYMENT','PAID','PURCHASING','PURCHASED','AT_US_HUB','READY_TO_SHIP','IN_TRANSIT','ARRIVED_BAHAMAS','CUSTOMS_PROCESSING']
  },
  {
    id:'SNS-1002', requestType:'IMAGE_REQUEST', retailer:'Burlington', productName:'Designer handbag — black', quantity:1, variant:'Medium', color:'Black', customerName:'Dion M.', email:'dion@example.com', phone:'+1 242 555 0177', address:'Eastern Road, Nassau', status:'PURCHASING', createdAt:'2026-08-14T15:10:00Z', updatedAt:'2026-08-16T19:02:00Z',
    quote:{productPrice:89.99,usSalesTax:0,domesticTransport:8,internationalFreight:18,customsDuty:18,vat:13.4,processingFees:10,localDelivery:12,serviceFee:18,localPrice:210},
    timeline:['REQUESTED','QUOTED','AWAITING_PAYMENT','PAID','PURCHASING']
  },
  {
    id:'SNS-1003', requestType:'URL_REQUEST', retailer:'BrandsMart USA', productName:'Samsung 65-inch 4K Smart TV', quantity:1, variant:'65 inch', color:'Black', customerName:'Renee T.', email:'renee@example.com', phone:'+1 242 555 0164', address:'Winton, Nassau', status:'AT_US_HUB', createdAt:'2026-08-13T11:20:00Z', updatedAt:'2026-08-16T17:45:00Z',
    quote:{productPrice:599,usSalesTax:0,domesticTransport:15,internationalFreight:72,customsDuty:45,vat:72.1,processingFees:10,localDelivery:18,serviceFee:42,localPrice:995},
    timeline:['REQUESTED','QUOTED','AWAITING_PAYMENT','PAID','PURCHASING','PURCHASED','EN_ROUTE_TO_US_HUB','AT_US_HUB']
  },
  {
    id:'SNS-1004', requestType:'URL_REQUEST', retailer:"Sam's Club", productName:'Bulk household essentials bundle', quantity:1, variant:'Mixed case', color:'', customerName:'Marcus C.', email:'marcus@example.com', phone:'+1 242 555 0108', address:'South Beach, Nassau', status:'DELIVERED', createdAt:'2026-08-08T13:05:00Z', updatedAt:'2026-08-15T20:30:00Z',
    quote:{productPrice:184.5,usSalesTax:0,domesticTransport:0,internationalFreight:28,customsDuty:21,vat:23.35,processingFees:10,localDelivery:12,serviceFee:24,localPrice:345},
    timeline:['REQUESTED','QUOTED','AWAITING_PAYMENT','PAID','PURCHASING','PURCHASED','EN_ROUTE_TO_US_HUB','AT_US_HUB','READY_TO_SHIP','IN_TRANSIT','ARRIVED_BAHAMAS','CUSTOMS_PROCESSING','CUSTOMS_CLEARED','OUT_FOR_DELIVERY','DELIVERED']
  }
];
