# NairobiPixel / Hashi Revenue OS — Locked Roadmap

This repository is the NairobiPixel business and Revenue OS only. HashiBot, MT5, and Prop Lab stay inside the HashiBot repository and do not share NairobiPixel runtime state or database credentials.

## Product direction

NairobiPixel is not positioned as a generic web-design agency. It sells measurable business outcomes and reusable systems that help businesses get more customers, collect payments, automate bookings, capture and follow up leads, run ads, improve customer support, collect reviews, sell online, and automate internal operations.

Public customer flow: understand problem → choose solution → see pricing → pay/deposit → onboard → book if needed → automated fulfilment where possible.

Private admin flow: Revenue → Scout → CRM → Outreach → Proposals → Customers → Orders → Payments → Products → Services → Agents → Campaigns → Product Lab → Experiments → Costs/Profit → Settings.

## Architecture decisions

- Keep the existing NairobiPixel public site and Netlify deployment.
- Use a new, isolated Supabase project for NairobiPixel. Do not reuse HashiBot Supabase.
- Add `/admin` as the private Revenue OS control room.
- Use Supabase Auth for admin access and Postgres for business data.
- Use Google Cloud Run only for heavier/background AI or scraping workers when justified by workload. Do not migrate the whole site to GCP prematurely.
- Use provider adapters for payments. Kenya: M-Pesa/Daraja. International digital products/subscriptions: Whop or another provider later.
- Never hard-code business logic to one payment provider.
- Keep HashiBot MT5/Prop Lab separate.

## Build order

1. Foundation: separate Supabase, admin auth shell, core schema, API boundaries, dynamic products/services.
2. Public storefront: transform site from portfolio-first to outcome/solution-first and make products selectable.
3. Checkout + onboarding: payments, orders, deposits, fulfilment triggers, booking/onboarding.
4. Revenue OS: revenue dashboard, CRM, orders, customers, payments, products, experiments.
5. Scout: business discovery, dedupe, website/social/business analysis, problem detection, opportunity scoring.
6. Outreach: tailored messages, approval queue, follow-ups, reply classification, proposal creation.
7. Reusable client engines: lead funnel, booking, deposit/payment, quote, WhatsApp sales, follow-up, AI receptionist, review engine, CRM, ecommerce, memberships, property/vehicle lead tools.
8. Advertising/customer acquisition: campaigns, landing pages, creatives, tracking, lead/sale attribution.
9. Unit economics: cost per service/product/client, API/AI/cloud/payment fees, gross margin, usage limits.
10. Product Lab: digital products and small apps, automated fulfilment, analytics, scale/change/kill.
11. Agent products/SaaS: hosted recurring products built from internal agents.
12. Content/distribution automation: only after real products/offers exist.

## Guardrails

- No multi-week perfection loop before a working revenue path exists.
- Every phase has an exit condition, not an arbitrary day estimate.
- Human approval before outbound outreach at first.
- No fake guarantees of revenue; track leads, conversion, CAC, bookings/orders, and actual sales where available.
- Prefer reusable modules over bespoke rebuilds.
- Automated fulfilment for low-touch products and subscriptions.
- Customer portal is deferred until a recurring SaaS/agent product actually needs it.
- Every experiment ends in SCALE / CHANGE / KILL based on evidence.

## First commercial checkpoint

Before overbuilding the OS, NairobiPixel must have live paid offers and a checkout/deposit path. The system is judged by real cash collected, not by feature count.
