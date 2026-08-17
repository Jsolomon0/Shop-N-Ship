# MVP Scope

## Objective

Validate whether Bahamian customers value a single interface for requesting U.S. products, receiving a transparent delivered-cost estimate, and tracking the order from purchase through Nassau delivery.

## Included

- Customer-facing landing page
- Launch retailer network
- Product URL, image and manual request types
- Nassau delivery details
- Browser-persistent request creation
- Admin quote builder
- Delivered-price and savings calculation
- Order status management
- Customer tracking timeline
- Seed/demo data for Best Buy, Burlington, BrandsMart USA and Sam's Club
- Responsive mobile-first interface
- Static Vercel configuration

## Excluded from this prototype

- Real user authentication
- Real payment collection
- Database persistence
- Retailer APIs
- automated purchasing
- freight booking APIs
- automated customs filing
- native mobile applications

## Production gate

Do not accept real customer payments or sensitive customs documents until the application has server-side authentication, a database, secure file storage, webhook-verified payment processing, and role-based access control.
