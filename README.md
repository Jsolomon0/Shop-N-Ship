# Shop N Ship — MVP

A bootstrap-ready cross-border shopping and logistics MVP for the South Florida → Nassau, Bahamas lane.

## What this MVP proves

This version is intentionally lean. It demonstrates the core operational loop without requiring a production database, payment processor, retailer APIs, or customs APIs:

1. Customer requests a product from a U.S. retailer.
2. The request is stored locally in the browser.
3. Admin reviews the request and creates an estimated landed-cost quote.
4. Customer views estimated delivered price and savings.
5. Admin advances the order through the fulfillment lifecycle.
6. Customer tracks the order from request through delivery.

## Launch retailers

- Amazon
- Walmart
- Target
- Best Buy
- Apple
- Nike
- Macy's
- Nordstrom
- Sephora
- Home Depot
- BrandsMart USA
- Burlington
- Sam's Club
- Other U.S. retailer

## Routes

- `/` — Customer landing page
- `/request` — Product request flow
- `/orders` — Customer order tracking
- `/admin` — MVP operations dashboard and quote builder

## Core MVP capabilities

### Customer

- Paste a product URL.
- Choose a supported retailer.
- Submit manual product details.
- Upload/reference a product image.
- Enter size, color, model, quantity, budget, and notes.
- Enter Nassau delivery details.
- View estimated quote breakdowns.
- View estimated local price comparison when available.
- Track order progress through a unified timeline.

### Admin

- View incoming requests and demo orders.
- Build landed-cost quotes.
- Calculate estimated customer savings.
- Track internal estimated contribution margin.
- Update fulfillment status.
- Maintain shopper, freight, customs, and delivery notes.
- Work with seeded BrandsMart, Burlington, Sam's Club, and Best Buy examples.

## Important MVP limitation

This repository currently uses browser `localStorage` so it can be deployed and tested without backend infrastructure.

That means data is **not shared between devices or users** and this version should not yet be used for real customer payments or sensitive production data.

Before accepting live orders, replace browser persistence with a server-side database and implement production authentication, payments, private file storage, authorization, and audit logging.

## Deployment

This project is designed to work as a zero-build static deployment on Vercel.

### Vercel

1. Import the GitHub repository into Vercel.
2. Select **Other** if Vercel asks for a framework preset.
3. No build command is required.
4. No environment variables are required for this static MVP.
5. Deploy.

The included `vercel.json` enables clean URLs, so:

- `request.html` is available as `/request`
- `orders.html` is available as `/orders`
- `admin.html` is available as `/admin`

## Local development

No dependencies are required.

From the repository root:

```bash
python3 -m http.server 3000
```

Then open:

```text
http://localhost:3000
```

## Demo workflow

1. Open `/request` and submit an item.
2. Open `/admin`.
3. Locate the new request.
4. Add product, freight, customs, VAT, processing, delivery, service-fee, and local-comparison values.
5. Generate the quote.
6. Advance the order status.
7. Open `/orders` to see the customer-facing timeline.

## Production roadmap

Highest-priority upgrades after validating the customer journey:

1. PostgreSQL database.
2. Customer/admin authentication and RBAC.
3. Secure server-side order APIs.
4. Stripe or appropriate payment-provider integration.
5. Private receipt/document storage.
6. Email/SMS/WhatsApp notifications.
7. Shopper task portal.
8. Hub/package intake.
9. Shipment/freight provider integrations.
10. Customs records and exception workflow.
11. Driver/last-mile portal.
12. Financial reconciliation and analytics.

## Compliance

Duty, VAT, customs fees, and local price comparisons in the MVP are estimates entered by an operator. The MVP deliberately does not hard-code legal or customs treatment for broad product categories.

Before production use, verify current Bahamian customs classifications, VAT treatment, import restrictions, licensing requirements, and U.S. sales-tax/resale-certificate treatment with qualified professionals and official authorities.
