# Shop N Ship Catalog Architecture

## Objective

The catalog is the shopping layer of the Shop N Ship MVP. Customers browse a curated U.S. assortment, see a provisional Nassau delivered-price estimate, and submit the item into the same request/quote/fulfillment workflow already used by the MVP.

The launch seed contains **300 catalog offers** across online retailers, membership stores, physical-shopper retailers, and oversized quote-required merchandise.

## Important distinction: product vs offer

Production should normalize:

- `products`: canonical product identity
- `retailer_offers`: retailer-specific price, SKU, image, inventory and URL
- `customs_profiles`: HS/classification, duty, levy and VAT treatment
- `shipping_profiles`: weight, dimensions, dangerous-goods flags and air/ocean eligibility

The static MVP keeps one flattened record per offer for simplicity.

## Catalog record

Each offer supports:

- `catalogSku` — Shop N Ship internal SKU
- `retailerSku` — retailer SKU when a live feed/manual verification supplies it
- `retailer`
- `name`
- `category`
- `imageUrl`
- `sourceUrl`
- `usPrice`
- `priceStatus`
- `priceUpdatedAt`
- `weightLb`
- `lengthIn`, `widthIn`, `heightIn`
- `shippingEligibility` — AIR, OCEAN or BOTH
- `sourcingMode` — ONLINE, SHOPPER or QUOTE_REQUIRED
- `customs.hsCode`
- `customs.classificationStatus`
- `customs.confidence`
- `customs.dutyRatePct`
- `customs.environmentalLevy`
- `customs.vatRatePct`
- calculated Shop N Ship fee
- calculated freight estimate
- calculated Customs/VAT estimate
- estimated Nassau delivered price

## Pricing model

Shop N Ship should behave like a cross-border shopping agent rather than hide all economics inside an opaque retail markup.

### Merchandise

The retailer price is the merchandise base. For the MVP, catalog prices are estimates and must be refreshed/confirmed before purchase.

### Shop N Ship service fee

Launch proposal:

| Merchandise value | Service fee |
| --- | --- |
| $0–$99.99 | 15%, $10 minimum |
| $100–$499.99 | 12%, $12 minimum |
| $500–$999.99 | 9%, $18 minimum |
| $1,000+ | 6%, $35 minimum |

This declining percentage prevents a high-ticket laptop or appliance from producing an unreasonable shopping fee.

### Physical shopper fee

Add **$8 per physical-store sourcing assignment** for Burlington, Ross, TJ Maxx, Marshalls and similar stores. This is separate from optional shopper tips.

### Logistics

International freight and Nassau last-mile delivery are separate line items. The current static rates are planning assumptions only and must be replaced with contracted carrier tariffs before live checkout.

## Landed-price estimate

Conceptually:

```
Retailer merchandise
+ Shop N Ship service fee
+ physical shopper fee, if applicable
+ international freight estimate
+ Bahamas customs duty
+ environmental levy
+ customs processing fee allocation
+ Bahamas VAT estimate
+ Nassau delivery
= estimated delivered price
```

The final production calculator must operate at **cart/shipment level**, not simply add a $10 processing minimum to each item. Multiple items consolidated into one Customs declaration can share shipment-level charges.

## Customs controls

Catalog customs fields are provisional. A product should have:

- source/version date
- HS code
- confidence
- duty rate
- levy
- VAT rate
- restricted-goods flag
- manual-review flag

Low-confidence classifications must be reviewed before final checkout.

Bahamas VAT should be configuration data, not hard-coded into product records. Duty schedules must be versioned.

## Inventory and retailer pricing

The MVP should eventually refresh offers using one of three methods:

1. official retailer/affiliate/API feed;
2. authorized merchant/partner feed;
3. human verification by shopper/admin.

Do not scrape retailer checkout systems or automate purchasing in ways that violate retailer terms.

## Images

The current 300-item seed uses a placeholder image intentionally. Production images should come from a permitted retailer or affiliate feed, merchant-supplied product content, or product media the business has rights to use.

## Shopper workflow

For Burlington/Ross-style inventory:

1. customer selects a catalog template or uploads a reference;
2. customer defines budget, size/color/brand constraints;
3. shopper receives the store task;
4. shopper confirms actual item, photo, SKU/UPC and price;
5. customer approves any material substitution/price change;
6. Shop N Ship purchases and continues fulfillment.

## Production tables

Recommended normalized schema:

- `retailers`
- `products`
- `retailer_offers`
- `offer_price_snapshots`
- `customs_profiles`
- `shipping_profiles`
- `catalog_categories`
- `carts`
- `cart_items`
- `service_fees`
- `shopping_tasks`
- `orders`
- `packages`
- `shipments`
- `customs_entries`

## Launch gate

Before collecting real customer money from the catalog:

- live database
- authenticated customer/cart sessions
- server-side pricing
- retailer-price re-verification
- payment authorization/capture
- shipment-level freight quote
- customs review workflow
- secure admin RBAC
- permitted product-image sourcing
