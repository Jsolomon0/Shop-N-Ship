# Live Retail Catalog Sources

Shop N Ship no longer exposes the generated 300-item template catalog. The customer catalog is now **live-source only**.

## Source order

### 1. Best Buy — implemented

**Integration:** official Best Buy Products API  
**Environment variable:** `BESTBUY_API_KEY`

The adapter returns, when supplied by Best Buy:

- real Best Buy SKU
- UPC
- current sale and regular price
- online/store availability flags
- retailer image
- product URL
- model/manufacturer
- shipping weight
- product height/width/depth
- rating/review count

Important: Best Buy's API documents product dimensions and shipping weight. The MVP does **not** label those dimensions as package dimensions. Ocean freight remains quote-required unless verified package dimensions come from a source that explicitly identifies them as package/shipping dimensions.

Commerce mode is `DISCOVERY_REQUEST`. Shop N Ship should not imply that Best Buy endorses or fulfills Shop N Ship orders. A deeper embedded checkout requires the appropriate Best Buy commerce relationship and review of the applicable API terms.

Developer portal: https://developer.bestbuy.com/

### 2. BrandsMart USA — feed adapter implemented, feed access required

**Integration:** authorized affiliate/product data feed  
**Environment variable:** `BRANDSMART_FEED_URL`

BrandsMart publicly advertises affiliate product data feed access with thousands of SKUs. After acceptance, place the authorized feed download URL in Vercel.

Affiliate page: https://www.brandsmartusa.com/pages/affiliates

### 3. Home Depot — feed adapter implemented, Impact approval required

**Integration:** authorized daily affiliate product feed  
**Environment variable:** `HOME_DEPOT_FEED_URL`

Home Depot states that accepted affiliate partners receive a daily product data feed through Impact. The intended Shop N Ship use must be checked against the program agreement before enabling customer-facing data.

Affiliate FAQ: https://www.homedepot.com/c/SF_MS_Affiliate_Program_FAQs

### 4. Walmart — feed adapter implemented, Impact approval required

**Integration:** authorized affiliate data feed  
**Environment variable:** `WALMART_FEED_URL`

Walmart's affiliate materials state that members can obtain data feeds through the affiliate member tools/Impact. The intended Shop N Ship shopping-agent use must be permitted by the agreement before enabling the feed.

Affiliate FAQ: https://affiliates.walmart.com/faqs

### 5. Amazon — planned next

Amazon has deprecated PA-API 5 in favor of the Creators API. The supported path requires Amazon Associates/Creators onboarding and OAuth credentials.

Planned variables:

- `AMAZON_CREATORS_CLIENT_ID`
- `AMAZON_CREATORS_CLIENT_SECRET`
- `AMAZON_ASSOCIATE_TAG`

Creators API docs: https://affiliate-program.amazon.com/creatorsapi/docs/en-us/api-reference

## Feed adapter expectations

The generic authorized-feed endpoint supports JSON and CSV. It attempts to map common field names for:

- product title
- retailer SKU/item ID
- UPC/GTIN/EAN
- manufacturer/model
- image URL
- product URL/deep link
- current/regular price
- availability or quantity
- shipping weight
- package or shipping dimensions
- category/department

If the retailer's actual column names are different, update the source-specific aliases in `api/catalog/feed.js` after receiving a sample feed.

## Package dimensions rule

Never convert product dimensions into package dimensions.

The normalized offer has separate fields:

- `packageDimensions`
- `packageDimensionsStatus`
- `productDimensions`
- `dimensionsArePackageDimensions`

Only fields explicitly named by the source as package/shipping dimensions are treated as verified package dimensions.

## Customs classification

The browser pricing module includes a limited set of provisional Bahamas Customs matches from the July 2024 Frequently Imported Items booklet.

Current examples include:

- cellular telephones — 10% duty + $5 environmental levy
- televisions — 35% duty + $5 environmental levy
- computer monitors/accessories — duty free
- digital/surveillance cameras — duty free
- Bluetooth speakers — duty free
- streaming/TV boxes — duty free
- wall/window air conditioners — 5% duty + $10 environmental levy
- refrigerators — duty free + $15 environmental levy
- tennis shoes — 20% duty

The Customs booklet itself says it is informational and that the Tariff Act controls. Any product that does not match a sufficiently reliable profile is shown as **Customs review required** rather than receiving an invented rate.

## VAT and processing estimate

The live catalog estimator currently uses:

- Bahamas VAT: 10%
- Customs processing: 1% of value, with a $10 minimum and $1,000 maximum

The final production calculator must calculate processing and shared charges at shipment/declaration level, not permanently charge every cart item a separate minimum.

## Vercel setup

In Vercel:

1. Open the Shop N Ship project.
2. Open **Settings → Environment Variables**.
3. Add `BESTBUY_API_KEY`.
4. Add each authorized feed URL only after access is granted.
5. Redeploy.

The endpoint `/api/catalog/status` reports whether each source is configured without exposing the secrets.

## Production ingestion architecture

The current feed adapter reads source data on demand. That is acceptable for the MVP but not the long-term architecture.

Production should ingest feeds into PostgreSQL on a schedule:

```
retailer source
→ ingestion worker
→ normalize
→ validate identifiers/images/prices
→ customs enrichment
→ shipping enrichment
→ retailer_offers table
→ customer catalog
```

This gives Shop N Ship price history, inventory snapshots, reconciliation, stale-offer detection and much faster customer searches.
