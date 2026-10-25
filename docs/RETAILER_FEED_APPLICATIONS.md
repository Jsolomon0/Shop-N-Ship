# Retailer Feed Applications — Shop N Ship

This file contains accurate application language for the retailer programs currently being pursued in parallel.

## Shop N Ship business description

Shop N Ship is a cross-border shopping concierge and logistics platform serving customers in The Bahamas. Customers use our website to discover U.S. products, request a delivered-cost quote, and ask Shop N Ship to coordinate sourcing, freight, customs preparation, and local delivery.

The public catalog is a discovery layer. Retailer feed/API data is used only under the applicable retailer/program terms. Shop N Ship does not represent itself as sponsored, endorsed, or operated by a retailer unless a separate written partnership exists.

Retailer affiliate/referral activity is kept separate from Shop N Ship's purchase-agent workflow unless the retailer expressly permits those transactions to participate in the affiliate program.

---

## BrandsMart USA

### Why Shop N Ship wants access

Shop N Ship serves customers in The Bahamas who frequently purchase electronics and appliances from South Florida. BrandsMart is highly relevant because of its South Florida footprint and product assortment.

We would like to use the authorized BrandsMart product feed to display current BrandsMart product information, images, pricing, product identifiers, and retailer links in our catalog.

### Suggested application description

> Shop N Ship is a cross-border shopping concierge serving customers in The Bahamas. We help customers discover U.S. products and coordinate sourcing, freight, customs preparation, and final delivery from South Florida to Nassau.
>
> We would like to use BrandsMart's authorized affiliate product feed to display BrandsMart products in our catalog with accurate product information and links back to BrandsMartUSA.com. Our platform will clearly identify BrandsMart as the retailer and will not imply that Shop N Ship is endorsed or operated by BrandsMart.
>
> Because Shop N Ship also provides a shopping-agent service, we would appreciate written clarification on whether transactions in which Shop N Ship purchases retail merchandise on behalf of a customer may participate in the affiliate program. Unless expressly approved, we will treat affiliate/referral activity separately from our purchase-agent transactions.

### Program facts

- BrandsMart advertises a free product data feed with 8,000+ top-selling SKUs.
- The affiliate program is positioned around referrals to BrandsMartUSA.com.
- BrandsMart lists affiliate@bm1.brandsmart.com for affiliate questions.

### Required setup after approval

- Add the authorized feed URL to Vercel as `BRANDSMART_FEED_URL`.
- Confirm actual feed column names against `api/catalog/feed.js`.
- Preserve any retailer-provided deep/affiliate links without rewriting them.
- Verify whether feed terms impose a stricter refresh interval than Shop N Ship's current 24-hour default.

---

## The Home Depot

### Why Shop N Ship wants access

Home Depot is important for tools, home improvement products, fixtures, appliances, smart-home products, and building-related purchases requested by Bahamian customers.

### Suggested application description

> Shop N Ship is a cross-border shopping concierge and logistics platform serving customers in The Bahamas. Our customers use our website to discover U.S. merchandise and request help coordinating purchase, freight, customs preparation, and delivery.
>
> We would like to participate in The Home Depot Affiliate Program to use the authorized product data feed and retailer links for product discovery on our live website. Home Depot products will be clearly identified as Home Depot merchandise and links supplied by the affiliate program will direct customers to HomeDepot.com.
>
> Shop N Ship's separate purchase-agent service is not being represented as an affiliate-program checkout. Unless Home Depot provides written approval for that use, affiliate referrals and Shop N Ship procurement transactions will remain separate.

### Program facts

- A live website is required to apply.
- Home Depot says accepted affiliates receive a daily product data feed.
- The program operates through Impact.
- Home Depot says websites outside the U.S. may participate, although HomeDepot.com shipping remains U.S.-focused.

### Required setup after approval

- Obtain the feed through Impact.
- Add the authorized feed URL to Vercel as `HOME_DEPOT_FEED_URL`.
- Preserve the official tracking/deep link from Impact.
- Refresh from the daily feed on a schedule; Shop N Ship currently allows a 36-hour maximum freshness window for Home Depot.
- Review the full program policies made available after acceptance before enabling public display.

---

## Walmart

### Why Shop N Ship wants access

Walmart is a core launch retailer for general merchandise, electronics, household essentials, baby products, small appliances, and other high-frequency categories.

### Suggested application description

> Shop N Ship is a cross-border shopping concierge serving customers in The Bahamas. Our website helps customers discover U.S. merchandise and estimate the logistics involved in getting products from the United States to Nassau.
>
> We would like to join the Walmart.com Affiliate Program and use Walmart's authorized data feed to display current Walmart product information and qualifying links on our website. We will preserve Walmart-provided links, keep feed-derived product information current, and will not redistribute Walmart's datafeed to third parties.
>
> Shop N Ship also offers a separate shopping-agent service. Unless Walmart provides written approval for those transactions, we will not treat purchases placed by Shop N Ship on behalf of customers as affiliate referrals or claim affiliate commission on those purchases.

### Program facts

- Walmart uses Impact for its affiliate program.
- Approved members can access data feeds.
- Walmart says applicants may get started within a day, but approval is discretionary.
- Walmart's current agreement requires product price/availability derived from the feed to be updated within 24 hours of an update from Walmart/feed content.
- Walmart prohibits redistribution/syndication of its datafeed to third parties.
- Purchases from Sam's Club/SamsClub.com are excluded from Walmart affiliate commissions.

### Required setup after approval

- Obtain the authorized Walmart feed from Impact.
- Add the feed URL to Vercel as `WALMART_FEED_URL`.
- Preserve Walmart qualifying/deep links exactly as supplied.
- Keep customer-facing Walmart feed data refreshed within 24 hours.
- Do not export Walmart's feed or expose a raw feed/API endpoint to third parties.
- Keep Shop N Ship's procurement workflow separate from affiliate attribution unless Walmart approves the model in writing.

---

## Current implementation status

| Retailer | Program path | Shop N Ship adapter | Credential/feed status | Customer-facing status |
| --- | --- | --- | --- | --- |
| Best Buy | Official Products API | Implemented | Approval pending | Setup required |
| BrandsMart USA | Affiliate product feed | Implemented | Need affiliate approval/feed | Setup required |
| Home Depot | Impact daily affiliate feed | Implemented | Need Impact approval/feed | Setup required |
| Walmart | Impact affiliate data feed | Implemented | Need affiliate approval/feed | Setup required |

## Compliance rule

Do not interpret an affiliate feed as authority to:

- buy through the retailer on behalf of another person;
- claim commissions on purchase-agent transactions;
- resell the retailer's feed;
- expose the raw feed to third parties;
- change retailer tracking/deep links;
- imply retailer endorsement.

Any expansion from referral/discovery into embedded commerce should be based on the retailer's written approval or a separate commerce/merchant agreement.
